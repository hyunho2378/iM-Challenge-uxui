import { colors, typography, layout, spacing } from '../../tokens/tokens'

const TYPE_STYLES = {
  payment: { bg: colors.primary[100], color: colors.primary[700] },
  cashback: { bg: colors.tag.cashBg, color: colors.tag.cashText },
  notice: { bg: colors.kakaoBg, color: colors.tag.noticeText },
  system: { bg: colors.gray[100], color: colors.gray[500] },
}

function NotifIcon({ type }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.system
  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: s.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {type === 'payment' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="4" width="14" height="10" rx="2" stroke={s.color} strokeWidth="1.6" />
          <line x1="2" y1="7.5" x2="16" y2="7.5" stroke={s.color} strokeWidth="1.4" />
          <rect x="4" y="10" width="4" height="2" rx="0.5" fill={s.color} />
        </svg>
      )}
      {type === 'cashback' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="6.5" stroke={s.color} strokeWidth="1.6" />
          <path d="M6 9.5 L8.5 12 L12.5 7" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {type === 'notice' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2 L16 14 L2 14 Z" stroke={s.color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
          <line x1="9" y1="8" x2="9" y2="11" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="9" cy="13" r="0.8" fill={s.color} />
        </svg>
      )}
      {type === 'system' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="6.5" stroke={s.color} strokeWidth="1.6" />
          <line x1="9" y1="6" x2="9" y2="9.5" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="9" cy="12" r="0.8" fill={s.color} />
        </svg>
      )}
    </div>
  )
}

export default function NotificationItem({ date, items = [] }) {
  return (
    <div>
      {/* 날짜 그룹 헤더 */}
      <div
        style={{
          backgroundColor: colors.gray[50],
          paddingTop: spacing[2],
          paddingBottom: spacing[2],
          paddingLeft: spacing[4],
          paddingRight: spacing[4],
        }}
      >
        <span
          style={{
            fontSize: typography.size.xs,
            fontWeight: typography.weight.semibold,
            color: colors.gray[500],
          }}
        >
          {date}
        </span>
      </div>

      {/* 알림 항목들 */}
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: spacing[3],
            paddingTop: spacing[4],
            paddingBottom: spacing[4],
            paddingLeft: spacing[4],
            paddingRight: spacing[4],
            backgroundColor: item.isRead ? colors.surface.card : colors.primary[50],
            borderBottom: `1px solid ${colors.gray[100]}`,
            position: 'relative',
          }}
        >
          {/* 미읽음 파란 dot */}
          {!item.isRead && (
            <div
              style={{
                position: 'absolute',
                left: spacing[2],
                top: '50%',
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: colors.primary[700],
              }}
            />
          )}

          {/* 아이콘 */}
          <NotifIcon type={item.type || 'system'} />

          {/* 텍스트 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: `0 0 2px 0`,
                fontSize: typography.size.sm,
                fontWeight: item.isRead ? typography.weight.regular : typography.weight.semibold,
                color: colors.gray[900],
                lineHeight: 1.4,
              }}
            >
              {item.title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: typography.size.xs,
                fontWeight: typography.weight.regular,
                color: colors.gray[500],
                lineHeight: 1.5,
              }}
            >
              {item.content}
            </p>
          </div>

          {/* 시간 */}
          <span
            style={{
              flexShrink: 0,
              fontSize: typography.size.xxs,
              color: colors.gray[400],
              marginTop: '2px',
            }}
          >
            {item.time}
          </span>
        </div>
      ))}
    </div>
  )
}
