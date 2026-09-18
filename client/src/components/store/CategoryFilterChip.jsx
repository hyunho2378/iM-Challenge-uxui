// CategoryFilterChip.jsx — M04 (p.43,44)
// St-03: 카테고리 아이콘 + 텍스트 병기 (S6, Nielsen #6 Recognition rather than recall)

import { colors, typography, layout } from '../../tokens/tokens'
import { usePlatform } from '../../hooks/usePlatform'
import { Check } from 'lucide-react'

export default function CategoryFilterChip({ label, active, onClick, icon }) {
  const isAndroid = usePlatform() === 'android'
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        backgroundColor: isAndroid
          ? (active ? colors.primary[100] : colors.surface.card)
          : (active ? colors.primary[700] : colors.surface.card),
        color: isAndroid
          ? (active ? colors.primary[700] : colors.gray[700])
          : (active ? colors.onDark.primary : colors.gray[700]),
        border: isAndroid
          ? (active ? 'none' : `1px solid ${colors.gray[300]}`)
          : (active ? 'none' : `1px solid ${colors.gray[200]}`),
        borderRadius: isAndroid ? layout.radiusSmall : layout.radiusPill,
        padding: '7px 14px',
        fontSize: typography.size.sm,
        fontWeight: active ? typography.weight.semibold : typography.weight.regular,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background-color 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out, box-shadow 200ms ease-out',
        boxShadow: isAndroid ? 'none' : (active ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'),
      }}
    >
      {isAndroid && active && <Check size={16} color={colors.primary[700]} />}
      {icon}
      {label}
    </button>
  )
}
