import { useNavigate } from 'react-router-dom'
import { colors, layout, typography, shadow } from '../tokens/tokens'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'

const mockNotifications = [
  {
    date: '오늘',
    items: [
      {
        id: 1,
        title: '캐시백 적립',
        content: '초당순두부에서 320원 캐시백 적립',
        time: '14:23',
        isRead: false,
        type: 'cashback',
      },
      {
        id: 2,
        title: '충전 완료',
        content: '10,000원 충전이 완료되었습니다',
        time: '10:05',
        isRead: true,
        type: 'charge',
      },
    ],
  },
  {
    date: '2025.04.13',
    items: [
      {
        id: 3,
        title: '이벤트 안내',
        content: '4월 캐시백 10% 이벤트가 시작됩니다!',
        time: '09:00',
        isRead: true,
        type: 'event',
      },
    ],
  },
]

const typeIconMap = {
  cashback: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill={colors.teal[500]} opacity="0.15" />
      <path d="M10 6v8M8 8h3a1 1 0 010 2H8" stroke={colors.teal[500]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  charge: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill={colors.primary[700]} opacity="0.1" />
      <path d="M10 6v4l3 2" stroke={colors.primary[700]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  event: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill={colors.warning} opacity="0.15" />
      <path d="M10 6l1.2 3.6H15l-3 2.2 1.1 3.6L10 13l-3.1 2.4 1.1-3.6-3-2.2h3.8L10 6z" fill={colors.warning} />
    </svg>
  ),
}

export default function NotificationPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="알림" onBack={() => navigate(-1)} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '24px',
          backgroundColor: colors.surface.background,
        }}
      >
        {mockNotifications.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* 날짜 헤더 */}
            <div
              style={{
                padding: `12px ${layout.margin} 8px`,
              }}
            >
              <p
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.semibold,
                  color: colors.gray[500],
                  margin: 0,
                }}
              >
                {group.date}
              </p>
            </div>

            {/* 알림 아이템들 */}
            <div
              style={{
                margin: `0 ${layout.margin}`,
                backgroundColor: colors.surface.card,
                borderRadius: layout.radiusCard,
                overflow: 'hidden',
                boxShadow: shadow.card,
              }}
            >
              {group.items.map((item, itemIndex) => (
                <div key={item.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '14px 16px',
                      gap: '12px',
                      backgroundColor: item.isRead ? colors.surface.card : colors.primary[50],
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: colors.gray[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {typeIconMap[item.type] || typeIconMap.event}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <p
                          style={{
                            fontSize: typography.size.sm,
                            fontWeight: typography.weight.semibold,
                            color: colors.gray[900],
                            margin: 0,
                          }}
                        >
                          {item.title}
                        </p>
                        <span
                          style={{
                            fontSize: typography.size.xs,
                            color: colors.gray[400],
                            flexShrink: 0,
                          }}
                        >
                          {item.time}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: typography.size.xs,
                          color: colors.gray[500],
                          margin: '4px 0 0',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.content}
                      </p>
                    </div>
                    {!item.isRead && (
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: colors.primary[600],
                          flexShrink: 0,
                          marginTop: '6px',
                        }}
                      />
                    )}
                  </div>
                  {itemIndex < group.items.length - 1 && (
                    <div style={{ height: '1px', backgroundColor: colors.gray[100], margin: `0 ${layout.margin}` }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScreenContainer>
  )
}
