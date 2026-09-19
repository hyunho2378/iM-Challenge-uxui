/**
 * WidgetAddBanner (Phase 2 신규)
 * Strategy: S1
 * Nielsen: #1 visibility, #7 flexibility/efficiency
 * Shneiderman: #2 shortcuts, #7 internal locus of control
 */
import { useState, useEffect, useRef } from 'react'
import { colors, typography, layout, spacing } from '../../tokens/tokens'

export default function WidgetAddBanner() {
  const [expanded, setExpanded] = useState(false)
  const timerRef = useRef(null)

  const handleOpen = () => {
    if (expanded) return
    setExpanded(true)
    // 400ms slide + 1500ms hold 후 닫기
    timerRef.current = setTimeout(() => setExpanded(false), 1900)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div
      style={{
        margin: `${spacing[3]} ${layout.margin}`,
        fontFamily: typography.fontFamily,
      }}
    >
      {/* Pill 버튼 */}
      <button
        onClick={handleOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing[2],
          backgroundColor: colors.primary[50],
          border: `1px solid ${colors.primary[100]}`,
          borderRadius: layout.radiusPill,
          padding: `${spacing[1]} ${spacing[3]}`,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.semibold,
          color: colors.primary[700],
          cursor: 'pointer',
          fontFamily: typography.fontFamily,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="12" height="12" rx="3" stroke={colors.primary[700]} strokeWidth="1.5" fill="none" />
          <path d="M7 4 L7 10" stroke={colors.primary[700]} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 7 L7 4 L10 7" stroke={colors.primary[700]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        위젯 추가하기
      </button>

      {/* 09차 4번: 08차 전역 리퀘드글래스 제거 때 이 패널만 남아 있었다.
          backdrop-filter·반투몥 배경·흰 테두리를 걷어내고 일반 카드 면으로 맞춘다. */}
      <div
        style={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.gray[200]}`,
          borderRadius: layout.radiusSmall,
          maxHeight: expanded ? '160px' : '0px',
          opacity: expanded ? 1 : 0,
          marginTop: expanded ? spacing[2] : '0px',
          overflow: 'hidden',
          transition: 'max-height 240ms cubic-bezier(0.23,1,0.32,1), opacity 240ms cubic-bezier(0.23,1,0.32,1), margin-top 240ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <div style={{ padding: spacing[4] }}>
          {/* 위젯 미리보기 */}
          <div
            style={{
              backgroundColor: colors.surface.darkCard,
              borderRadius: layout.radiusSmall,
              padding: `${spacing[2]} ${spacing[3]}`,
              marginBottom: spacing[3],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: typography.size.xxs, color: colors.onDark.secondary, marginBottom: '1px' }}>
                잔액
              </div>
              <div
                style={{
                  fontSize: typography.size.md,
                  fontWeight: typography.weight.bold,
                  color: colors.onDark.primary,
                  letterSpacing: '-0.02em',
                }}
              >
                120,000원
              </div>
            </div>
            <div
              style={{
                fontSize: typography.size.xxs,
                color: colors.onDark.secondary,
                fontWeight: typography.weight.medium,
              }}
            >
              iM샵
            </div>
          </div>
          <p
            style={{
              margin: 0,
              padding: `0 ${spacing[3]}`,
              fontSize: typography.size.xs,
              color: colors.gray[700],
              lineHeight: typography.lineHeight.normal,
              wordBreak: 'keep-all',
              fontFamily: typography.fontFamily,
            }}
          >
            홈 화면에 위젯을 추가하면 앱을 열지 않아도 잔액을 바로 확인할 수 있어요.
          </p>
        </div>
      </div>
    </div>
  )
}
