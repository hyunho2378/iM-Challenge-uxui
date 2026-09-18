import { useNavigate } from 'react-router-dom'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const SERVICES = [
  {
    label: '충전하기',
    path: '/charge',
    bg: colors.primary[100],
    iconColor: colors.primary[700],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    label: '이용내역',
    path: '/history',
    bg: colors.tag.cashBg,
    iconColor: colors.tag.cashText,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: '강릉여행',
    path: '/life',
    bg: colors.tag.voucherBg,
    iconColor: colors.tag.voucherText,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: '이용안내',
    path: '/usage-guide',
    bg: colors.purpleBg,
    iconColor: colors.purpleDark,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7C13.38 7 14.5 8.12 14.5 9.5C14.5 10.88 12 12.5 12 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
  },
]

export default function ServiceShortcutGrid() {
  const navigate = useNavigate()

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        {SERVICES.map((svc) => (
          <button
            key={svc.path}
            onClick={() => navigate(svc.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing[2],
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: `${spacing[1]} ${spacing[2]}`,
              flex: 1,
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: svc.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: svc.iconColor,
              }}
            >
              {svc.icon}
            </div>
            <span
              style={{
                fontSize: typography.size.xxs,
                fontWeight: typography.weight.medium,
                color: colors.gray[900],
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {svc.label}
            </span>
          </button>
        ))}

        {/* 편집 버튼 */}
        <button
          onClick={() => navigate('/service-edit')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[2],
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: `${spacing[1]} ${spacing[2]}`,
            flex: 1,
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: colors.gray[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.gray[500],
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span
            style={{
              fontSize: typography.size.xxs,
              fontWeight: typography.weight.medium,
              color: colors.gray[500],
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            편집
          </span>
        </button>
      </div>
    </div>
  )
}
