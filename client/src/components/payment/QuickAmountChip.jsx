// QuickAmountChip.jsx — P03
// 빠른 금액 추가 칩

import { colors, typography, layout } from '../../tokens/tokens'
import { usePlatform } from '../../hooks/usePlatform'

export default function QuickAmountChip({ label, onClick }) {
  const isAndroid = usePlatform() === 'android'
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary[50],
        color: colors.primary[700],
        border: 'none',
        borderRadius: isAndroid ? layout.radiusSmall : layout.radiusPill,
        padding: '6px 14px',
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'opacity 120ms cubic-bezier(0.23,1,0.32,1)',
      }}
      onMouseDown={(e) => { e.currentTarget.style.opacity = '0.7' }}
      onMouseUp={(e) => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
      onTouchStart={(e) => { e.currentTarget.style.opacity = '0.7' }}
      onTouchEnd={(e) => { e.currentTarget.style.opacity = '1' }}
    >
      {label}
    </button>
  )
}
