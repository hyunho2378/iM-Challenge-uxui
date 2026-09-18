import { useNavigate } from 'react-router-dom'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import Button from '../common/Button'

export default function RecentPaymentEmpty() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        backgroundColor: colors.surface.card,
        borderRadius: layout.radiusCard,
        margin: layout.margin,
        padding: spacing[8],
        boxShadow: shadow.card,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[3],
      }}
    >
      {/* 빈 문서 아이콘 */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="5" width="30" height="38" rx="4" fill={colors.gray[100]} />
        <rect x="9" y="5" width="30" height="38" rx="4" stroke={colors.gray[300]} strokeWidth="1.5" />
        <line x1="16" y1="16" x2="32" y2="16" stroke={colors.gray[300]} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="22" x2="32" y2="22" stroke={colors.gray[300]} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="28" x2="24" y2="28" stroke={colors.gray[300]} strokeWidth="2" strokeLinecap="round" />
        {/* X 표시 */}
        <circle cx="34" cy="34" r="9" fill={colors.gray[200]} />
        <line x1="30" y1="30" x2="38" y2="38" stroke={colors.gray[500]} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="38" y1="30" x2="30" y2="38" stroke={colors.gray[500]} strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      <p
        style={{
          margin: 0,
          color: colors.gray[500],
          fontSize: typography.size.sm,
          fontWeight: typography.weight.regular,
          textAlign: 'center',
        }}
      >
        최근 결제 내역이 없습니다
      </p>

      <Button
        variant="outlined"
        size="sm"
        fullWidth={false}
        style={{ marginTop: spacing[1] }}
        onClick={() => navigate('/store')}
      >
        결제하러 가기
      </Button>
    </div>
  )
}
