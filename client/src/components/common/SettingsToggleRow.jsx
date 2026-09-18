// SettingsToggleRow.jsx — I05 (p.36)
// 설정 토글 행

import { colors, typography, layout, spacing } from '../../tokens/tokens'
import { usePlatform } from '../../hooks/usePlatform'

export default function SettingsToggleRow({ label, description, value, onChange }) {
  const isAndroid = usePlatform() === 'android'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: layout.margin,
        borderBottom: `1px solid ${colors.gray[100]}`,
        fontFamily: typography.fontFamily,
      }}
    >
      {/* 좌측: 라벨 + 설명 */}
      <div style={{ flex: 1, marginRight: spacing[4] }}>
        <div
          style={{
            fontSize: typography.size.md,
            fontWeight: typography.weight.regular,
            color: colors.gray[900],
            lineHeight: 1.4,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: typography.size.xs,
              color: colors.gray[500],
              marginTop: '2px',
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* 우측: 토글 스위치 */}
      <button
        onClick={() => onChange && onChange(!value)}
        role="switch"
        aria-checked={value}
        style={{
          flexShrink: 0,
          width: isAndroid ? '52px' : '48px',
          height: isAndroid ? '32px' : '28px',
          borderRadius: layout.radiusPill,
          backgroundColor: value ? colors.primary[700] : colors.gray[300],
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)',
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: isAndroid ? (value ? '4px' : '8px') : '3px',
            left: isAndroid ? (value ? '24px' : '4px') : (value ? '23px' : '3px'),
            width: isAndroid ? (value ? '24px' : '16px') : '22px',
            height: isAndroid ? (value ? '24px' : '16px') : '22px',
            borderRadius: '50%',
            backgroundColor: isAndroid && !value ? colors.gray[500] : colors.surface.card,
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            transition: 'left 160ms cubic-bezier(0.23,1,0.32,1), top 160ms cubic-bezier(0.23,1,0.32,1), width 160ms cubic-bezier(0.23,1,0.32,1), height 160ms cubic-bezier(0.23,1,0.32,1), background-color 160ms cubic-bezier(0.23,1,0.32,1)',
            display: 'block',
          }}
        />
      </button>
    </div>
  )
}
