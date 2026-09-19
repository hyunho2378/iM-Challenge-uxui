/**
 * CouponPage — 쿠폰함 (09차, 전사.md S34 기준 재작성)
 *
 * S34 원문 구성 그대로: 다운로드가능/다운로드완료 탭 + 카테고리 칩 + 정렬(거리순)
 * + 매장별 쿠폰 카드 리스트.
 * 진입은 지원금·혜택(BenefitsPage) 상단의 "쿠폰함" 카드에서 들어온다(새 바텀내비 탭 만들지 않음).
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { useTypography } from '../hooks/useTypography'
import { usePlatform } from '../hooks/usePlatform'
import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import { COUPON_CATEGORIES, getCoupons } from '../data/coupons'

const TABS = [
  { key: 'available', label: '다운로드가능', downloaded: false },
  { key: 'done', label: '다운로드완료', downloaded: true },
]

function CouponCard({ coupon, isAndroid, sizes, onDownload }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing[4],
      backgroundColor: colors.surface.card,
      borderRadius: layout.radiusCard,
      boxShadow: shadow.card,
      padding: spacing[4],
      fontFamily: typography.fontFamily,
    }}>
      {/* 할인금액 — S40 "쿠폰(총2건) 3,000원/5,000원 할인" */}
      <div style={{
        flexShrink: 0,
        width: 76,
        textAlign: 'center',
        borderRight: `1px dashed ${colors.gray[200]}`,
        paddingRight: spacing[3],
      }}>
        <p style={{
          margin: 0,
          fontSize: sizes.lg,
          fontWeight: typography.weight.bold,
          color: colors.primary[700],
          lineHeight: 1.2,
        }}>
          {coupon.amount.toLocaleString('ko-KR')}
        </p>
        <p style={{ margin: 0, fontSize: sizes.xxs, color: colors.gray[500] }}>원 할인</p>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: sizes.sm,
          fontWeight: typography.weight.semibold,
          color: colors.gray[900],
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {coupon.store}
        </p>
        <p style={{ margin: `2px 0 0`, fontSize: sizes.xxs, color: colors.gray[500] }}>
          {coupon.condition}
        </p>
        <p style={{ margin: `2px 0 0`, fontSize: sizes.xxs, color: colors.gray[400] }}>
          {coupon.period}
        </p>
        <p style={{
          margin: `${spacing[1]} 0 0`,
          fontSize: sizes.xxs,
          color: colors.gray[500],
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <MapPin size={11} color={colors.gray[400]} />
          {coupon.distanceKm}km
        </p>
      </div>

      <button
        onClick={() => onDownload(coupon)}
        disabled={coupon.downloaded}
        style={{
          flexShrink: 0,
          minHeight: layout.touchMin,
          padding: `0 ${spacing[4]}`,
          borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
          border: coupon.downloaded ? `1px solid ${colors.gray[200]}` : 'none',
          backgroundColor: coupon.downloaded ? colors.surface.card : colors.primary[700],
          color: coupon.downloaded ? colors.gray[400] : colors.onDark.primary,
          fontSize: sizes.xs,
          fontWeight: typography.weight.semibold,
          cursor: coupon.downloaded ? 'default' : 'pointer',
          fontFamily: typography.fontFamily,
          whiteSpace: 'nowrap',
        }}
      >
        {coupon.downloaded ? '받음' : '받기'}
      </button>
    </div>
  )
}

export default function CouponPage() {
  const navigate = useNavigate()
  const sizes = useTypography()
  const isAndroid = usePlatform() === 'android'

  const [tab, setTab] = useState('available')
  const [category, setCategory] = useState('전체')
  // 받기 누른 쿠폰 id — 세션 동안만 유지(로컬스토리지 금지 정책)
  const [claimed, setClaimed] = useState([])

  const activeTab = TABS.find((t) => t.key === tab)

  const list = useMemo(() => {
    const base = getCoupons({ downloaded: activeTab.downloaded, category })
    if (activeTab.downloaded) {
      // 이번 세션에 받은 쿠폰도 완료 탭에 함께 보여준다
      const extra = getCoupons({ downloaded: false, category }).filter((c) => claimed.includes(c.id))
      return [...base, ...extra].sort((a, b) => a.distanceKm - b.distanceKm)
    }
    return base.filter((c) => !claimed.includes(c.id))
  }, [activeTab, category, claimed])

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="쿠폰함" onBack={() => navigate(-1)} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface.background }}>
        {/* 탭 — S34 "다운로드가능/다운로드완료" */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          backgroundColor: colors.surface.card,
          borderBottom: `1px solid ${colors.gray[100]}`,
        }}>
          {TABS.map((t) => {
            const on = t.key === tab
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1,
                  minHeight: layout.touchMin,
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${on ? colors.primary[700] : 'transparent'}`,
                  color: on ? colors.primary[700] : colors.gray[500],
                  fontSize: sizes.sm,
                  fontWeight: on ? typography.weight.bold : typography.weight.medium,
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily,
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* 카테고리 칩 — S34 "전체/음식점/유통쇼핑/의류잡화/뷰티생활" */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          gap: spacing[2],
          overflowX: 'auto',
          padding: `${spacing[3]} ${layout.margin}`,
          backgroundColor: colors.surface.card,
          scrollbarWidth: 'none',
        }}>
          {COUPON_CATEGORIES.map((c) => {
            const on = c === category
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  flexShrink: 0,
                  minHeight: 34,
                  padding: `0 ${spacing[3]}`,
                  borderRadius: layout.radiusPill,
                  border: `1px solid ${on ? colors.primary[300] : colors.gray[200]}`,
                  backgroundColor: on ? colors.primary[100] : colors.surface.card,
                  color: on ? colors.primary[700] : colors.gray[600],
                  fontSize: sizes.xs,
                  fontWeight: on ? typography.weight.semibold : typography.weight.medium,
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily,
                  whiteSpace: 'nowrap',
                }}
              >
                {c}
              </button>
            )
          })}
        </div>

        {/* 건수 + 정렬 — S34 "정렬(거리순)" */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${spacing[3]} ${layout.margin} ${spacing[2]}`,
        }}>
          <span style={{ fontSize: sizes.xs, color: colors.gray[600], fontFamily: typography.fontFamily }}>
            총 {list.length}건
          </span>
          <span style={{ fontSize: sizes.xs, color: colors.gray[500], fontFamily: typography.fontFamily }}>
            거리순
          </span>
        </div>

        {/* 쿠폰 리스트 */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: `0 ${layout.margin} ${spacing[6]}`,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[3],
        }}>
          {list.length === 0 ? (
            <div style={{
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
              padding: spacing[8],
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: sizes.sm, color: colors.gray[500], fontFamily: typography.fontFamily }}>
                해당하는 쿠폰이 없어요
              </p>
            </div>
          ) : (
            list.map((c) => (
              <CouponCard
                key={c.id}
                coupon={{ ...c, downloaded: activeTab.downloaded || claimed.includes(c.id) }}
                isAndroid={isAndroid}
                sizes={sizes}
                onDownload={(cp) => setClaimed((prev) => (prev.includes(cp.id) ? prev : [...prev, cp.id]))}
              />
            ))
          )}
        </div>
      </div>
    </ScreenContainer>
  )
}
