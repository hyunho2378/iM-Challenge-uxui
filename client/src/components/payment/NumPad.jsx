// NumPad.jsx — P04
// 커스텀 숫자패드 (p.14,15,19)

import { Delete } from 'lucide-react'
import { colors, typography, layout, spacing } from '../../tokens/tokens'

const PAD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['00', '0', 'backspace'],
]

export default function NumPad({ onPress }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: spacing[2],
        padding: `0 ${layout.margin}`,
      }}
    >
      {PAD_KEYS.flat().map((key, idx) => (
        <button
          key={idx}
          onClick={() => onPress(key)}
          style={{
            height: '56px',
            backgroundColor: colors.surface.card,
            border: 'none',
            borderRadius: layout.radiusSmall,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.size.xl,
            fontWeight: typography.weight.medium,
            color: colors.gray[900],
            cursor: 'pointer',
            transition: 'background-color 100ms cubic-bezier(0.23,1,0.32,1)',
          }}
          onMouseDown={(e) => { e.currentTarget.style.backgroundColor = colors.gray[100] }}
          onMouseUp={(e) => { e.currentTarget.style.backgroundColor = colors.surface.card }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.surface.card }}
          onTouchStart={(e) => { e.currentTarget.style.backgroundColor = colors.gray[100] }}
          onTouchEnd={(e) => { e.currentTarget.style.backgroundColor = colors.surface.card }}
        >
          {key === 'backspace' ? (
            <Delete size={22} color={colors.gray[700]} />
          ) : (
            key
          )}
        </button>
      ))}
    </div>
  )
}
