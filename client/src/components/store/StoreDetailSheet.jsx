// StoreDetailSheet.jsx — M03 (p.45)
// Strategy: S6 | Nielsen: #1 visibility, #6 recognition | Shneiderman: #7 locus of control

import { useState } from 'react'
import { Phone, MapPin, Clock, ExternalLink } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import BottomSheet from '../common/BottomSheet'
import { DAEGU_STATION, calculateDistance } from '../../data/stores'
import { usePlatform } from '../../hooks/usePlatform'

function formatDistanceKm(km) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

export default function StoreDetailSheet({ isOpen, onClose, onNavigate, store }) {
  const [ownerSheetOpen, setOwnerSheetOpen] = useState(false)
  const isAndroid = usePlatform() === 'android'

  const {
    name = '매장명',
    category = '기타',
    subCategory,
    distance,
    phone,
    tel,
    address,
    hours,
    lastUpdated,
    isQR,
    lat,
    lng,
  } = store || {}

  const phoneNumber = phone || tel
  const distanceKm = typeof distance === 'number'
    ? distance
    : (typeof lat === 'number' && typeof lng === 'number'
      ? calculateDistance(DAEGU_STATION.lat, DAEGU_STATION.lng, lat, lng)
      : null)
  const distanceLabel = distanceKm != null ? formatDistanceKm(distanceKm) : null

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <div style={{ fontFamily: typography.fontFamily }}>
          {/* 매장 이미지 placeholder */}
          <div
            style={{
              height: '120px',
              backgroundColor: colors.gray[200],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="5" y="10" width="30" height="22" rx="3" stroke={colors.gray[400]} strokeWidth="1.5" fill="none" />
              <circle cx="20" cy="21" r="6" stroke={colors.gray[400]} strokeWidth="1.5" fill="none" />
              <circle cx="20" cy="21" r="3" fill={colors.gray[300]} />
              <path d="M14 10 L15 7 L25 7 L26 10" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 매장 정보 헤더 */}
          <div style={{ padding: `${spacing[4]} ${layout.margin}` }}>
            <div
              style={{
                fontSize: typography.size.xl,
                fontWeight: typography.weight.bold,
                color: colors.gray[900],
                marginBottom: spacing[1],
              }}
            >
              {name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.medium,
                  color: colors.primary[700],
                  backgroundColor: colors.primary[50],
                  borderRadius: layout.radiusPill,
                  padding: '2px 10px',
                }}
              >
                {subCategory ? `${category} · ${subCategory}` : category}
              </span>
              {isQR && (
                <span
                  style={{
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.semibold,
                    color: colors.onDark.primary,
                    backgroundColor: colors.teal[500],
                    borderRadius: layout.radiusPill,
                    padding: '2px 10px',
                  }}
                >
                  QR결제
                </span>
              )}
              {distanceLabel && (
                <span style={{ fontSize: typography.size.xs, color: colors.gray[500] }}>
                  {distanceLabel}
                </span>
              )}
            </div>
            {/* St-01: 최근 업데이트 날짜 — S6, Nielsen #1 */}
            <div style={{ marginTop: spacing[1], fontSize: typography.size.xxs, color: colors.gray[400] }}>
              마지막 업데이트: {lastUpdated || '2026.04.15'}
            </div>
          </div>

          {/* 구분선 */}
          <div style={{ height: '8px', backgroundColor: colors.surface.background }} />

          {/* 상세 정보 행들 */}
          <div style={{ padding: `${spacing[2]} ${layout.margin}` }}>
            {phoneNumber && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  padding: `${spacing[3]} 0`,
                  borderBottom: `1px solid ${colors.gray[100]}`,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: layout.radiusSmall,
                    backgroundColor: colors.primary[50],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={16} color={colors.primary[700]} />
                </div>
                <a
                  href={`tel:${phoneNumber}`}
                  style={{
                    fontSize: typography.size.sm,
                    color: colors.gray[900],
                    textDecoration: 'none',
                  }}
                >
                  {phoneNumber}
                </a>
              </div>
            )}

            {address && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing[3],
                  padding: `${spacing[3]} 0`,
                  borderBottom: `1px solid ${colors.gray[100]}`,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: layout.radiusSmall,
                    backgroundColor: colors.primary[50],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  <MapPin size={16} color={colors.primary[700]} />
                </div>
                <span
                  style={{
                    fontSize: typography.size.sm,
                    color: colors.gray[900],
                    lineHeight: 1.5,
                    paddingTop: '6px',
                  }}
                >
                  {address}
                </span>
              </div>
            )}

            {hours && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  padding: `${spacing[3]} 0`,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: layout.radiusSmall,
                    backgroundColor: colors.primary[50],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={16} color={colors.primary[700]} />
                </div>
                <span style={{ fontSize: typography.size.sm, color: colors.gray[900] }}>{hours}</span>
              </div>
            )}
          </div>

          {/* 하단 버튼 2개 */}
          <div
            style={{
              display: 'flex',
              gap: spacing[3],
              padding: `${spacing[4]} ${layout.margin}`,
            }}
          >
            <button
              onClick={() => phoneNumber && window.open(`tel:${phoneNumber}`)}
              disabled={!phoneNumber}
              style={{
                flex: 1,
                height: '48px',
                backgroundColor: 'transparent',
                color: phoneNumber ? colors.primary[700] : colors.gray[400],
                border: `1.5px solid ${phoneNumber ? colors.primary[700] : colors.gray[200]}`,
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                cursor: phoneNumber ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
              }}
            >
              <Phone size={16} />
              전화하기
            </button>
            <button
              onClick={onNavigate}
              style={{
                flex: 1,
                height: '48px',
                backgroundColor: colors.primary[700],
                color: colors.onDark.primary,
                border: 'none',
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                boxShadow: shadow.button,
              }}
            >
              <MapPin size={16} />
              길찾기
            </button>
          </div>

          {/* St-02: 가맹점 정보 수정 요청 링크 — S6, Nielsen #6, Shneiderman #7 */}
          <div
            style={{
              textAlign: 'center',
              padding: `${spacing[1]} ${layout.margin} ${spacing[5]}`,
            }}
          >
            <button
              onClick={() => setOwnerSheetOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: typography.size.xs,
                color: colors.gray[500],
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              가맹점 정보 수정 요청
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* 가맹점주 바텀시트 — S6, B2B 분리 영역 */}
      <BottomSheet isOpen={ownerSheetOpen} onClose={() => setOwnerSheetOpen(false)}>
        <div style={{ fontFamily: typography.fontFamily, padding: `${spacing[5]} ${layout.margin}` }}>
          {/* 아이콘 */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: layout.radiusCard,
              backgroundColor: colors.primary[50],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing[4],
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="15" rx="2" stroke={colors.primary[700]} strokeWidth="1.5" fill="none" />
              <path d="M2 7 L5 3 L19 3 L22 7" stroke={colors.primary[700]} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
              <rect x="9" y="13" width="6" height="9" rx="1" stroke={colors.primary[700]} strokeWidth="1.2" fill="none" />
            </svg>
          </div>

          <p
            style={{
              margin: `0 0 ${spacing[2]}`,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.gray[900],
            }}
          >
            가맹점주이신가요?
          </p>
          <p
            style={{
              margin: `0 0 ${spacing[5]}`,
              fontSize: typography.size.sm,
              color: colors.gray[500],
              lineHeight: 1.6,
            }}
          >
            매장 정보가 정확하지 않다면 가맹점주 포털에서 직접 수정하실 수 있습니다.
          </p>

          <button
            onClick={() => setOwnerSheetOpen(false)}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: colors.primary[700],
              border: 'none',
              borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
              fontSize: typography.size.md,
              fontWeight: typography.weight.semibold,
              color: colors.onDark.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              boxShadow: shadow.button,
            }}
          >
            <ExternalLink size={18} />
            가맹점주 포털로 이동
          </button>

          <button
            onClick={() => setOwnerSheetOpen(false)}
            style={{
              width: '100%',
              height: '44px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: typography.size.sm,
              color: colors.gray[500],
              marginTop: spacing[3],
            }}
          >
            닫기
          </button>
        </div>
      </BottomSheet>
    </>
  )
}
