// FrequentPlaces.jsx — 자주 가는 곳 / QR결제 매장 탭

import { useState } from 'react'
import { Store } from 'lucide-react'
import { colors, typography, layout, spacing } from '../../tokens/tokens'
import { QR_STORES } from '../../data/stores'
import StoreListItem from './StoreListItem'

const FREQUENT = [
  { id: 1, name: '초당순두부', category: '음식점', address: '금성로' },
  { id: 2, name: '테라로사', category: '카페', address: '구정면' },
  { id: 3, name: 'GS25 경포점', category: '편의점', address: '경포로' },
]

export default function FrequentPlaces({ onSelectStore }) {
  const [tab, setTab] = useState('favorites')

  return (
    <div
      style={{
        backgroundColor: colors.surface.card,
        paddingTop: spacing[3],
        paddingBottom: spacing[3],
        borderBottom: `1px solid ${colors.gray[100]}`,
      }}
    >
      {/* 탭 헤더 */}
      <div
        style={{
          display: 'flex',
          borderBottom: `1px solid ${colors.gray[200]}`,
          padding: `0 ${layout.margin}`,
          gap: spacing[4],
        }}
      >
        <TabButton
          label="자주 가는 곳"
          active={tab === 'favorites'}
          onClick={() => setTab('favorites')}
        />
        <TabButton
          label={`QR결제 매장 ${QR_STORES.length}`}
          active={tab === 'qr'}
          onClick={() => setTab('qr')}
        />
      </div>

      {tab === 'favorites' ? (
        <div
          style={{
            display: 'flex',
            gap: spacing[3],
            padding: `${spacing[3]} ${layout.margin} 0`,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {FREQUENT.map((place) => (
            <div
              key={place.id}
              style={{
                width: '80px',
                flexShrink: 0,
                backgroundColor: colors.gray[50],
                border: `1px solid ${colors.gray[100]}`,
                borderRadius: layout.radiusSmall,
                padding: `${spacing[3]} ${spacing[2]}`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing[1],
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary[50],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Store size={16} color={colors.primary[700]} />
              </div>
              <span
                style={{
                  fontSize: typography.size.xxs,
                  fontWeight: typography.weight.semibold,
                  color: colors.gray[900],
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
              >
                {place.name}
              </span>
              <span
                style={{
                  fontSize: typography.size.xxs,
                  color: colors.gray[400],
                  textAlign: 'center',
                }}
              >
                {place.category}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ paddingTop: spacing[1] }}>
          {QR_STORES.slice(0, 50).map((store) => (
            <StoreListItem
              key={store.id}
              store={store}
              onClick={() => onSelectStore?.(store)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: `${spacing[2]} 0`,
        cursor: 'pointer',
        fontSize: typography.size.sm,
        fontWeight: active ? typography.weight.semibold : typography.weight.regular,
        color: active ? colors.gray[900] : colors.gray[500],
        borderBottom: active ? `2px solid ${colors.primary[700]}` : '2px solid transparent',
        fontFamily: typography.fontFamily,
        marginBottom: '-1px',
      }}
    >
      {label}
    </button>
  )
}
