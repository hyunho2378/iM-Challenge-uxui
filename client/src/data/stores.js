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

export const GANGNEUNG_STATION = { lat: 37.7647, lng: 128.8990 }

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
