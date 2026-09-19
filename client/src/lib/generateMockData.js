// generateMockData.js — 가상 거래 시계열 시뮬레이션 엔진
// 매 호출마다 새 데이터 생성. 메모리 전용. DB 무관.
// 1년치(25년 6월~26년 5월) 약 480건 거래 + 잔액/캐시백 최종 상태 반환

import storesRaw from '../data/stores.json'

// 상수
const START_DATE = new Date('2025-06-01T09:00:00')
const END_DATE = new Date('2026-05-31T23:59:59')
const CURRENT_MONTH = '2026-05'  // 이번 달 = 26년 5월
const MIN_BALANCE = 20000
const CASHBACK_RATE = 0.10
const MONTHLY_CASHBACK_CAP = 30000

// 헬퍼
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

// iM샵 실제 사용 패턴: 한도 채우는 정도 = 일평균 1만 ± 0.5만
function randomPaymentAmount() {
  const r = Math.random()
  if (r < 0.55) return randomBetween(3, 12) * 1000        // 55%: 3천~1.2만 (편의점/카페)
  if (r < 0.85) return randomBetween(12, 25) * 1000       // 30%: 1.2만~2.5만 (식사)
  if (r < 0.97) return randomBetween(25, 50) * 1000       // 12%: 2.5만~5만 (마트/회식)
  return randomBetween(50, 120) * 1000                     //  3%: 5만~12만 (큰 결제)
}

function randomChargeAmount() {
  return randomChoice([10000, 30000, 50000, 100000, 200000])
}


export function generateMockData() {
  // 1. 시계열 시뮬레이션 상태
  let balance = 0
  let cashback = 0
  const monthlyCashbackEarned = {}
  const transactions = []
  let nextId = 1

  // 2. 첫 거래 = 무조건 25/06/01 09:00 충전 (의미: iM샵 시작)
  const firstChargeAmount = randomBetween(5, 15) * 10000  // 5만~15만
  balance += firstChargeAmount
  transactions.push({
    id: nextId++,
    date: START_DATE.toISOString(),
    type: 'charge',
    discounted: true,
    totalAmount: firstChargeAmount,
    paidByCashback: 0,
    paidByBalance: firstChargeAmount,
    cashbackEarned: 0,
    cashbackMode: null,
    storeName: null,
    storeId: null,
    balanceAfter: balance,
  })

  // 3. 이벤트 생성 — 25/06/01 09:00 ~ 26/05/31 사이
  const totalDays = 365
  const targetSpends = randomBetween(220, 260)
  const targetCharges = randomBetween(40, 55)

  const allEvents = []

  for (let i = 0; i < targetSpends; i++) {
    const dayOffset = randomBetween(0, totalDays - 1)
    const date = new Date(START_DATE.getTime() + dayOffset * 86400000)
    date.setHours(randomBetween(9, 22), randomBetween(0, 59), 0, 0)
    allEvents.push({ type: 'spend', date })
  }

  for (let i = 0; i < targetCharges; i++) {
    const dayOffset = randomBetween(0, totalDays - 1)
    const date = new Date(START_DATE.getTime() + dayOffset * 86400000)
    date.setHours(randomBetween(10, 22), randomBetween(0, 59), 0, 0)
    allEvents.push({ type: 'charge', date })
  }

  // 첫 거래(09:00) 이후로만 (혹시 같은 날 09:00 이전 시간 들어왔을 경우 방어)
  const firstChargeTime = START_DATE.getTime()
  const validEvents = allEvents.filter(e => e.date.getTime() > firstChargeTime)

  // 4. 날짜 순 정렬
  validEvents.sort((a, b) => a.date - b.date)

  // 5. 시계열 시뮬레이션
  for (const event of validEvents) {
    const monthKey = getMonthKey(event.date)
    if (!monthlyCashbackEarned[monthKey]) monthlyCashbackEarned[monthKey] = 0

    if (event.type === 'charge') {
      const amount = randomChargeAmount()
      balance += amount
      transactions.push({
        id: nextId++,
        date: event.date.toISOString(),
        type: 'charge',
        discounted: true,
        totalAmount: amount,
        paidByCashback: 0,
        paidByBalance: amount,
        cashbackEarned: 0,
        cashbackMode: null,
        storeName: null,
        storeId: null,
        balanceAfter: balance,
      })
    }

    else if (event.type === 'spend') {
      let amount = randomPaymentAmount()
      // 최소 3,000원 보장 (분포 함수가 이미 보장하지만 명시)
      if (amount < 3000) amount = 3000

      // 잔액 부족 위험 → 결제 1초 전에 자동 충전 삽입
      if (balance - amount < MIN_BALANCE) {
        const refillAmount = randomChoice([50000, 100000, 200000])
        balance += refillAmount
        const refillDate = new Date(event.date.getTime() - 1000)
        transactions.push({
          id: nextId++,
          date: refillDate.toISOString(),
          type: 'charge',
          discounted: true,
          totalAmount: refillAmount,
          paidByCashback: 0,
          paidByBalance: refillAmount,
          cashbackEarned: 0,
          cashbackMode: null,
          storeName: null,
          storeId: null,
          balanceAfter: balance,
        })
      }

      // 그래도 부족하면 스킵 (이론상 거의 안 일어남)
      if (balance - amount < MIN_BALANCE) continue

      // 자동/수동 모드 결정 (80:20)
      const mode = Math.random() < 0.8 ? 'auto' : 'manual'

      // 캐시백 사용분 계산
      let paidByCashback = 0
      if (mode === 'auto') {
        paidByCashback = Math.min(cashback, amount)
        cashback -= paidByCashback
      }
      const paidByBalance = amount - paidByCashback
      balance -= paidByBalance

      // 캐시백 적립 (iM샵 차감분의 10%, 월 한도 체크)
      const monthEarned = monthlyCashbackEarned[monthKey]
      const remainingCap = Math.max(0, MONTHLY_CASHBACK_CAP - monthEarned)
      const earned = Math.min(Math.floor(paidByBalance * CASHBACK_RATE), remainingCap)
      cashback += earned
      monthlyCashbackEarned[monthKey] += earned

      // 매장 랜덤 선택 (13,643개 중)
      const store = randomChoice(storesRaw)
      transactions.push({
        id: nextId++,
        date: event.date.toISOString(),
        type: 'spend',
        totalAmount: amount,
        paidByCashback,
        paidByBalance,
        cashbackEarned: earned,
        cashbackMode: mode,
        storeName: store.name,
        storeId: store.id,
        balanceAfter: balance,
      })
    }
  }

  // ─────────────────────────────────────────
  // 5.5. mock 환불 생성 — charge 항목 선택 후 REFUND_TRANSACTION 동일 구조로 생성
  // ─────────────────────────────────────────
  const chargeTransactions = transactions.filter(t => t.type === 'charge')
  const targetRefunds = randomBetween(15, 25)
  const actualRefundCount = Math.min(targetRefunds, Math.floor(chargeTransactions.length * 0.4))
  const shuffledCharges = [...chargeTransactions].sort(() => Math.random() - 0.5)
  const selectedForRefund = shuffledCharges.slice(0, actualRefundCount)

  for (const charge of selectedForRefund) {
    const refundAmount = charge.paidByBalance
    const refundDate = new Date(new Date(charge.date).getTime() + randomBetween(1, 7) * 86400000)
    if (refundDate > END_DATE) continue

    charge.refunded = true
    balance += refundAmount
    transactions.push({
      id: nextId++,
      date: refundDate.toISOString(),
      type: 'refund',
      totalAmount: refundAmount,
      paidByCashback: 0,
      paidByBalance: refundAmount,
      cashbackEarned: 0,
      cashbackMode: null,
      storeName: null,
      storeId: null,
      balanceAfter: balance,
      linkedTransactionId: charge.id,
    })
  }

  // ─────────────────────────────────────────
  // 6.5. 최종 잔액 정규화 (5월 31일 기준 30,000~150,000원)
  // 자연스러운 iM샵 사용자 잔액 라인에 맞춤
  // ─────────────────────────────────────────
  const TARGET_BALANCE_MIN = 30000
  const TARGET_BALANCE_MAX = 150000

  // 5월 마지막 일주일 (5/25~5/31) 9~22시 사이 랜덤 시간 생성
  function randomLateMayDate() {
    const dayOffset = randomBetween(0, 6)
    const date = new Date('2026-05-25T00:00:00')
    date.setDate(date.getDate() + dayOffset)
    date.setHours(randomBetween(9, 22), randomBetween(0, 59), 0, 0)
    return date
  }

  if (balance > TARGET_BALANCE_MAX) {
    // 초과분만큼 추가 결제 생성 (5월 마지막 주에 분산)
    let excess = balance - randomBetween(TARGET_BALANCE_MIN, TARGET_BALANCE_MAX)
    let safetyCounter = 0  // 무한루프 방지

    while (excess > 5000 && safetyCounter < 50) {
      safetyCounter++

      // 결제 금액: 남은 초과분의 30~70% (한 번에 다 안 쓰고 여러 건으로 분산)
      const ratio = 0.3 + Math.random() * 0.4
      let amount = Math.floor(excess * ratio / 1000) * 1000  // 1000원 단위
      if (amount < 3000) amount = 3000
      if (amount > excess) amount = Math.floor(excess / 1000) * 1000
      if (amount < 3000) break

      // 잔액 부족 방어
      if (balance - amount < MIN_BALANCE) break

      const date = randomLateMayDate()
      const monthKey = getMonthKey(date)
      if (!monthlyCashbackEarned[monthKey]) monthlyCashbackEarned[monthKey] = 0

      // 자동/수동 모드 80:20 유지
      const mode = Math.random() < 0.8 ? 'auto' : 'manual'

      let paidByCashback = 0
      if (mode === 'auto') {
        paidByCashback = Math.min(cashback, amount)
        cashback -= paidByCashback
      }
      const paidByBalance = amount - paidByCashback
      balance -= paidByBalance

      // 캐시백 적립 (월 한도 체크 — 이미 5월 한도 도달했으면 0)
      const monthEarned = monthlyCashbackEarned[monthKey]
      const remainingCap = Math.max(0, MONTHLY_CASHBACK_CAP - monthEarned)
      const earned = Math.min(Math.floor(paidByBalance * CASHBACK_RATE), remainingCap)
      cashback += earned
      monthlyCashbackEarned[monthKey] += earned

      const store = randomChoice(storesRaw)
      transactions.push({
        id: nextId++,
        date: date.toISOString(),
        type: 'spend',
        totalAmount: amount,
        paidByCashback,
        paidByBalance,
        cashbackEarned: earned,
        cashbackMode: mode,
        storeName: store.name,
        storeId: store.id,
        balanceAfter: balance,
      })

      excess -= amount
    }
  }

  else if (balance < TARGET_BALANCE_MIN) {
    // 부족분 보충 충전 1건 (5월 마지막 주)
    const refillAmount = randomChoice([30000, 50000, 100000])
    const date = randomLateMayDate()
    balance += refillAmount
    transactions.push({
      id: nextId++,
      date: date.toISOString(),
      type: 'charge',
      discounted: true,
      totalAmount: refillAmount,
      paidByCashback: 0,
      paidByBalance: refillAmount,
      cashbackEarned: 0,
      cashbackMode: null,
      storeName: null,
      storeId: null,
      balanceAfter: balance,
    })
  }

  // ─────────────────────────────────────────
  // 6.7. balanceAfter 재계산 패스
  // 정규화 후처리(6.5)가 5/25~5/31 사이에 거래를 추가하면서
  // 시간순으로 봤을 때 기존 거래와 순서가 섞임.
  // 시간순 정렬 후 첫 거래부터 누적 합산하며 balanceAfter를 덮어쓴다.
  // ─────────────────────────────────────────
  const chronological = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  let runningBalance = 0
  for (const tx of chronological) {
    if (tx.type === 'charge') {
      // 충전: 잔액 증가
      runningBalance += tx.totalAmount
    } else if (tx.type === 'refund') {
      runningBalance += tx.totalAmount
    } else if (tx.type === 'spend') {
      // 결제: 캐시백 사용분 제외, iM샵 차감분만 잔액에서 빠짐
      runningBalance -= tx.paidByBalance
    }
    tx.balanceAfter = runningBalance
  }

  // 6. 최신 순 정렬 (이용내역 표시용)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date))

  // 06차: 이번 달(CURRENT_MONTH) 할인충전 사용액 — 월한도 300,000 위젯 초기값
  const monthlyDiscountCharged = transactions
    .filter((t) => t.type === 'charge' && t.discounted && getMonthKey(new Date(t.date)) === CURRENT_MONTH)
    .reduce((sum, t) => sum + t.totalAmount, 0)

  return {
    balance,
    cashbackBalance: cashback,
    monthlyAccumulated: monthlyCashbackEarned[CURRENT_MONTH] || 0,
    monthlyDiscountCharged,
    transactions,
  }
}

// ─────────────────────────────────────
// 개발 검증용 — Phase 1 검증 후 제거 가능
// ─────────────────────────────────────

export function _devValidate() {
  const data = generateMockData()
  const issues = []

  if (data.balance < MIN_BALANCE) {
    issues.push(`잔액 ${data.balance}이 ${MIN_BALANCE} 미만`)
  }
  if (data.cashbackBalance < 0) {
    issues.push(`캐시백 음수: ${data.cashbackBalance}`)
  }
  if (data.monthlyAccumulated > MONTHLY_CASHBACK_CAP) {
    issues.push(`이번달 적립 한도 초과: ${data.monthlyAccumulated}`)
  }

  // 잔액 정규화 검증 (v5)
  if (data.balance > 150000) {
    issues.push(`잔액 초과(150,000+): ${data.balance}`)
  }
  if (data.balance < 30000) {
    issues.push(`잔액 부족(30,000-): ${data.balance}`)
  }

  // balanceAfter 일관성 검증 (v6.1)
  const chrono = [...data.transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
  let check = 0
  let inconsistent = null
  for (const tx of chrono) {
    if (tx.type === 'charge') check += tx.totalAmount
    else if (tx.type === 'refund') check += tx.totalAmount
    else if (tx.type === 'spend') check -= tx.paidByBalance
    if (tx.balanceAfter !== check) {
      inconsistent = { id: tx.id, expected: check, actual: tx.balanceAfter, type: tx.type }
      break
    }
  }
  if (inconsistent) {
    issues.push(`balanceAfter 불일치: tx ${inconsistent.id} (${inconsistent.type}) expected=${inconsistent.expected} actual=${inconsistent.actual}`)
  }

  // 최종 잔액 = 마지막 거래의 balanceAfter여야 함
  const last = chrono[chrono.length - 1]
  if (last.balanceAfter !== data.balance) {
    issues.push(`최종 잔액 불일치: data.balance=${data.balance} vs lastTx.balanceAfter=${last.balanceAfter}`)
  }

  const counts = {
    charge: data.transactions.filter(t => t.type === 'charge').length,
    refund: data.transactions.filter(t => t.type === 'refund').length,
    spend: data.transactions.filter(t => t.type === 'spend').length,
  }

  // 첫 거래(가장 오래된)가 충전인지 확인
  const oldest = [...data.transactions].sort((a, b) => new Date(a.date) - new Date(b.date))[0]
  if (oldest.type !== 'charge') {
    issues.push(`첫 거래가 충전이 아님: ${oldest.type}`)
  }

  // 0원 결제 없는지 확인
  const zeroPayment = data.transactions.find(t => t.type === 'spend' && t.totalAmount === 0)
  if (zeroPayment) {
    issues.push(`0원 결제 발견: id ${zeroPayment.id}`)
  }

  // 모든 spend 거래에 storeName 있는지 확인
  const noStore = data.transactions.find(t => t.type === 'spend' && !t.storeName)
  if (noStore) {
    issues.push(`매장명 없는 결제 발견: id ${noStore.id}`)
  }

  console.log('[generateMockData 검증]', {
    balance: data.balance,
    cashback: data.cashbackBalance,
    monthlyAcc: data.monthlyAccumulated,
    totalTx: data.transactions.length,
    counts,
    oldestTx: { type: oldest.type, date: oldest.date, amount: oldest.totalAmount },
    firstStore: data.transactions.find(t => t.type === 'spend')?.storeName,
    issues: issues.length === 0 ? 'OK' : issues,
  })

  return data
}
