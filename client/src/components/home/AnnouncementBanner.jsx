/**
 * AnnouncementBanner (Phase 2 신규)
 * Nielsen: #8 aesthetic/minimalistic
 * Shneiderman: #3 informative feedback
 * Phase 1 ref: common/AnnouncementModal.jsx
 * Changed: popup modal → inline banner (H-05)
 */
import { X } from 'lucide-react'
import { colors, typography, layout, spacing } from '../../tokens/tokens'

export default function AnnouncementBanner({ show, onClose }) {
  if (!show) return null

  return (
    <div
      style={{
        margin: `${spacing[2]} ${layout.margin}`,
        backgroundColor: colors.primary[50],
        border: `1px solid ${colors.primary[100]}`,
        borderRadius: layout.radiusSmall,
        padding: `${spacing[3]} ${spacing[4]}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing[3],
        fontFamily: typography.fontFamily,
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke={colors.primary[700]} strokeWidth="1.5" fill="none" />
          <path d="M8 5 L8 8.5" stroke={colors.primary[700]} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11" r="0.75" fill={colors.primary[700]} />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.semibold,
            color: colors.primary[700],
            marginBottom: '2px',
          }}
        >
          5월 캐시백 안내
        </p>
        <p style={{ margin: 0, fontSize: typography.size.xs, color: colors.gray[700], lineHeight: 1.5 }}>
          2026년 5월 iM샵 캐시백 적립이 시작되었습니다.
        </p>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: colors.gray[400],
        }}
      >
        <X size={16} />
      </button>
    </div>
  )
}
