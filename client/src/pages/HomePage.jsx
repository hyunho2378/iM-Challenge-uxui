import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useUser } from '../context/UserContext'
import { useOnboarding } from '../context/OnboardingContext'
import { colors, layout, spacing, shadow, typography } from '../tokens/tokens'
import { STORES, GANGNEUNG_STATION, calculateDistance } from '../data/stores'
import CoachMarkOverlay from '../components/common/CoachMarkOverlay'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBar from '../components/layout/TopAppBar'
import TopAppBarLargeText from '../components/layout/TopAppBarLargeText'
import BottomNavBar from '../components/layout/BottomNavBar'
import HomePageLarge from './HomePageLarge'

import WidgetAddBanner from '../components/home/WidgetAddBanner'
import BannerCarousel from '../components/home/BannerCarousel'
import BalanceCardExpanded from '../components/home/BalanceCardExpanded'
import CardApplyCTA from '../components/home/CardApplyCTA'
import CashbackEntryCard from '../components/home/CashbackEntryCard'
import SectionHeader from '../components/home/SectionHeader'
import StoreRecommendCard from '../components/home/StoreRecommendCard'

const FEATURED_IDS = [2630781, 646727, 3401394]
const featuredStores = FEATURED_IDS
  .map((id) => STORES.find((s) => s.id === id))
  .filter(Boolean)
  .map((s) => {
    const km = calculateDistance(GANGNEUNG_STATION.lat, GANGNEUNG_STATION.lng, s.lat, s.lng)
    return { ...s, distance: km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km` }
  })

export default function HomePage() {
  const navigate = useNavigate()
  const { isLargeText } = useApp()
  const { hasCard } = useUser()
  const {
    hasSeenCardApplyCoach,
    hasSeenChargeCoach,
    hasSeenRefundCoach,
    markSeen,
    completeAllCoachmarks,
  } = useOnboarding()

  const chargeButtonRef = useRef(null)
  const refundButtonRef = useRef(null)
  const applyButtonRef = useRef(null)

  const [coachStep, setCoachStep] = useState(null) // 'cardApply' | 'charge' | 'refund' | null

  // B4: 코치마크 자동 노출 단계 결정
  useEffect(() => {
    if (!hasCard && !hasSeenCardApplyCoach) {
      setCoachStep('cardApply')
      return
    }
    if (hasCard && !hasSeenChargeCoach) {
      setCoachStep('charge')
      return
    }
    if (hasCard && hasSeenChargeCoach && !hasSeenRefundCoach) {
      setCoachStep('refund')
      return
    }
    setCoachStep(null)
  }, [hasCard, hasSeenCardApplyCoach, hasSeenChargeCoach, hasSeenRefundCoach])

  if (isLargeText) return <HomePageLarge />

  return (
    <ScreenContainer>
      {isLargeText ? <TopAppBarLargeText /> : <TopAppBar />}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          backgroundColor: colors.surface.background,
        }}
      >
        {/* H-01: 위젯 추가 배너 */}
        <WidgetAddBanner />

        {/* 배너 캐러셀 */}
        <BannerCarousel applyButtonRef={applyButtonRef} />

        {/* B4: 카드 보유 여부 분기 */}
        {hasCard ? (
          <>
            <BalanceCardExpanded
              chargeButtonRef={chargeButtonRef}
              refundButtonRef={refundButtonRef}
            />
            {/* B7: 진입 카드 — 클릭 시 바로 /cashback 진입 */}
            <div style={{ marginTop: spacing[2] }}>
              <CashbackEntryCard onClick={() => navigate('/cashback')} />
            </div>
          </>
        ) : (
          // B6: 신규 사용자 CTA 카드
          <CardApplyCTA applyButtonRef={applyButtonRef} />
        )}

        {/* 결제 가능 매장 */}
        <SectionHeader
          title="결제 가능 매장"
          onViewAll={() => navigate('/store')}
        />
        <StoreRecommendCard stores={featuredStores} />

        {/* 이용안내 카드 */}
        <div
          onClick={() => navigate('/usage-guide')}
          style={{
            margin: layout.margin,
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
            fontSize: typography.size.md,
            fontWeight: typography.weight.bold,
            color: colors.gray[900],
            fontFamily: typography.fontFamily,
          }}>
            iM샵 이용안내
          </span>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: layout.radiusSmall,
            backgroundColor: colors.gray[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <HelpCircle size={24} color={colors.gray[700]} />
          </div>
        </div>

        <div style={{ height: layout.bottomNavHeight }} />
      </div>

      <BottomNavBar />

      {/* B4: 코치마크 오버레이 */}
      {coachStep === 'cardApply' && (
        <CoachMarkOverlay
          targetRef={applyButtonRef}
          placement="bottom"
          message="iM샵 카드를 신청해보세요. 신청하기를 누르면 1초 만에 카드를 받을 수 있어요."
          step={1}
          totalSteps={1}
          onNext={() => {
            markSeen('cardApply')
            setCoachStep(null)
          }}
          onSkip={() => {
            markSeen('cardApply')
            setCoachStep(null)
          }}
        />
      )}

      {coachStep === 'charge' && (
        <CoachMarkOverlay
          targetRef={chargeButtonRef}
          message="[충전] 버튼을 눌러 iM샵 잔액을 충전할 수 있습니다."
          step={1}
          totalSteps={2}
          onNext={() => markSeen('charge')}
          onSkip={() => completeAllCoachmarks()}
        />
      )}

      {coachStep === 'refund' && (
        <CoachMarkOverlay
          targetRef={refundButtonRef}
          message="[환불] 버튼으로 충전한 금액을 다시 환불받을 수 있습니다."
          step={2}
          totalSteps={2}
          onNext={() => markSeen('refund')}
          onSkip={() => completeAllCoachmarks()}
        />
      )}
    </ScreenContainer>
  )
}
