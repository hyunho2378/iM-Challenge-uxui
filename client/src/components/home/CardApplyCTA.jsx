/**
 * CardApplyCTA (B6)
 * 신규 사용자 전용 — 잔액 카드 자리 카드 신청 CTA
 */

import { useNavigate } from 'react-router-dom'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import { usePlatform } from '../../hooks/usePlatform'

export default function CardApplyCTA({ applyButtonRef }) {
  const navigate = useNavigate()
  const isAndroid = usePlatform() === 'android'

  return (
    <div style={{ margin: layout.margin }}>
      <div style={{
        backgroundColor: colors.surface.darkCard,
        borderRadius: layout.radiusCard,
        padding: spacing[6],
        boxShadow: shadow.button,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3], flex: 1 }}>
          <h3 style={{
            margin: 0,
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: colors.onDark.primary,
            lineHeight: 1.3,
            fontFamily: typography.fontFamily,
          }}>
            iM샵 카드를<br />신청하세요
          </h3>
          <p style={{
            margin: 0,
            fontSize: typography.size.sm,
            color: colors.onDark.secondary,
            fontFamily: typography.fontFamily,
          }}>
            최대 10% 캐시백 혜택
          </p>
          <button
            ref={applyButtonRef}
            onClick={() => navigate('/card-apply')}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
              color: colors.onDark.primary,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
              padding: `${spacing[2]} ${spacing[5]}`,
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              minHeight: layout.touchMin,
              marginTop: spacing[2],
            }}
          >
            신청하기
          </button>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing[3] }}>
          <svg width="100" height="84" viewBox="0 0 100 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-8deg)' }}>
            <rect x="0" y="0" width="100" height="64" rx="8" fill={colors.surface.card} />
            <text x="8" y="22" fontSize="13" fontWeight="700" fill={colors.primary[700]} fontFamily="sans-serif">iM샵</text>
            <rect x="8" y="32" width="26" height="16" rx="3" fill={colors.gray[200]} />
            <rect x="8" y="54" width="14" height="3" rx="1.5" fill={colors.gray[300]} />
          </svg>
        </div>
      </div>
    </div>
  )
}
