/**
 * PromoBundle (Task 7)
 * Strategy: S3
 * Nielsen: #1 visibility, #7 flexibility
 * 카드 신청 카드 + 카카오페이 카드 시각적 묶음
 */

import { useNavigate } from 'react-router-dom'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

export default function PromoBundle() {
  const navigate = useNavigate()

  return (
    <div style={{ margin: `${spacing[4]} ${layout.margin}` }}>
      {/* 상단: 카드 신청 카드 */}
      <div
        onClick={() => navigate('/card-apply')}
        style={{
          backgroundColor: colors.primary[700],
          borderRadius: `${layout.radiusCard} ${layout.radiusCard} 0 0`,
          padding: `${spacing[5]} ${spacing[5]} ${spacing[4]}`,
          cursor: 'pointer',
          boxShadow: shadow.card,
        }}
      >
        <div
          style={{
            fontSize: typography.size.xxs,
            color: colors.onDark.secondary,
            fontFamily: typography.fontFamily,
            marginBottom: spacing[1],
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          카드 신청
        </div>
        <div
          style={{
            fontSize: typography.size.md,
            fontWeight: typography.weight.bold,
            color: colors.onDark.primary,
            fontFamily: typography.fontFamily,
            marginBottom: spacing[1],
          }}
        >
          iM샵 카드를 신청하세요
        </div>
        <div
          style={{
            fontSize: typography.size.xs,
            color: colors.onDark.secondary,
            fontFamily: typography.fontFamily,
          }}
        >
          최대 10% 캐시백 혜택
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); navigate('/card-apply') }}
          style={{
            marginTop: spacing[4],
            backgroundColor: colors.onDark.primary,
            border: 'none',
            borderRadius: layout.radiusButton,
            color: colors.primary[700],
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            padding: `${spacing[2]} ${spacing[5]}`,
            cursor: 'pointer',
            minHeight: layout.touchMin,
            fontFamily: typography.fontFamily,
          }}
        >
          신청하기
        </button>
      </div>

      {/* 하단: 카카오페이 카드 */}
      <div
        onClick={() => navigate('/kakao-guide')}
        style={{
          backgroundColor: colors.kakaoBg,
          borderRadius: `0 0 ${layout.radiusCard} ${layout.radiusCard}`,
          padding: `${spacing[4]} ${spacing[5]}`,
          cursor: 'pointer',
          borderTop: `1px solid ${colors.gray[200]}`,
          boxShadow: shadow.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
              color: colors.gray[900],
              fontFamily: typography.fontFamily,
            }}
          >
            카카오페이로도 결제하세요
          </div>
          <div
            style={{
              fontSize: typography.size.xs,
              color: colors.gray[500],
              fontFamily: typography.fontFamily,
              marginTop: spacing[1],
            }}
          >
            iM샵을 카카오페이와 연결하면 더 편리하게
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4 L10 8 L6 12" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
