import { colors, typography, spacing } from '../../tokens/tokens'

export default function SectionHeader({ title, onViewAll, showViewAll = true }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: spacing[4],
        paddingRight: spacing[4],
        paddingTop: spacing[2],
        paddingBottom: spacing[2],
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: typography.size.md,
          fontWeight: typography.weight.bold,
          color: colors.gray[900],
        }}
      >
        {title}
      </h3>

      {showViewAll && (
        <button
          onClick={onViewAll}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            // 장식 예외: 아이콘 버튼 그룹 마이크로 간격 (디자인시스템 단계 3-B)
            gap: '2px',
            color: colors.primary[600],
            fontSize: typography.size.xs,
            fontWeight: typography.weight.medium,
          }}
        >
          전체보기
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.5 3.5L9 7L5.5 10.5" stroke={colors.primary[600]} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
