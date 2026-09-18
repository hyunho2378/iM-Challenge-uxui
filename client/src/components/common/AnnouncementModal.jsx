// AnnouncementModal.jsx — S01 (p.5,20)
// 공지 팝업 모달

import { colors, typography, layout, spacing } from '../../tokens/tokens'

export default function AnnouncementModal({ isOpen = true, onDismiss, onClose }) {
  if (isOpen === false) return null

  return (
    <div
      className="glass-scrim"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.surface.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        fontFamily: typography.fontFamily,
        padding: layout.margin,
      }}
    >
      <div
        style={{
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          width: '320px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        {/* 상단 배너: 파란 배경 */}
        <div
          style={{
            backgroundColor: colors.primary[700],
            padding: spacing[5],
            position: 'relative',
            overflow: 'hidden',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          {/* 장식 SVG 아이콘 */}
          <svg
            style={{ position: 'absolute', top: 16, right: 16, opacity: 0.3 }}
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
          >
            <circle cx="40" cy="40" r="36" fill="rgba(255,255,255,0.15)" />
            <circle cx="40" cy="40" r="24" fill="rgba(255,255,255,0.12)" />
            <path
              d="M28 40 L36 48 L54 32"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="40" r="14" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />
          </svg>

          {/* 배너 텍스트 */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: layout.radiusPill,
                padding: '2px 10px',
                marginBottom: spacing[2],
              }}
            >
              <span
                style={{
                  color: colors.onDark.primary,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.semibold,
                }}
              >
                공지사항
              </span>
            </div>
            <div
              style={{
                color: colors.onDark.primary,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                marginBottom: spacing[2],
                lineHeight: 1.3,
              }}
            >
              4월 캐시백 안내
            </div>
            <div
              style={{
                color: colors.onDark.secondary,
                fontSize: typography.size.xs,
                lineHeight: 1.5,
              }}
            >
              강릉 사랑페이 카드로 결제 시{'\n'}
              최대 10% 캐시백 혜택을 드립니다.{'\n'}
              이번 달도 iM샵을 이용해 주세요!
            </div>
          </div>
        </div>

        {/* 하단 버튼 행 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: `${spacing[3]} ${spacing[4]}`,
            borderTop: `1px solid ${colors.gray[100]}`,
          }}
        >
          <button
            onClick={onDismiss}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: typography.size.sm,
              fontWeight: typography.weight.medium,
              color: colors.gray[500],
              padding: spacing[2],
              textAlign: 'left',
            }}
          >
            오늘 그만 보기
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
              color: colors.primary[700],
              padding: spacing[2],
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
