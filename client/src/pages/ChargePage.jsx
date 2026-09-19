import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { colors } from '../tokens/tokens'
import ScreenContainer from '../components/layout/ScreenContainer'
import ChargeScreen from '../components/payment/ChargeScreen'
import RefundGuideModal from '../components/common/RefundGuideModal'

export default function ChargePage() {
  const navigate = useNavigate()
  const { balance, chargeBalance, monthlyDiscountCharged } = useUser()
  const [isRefundOpen, setIsRefundOpen] = useState(false)

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <ChargeScreen
        onClose={() => navigate(-1)}
        onRefundGuide={() => setIsRefundOpen(true)}
        onCharge={chargeBalance}
        balance={balance}
        monthlyDiscountCharged={monthlyDiscountCharged}
      />
      <RefundGuideModal
        isOpen={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
      />
    </ScreenContainer>
  )
}
