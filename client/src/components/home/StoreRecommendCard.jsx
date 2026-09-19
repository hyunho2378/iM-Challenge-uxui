import { useNavigate } from 'react-router-dom'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

// 09차: 이전 베이스 프로젝트(타 지역)의 상호가 남아 있어 제거하고,
// 전사.md 캐처에 실제로 등장하는 상호(S34 쿠폰함·S44 목록)로 교체한다.
const defaultStores = [
  { id: 1, name: '오복식당', category: '음식점', distance: '0.3km' },
  { id: 2, name: '수야커피', category: '카페', distance: '1.2km' },
  { id: 3, name: '푸름식품', category: '마트', distance: '0.8km' },
]

function StoreIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="7" width="16" height="11" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M4 7 C4 4.79 5.79 3 8 3 H12 C14.21 3 16 4.79 16 7" stroke={color} strokeWidth="1.6" fill="none" />
      <rect x="7" y="11" width="6" height="4" rx="1" stroke={color} strokeWidth="1.4" />
      <line x1="10" y1="7" x2="10" y2="11" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function StoreRecommendCard({ stores = defaultStores }) {
  const navigate = useNavigate()

  return (
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
      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => navigate('/store', { state: { focusStoreId: store.id } })}
          style={{
            minWidth: '140px',
            width: '140px',
            backgroundColor: colors.surface.card,
            borderRadius: layout.radiusButton,
            padding: spacing[3],
            boxShadow: shadow.card,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[2],
            flexShrink: 0,
          }}
        >
          {/* 매장 아이콘 */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: colors.primary[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StoreIcon color={colors.primary[700]} />
          </div>

          {/* 매장명 */}
          <p
            style={{
              margin: 0,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: colors.gray[900],
              lineHeight: 1.3,
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            {store.name}
          </p>

          {/* 카테고리 + 거리 */}
          <p
            style={{
              margin: 0,
              fontSize: typography.size.xxs,
              fontWeight: typography.weight.regular,
              color: colors.gray[500],
              lineHeight: 1.4,
            }}
          >
            {store.category} · {store.distance}
          </p>
        </div>
      ))}
    </div>
  )
}
