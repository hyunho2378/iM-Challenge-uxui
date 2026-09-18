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

  const markSeen = useCallback((key) => {
    if (key === 'cardApply') setHasSeenCardApplyCoach(true)
    else if (key === 'charge') setHasSeenChargeCoach(true)
    else if (key === 'refund') setHasSeenRefundCoach(true)
    else if (key === 'cashbackModal') setHasSeenCashbackModal(true)
  }, [])

  const completeAllCoachmarks = useCallback(() => {
    setHasSeenCardApplyCoach(true)
    setHasSeenChargeCoach(true)
    setHasSeenRefundCoach(true)
  }, [])

  return (
    <OnboardingContext.Provider value={{
      hasSeenCardApplyCoach, hasSeenChargeCoach, hasSeenRefundCoach, hasSeenCashbackModal,
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
