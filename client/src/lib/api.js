// api.js — 서버 액션 기록 클라이언트

/**
 * 새 세션 발급 (앱 진입 시 1회 호출)
 * @returns {Promise<string|null>} 's_1', 's_2' 형식 또는 실패 시 null
 */
export async function createSession() {
  try {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) {
      console.warn('[api.createSession] failed:', res.status)
      return null
    }
    const data = await res.json()
    return data.sessionId
  } catch (err) {
    console.warn('[api.createSession] network error:', err.message)
    return null
  }
}

/**
 * 세션 액션을 서버 DB에 기록 (fire-and-forget)
 * @param {string} sessionId - AppContext에서 발급한 UUID
 * @param {'charge'|'refund'|'qr_pay'} actionType
 * @param {number} amount - 원 단위 정수
 * @param {string|null} storeName - qr_pay만 채움
 * @returns {Promise<{ok: true, id, createdAt} | null>}
 */
export async function logAction(sessionId, actionType, amount, storeName = null) {
  try {
    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, actionType, amount, storeName }),
    })
    if (!res.ok) {
      console.warn('[api.logAction] failed:', res.status)
      return null
    }
    return await res.json()
  } catch (err) {
    // 네트워크 오류 시 UX는 그대로 진행 (DB 기록은 부가 기능)
    console.warn('[api.logAction] network error:', err.message)
    return null
  }
}

/**
 * 누적 통계 가져오기 (발표용 위젯)
 */
export async function fetchStats() {
  try {
    const res = await fetch('/api/log/stats')
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    return null
  }
}
