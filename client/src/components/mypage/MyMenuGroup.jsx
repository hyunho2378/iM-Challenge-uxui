import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { colors, typography, layout, spacing } from '../../tokens/tokens'

export default function MyMenuGroup({ title, items }) {
  const navigate = useNavigate()

  const handleClick = (item) => {
    if (item.disabled) return
    if (item.onClick) item.onClick()
    else if (item.href) navigate(item.href)
  }

  return (
    <div>
      {/* 그룹 헤더 */}
      <div style={{
        padding: `${spacing[4]} ${spacing[4]} ${spacing[2]}`,
        backgroundColor: colors.surface.background,
      }}>
        <span style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.gray[700],
          fontFamily: typography.fontFamily,
        }}>
          {title}
        </span>
      </div>

      {/* 메뉴 항목 */}
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => handleClick(item)}
          style={{
            width: '100%',
            border: 'none',
            cursor: item.disabled ? 'default' : 'pointer',
            pointerEvents: item.disabled ? 'none' : 'auto',
            textAlign: 'left',
            backgroundColor: colors.surface.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${spacing[4]} ${spacing[4]}`,
            minHeight: layout.touchMin,
            borderBottom: `1px solid ${colors.gray[100]}`,
            fontFamily: typography.fontFamily,
          }}
        >
          <span style={{
            fontSize: typography.size.md,
            color: item.disabled ? (item.labelColor || colors.gray[300]) : colors.gray[900],
          }}>
            {item.label}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            {item.value && (
              <span style={{
                fontSize: typography.size.sm,
                color: item.disabled
                  ? (item.valueColor || colors.gray[300])
                  : colors.gray[500],
              }}>
                {item.value}
              </span>
            )}
            {!item.disabled && <ChevronRight size={20} color={colors.gray[400]} />}
          </div>
        </button>
      ))}
    </div>
  )
}
