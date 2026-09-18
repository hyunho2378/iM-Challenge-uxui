import { useNavigate } from 'react-router-dom'
import { colors, layout, typography, shadow } from '../tokens/tokens'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'

const menuGroups = [
  {
    group: '계정',
    items: [
      {
        id: 'my-info',
        label: '내 정보',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="3" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: 'linked-account',
        label: '연결계좌 변경',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="5" width="14" height="11" rx="2" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M3 9h14" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M7 13h2" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: 'main-card',
        label: '주카드/잔액 변경',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="5" width="16" height="11" rx="2" stroke={colors.gray[700]} strokeWidth="1.5" />
            <circle cx="6" cy="13" r="1.5" fill={colors.gray[700]} />
            <circle cx="10" cy="13" r="1.5" fill={colors.gray[700]} />
          </svg>
        ),
      },
    ],
  },
  {
    group: '지원',
    items: [
      {
        id: 'customer-center',
        label: '고객센터',
        route: '/customer-center',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 12a6 6 0 1112 0" stroke={colors.gray[700]} strokeWidth="1.5" />
            <rect x="3" y="12" width="3" height="4" rx="1" fill={colors.gray[700]} />
            <rect x="14" y="12" width="3" height="4" rx="1" fill={colors.gray[700]} />
          </svg>
        ),
      },
      {
        id: 'card-lost',
        label: '분실신고/재발급',
        route: '/card-lost',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="10" r="4" stroke={colors.gray[700]} strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        id: 'refund',
        label: '환불(출금) 신청',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10h10M10 5l-5 5 5 5" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
  },
  {
    group: '앱',
    items: [
      {
        id: 'settings',
        label: '설정',
        route: '/settings',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="2.5" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.41 1.41M13.54 13.54l1.41 1.41M5.05 14.95l1.41-1.41M13.54 6.46l1.41-1.41" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: 'notification',
        label: '알림',
        route: '/notification',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 00-6 6v4l-1 2h14l-1-2V8a6 6 0 00-6-6z" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M8 15a2 2 0 004 0" stroke={colors.gray[700]} strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        id: 'coupon',
        label: '내 쿠폰',
        route: '/coupon',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="6" width="16" height="9" rx="2" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M13 6V5a1 1 0 00-1-1H8a1 1 0 00-1 1v1" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M6 10h8M6 13h5" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: 'gangneung-money',
        label: '강릉머니',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M10 6v8M8 8h3.5a1.5 1.5 0 010 3H8" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
  {
    group: '가맹점',
    items: [
      {
        id: 'store-register',
        label: '가맹점 등록',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 7h14l-1.5 8H4.5L3 7z" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M7 7V5a2 2 0 014 0v2" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M10 11v3M8.5 12.5h3" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: 'card-delivery',
        label: '카드 배송 현황',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 8h11v7H2V8z" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M13 11h3l2 3v1h-5v-4z" stroke={colors.gray[700]} strokeWidth="1.5" />
            <circle cx="5.5" cy="16.5" r="1.5" fill={colors.gray[700]} />
            <circle cx="14.5" cy="16.5" r="1.5" fill={colors.gray[700]} />
          </svg>
        ),
      },
    ],
  },
  {
    group: '정보',
    items: [
      {
        id: 'terms',
        label: '이용약관',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="2" width="12" height="16" rx="2" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M7 7h6M7 10h6M7 13h4" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: 'notice',
        label: '공지사항',
        route: '/news',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14v11a1 1 0 01-1 1H4a1 1 0 01-1-1V5z" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M3 5l7-3 7 3" stroke={colors.gray[700]} strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        id: 'share',
        label: '지인에게 소개하기',
        route: null,
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="15" cy="5" r="2" stroke={colors.gray[700]} strokeWidth="1.5" />
            <circle cx="5" cy="10" r="2" stroke={colors.gray[700]} strokeWidth="1.5" />
            <circle cx="15" cy="15" r="2" stroke={colors.gray[700]} strokeWidth="1.5" />
            <path d="M7 9l6-3M7 11l6 3" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
]

export default function MenuPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer>
      <TopAppBarBack title="전체 메뉴" onBack={() => navigate(-1)} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '24px',
          backgroundColor: colors.surface.background,
        }}
      >
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* 그룹 헤더 */}
            <div
              style={{
                padding: `${groupIndex === 0 ? '16px' : '8px'} ${layout.margin} 8px`,
              }}
            >
              <p
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.semibold,
                  color: colors.gray[500],
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {group.group}
              </p>
            </div>

            {/* 그룹 아이템 */}
            <div
              style={{
                backgroundColor: colors.surface.card,
                marginHorizontal: layout.margin,
                borderRadius: layout.radiusCard,
                overflow: 'hidden',
                boxShadow: shadow.card,
                margin: `0 ${layout.margin}`,
              }}
            >
              {group.items.map((item, itemIndex) => (
                <div key={item.id}>
                  <button
                    onClick={() => item.route && navigate(item.route)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: item.route ? 'pointer' : 'default',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: colors.gray[100],
                          borderRadius: layout.radiusSmall,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <span
                        style={{
                          fontSize: typography.size.sm,
                          fontWeight: typography.weight.medium,
                          color: colors.gray[900],
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {itemIndex < group.items.length - 1 && (
                    <div
                      style={{
                        height: '1px',
                        backgroundColor: colors.gray[100],
                        margin: `0 ${layout.margin}`,
                      }}
                    />
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
