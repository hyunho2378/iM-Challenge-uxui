import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { colors } from '../tokens/tokens'
import ScreenContainer from '../components/layout/ScreenContainer'
import ChargeScreen from '../components/payment/ChargeScreen'
import RefundGuideModal from '../components/common/RefundGuideModal'
import CoachMarkOverlay from '../components/common/CoachMarkOverlay'

export default function ChargePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { balance, chargeBalance } = useUser()
  const [isRefundOpen, setIsRefundOpen] = useState(false)
  // S7 코치마크 Step 2 — 홈에서 코치마크 "다음" 눌러 진입한 경우만 표시
  const [showCoach, setShowCoach] = useState(location.state?.fromCoach === true)

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <ChargeScreen
        onClose={() => navigate(-1)}
        onRefundGuide={() => setIsRefundOpen(true)}
        onCharge={chargeBalance}
        balance={balance}
      />
      <RefundGuideModal
        isOpen={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
      />
      {showCoach && (
        <CoachMarkOverlay
          targetRect={null}
          message="충전할 금액을 입력하고 [다음]을 눌러 충전을 완료해보세요. 한 번에 최대 50만 원까지 충전 가능합니다."
          step={2}
          totalSteps={2}
          onNext={() => setShowCoach(false)}
          onSkip={() => setShowCoach(false)}
        />
      )}
    </ScreenContainer>
  )
}
