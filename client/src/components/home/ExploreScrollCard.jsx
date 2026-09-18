import { useNavigate } from 'react-router-dom'
import { colors, typography, layout, spacing } from '../../tokens/tokens'

const CARDS = [
  {
    id: 1,
    title: '카카오페이 연결',
    description: '카카오페이로 간편 충전',
    bg: colors.kakaoBg,
    titleColor: colors.tag.noticeText,
    descColor: colors.explore.amberDark,
    arrowColor: colors.warning,
  },
  {
    id: 2,
    title: 'iM샵 이용안내',
    description: '사용법을 알아보세요',
    bg: colors.gray[100],
    titleColor: colors.gray[700],
    descColor: colors.gray[500],
    arrowColor: colors.gray[400],
    path: '/usage-guide',
  },
  {
    id: 3,
    title: '지원금 혜택',
    description: '나에게 맞는 지원금 확인',
    bg: colors.tag.cashBg,
    titleColor: colors.tag.cashText,
    descColor: colors.explore.emeraldDark,
    arrowColor: colors.success,
  },
]

export default function ExploreScrollCard() {
  const navigate = useNavigate()
  return (
    <div>
      {/* 섹션 제목 */}
      <p
        style={{
          margin: `0 0 ${spacing[3]} 0`,
          paddingLeft: spacing[4],
          paddingRight: spacing[4],
          fontSize: typography.size.md,
          fontWeight: typography.weight.bold,
          color: colors.gray[900],
        }}
      >
        iM샵 120% 활용하기
      </p>

      {/* 가로 스크롤 카드 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: spacing[3],
          overflowX: 'auto',
          paddingLeft: spacing[4],
          paddingRight: spacing[4],
          paddingBottom: spacing[2],
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => card.path && navigate(card.path)}
            style={{
              minWidth: '160px',
              width: '160px',
              height: '100px',
              borderRadius: layout.radiusButton,
              backgroundColor: card.bg,
              padding: spacing[3],
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: card.path ? 'pointer' : 'default',
              flexShrink: 0,
            }}
          >
            <div>
              <p
                style={{
                  margin: `0 0 4px 0`,
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: card.titleColor,
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: typography.size.xxs,
                  fontWeight: typography.weight.regular,
                  color: card.descColor,
                  opacity: 0.85,
                  lineHeight: 1.4,
                }}
              >
                {card.description}
              </p>
            </div>

            {/* 하단 화살표 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill={card.arrowColor} fillOpacity="0.2" />
                <path
                  d="M8 7 L12 10 L8 13"
                  stroke={card.arrowColor}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
