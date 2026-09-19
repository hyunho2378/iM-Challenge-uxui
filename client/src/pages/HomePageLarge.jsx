import { useNavigate } from 'react-router-dom'
import { useUser, MONTHLY_DISCOUNT_LIMIT } from '../context/UserContext'
import { useTypography } from '../hooks/useTypography'
import { usePlatform } from '../hooks/usePlatform'
import { colors, spacing, layout, shadow, typography } from '../tokens/tokens'
import ScreenContainer from '../components/layout/ScreenContainer'
import BottomNavBar from '../components/layout/BottomNavBar'
import TopAppBarLargeText from '../components/layout/TopAppBarLargeText'
import { ChevronRight, Receipt, HelpCircle } from 'lucide-react'

// 잔액 카드 (다크) — iM샵 + balance + [충전(흰)][QR결제(글래스)]
function BalanceCardLarge({ balance, sizes, navigate, fmt, btnRadius }) {
  return (
    <div style={{
      backgroundColor: colors.surface.darkCard,
      borderRadius: layout.radiusCard,
      padding: spacing[5],
      color: colors.onDark.primary,
      boxShadow: shadow.button,
    }}>
      {/* iM샵 + balance */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: spacing[4],
      }}>
        <span style={{
          fontSize: sizes.md,
          fontWeight: typography.weight.medium,
          color: 'rgba(255,255,255,0.85)',
          fontFamily: typography.fontFamily,
        }}>
          대구로페이
        </span>
        <span style={{
          fontSize: sizes.balance,
          fontWeight: typography.weight.bold,
          color: colors.onDark.primary,
          fontFamily: typography.fontFamily,
        }}>
          {fmt(balance)}원
        </span>
      </div>

      {/* 충전 + QR결제 */}
      <div style={{ display: 'flex', gap: spacing[2] }}>
        <button
          onClick={() => navigate('/charge')}
          style={{
            flex: 1,
            height: '68px',
            backgroundColor: colors.surface.card,
            color: colors.primary[700],
            border: 'none',
            borderRadius: btnRadius,
            fontSize: sizes.md,
            fontWeight: typography.weight.bold,
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
          }}
        >
          충전
        </button>
        <button
          onClick={() => navigate('/qr')}
          style={{
            flex: 1,
            height: '68px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: colors.onDark.primary,
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: btnRadius,
            fontSize: sizes.md,
            fontWeight: typography.weight.bold,
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
          }}
        >
          QR결제
        </button>
      </div>
    </div>
  )
}

// 06차 1번: 캐시백 자동/수동 토글 → 이번 달 할인충전 한도 진행률로 교체 (일반 모드와 동일 개념).
// 큰글씨 모드도 같은 정보를 보여줘야 한다 — 모드마다 다른 기능을 보여주면 안 된다.
function DiscountLimitCardLarge({ monthlyDiscountCharged, sizes, fmt, btnRadius }) {
  const progressPct = Math.min(100, (monthlyDiscountCharged / MONTHLY_DISCOUNT_LIMIT) * 100)
  return (
    <div style={{
      backgroundColor: colors.surface.card,
      borderRadius: layout.radiusCard,
      padding: spacing[5],
      boxShadow: shadow.card,
    }}>
      {/* 1줄: 라벨 + % */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: spacing[3],
      }}>
        <span style={{
          fontSize: sizes.md,
          fontWeight: typography.weight.medium,
          color: colors.gray[700],
          fontFamily: typography.fontFamily,
        }}>
          이번 달 할인충전
        </span>
        <span style={{
          fontSize: sizes.xl,
          fontWeight: typography.weight.bold,
          color: colors.teal[500],
          fontFamily: typography.fontFamily,
        }}>
          {Math.round(progressPct)}%
        </span>
      </div>

      {/* 진행바 */}
      <div style={{
        height: 10,
        backgroundColor: colors.gray[100],
        borderRadius: layout.radiusPill,
        overflow: 'hidden',
        marginBottom: spacing[3],
      }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          backgroundColor: colors.teal[500],
          transition: 'width 280ms cubic-bezier(0.23,1,0.32,1)',
        }} />
      </div>

      {/* 금액 */}
      <div style={{ fontSize: sizes.sm, color: colors.gray[500], fontFamily: typography.fontFamily }}>
        사용액 {fmt(monthlyDiscountCharged)}원 / {fmt(MONTHLY_DISCOUNT_LIMIT)}원
      </div>
      <div style={{ marginTop: spacing[2], fontSize: sizes.xs, color: colors.gray[500], fontFamily: typography.fontFamily }}>
        한도를 넘으면 할인 없이 충전해요
      </div>
    </div>
  )
}

// 신규 사용자 — 카드 신청 CTA (큰글씨 톤, 단순)
function CardApplyCTALarge({ sizes, navigate, btnRadius }) {
  return (
    <div style={{
      backgroundColor: colors.surface.darkCard,
      borderRadius: layout.radiusCard,
      padding: spacing[6],
      boxShadow: shadow.button,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
    }}>
      <div>
        <div style={{
          fontSize: sizes.xl,
          fontWeight: typography.weight.bold,
          color: colors.onDark.primary,
          lineHeight: 1.3,
          marginBottom: spacing[2],
          fontFamily: typography.fontFamily,
        }}>
          대구로페이 카드를<br />신청하세요
        </div>
        <div style={{
          fontSize: sizes.md,
          color: colors.onDark.secondary,
          fontFamily: typography.fontFamily,
        }}>
          최대 10% 캐시백 혜택
        </div>
      </div>
      <button
        onClick={() => navigate('/card-apply')}
        style={{
          width: '100%',
          height: '68px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: btnRadius,
          color: colors.onDark.primary,
          fontSize: sizes.md,
          fontWeight: typography.weight.bold,
          cursor: 'pointer',
          fontFamily: typography.fontFamily,
        }}
      >
        신청하기
      </button>
    </div>
  )
}

// 캐시백 카드 — 이번달 적립 + 사용 가능 + 한도
function CashbackCardLarge({ monthlyAccumulated, cashbackBalance, sizes, fmt, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.surface.card,
        borderRadius: layout.radiusCard,
        boxShadow: shadow.card,
        padding: spacing[5],
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <div>
        {/* 1줄: 캐시백 10% */}
        <div style={{ marginBottom: spacing[2] }}>
          <span style={{
            fontSize: sizes.md,
            fontWeight: typography.weight.regular,
            color: colors.gray[700],
            fontFamily: typography.fontFamily,
          }}>
            캐시백{' '}
          </span>
          <span style={{
            fontSize: sizes.md,
            fontWeight: typography.weight.bold,
            color: colors.primary[700],
            fontFamily: typography.fontFamily,
          }}>
            10%
          </span>
        </div>

        {/* 2줄: 이번달 적립 */}
        <div style={{
          fontSize: sizes.lg,
          fontWeight: typography.weight.bold,
          color: colors.teal[500],
          fontFamily: typography.fontFamily,
          marginBottom: spacing[1],
        }}>
          이번달 적립 {fmt(monthlyAccumulated)}원
        </div>

        {/* 3줄: 사용 가능 */}
        <div style={{
          fontSize: sizes.md,
          fontWeight: typography.weight.medium,
          color: colors.gray[700],
          fontFamily: typography.fontFamily,
          marginBottom: spacing[1],
        }}>
          사용 가능 {fmt(cashbackBalance)}원
        </div>

        {/* 4줄: 이번 달 최대 */}
        <div style={{
          fontSize: sizes.sm,
          color: colors.gray[500],
          fontFamily: typography.fontFamily,
        }}>
          이번 달 최대 3만원
        </div>
      </div>

      <ChevronRight size={32} color={colors.gray[400]} strokeWidth={1.8} />
    </div>
  )
}

// 액션 카드 (이용내역, 이용안내)
function ActionCardLarge({ title, icon: Icon, iconBg, iconColor, sizes, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.surface.card,
        borderRadius: layout.radiusCard,
        boxShadow: shadow.card,
        padding: spacing[5],
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <span style={{
        fontSize: sizes.lg,
        fontWeight: typography.weight.bold,
        color: colors.gray[900],
        fontFamily: typography.fontFamily,
      }}>
        {title}
      </span>

      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: layout.radiusCard,
        backgroundColor: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={24} color={iconColor} strokeWidth={1.8} />
      </div>
    </div>
  )
}

// 환불 카드 + 3D 일러스트
function RefundCardLarge({ sizes, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.surface.card,
        borderRadius: layout.radiusCard,
        boxShadow: shadow.card,
        padding: spacing[6],
        minHeight: '140px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <div>
        <div style={{
          fontSize: sizes.lg,
          fontWeight: typography.weight.bold,
          color: colors.gray[900],
          fontFamily: typography.fontFamily,
          marginBottom: spacing[2],
        }}>
          환불(출금)
        </div>
        <div style={{
          fontSize: sizes.sm,
          color: colors.gray[500],
          fontFamily: typography.fontFamily,
        }}>
          충전 금액을 다시 돌려받아요
        </div>
      </div>

      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <ellipse cx="40" cy="50" rx="28" ry="24" fill={colors.illustration.leaf} />
        <ellipse cx="40" cy="48" rx="28" ry="24" fill={colors.illustration.leafDark} opacity="0.4" />
        <path d="M28 26 L52 26 L48 34 L32 34 Z" fill={colors.illustration.leafDark} />
        <text x="40" y="56" textAnchor="middle" fontSize="20" fontWeight="bold" fill={colors.surface.card} fontFamily="sans-serif">₩</text>
        <circle cx="60" cy="32" r="10" fill={colors.illustration.coin} />
        <text x="60" y="37" textAnchor="middle" fontSize="11" fontWeight="bold" fill={colors.illustration.coinText} fontFamily="sans-serif">₩</text>
      </svg>
    </div>
  )
}

export default function HomePageLarge() {
  const navigate = useNavigate()
  const sizes = useTypography()
  const platform = usePlatform()
  const isAndroid = platform === 'android'
  const btnRadius = isAndroid ? layout.radiusPill : layout.radiusButton
  const {
    hasCard,
    balance,
    cashbackBalance,
    monthlyAccumulated,
    monthlyDiscountCharged,
  } = useUser()
  const fmt = (n) => n.toLocaleString('ko-KR')

  return (
    <ScreenContainer>
      <TopAppBarLargeText />

      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        // 04차: TopAppBarLargeText가 fixed(52px)로 바뀌어 레이아웃에서 빠졌으므로 더해준다
        paddingTop: `calc(52px + ${spacing[3]})`,
        paddingLeft: layout.margin,
        paddingRight: layout.margin,
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 100px)',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[4],
      }}>
        {!hasCard ? (
          <CardApplyCTALarge sizes={sizes} navigate={navigate} btnRadius={btnRadius} />
        ) : (
          <>
            <BalanceCardLarge
              balance={balance}
              sizes={sizes}
              navigate={navigate}
              fmt={fmt}
              btnRadius={btnRadius}
            />

            <DiscountLimitCardLarge
              monthlyDiscountCharged={monthlyDiscountCharged}
              sizes={sizes}
              fmt={fmt}
              btnRadius={btnRadius}
            />

            <CashbackCardLarge
              monthlyAccumulated={monthlyAccumulated}
              cashbackBalance={cashbackBalance}
              sizes={sizes}
              fmt={fmt}
              onClick={() => navigate('/benefits')}
            />

            <ActionCardLarge
              title="이용 내역"
              icon={Receipt}
              iconBg={colors.primary[100]}
              iconColor={colors.primary[700]}
              sizes={sizes}
              onClick={() => navigate('/history')}
            />

            <RefundCardLarge sizes={sizes} onClick={() => navigate('/refund')} />
          </>
        )}

        <ActionCardLarge
          title="iM샵 이용안내"
          icon={HelpCircle}
          iconBg={colors.gray[100]}
          iconColor={colors.gray[700]}
          sizes={sizes}
          onClick={() => navigate('/usage-guide')}
        />
      </div>

      <BottomNavBar />
    </ScreenContainer>
  )
}
