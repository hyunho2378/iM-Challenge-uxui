import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

export default function CashbackProgressCard({
  current = 3200,
  max = 30000,
  percent = 10,
}) {
  const clampedPercent = Math.min(100, Math.max(0, percent))
  const fmtKRW = (n) => n.toLocaleString('ko-KR') + '원'

  return (
    <div
      style={{
        backgroundColor: colors.surface.card,
        borderRadius: layout.radiusCard,
        margin: layout.margin,
        padding: spacing[4],
        boxShadow: shadow.card,
      }}
    >
      {/* 상단: 레이블 + 퍼센트 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[3] }}>
        <span
          style={{
            color: colors.gray[500],
            fontSize: typography.size.xs,
            fontWeight: typography.weight.regular,
          }}
        >
          이번 달 캐시백
        </span>
        <span
          style={{
            color: colors.primary[700],
            fontSize: typography.size.xl,
            fontWeight: typography.weight.bold,
            lineHeight: 1,
          }}
        >
          {clampedPercent}%
        </span>
      </div>

      {/* 진행바 */}
      <div
        style={{
          backgroundColor: colors.gray[100],
          borderRadius: layout.radiusPill,
          height: '8px',
          overflow: 'hidden',
          marginBottom: spacing[3],
        }}
      >
        <div
          style={{
            backgroundColor: colors.teal[500],
            borderRadius: layout.radiusPill,
            height: '100%',
            width: `${clampedPercent}%`,
            transition: 'width 280ms cubic-bezier(0.23,1,0.32,1)',
          }}
        />
      </div>

      {/* 하단: 받은 금액 + 한도 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            color: colors.teal[500],
            fontSize: typography.size.xs,
            fontWeight: typography.weight.semibold,
          }}
        >
          받은 금액 {fmtKRW(current)}
        </span>
        <span
          style={{
            color: colors.gray[500],
            fontSize: typography.size.xs,
            fontWeight: typography.weight.regular,
          }}
        >
          한도 {fmtKRW(max)}
        </span>
      </div>
    </div>
  )
}
