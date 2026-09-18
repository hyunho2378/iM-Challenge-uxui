import { colors, typography, layout, spacing } from '../../tokens/tokens'

const KEYWORDS = ['강릉 맛집', '카페', '편의점', '숙박', 'GS25', '순두부', '테라로사', '경포대']

export default function PopularKeywords({ onKeywordClick }) {
  return (
    <div style={{ padding: `${spacing[4]} 0` }}>
      <p style={{
        margin: 0,
        padding: `0 ${layout.margin} ${spacing[2]}`,
        fontSize: typography.size.xs,
        fontWeight: typography.weight.semibold,
        color: colors.gray[500],
        fontFamily: typography.fontFamily,
      }}>
        자주 찾는 키워드
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: spacing[2],
        padding: `0 ${layout.margin}`,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {KEYWORDS.map((keyword) => (
          <div
            key={keyword}
            style={{ minHeight: layout.touchMin, display: 'flex', alignItems: 'center' }}
          >
            <button
              onClick={() => onKeywordClick(keyword)}
              style={{
                padding: `${spacing[1]} ${spacing[4]}`,
                backgroundColor: colors.primary[50],
                border: `1px solid ${colors.primary[100]}`,
                borderRadius: layout.radiusPill,
                color: colors.primary[700],
                fontSize: typography.size.xs,
                fontWeight: typography.weight.medium,
                fontFamily: typography.fontFamily,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {keyword}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
