import { useNavigate } from 'react-router-dom'
import { colors, typography } from '../tokens/tokens'
import Button from '../components/common/Button'
import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'

export default function CouponPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="내 쿠폰" onBack={() => navigate(-1)} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface.background,
          paddingBottom: '24px',
        }}
      >
        {/* 쿠폰 SVG 아이콘 */}
        <div
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: colors.gray[100],
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="12" width="32" height="18" rx="3" stroke={colors.gray[400]} strokeWidth="2" />
            <circle cx="13" cy="21" r="4" fill={colors.gray[200]} stroke={colors.gray[400]} strokeWidth="1.5" />
            <path d="M21 16h10M21 21h8M21 26h6" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 12v3M17 27v1" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
          </svg>
        </div>

        <p
          style={{
            fontSize: typography.size.md,
            fontWeight: typography.weight.semibold,
            color: colors.gray[700],
            margin: '0 0 8px',
            textAlign: 'center',
          }}
        >
          보유한 쿠폰이 없습니다
        </p>
        <p
          style={{
            fontSize: typography.size.sm,
            color: colors.gray[400],
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          이벤트에 참여하거나 결제 시{'\n'}쿠폰을 받을 수 있어요
        </p>

        <Button variant="filled" size="md" fullWidth={false} onClick={() => navigate('/')} style={{ marginTop: '32px' }}>
          이벤트 보러 가기
        </Button>
      </div>
    </ScreenContainer>
  )
}
