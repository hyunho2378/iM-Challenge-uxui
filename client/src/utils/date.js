/**
 * formatDate — 공통 날짜 포맷 유틸
 *
 * @param {string} iso - ISO 8601 날짜 문자열
 * @param {object} opts - 옵션
 * @param {boolean} opts.withTime - 시:분 포함 여부 (기본 false)
 * @returns {string} 포맷된 날짜 문자열
 *
 * @example
 *   formatDate('2026-05-17T14:30:00.000Z')                  // "26.05.17"
 *   formatDate('2026-05-17T14:30:00.000Z', { withTime: true })  // "26.05.17 14:30"
 */
export function formatDate(iso, { withTime = false } = {}) {
  const d = new Date(iso)
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const base = `${yy}.${mm}.${dd}`

  if (!withTime) return base

  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${base} ${hh}:${min}`
}
