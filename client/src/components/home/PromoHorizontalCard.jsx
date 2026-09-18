import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

export default function PromoHorizontalCard({
  title = '특별 프로모션',
  description = '지금 바로 확인해보세요',
  bgColor = colors.primary[700],
  textColor = colors.onDark.primary,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        margin: layout.margin,
        borderRadius: layout.radiusCard,
        height: '80px',
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${spacing[4]}`,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: shadow.card,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 좌측 텍스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1], zIndex: 1 }}>
        <p
          style={{
            margin: 0,
            color: textColor,
            fontSize: typography.size.md,
            fontWeight: typography.weight.bold,
            lineHeight: 1.3,
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: 0,
            color: textColor,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.regular,
            opacity: 0.85,
          }}
        >
          {description}
        </p>
      </div>

      {/* 우측 장식 SVG */}
      <div style={{ flexShrink: 0, zIndex: 1 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.15)" />
          <path
            d="M18 24 L24 18 L30 24 L24 30 L18 24 Z"
            fill="rgba(255,255,255,0.5)"
          />
          <path
            d="M24 18 L24 12 M30 24 L36 24 M24 30 L24 36 M18 24 L12 24"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 배경 데코 원 */}
      <div
        style={{
          position: 'absolute',
          right: '-16px',
          top: '-16px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.08)',
          zIndex: 0,
        }}
      />
    </div>
  )
}
