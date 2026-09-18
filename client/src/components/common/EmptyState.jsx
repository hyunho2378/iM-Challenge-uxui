import { colors, typography, spacing } from '../../tokens/tokens'
import Button from './Button'

export default function EmptyState({ message = '데이터가 없습니다', ctaLabel, onCta }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${spacing[10]} ${spacing[4]}`,
        gap: spacing[4],
      }}
    >
      {/* 빈 문서 + X 아이콘 */}
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="6" width="40" height="52" rx="5" fill={colors.gray[100]} />
        <rect x="12" y="6" width="40" height="52" rx="5" stroke={colors.gray[300]} strokeWidth="2" />
        <line x1="20" y1="20" x2="44" y2="20" stroke={colors.gray[300]} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="28" x2="44" y2="28" stroke={colors.gray[300]} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="36" x2="34" y2="36" stroke={colors.gray[300]} strokeWidth="2.5" strokeLinecap="round" />
        {/* X 배지 */}
        <circle cx="45" cy="45" r="12" fill={colors.gray[200]} />
        <line x1="40" y1="40" x2="50" y2="50" stroke={colors.gray[500]} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="40" x2="40" y2="50" stroke={colors.gray[500]} strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      <p
        style={{
          margin: 0,
          color: colors.gray[500],
          fontSize: typography.size.sm,
          fontWeight: typography.weight.regular,
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>

      {ctaLabel && onCta && (
        <Button
          variant="filled"
          size="sm"
          fullWidth={false}
          style={{ marginTop: spacing[1] }}
          onClick={onCta}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
