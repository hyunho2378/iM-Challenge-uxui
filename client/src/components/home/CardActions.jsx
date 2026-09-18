/**
 * CardActions (Task 5)
 * Strategy: S2 — 환불 동등 위계 노출
 * Nielsen: #1 visibility, #2 match real world
 * Shneiderman: #1 consistency
 * 3슬롯: 충전(Plus) / 환불(RotateCcw) / 이용내역(Receipt)
 */

import { useNavigate } from 'react-router-dom'
import { Plus, RotateCcw, Receipt } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const ACTIONS = [
  { label: '충전', Icon: Plus, path: '/charge' },
  { label: '환불', Icon: RotateCcw, path: '/refund' },
  { label: '이용내역', Icon: Receipt, path: '/history' },
]

export default function CardActions({ chargeButtonRef }) {
  const navigate = useNavigate()

  return (
    <div
      style={{
        margin: `0 ${layout.margin} ${spacing[2]}`,
        backgroundColor: colors.surface.card,
        borderRadius: layout.radiusCard,
        boxShadow: shadow.card,
        display: 'flex',
      }}
    >
      {ACTIONS.map(({ label, Icon, path }, idx) => (
        <button
          key={label}
          ref={label === '충전' ? chargeButtonRef : undefined}
          onClick={() => navigate(path)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[1],
            padding: `${spacing[4]} 0`,
            background: 'none',
            border: 'none',
            borderRight: idx < ACTIONS.length - 1 ? `1px solid ${colors.gray[100]}` : 'none',
            cursor: 'pointer',
            minHeight: layout.touchMin,
            fontFamily: typography.fontFamily,
          }}
        >
          <Icon size={20} color={colors.primary[700]} strokeWidth={1.8} />
          <span
            style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.medium,
              color: colors.gray[700],
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
