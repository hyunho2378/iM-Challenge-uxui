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

// ─── 초기 상태 (카드 등록 전 = 빈 값) ─────────────────────────────────────────

const EMPTY_INITIAL = {
  balance: 0,
  cashbackBalance: 0,
  cashbackMode: 'auto',
  monthlyAccumulated: 0,
  transactions: [],
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function userReducer(state, action) {
  switch (action.type) {

    case 'LOAD_MOCK_DATA': {
      // 카드 등록 시점에 generateMockData() 결과 주입
      const { balance, cashbackBalance, monthlyAccumulated, transactions } = action.payload
      return {
        ...state,
        balance,
        cashbackBalance,
        monthlyAccumulated,
        transactions,
        // cashbackMode는 유지 (기본 'auto')
      }
    }

    case 'CHARGE_BALANCE': {
      const { id, amount, date } = action.payload
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
        balanceAfter: newBalance,
      }
      return {
        ...state,
        balance: newBalance,
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

    case 'REFUND_TRANSACTION': {
      const { transactionId } = action.payload
      const target = state.transactions.find((t) => t.id === transactionId)

      if (!target || target.type !== 'charge') return state

      const refundAmount = target.paidByBalance
      const newBalance = state.balance + refundAmount
      const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'refund',
        storeName: null,
        totalAmount: refundAmount,
        paidByCashback: 0,
        paidByBalance: refundAmount,
        cashbackEarned: 0,
        cashbackMode: null,
        balanceAfter: newBalance,
        linkedTransactionId: transactionId,
      }

      return {
        ...state,
        balance: newBalance,
        transactions: [
          newTransaction,
          ...state.transactions.map((t) =>
            t.id === transactionId ? { ...t, refunded: true } : t
          ),
        ],
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
  const [hasCard, setHasCard] = useState(false)
  const [cardStatus, setCardStatus] = useState('none')
  // 05차: 연결계좌 등록 상태 (PAY-01/PAY-03). 은행명 문자열 또는 미등록 시 null
  const [linkedBank, setLinkedBank] = useState(null)
  // 'charge' | 'payment' | 'refund' | null. 서버 기록에 실패한 마지막 동작
  const [lastError, setLastError] = useState(null)
  const [state, dispatch] = useReducer(userReducer, EMPTY_INITIAL)

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
        transactions: mockData.transactions,
      },
    })
    setHasCard(true)
    setCardStatus('registered')
  }, [])

  const chargeBalance = useCallback((amount) => {
    const id = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const date = new Date().toISOString()
    dispatch({ type: 'CHARGE_BALANCE', payload: { id, amount, date } })
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

  const refundTransaction = useCallback((transactionId) => {
    const target = state.transactions.find((t) => t.id === transactionId)
    const refundAmount = target?.paidByBalance || 0
    dispatch({ type: 'REFUND_TRANSACTION', payload: { transactionId } })
    if (sessionId && refundAmount > 0) {
      logAction(sessionId, 'refund', refundAmount).catch(() => setLastError('refund'))
    }
  }, [sessionId, state.transactions])

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
      transactions: state.transactions,
      applyCard,
      shipCard,
      registerCard,
      linkedBank,
      linkAccount,
      chargeBalance,
      spendBalance,
      refundTransaction,
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
