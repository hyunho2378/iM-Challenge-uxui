/**
 * CashbackEntryCard (B7)
 * hasCard true 시 잔액 카드 바로 아래 노출
 * 클릭 시 5월 캐시백 모달 오픈
 */

import { Info, ChevronRight } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

export default function CashbackEntryCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: `calc(100% - ${layout.margin} * 2)`,
        margin: `0 ${layout.margin}`,
        backgroundColor: colors.surface.card,
        border: 'none',
        boxShadow: shadow.card,
        borderRadius: layout.radiusCard,
        padding: spacing[4],
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        cursor: 'pointer',
        fontFamily: typography.fontFamily,
        minHeight: layout.touchMin,
      }}
    >
      <Info size={20} color={colors.primary[700]} strokeWidth={2} />
      <div style={{ flex: 1, textAlign: 'left' }}>
        <p style={{
          margin: 0,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
          color: colors.gray[900],
        }}>
          캐시백 내역 확인하기
        </p>
        <p style={{
          margin: `${spacing[1]} 0 0 0`,
          fontSize: typography.size.xs,
          color: colors.gray[500],
        }}>
          이번 달 적립금 확인
        </p>
      </div>
      <ChevronRight size={20} color={colors.gray[400]} />
    </button>
  )
}
