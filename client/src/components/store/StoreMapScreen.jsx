// StoreMapScreen.jsx — M01 (p.24,43,44)
// 지도 35% / 목록 시트 65% — 드래그 시트 제거, 탭(가까운곳/QR결제매장)

import { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { Search } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import {
  CATEGORIES,
  STORES,
  searchStores,
  getStoresByCategory,
  DAEGU_STATION,
  getNearbyStores,
} from '../../data/stores'
import CategoryFilterChip from './CategoryFilterChip'
import StoreListItem from './StoreListItem'
import StoreDetailSheet from './StoreDetailSheet'
import CoachMarkOverlay from '../common/CoachMarkOverlay'
import { usePlatform } from '../../hooks/usePlatform'
import { useOnboarding } from '../../context/OnboardingContext'

// St-03: 카테고리 아이콘 (S6, Nielsen #6)
const CATEGORY_ICONS = {
  '전체': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="1" width="4.5" height="4.5" rx="1" fill="currentColor" />
      <rect x="7.5" y="1" width="4.5" height="4.5" rx="1" fill="currentColor" />
      <rect x="1" y="7.5" width="4.5" height="4.5" rx="1" fill="currentColor" />
      <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" fill="currentColor" />
    </svg>
  ),
  '음식점': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M4 1.5 L4 5 Q4 6.5 6.5 6.5 Q9 6.5 9 5 L9 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6.5 6.5 L6.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  '카페': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 5 L2 9.5 Q2 11.5 4 11.5 L7.5 11.5 Q9.5 11.5 9.5 9.5 L9.5 5 Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M9.5 6 L10.5 6 Q12 6 12 7.5 Q12 9 10.5 9 L9.5 9" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M5 3 Q5 4.5 6.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  '편의점': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1.5" y="5" width="10" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M1.5 5 L3.5 1.5 L9.5 1.5 L11.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      <rect x="4.5" y="8" width="4" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  '숙박': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="6" width="11" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M1 8.5 L1 4.5 Q1 2.5 3 2.5 L10 2.5 Q12 2.5 12 4.5 L12 8.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <ellipse cx="4.5" cy="6" rx="1.5" ry="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  '관광': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="4" width="11" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="6.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M4.5 4 L5 2 L8 2 L8.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  '마트': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 1.5 L2.5 1.5 L4.5 8.5 L10 8.5 L12 4 L3.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="5.5" cy="10.5" r="1.5" fill="currentColor" />
      <circle cx="9.5" cy="10.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  '의료': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M5 1.5 L8 1.5 L8 5 L11.5 5 L11.5 8 L8 8 L8 11.5 L5 11.5 L5 8 L1.5 8 L1.5 5 L5 5 Z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  '미용': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="3" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <circle cx="10" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M4.5 9 L11.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.5 9 L1.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  '교통': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="2.5" y="2" width="8" height="7.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M2.5 6.5 L10.5 6.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.5" cy="8.2" r="0.8" fill="currentColor" />
      <circle cx="8.5" cy="8.2" r="0.8" fill="currentColor" />
      <path d="M3 9.5 L3 11 M10 9.5 L10 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  '생활': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1.5 6 L6.5 1.5 L11.5 6 L11.5 11.5 L1.5 11.5 Z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <path d="M5 11.5 L5 8 L8 8 L8 11.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  '교육': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 4.5 L6.5 1.5 L12 4.5 L6.5 7.5 Z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <path d="M3.5 6 L3.5 9.5 Q6.5 11.5 9.5 9.5 L9.5 6" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M12 4.5 L12 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  '기타': (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="3" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="6.5" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="10" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  ),
}

function shortAddress(addr) {
  if (!addr) return ''
  return addr.replace(/^대구광역시\s*/, '')
}

function formatDistanceKm(km) {
  if (typeof km !== 'number') return ''
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: `${spacing[3]} 0`,
        cursor: 'pointer',
        fontSize: typography.size.sm,
        fontWeight: active ? typography.weight.semibold : typography.weight.regular,
        color: active ? colors.gray[900] : colors.gray[500],
        borderBottom: active ? `2px solid ${colors.primary[700]}` : '2px solid transparent',
        fontFamily: typography.fontFamily,
        marginBottom: '-1px',
      }}
    >
      {label}
    </button>
  )
}

export default function StoreMapScreen() {
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState('전체')
  const [tab, setTab] = useState('nearby')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mapRef, setMapRef] = useState(null)
  const [currentZoom, setCurrentZoom] = useState(13)
  const [currentBounds, setCurrentBounds] = useState(null)
  const clustererRef = useRef(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const searchContainerRef = useRef(null)
  const [searchFocused, setSearchFocused] = useState(false)

  // 10차 3번: 결제매장 코치마크. 카테고리 칩과 지도를 차례로 집는다.
  const { hasSeenStoreMapCoach, markSeen } = useOnboarding()
  const categoryBarRef = useRef(null)
  const mapAreaRef = useRef(null)
  const [storeCoachStep, setStoreCoachStep] = useState(hasSeenStoreMapCoach ? 0 : 1)
  const isAndroid = usePlatform() === 'android'

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    // 키가 없으면 지도 타일만 빠진다. 목록과 필터와 상세 시트는 그대로 동작한다.
  })

  // Pre-compute nearby stores once on mount
  const allNearbyStores = useMemo(
    () => getNearbyStores(DAEGU_STATION.lat, DAEGU_STATION.lng, 2000),
    []
  )
  const allQrNearbyStores = useMemo(
    () => getNearbyStores(DAEGU_STATION.lat, DAEGU_STATION.lng, 300, true),
    []
  )

  // 300ms debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  // Map markers: search results or category filter
  const visibleStores = useMemo(() => {
    if (debouncedQuery.trim()) return searchStores(debouncedQuery, { category: activeCategory, limit: 500 })
    if (activeCategory !== '전체') return getStoresByCategory(activeCategory)
    return []
  }, [debouncedQuery, activeCategory])

  // List stores for active tab + category
  const listStores = useMemo(() => {
    if (tab === 'qr') return allQrNearbyStores.slice(0, 100)
    if (activeCategory === '전체') return allNearbyStores.slice(0, 100)
    return allNearbyStores.filter((s) => s.category === activeCategory).slice(0, 100)
  }, [tab, activeCategory, allNearbyStores, allQrNearbyStores])

  const suggestions = searchQuery.trim().length > 0 ? searchStores(searchQuery, { limit: 10 }) : []

  // 매장 선택 — 강조만 (panTo 없음)
  const handleStoreSelect = (store) => {
    setSelectedStore(store)
    setSheetOpen(true)
  }

  // 길찾기 — panTo + zoom + 시트 닫기
  const handleNavigate = () => {
    if (!selectedStore || !mapRef) return
    mapRef.panTo({ lat: selectedStore.lat, lng: selectedStore.lng })
    mapRef.setZoom(17)
    setSheetOpen(false)
  }

  // Marker clusterer: rebuild on visibleStores / map change
  useEffect(() => {
    if (!isLoaded || !mapRef || !window.google) return
    if (clustererRef.current) clustererRef.current.clearMarkers()

    const markers = visibleStores.map((store) => {
      const marker = new window.google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: store.isQR ? colors.teal[500] : colors.primary[700],
          fillOpacity: 0.85,
          strokeColor: colors.surface.card,
          strokeWeight: 1.5,
        },
        title: store.name,
      })
      marker.addListener('click', () => handleStoreSelect(store))
      return marker
    })

    clustererRef.current = new MarkerClusterer({ map: mapRef, markers })
    return () => { clustererRef.current?.clearMarkers() }
  }, [isLoaded, mapRef, visibleStores])

  // 강조 핀 — selectedStore가 있을 때 1.3배 크기 마커를 클러스터러 위에 별도 표시
  useEffect(() => {
    if (!isLoaded || !mapRef || !window.google || !selectedStore) return

    const highlightMarker = new window.google.maps.Marker({
      position: { lat: selectedStore.lat, lng: selectedStore.lng },
      map: mapRef,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: selectedStore.isQR ? colors.teal[500] : colors.primary[700],
        fillOpacity: 1,
        strokeColor: colors.surface.card,
        strokeWeight: 2.5,
      },
      zIndex: 1000,
      clickable: false,
    })

    return () => {
      highlightMarker.setMap(null)
    }
  }, [isLoaded, mapRef, selectedStore])

  // 홈 추천 매장 탭 → focusStoreId로 진입한 경우 처리
  useEffect(() => {
    const focusId = location.state?.focusStoreId
    if (!focusId || !mapRef) return
    const target = STORES.find((s) => s.id === focusId)
    if (!target) return
    setSelectedStore(target)
    setSheetOpen(true)
    mapRef.panTo({ lat: target.lat, lng: target.lng })
    mapRef.setZoom(17)
  }, [location.state?.focusStoreId, mapRef])

  // Click outside → close autocomplete
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  const onLoad = (map) => setMapRef(map)
  const onUnmount = () => setMapRef(null)

  // 06차 6번: 카테고리 클릭 → 배너 노출 → 배너에서 매장 선택 → 지도 이동.
  // 상세 시트는 열지 않는다(가볍게 둘러보고 위치만 확인하는 용도. 상세는 리스트/마커 탭에서).
  const handleBannerSelect = (store) => {
    setSelectedStore(store)
    if (mapRef) {
      mapRef.panTo({ lat: store.lat, lng: store.lng })
      mapRef.setZoom(17)
    }
  }

  const handleSelectSuggestion = (store) => {
    setSearchQuery(store.name)
    setShowSuggestions(false)
    setSelectedStore(store)
    setSheetOpen(true)
    if (mapRef) {
      mapRef.panTo({ lat: store.lat, lng: store.lng })
      mapRef.setZoom(16)
    }
  }

  return (
    <div
      style={{
        width: '100%',
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: typography.fontFamily,
        overflow: 'hidden',
      }}
    >
      {/* 지도 영역: 55% — ScreenContainer fullBleedTop으로 statusBar 영역 처리 */}
      <div ref={mapAreaRef} style={{ height: '55%', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={DAEGU_STATION}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={() => setSelectedStore(null)}
            onZoomChanged={() => { if (mapRef) setCurrentZoom(mapRef.getZoom()) }}
            onBoundsChanged={() => { if (mapRef) setCurrentBounds(mapRef.getBounds()) }}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {/* 줌 >= 18 시 개별 핀 이름 라벨 (viewport 안 매장만) */}
            {currentZoom >= 18 && currentBounds && visibleStores
              .filter((store) => {
                if (!currentBounds.contains) return false
                return currentBounds.contains({ lat: store.lat, lng: store.lng })
              })
              .map((store) => {
                if (selectedStore && selectedStore.id === store.id) return null
                const borderColor = store.isQR ? colors.teal[500] : colors.primary[700]
                return (
                  <OverlayView
                    key={`label-${store.id}`}
                    position={{ lat: store.lat, lng: store.lng }}
                    mapPaneName={OverlayView.FLOAT_PANE}
                    getPixelPositionOffset={(width, height) => ({
                      x: -width / 2,
                      y: -height - 12,
                    })}
                  >
                    <div style={{
                      pointerEvents: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        backgroundColor: colors.surface.card,
                        border: `2px solid ${borderColor}`,
                        borderRadius: layout.radiusSmall,
                        padding: `${spacing[1]} ${spacing[2]}`,
                        fontSize: typography.size.xxs,
                        fontWeight: typography.weight.semibold,
                        color: colors.gray[900],
                        boxShadow: shadow.card,
                        whiteSpace: 'nowrap',
                        fontFamily: typography.fontFamily,
                      }}>
                        {store.name}
                      </div>
                      <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: `5px solid ${borderColor}`,
                      }} />
                    </div>
                  </OverlayView>
                )
              })}

            {/* 강조된 매장의 라벨 — 핀 위에 떠있는 박스 + 꼬리 */}
            {selectedStore && (
              <OverlayView
                position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
                mapPaneName={OverlayView.FLOAT_PANE}
                getPixelPositionOffset={(width, height) => ({
                  x: -width / 2,
                  y: -height - 12,
                })}
              >
                <div style={{
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  {/* 라벨 박스 */}
                  <div style={{
                    backgroundColor: colors.surface.card,
                    border: `2px solid ${selectedStore.isQR ? colors.teal[500] : colors.primary[700]}`,
                    borderRadius: layout.radiusSmall,
                    padding: `${spacing[1]} ${spacing[3]}`,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.semibold,
                    color: colors.gray[900],
                    boxShadow: shadow.card,
                    whiteSpace: 'nowrap',
                    fontFamily: typography.fontFamily,
                  }}>
                    {selectedStore.name}
                  </div>
                  {/* 꼬리 — 핀을 가리키는 작은 삼각형 */}
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid ${selectedStore.isQR ? colors.teal[500] : colors.primary[700]}`,
                  }} />
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: colors.gray[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: typography.size.xs, color: colors.gray[500] }}>지도 로딩 중</span>
          </div>
        )}

        {/* 검색바 (absolute — 지도 위) */}
        <div
          ref={searchContainerRef}
          style={{
            position: 'absolute',
            top: layout.topBarHeight,
            left: layout.margin,
            right: layout.margin,
            zIndex: 20,
          }}
        >
          <div
            style={{
              backgroundColor: isAndroid ? colors.gray[100] : colors.surface.card,
              borderRadius: isAndroid ? '8px 8px 0 0' : layout.radiusPill,
              border: isAndroid ? 'none' : undefined,
              borderBottom: isAndroid ? `2px solid ${searchFocused ? colors.primary[700] : colors.gray[400]}` : undefined,
              padding: `${spacing[3]} ${spacing[4]}`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              boxShadow: isAndroid ? 'none' : shadow.card,
            }}
          >
            <Search size={18} color={colors.gray[400]} />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
              onFocus={() => { setShowSuggestions(true); setSearchFocused(true) }}
              onBlur={() => setSearchFocused(false)}
              placeholder="매장 검색"
              style={{
                border: 'none',
                outline: 'none',
                background: 'none',
                flex: 1,
                fontSize: typography.size.sm,
                color: colors.gray[900],
                fontFamily: typography.fontFamily,
              }}
            />
          </div>

          {/* 자동완성 드롭다운 */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: spacing[2],
                backgroundColor: colors.surface.card,
                borderRadius: layout.radiusCard,
                boxShadow: shadow.modal,
                overflow: 'hidden',
              }}
            >
              {suggestions.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleSelectSuggestion(store)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderBottom: `1px solid ${colors.gray[100]}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[1],
                    fontFamily: typography.fontFamily,
                  }}
                >
                  <span style={{ fontSize: typography.size.sm, fontWeight: typography.weight.medium, color: colors.gray[900] }}>
                    {store.name}
                  </span>
                  <span style={{ fontSize: typography.size.xs, color: colors.gray[500] }}>
                    {store.category} · {shortAddress(store.address)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 카테고리 필터칩 행 */}
        <div
          ref={categoryBarRef}
          style={{
            position: 'absolute',
            top: `calc(${layout.topBarHeight} + 48px + ${spacing[2]})`,
            left: 0,
            right: 0,
            zIndex: 10,
            display: 'flex',
            gap: spacing[2],
            padding: `0 ${layout.margin}`,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryFilterChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              icon={CATEGORY_ICONS[cat]}
            />
          ))}
        </div>

        {/* 06차 6번: 카테고리 선택 시 배너 노출 — 선택하면 지도가 그 위치로 이동한다 */}
        {activeCategory !== '전체' && (
          <div
            style={{
              position: 'absolute',
              top: `calc(${layout.topBarHeight} + 48px + 40px + ${spacing[3]})`,
              left: 0,
              right: 0,
              zIndex: 10,
              display: 'flex',
              gap: spacing[2],
              padding: `0 ${layout.margin}`,
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {listStores.slice(0, 10).map((store) => (
              <button
                key={store.id}
                onClick={() => handleBannerSelect(store)}
                style={{
                  flexShrink: 0,
                  width: '132px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px',
                  padding: spacing[3],
                  backgroundColor: colors.surface.card,
                  borderRadius: layout.radiusButton,
                  border: selectedStore?.id === store.id ? `2px solid ${colors.primary[700]}` : 'none',
                  boxShadow: shadow.card,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.semibold,
                  color: colors.gray[900],
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}>
                  {store.name}
                </span>
                <span style={{ fontSize: typography.size.xxs, color: colors.gray[500] }}>
                  {formatDistanceKm(store.distance)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 목록 시트: flex: 1 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.surface.card,
          borderTopLeftRadius: layout.radiusModal,
          borderTopRightRadius: layout.radiusModal,
          boxShadow: shadow.modal,
          overflow: 'hidden',
        }}
      >
        {/* 탭 헤더 */}
        <div
          style={{
            display: 'flex',
            borderBottom: `1px solid ${colors.gray[200]}`,
            padding: `0 ${layout.margin}`,
            gap: spacing[4],
            flexShrink: 0,
          }}
        >
          <TabButton label="가까운 곳" active={tab === 'nearby'} onClick={() => setTab('nearby')} />
          <TabButton
            label={`QR결제 매장 ${allQrNearbyStores.length}`}
            active={tab === 'qr'}
            onClick={() => setTab('qr')}
          />
        </div>

        {/* 매장 목록 */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: layout.bottomNavHeight }}>
          {listStores.length === 0 ? (
            <div
              style={{
                padding: `${spacing[8]} ${layout.margin}`,
                textAlign: 'center',
                fontSize: typography.size.sm,
                color: colors.gray[400],
              }}
            >
              해당 카테고리의 가까운 매장이 없습니다
            </div>
          ) : (
            listStores.map((store) => (
              <StoreListItem
                key={store.id}
                store={store}
                onClick={() => handleStoreSelect(store)}
              />
            ))
          )}
        </div>
      </div>

      {/* 매장 상세 바텀시트 */}
      <StoreDetailSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onNavigate={handleNavigate}
        store={selectedStore}
      />

      {/* 10차 3번: 결제매장 코치마크 */}
      {storeCoachStep === 1 && (
        <CoachMarkOverlay
          targetRef={categoryBarRef}
          placement="bottom"
          message="음식점, 카페, 마트처럼 원하는 업종을 누르면 그 업종의 가맹점만 걸러서 보여줍니다. 다시 모두 보려면 맨 앞의 [전체]를 누르세요."
          step={1}
          totalSteps={2}
          onNext={() => setStoreCoachStep(2)}
          onSkip={() => { markSeen('storeMap'); setStoreCoachStep(0) }}
        />
      )}

      {storeCoachStep === 2 && (
        <CoachMarkOverlay
          targetRef={mapAreaRef}
          placement="bottom"
          message="지도에서 가맹점 위치를 확인할 수 있습니다. 지도의 표시나 아래 목록을 누르면 가게 정보와 길찾기가 열립니다."
          step={2}
          totalSteps={2}
          onNext={() => { markSeen('storeMap'); setStoreCoachStep(0) }}
          onSkip={() => { markSeen('storeMap'); setStoreCoachStep(0) }}
        />
      )}
    </div>
  )
}
