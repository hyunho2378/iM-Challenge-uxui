// MonthPickerSheet.jsx — S03 (p.12)
// 월 선택 바텀시트

import { Check } from 'lucide-react'
import { colors, typography, layout, spacing } from '../../tokens/tokens'
import BottomSheet from './BottomSheet'

function generateMonths(count = 12) {
  const months = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    months.push({
      value: `${year}-${String(month).padStart(2, '0')}`,
      label: `${year}년 ${month}월`,
    })
  }
  return months
}

export default function MonthPickerSheet({ isOpen, onClose, selected, onSelect }) {
  const months = generateMonths(12)

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="기간 선택">
      <div style={{ paddingBottom: spacing[6] }}>
        {months.map(({ value, label }) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              onClick={() => onSelect && onSelect(value)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${spacing[4]} ${layout.margin}`,
                background: 'none',
                border: 'none',
                borderBottom: `1px solid ${colors.gray[100]}`,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontSize: typography.size.md,
                  fontWeight: isSelected ? typography.weight.semibold : typography.weight.regular,
                  color: isSelected ? colors.primary[700] : colors.gray[900],
                }}
              >
                {label}
              </span>
              {isSelected && (
                <Check size={18} color={colors.primary[700]} strokeWidth={2.5} />
              )}
            </button>
          )
        })}
      </div>
    </BottomSheet>
  )
}
