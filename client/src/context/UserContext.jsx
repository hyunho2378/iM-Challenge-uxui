/**
 * UserContext — 캐시백 시스템 + 카드 등록 분기
 * 카드 등록 시점에 generateMockData()로 1년치 가상 거래 주입
 * Session-scoped — 새로고침 시 리셋 (localStorage 금지 정책)
 */

import { createContext, useContext, useReducer, useState, useCallback } from 'react'
import { generateMockData } from '../lib/generateMockData'
import { logAction } from '../lib/api'
import { useApp } from './AppContext'

const UserContext = createContext(null)

// 06차: iM샵 실측(전사.md S09) — 월충전한도 300,000원. 이 한도를 넘겨 충전하려 하면
// ChargeScreen이 AI 개입(할인없이충전 유도)을 띄운다. 할인없이충전(무혜택)은 이 한도를 소비하지 않는다.
export const MONTHLY_DISCOUNT_LIMIT = 300000

// ─── 초기 상태 (카드 등록 전 = 빈 값) ─────────────────────────────────────────

const EMPTY_INITIAL = {
  balance: 0,
  cashbackBalance: 0,
  cashbackMode: 'auto',
  monthlyAccumulated: 0,
  monthlyDiscountCharged: 0,
  transactions: [],
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function userReducer(state, action) {
  switch (action.type) {

    case 'LOAD_MOCK_DATA': {
      // 카드 등록 시점에 generateMockData() 결과 주입
      const { balance, cashbackBalance, monthlyAccumulated, monthlyDiscountCharged, transactions } = action.payload
      return {
        ...state,
        balance,
        cashbackBalance,
        monthlyAccumulated,
        monthlyDiscountCharged,
        transactions,
        // cashbackMode는 유지 (기본 'auto')
      }
    }

    case 'CHARGE_BALANCE': {
      const { id, amount, date, discounted } = action.payload
      const newBalance = state.balance + amount
      const newTransaction = {
        id,
        date,
        type: 'charge',
        storeName: null,
        totalAmount: amount,
        paidByCashback: 0,
        paidByBalance: amount,
        cashbackEarned: 0,
        cashbackMode: null,
        discounted,
        balanceAfter: newBalance,
      }
      return {
        ...state,
        balance: newBalance,
        monthlyDiscountCharged: discounted
          ? state.monthlyDiscountCharged + amount
          : state.monthlyDiscountCharged,
        transactions: [newTransaction, ...state.transactions],
      }
    }

    case 'SPEND_BALANCE': {
      const { amount, storeName } = action.payload

      let paidByCashback = 0
      let paidByBalance = amount

      if (state.cashbackMode === 'auto' && state.cashbackBalance > 0) {
        paidByCashback = Math.min(state.cashbackBalance, amount)
        paidByBalance = amount - paidByCashback
      }

      if (paidByBalance > state.balance) return state

      const potentialCashback = Math.floor(paidByBalance * 0.1)
      const remainingMonthlyLimit = 30000 - state.monthlyAccumulated
      const cashbackEarned = Math.min(potentialCashback, Math.max(0, remainingMonthlyLimit))

      const newBalance = state.balance - paidByBalance
      const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'spend',
        storeName,
        totalAmount: amount,
        paidByCashback,
        paidByBalance,
        cashbackEarned,
        cashbackMode: state.cashbackMode,
        balanceAfter: newBalance,
      }

      return {
        ...state,
        balance: newBalance,
        cashbackBalance: state.cashbackBalance - paidByCashback + cashbackEarned,
        monthlyAccumulated: state.monthlyAccumulated + cashbackEarned,
        transactions: [newTransaction, ...state.transactions],
      }
    }

    case 'REFUND_BALANCE': {
      // 06차: iM샵 실제 규칙(전사.md FAQ Q19)은 특정 충전 건이 아니라 "현재 잔액"의
      // 40% 이하만 환불 대상이다. 과거처럼 충전 건을 찾아 되돌리는 구조가 아니다.
      const { id, amount, date } = action.payload
      if (amount <= 0 || amount > state.balance) return state
      const newBalance = state.balance - amount
      const newTransaction = {
        id,
        date,
        type: 'refund',
        storeName: null,
        totalAmount: amount,
        paidByCashback: 0,
        paidByBalance: amount,
        cashbackEarned: 0,
        cashbackMode: null,
        balanceAfter: newBalance,
      }
      return {
        ...state,
        balance: newBalance,
        transactions: [newTransaction, ...state.transactions],
      }
    }

    case 'SET_CASHBACK_MODE': {
      return {
        ...state,
        cashbackMode: action.payload.mode,
      }
    }

    default:
      return state
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function UserProvider({ children }) {
  const { sessionId } = useApp()
  // 08차 3번: 새로고침마다 카드 보유/미보유가 오락가락한다는 지적 — 정확히는 항상 미보유로
  // 시작했을 뿐이지만, 데모 중 매번 카드신청 플로우를 다시 타지 않도록 처음부터 카드 보유 +
  // 목데이터가 로드된 상태로 고정한다. registerCard()와 같은 데이터를 쓴다.
  const [hasCard, setHasCard] = useState(true)
  const [cardStatus, setCardStatus] = useState('registered')
  // 05차: 연결계좌 등록 상태 (PAY-01/PAY-03). 은행명 문자열 또는 미등록 시 null
  const [linkedBank, setLinkedBank] = useState(null)
  // 'charge' | 'payment' | 'refund' | null. 서버 기록에 실패한 마지막 동작
  const [lastError, setLastError] = useState(null)
  const [state, dispatch] = useReducer(userReducer, undefined, () => {
    const mockData = generateMockData()
    return {
      ...EMPTY_INITIAL,
      balance: mockData.balance,
      cashbackBalance: mockData.cashbackBalance,
      monthlyAccumulated: mockData.monthlyAccumulated,
      monthlyDiscountCharged: mockData.monthlyDiscountCharged,
      transactions: mockData.transactions,
    }
  })

  const applyCard = useCallback(() => setCardStatus('applying'), [])
  const shipCard = useCallback(() => setCardStatus('shipped'), [])
  const linkAccount = useCallback((bankName) => setLinkedBank(bankName), [])

  // 카드 등록 시점에 가상 거래 데이터 주입
  const registerCard = useCallback(() => {
    const mockData = generateMockData()
    dispatch({
      type: 'LOAD_MOCK_DATA',
      payload: {
        balance: mockData.balance,
        cashbackBalance: mockData.cashbackBalance,
        monthlyAccumulated: mockData.monthlyAccumulated,
        monthlyDiscountCharged: mockData.monthlyDiscountCharged,
        transactions: mockData.transactions,
      },
    })
    setHasCard(true)
    setCardStatus('registered')
  }, [])

  // discounted=true: 정상 충전(/charge, 월한도 300,000 소비). false: 할인없이충전(/charge-free, 한도 미소비)
  const chargeBalance = useCallback((amount, { discounted = true } = {}) => {
    const id = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const date = new Date().toISOString()
    dispatch({ type: 'CHARGE_BALANCE', payload: { id, amount, date, discounted } })
    if (sessionId) {
      logAction(sessionId, 'charge', amount).catch(() => setLastError('charge'))
    }
    return id
  }, [sessionId])

  const spendBalance = useCallback((amount, storeName = null) => {
    dispatch({ type: 'SPEND_BALANCE', payload: { amount, storeName } })
    if (sessionId) {
      logAction(sessionId, 'qr_pay', amount, storeName).catch(() => setLastError('payment'))
    }
  }, [sessionId])

  // 06차: 잔액환불(전사.md FAQ Q19). 마지막 충전 후 잔액의 40% 이하만 대상 — 상한 계산은
  // 호출부(RefundPage)에서 하고, 여기는 금액을 받아 그대로 차감한다.
  const refundBalance = useCallback((amount) => {
    const id = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const date = new Date().toISOString()
    dispatch({ type: 'REFUND_BALANCE', payload: { id, amount, date } })
    if (sessionId && amount > 0) {
      logAction(sessionId, 'refund', amount).catch(() => setLastError('refund'))
    }
    return id
  }, [sessionId])

  // 서버 기록 실패를 더 이상 조용히 버리지 않는다.
  // 지금은 상태만 남긴다. 사용자에게 보여줄 실패 화면은 캡처 확보 후 설계한다.
  const clearError = useCallback(() => setLastError(null), [])

  const setCashbackMode = useCallback((mode) => {
    dispatch({ type: 'SET_CASHBACK_MODE', payload: { mode } })
  }, [])

  return (
    <UserContext.Provider value={{
      hasCard,
      cardStatus,
      balance: state.balance,
      cashbackBalance: state.cashbackBalance,
      cashbackMode: state.cashbackMode,
      monthlyAccumulated: state.monthlyAccumulated,
      monthlyDiscountCharged: state.monthlyDiscountCharged,
      transactions: state.transactions,
      applyCard,
      shipCard,
      registerCard,
      linkedBank,
      linkAccount,
      chargeBalance,
      spendBalance,
      refundBalance,
      setCashbackMode,
      lastError,
      clearError,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
