/**
 * OnboardingContext (B2)
 * 코치마크 단계별 상태 + 모달 seen 관리
 * Session-scoped — 새로고침 시 초기화 (localStorage 금지 정책)
 */

import { createContext, useContext, useState, useCallback } from 'react'

const OnboardingContext = createContext(null)

export function OnboardingProvider({ children }) {
  const [hasSeenCardApplyCoach, setHasSeenCardApplyCoach] = useState(false)
  const [hasSeenChargeCoach, setHasSeenChargeCoach] = useState(false)
  const [hasSeenRefundCoach, setHasSeenRefundCoach] = useState(false)
  const [hasSeenCashbackModal, setHasSeenCashbackModal] = useState(false)
  // 06차 2번: 카드신청/충전 플로우 내부, 신규 화면(연결계좌·할인없이충전) 단계별 코치마크
  const [hasSeenCardApplyFlowCoach, setHasSeenCardApplyFlowCoach] = useState(false)
  const [hasSeenChargeFlowCoach, setHasSeenChargeFlowCoach] = useState(false)
  const [hasSeenAccountLinkCoach, setHasSeenAccountLinkCoach] = useState(false)
  const [hasSeenChargeFreeCoach, setHasSeenChargeFreeCoach] = useState(false)
  const [hasSeenRefundPageCoach, setHasSeenRefundPageCoach] = useState(false)
  // 10차 3번: 시니어 접근성이 이 프로젝트 핵심이라 안내가 비어 있던 네 화면에도 코치마크를 달았다.
  // homeIntro: 홈 최초 진입(카드 보유 상태 1회) / qrScan: QR결제 / history: 이용내역 / storeMap: 결제매장
  const [hasSeenHomeIntroCoach, setHasSeenHomeIntroCoach] = useState(false)
  const [hasSeenQRScanCoach, setHasSeenQRScanCoach] = useState(false)
  const [hasSeenHistoryCoach, setHasSeenHistoryCoach] = useState(false)
  const [hasSeenStoreMapCoach, setHasSeenStoreMapCoach] = useState(false)

  const markSeen = useCallback((key) => {
    if (key === 'cardApply') setHasSeenCardApplyCoach(true)
    else if (key === 'charge') setHasSeenChargeCoach(true)
    else if (key === 'refund') setHasSeenRefundCoach(true)
    else if (key === 'cashbackModal') setHasSeenCashbackModal(true)
    else if (key === 'cardApplyFlow') setHasSeenCardApplyFlowCoach(true)
    else if (key === 'chargeFlow') setHasSeenChargeFlowCoach(true)
    else if (key === 'accountLink') setHasSeenAccountLinkCoach(true)
    else if (key === 'chargeFree') setHasSeenChargeFreeCoach(true)
    else if (key === 'refundPage') setHasSeenRefundPageCoach(true)
    else if (key === 'homeIntro') setHasSeenHomeIntroCoach(true)
    else if (key === 'qrScan') setHasSeenQRScanCoach(true)
    else if (key === 'history') setHasSeenHistoryCoach(true)
    else if (key === 'storeMap') setHasSeenStoreMapCoach(true)
  }, [])

  // 홈에서 건너뛰기를 누르면 홈 안의 단계(소개·충전·환불)를 한번에 닫는다.
  const completeAllCoachmarks = useCallback(() => {
    setHasSeenHomeIntroCoach(true)
    setHasSeenCardApplyCoach(true)
    setHasSeenChargeCoach(true)
    setHasSeenRefundCoach(true)
  }, [])

  return (
    <OnboardingContext.Provider value={{
      hasSeenCardApplyCoach, hasSeenChargeCoach, hasSeenRefundCoach, hasSeenCashbackModal,
      hasSeenCardApplyFlowCoach, hasSeenChargeFlowCoach, hasSeenAccountLinkCoach, hasSeenChargeFreeCoach,
      hasSeenRefundPageCoach,
      hasSeenHomeIntroCoach, hasSeenQRScanCoach, hasSeenHistoryCoach, hasSeenStoreMapCoach,
      markSeen, completeAllCoachmarks,
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
