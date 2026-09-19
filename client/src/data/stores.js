// 05차 리브랜딩: 이전 지역 실데이터(13,021건)를 대구 표본 데이터(60건, 카테고리별 5건)로 교체했다.
// 전량 대체(13,000여 건)는 시간상 불가능해 데모가 비어 보이지 않을 만큼만 채웠다.
// 상호는 실제 대구 동/읍 명칭 + 일반 업종 명사 조합이며 특정 실존 상호를 그대로 쓰지 않았다.
import storesData from './stores.json'
import qrStoresData from './qr-stores.json'

export const STORES = storesData
export const QR_STORES = qrStoresData

export const CATEGORIES = [
  '전체', '음식점', '카페', '편의점', '마트', '의료',
  '미용', '교통', '숙박', '관광', '생활', '교육', '기타',
]

export function searchStores(query, options = {}) {
  if (!query || query.trim().length < 1) return []
  const q = query.trim().toLowerCase()
  const { category, qrOnly, limit = 50 } = options

  const results = STORES.filter((s) => {
    if (qrOnly && !s.isQR) return false
    if (category && category !== '전체' && s.category !== category) return false
    return s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
  })

  return results.slice(0, limit)
}

export function getStoresByCategory(category, qrOnly = false) {
  let list = qrOnly ? QR_STORES : STORES
  if (category && category !== '전체') {
    list = list.filter((s) => s.category === category)
  }
  return list
}

// 대구역 기준 좌표(05차 리브랜딩)
export const DAEGU_STATION = { lat: 35.8716, lng: 128.5911 }

export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function getNearbyStores(refLat, refLng, limit = 100, qrOnly = false) {
  const list = qrOnly ? QR_STORES : STORES
  return list
    .filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number')
    .map((s) => ({ ...s, distance: calculateDistance(refLat, refLng, s.lat, s.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}
