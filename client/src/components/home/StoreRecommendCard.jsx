import { useNavigate } from 'react-router-dom'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const defaultStores = [
  { id: 1, name: '강릉중앙시장', category: '전통시장', distance: '0.3km' },
  { id: 2, name: '초당순두부마을', category: '음식점', distance: '1.2km' },
  { id: 3, name: '강릉커피거리', category: '카페', distance: '0.8km' },
]

const storeColors = [colors.primary[100], colors.tag.cashBg, colors.tag.voucherBg]
const iconColors = [colors.primary[700], colors.tag.cashText, colors.tag.voucherText]

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
      {stores.map((store, idx) => (
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
              backgroundColor: storeColors[idx % storeColors.length],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StoreIcon color={iconColors[idx % iconColors.length]} />
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
