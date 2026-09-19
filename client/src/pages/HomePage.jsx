import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useUser } from '../context/UserContext'
import { useOnboarding } from '../context/OnboardingContext'
import { colors, layout, spacing, shadow, typography } from '../tokens/tokens'
import { STORES, DAEGU_STATION, calculateDistance } from '../data/stores'
import CoachMarkOverlay from '../components/common/CoachMarkOverlay'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBar from '../components/layout/TopAppBar'
import TopAppBarLargeText from '../components/layout/TopAppBarLargeText'
import BottomNavBar from '../components/layout/BottomNavBar'
import HomePageLarge from './HomePageLarge'

import WidgetAddBanner from '../components/home/WidgetAddBanner'
import BalanceCardExpanded from '../components/home/BalanceCardExpanded'
import CardApplyCTA from '../components/home/CardApplyCTA'
import CashbackEntryCard from '../components/home/CashbackEntryCard'
import SectionHeader from '../components/home/SectionHeader'
import StoreRecommendCard from '../components/home/StoreRecommendCard'

// 09차 3번: 이전에는 FEATURED_IDS = [9000001, 9000011, 9000021] 세 개를 박아두어
// 홈의 '결제 가능 매장'이 항상 동성김밥/동성마트24/동성약국만 반복했다.
// 이제 대구역 기준 거리순으로 뽑되, 같은 카테고리가 연속해 차지하지 않게
// 카테고리별로 먼저 한 곳씩 집고 나머지를 거리순으로 채운다(최대 10곳).
const FEATURED_LIMIT = 10
const featuredStores = (() => {
  const withDistance = STORES
    .filter((s) => s.isQR && typeof s.lat === 'number' && typeof s.lng === 'number')
    .map((s) => ({ ...s, km: calculateDistance(DAEGU_STATION.lat, DAEGU_STATION.lng, s.lat, s.lng) }))
    .sort((a, b) => a.km - b.km)

  const picked = []
  const usedCategories = new Set()
  // 1패스: 카테고리당 가장 가까운 매장 한 곳씩
  for (const s of withDistance) {
    if (picked.length >= FEATURED_LIMIT) break
    if (usedCategories.has(s.category)) continue
    usedCategories.add(s.category)
    picked.push(s)
  }
  // 2패스: 자리가 남으면 거리순으로 보충
  for (const s of withDistance) {
    if (picked.length >= FEATURED_LIMIT) break
    if (picked.some((p) => p.id === s.id)) continue
    picked.push(s)
  }

  return picked
    .sort((a, b) => a.km - b.km)
    .map(({ km, ...s }) => ({
      ...s,
      distance: km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`,
    }))
})()

export default function HomePage() {
  const navigate = useNavigate()
  const { isLargeText } = useApp()
  const { hasCard } = useUser()
  const {
    hasSeenCardApplyCoach,
    hasSeenHomeIntroCoach,
    hasSeenChargeCoach,
    hasSeenRefundCoach,
    markSeen,
    completeAllCoachmarks,
  } = useOnboarding()

  const chargeButtonRef = useRef(null)
  const refundButtonRef = useRef(null)
  const applyButtonRef = useRef(null)
  // 10차 3번: 홈 최초 진입 안내가 집는 3버튼 행
  const actionRowRef = useRef(null)

  const [coachStep, setCoachStep] = useState(null) // 'cardApply' | 'homeIntro' | 'charge' | 'refund' | null

  // B4: 코치마크 자동 노출 단계 결정
  // 10차 3번: 카드를 등록하면 먼저 "여기에 뭐가 있는지"를 한 번 알려주고(homeIntro),
  // 그다음에 충전·환불 버튼을 개별로 집는다.
  useEffect(() => {
    if (!hasCard && !hasSeenCardApplyCoach) {
      setCoachStep('cardApply')
      return
    }
    if (hasCard && !hasSeenHomeIntroCoach) {
      setCoachStep('homeIntro')
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
  }, [hasCard, hasSeenCardApplyCoach, hasSeenHomeIntroCoach, hasSeenChargeCoach, hasSeenRefundCoach])

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
        {/* 10차 1번: 전사.md 원본 배치로 되돌린다 — 위젯 추가 → iM뱅크 배너 → 잔액카드 →
            혜택 현황 → 결제 가능 매장. 04차에 '핵심 태스크를 프로모션보다 위로' 올렸던 판단을 철회. */}
        {/* H-01: 위젯 추가 배너 */}
        <WidgetAddBanner />

        {/* 프로모션 배너: iM뱅크 자체 상품, 전사.md S07 배너 원문 그대로.
            이동할 이벤트 상세(S29) 화면이 없어서 눌러도 반응하지 않는 카드로 둔다 */}
        <div style={{
          margin: `0 ${layout.margin} ${spacing[3]}`,
          padding: spacing[5],
          borderRadius: layout.radiusCard,
          backgroundColor: colors.primary[100],
          fontFamily: typography.fontFamily,
        }}>
          <p style={{
            margin: 0,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.semibold,
            color: colors.primary[700],
          }}>
            iM뱅크 | 현대카드M
          </p>
          <p style={{
            margin: `${spacing[2]} 0 0`,
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: colors.primary[800],
            lineHeight: 1.35,
          }}>
            최대 5% M포인트 적립<br />7만원 캐시백
          </p>
        </div>

        {hasCard ? (
          <>
            <BalanceCardExpanded
              chargeButtonRef={chargeButtonRef}
              refundButtonRef={refundButtonRef}
            />
            {/* B7: 진입 카드 — 06차 5번: 죽은 /cashback 대신 새 혜택 현황 페이지로 연결 */}
            <div style={{ marginTop: spacing[2] }}>
              <CashbackEntryCard onClick={() => navigate('/benefits')} />
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
          message="대구로페이 카드를 신청해보세요. 신청하기를 누르면 1초 만에 카드를 받을 수 있어요."
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

      {/* 10차 3번: 홈 최초 진입 — 잔액과 3버튼이 여기 있다는 것부터 알리고 시작한다 */}
      {coachStep === 'homeIntro' && (
        <CoachMarkOverlay
          targetRef={actionRowRef}
          message="카드가 등록됐어요. 위에 잔액이 보이고, 아래 세 버튼로 [충전] [환불] [QR결제]를 모두 할 수 있습니다."
          step={1}
          totalSteps={3}
          onNext={() => markSeen('homeIntro')}
          onSkip={() => completeAllCoachmarks()}
        />
      )}

      {coachStep === 'charge' && (
        <CoachMarkOverlay
          targetRef={chargeButtonRef}
          message="[충전] 버튼을 눌러 iM샵 잔액을 충전할 수 있습니다."
          step={2}
          totalSteps={3}
          onNext={() => markSeen('charge')}
          onSkip={() => completeAllCoachmarks()}
        />
      )}

      {coachStep === 'refund' && (
        <CoachMarkOverlay
          targetRef={refundButtonRef}
          message="[환불] 버튼으로 충전한 금액을 다시 환불받을 수 있습니다."
          step={3}
          totalSteps={3}
          onNext={() => markSeen('refund')}
          onSkip={() => completeAllCoachmarks()}
        />
      )}
    </ScreenContainer>
  )
}
