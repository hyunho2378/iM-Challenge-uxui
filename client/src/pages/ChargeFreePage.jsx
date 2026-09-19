// ChargeFreePage.jsx: 할인없이 충전(무혜택)
// 05차 지시서 3번, 신규 화면. 출처: 전사.md S28(PAY-03).
// 정상 충전(ChargeScreen)과 별개 화면이다(원본 iM샵도 별도 메뉴 항목). 진입 시 재확인 모달을 띄운다.
// AI 개입지점 2(충전 에러 → 이 화면 유도)의 도착지가 여기다.
import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { colors, layout, typography, spacing, shadow } from '../tokens/tokens'
import { useUser } from '../context/UserContext'
import { useApp } from '../context/AppContext'
import { useOnboarding } from '../context/OnboardingContext'
import { useTypography } from '../hooks/useTypography'

import ScreenContainer from '../components/layout/ScreenContainer'
import QuickAmountChip from '../components/payment/QuickAmountChip'
import NumPad from '../components/payment/NumPad'
import PaymentAuthOverlay from '../components/common/PaymentAuthOverlay'
import CoachMarkOverlay from '../components/common/CoachMarkOverlay'
import Button from '../components/common/Button'

const MAX_AMOUNT = 2000000 // S28 이용안내: 상품당 최대 충전 한도 200만원
const UNIT_AMOUNT = 10000

const USAGE_NOTES = [
  '최소 충전 금액은 1만원이며, 만원 단위로 입력할 수 있습니다.',
  '상품당 최대 충전 한도는 200만원이며, 할인 충전 한도와 합산하여 운영됩니다.',
  "충전 취소는 '지역사랑상품권 > 이용내역 > 충전 거래'의 상세 화면에서 충전 당일에만 할 수 있습니다.",
]

// 진입 재확인 모달. S28 카피원문
function EntryConfirmModal({ onCancel, onContinue }) {
  const sizes = useTypography()
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onCancel} style={{ position: 'absolute', inset: 0, backgroundColor: colors.surface.overlay }} />
      <div style={{
        position: 'relative',
        width: 'calc(100% - 64px)',
        maxWidth: '320px',
        backgroundColor: colors.surface.card,
        borderRadius: layout.radiusCard,
        padding: spacing[5],
        boxShadow: shadow.modal,
      }}>
        <p style={{ margin: `0 0 ${spacing[5]}`, fontSize: sizes.sm, color: colors.gray[900], lineHeight: typography.lineHeight.body, textAlign: 'center' }}>
          해당 메뉴는 할인 없는 충전입니다. 그래도 계속 충전 하시겠습니까?
        </p>
        <div style={{ display: 'flex', gap: spacing[2] }}>
          <Button variant="outlined" fullWidth={false} style={{ flex: 1 }} onClick={onCancel}>아니오</Button>
          <Button variant="filled" fullWidth={false} style={{ flex: 1 }} onClick={onContinue}>계속하기</Button>
        </div>
      </div>
    </div>
  )
}

export default function ChargeFreePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const sizes = useTypography()
  const { balance, chargeBalance, linkedBank } = useUser()
  const { showSnackbar } = useApp()
  const { hasSeenChargeFreeCoach, markSeen } = useOnboarding()
  const chargeButtonRef = useRef(null)

  // AI 개입지점 2에서 넘어온 경우 재확인 모달을 생략한다. 이미 "충전할까요?" 유도를 거쳤다
  const skipConfirm = location.state?.fromAssist === true
  // AI 개입지점 2에서 넘어올 때 입력해둔 금액을 그대로 이어받는다. 다시 입력하게 하지 않는다
  const carriedAmount = typeof location.state?.amount === 'number' ? location.state.amount : 0
  const [confirmed, setConfirmed] = useState(skipConfirm)
  const [amount, setAmount] = useState(carriedAmount)
  const [showUsage, setShowUsage] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [done, setDone] = useState(false)

  const handleNumPress = (key) => {
    if (key === 'backspace') {
      setAmount((prev) => {
        const str = String(prev)
        return str.length <= 1 ? 0 : parseInt(str.slice(0, -1), 10)
      })
      return
    }
    setAmount((prev) => {
      const str = prev === 0 ? '' : String(prev)
      const parsed = parseInt(str + key, 10)
      if (isNaN(parsed) || parsed > MAX_AMOUNT) return prev
      return parsed
    })
  }

  const hasAmount = amount > 0
  const isNotUnit = hasAmount && amount % UNIT_AMOUNT !== 0
  const isOverLimit = amount > MAX_AMOUNT
  const canCharge = hasAmount && !isNotUnit && !isOverLimit

  if (!confirmed) {
    return (
      <ScreenContainer statusBarBg={colors.surface.card}>
        <EntryConfirmModal onCancel={() => navigate(-1)} onContinue={() => setConfirmed(true)} />
      </ScreenContainer>
    )
  }

  if (done) {
    return (
      <ScreenContainer statusBarBg={colors.surface.card}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: spacing[5], padding: spacing[8] }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            backgroundColor: colors.successBg, border: `2px solid ${colors.successBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M7 18L14 25L29 10" stroke={colors.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: sizes.xl, fontWeight: typography.weight.bold, color: colors.gray[900] }}>충전 완료</p>
            <p style={{ margin: `${spacing[2]} 0 0`, fontSize: sizes.md, color: colors.gray[500] }}>
              {amount.toLocaleString('ko-KR')}원을 할인 없이 충전했습니다
            </p>
          </div>
          <Button variant="filled" onClick={() => { showSnackbar('충전이 완료됐어요'); navigate('/') }}>홈으로 가기</Button>
        </div>
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface.background }}>
        {/* 헤더 */}
        <div style={{
          backgroundColor: colors.surface.card, display: 'flex', alignItems: 'center',
          padding: `${spacing[3]} ${layout.margin}`, gap: spacing[3], borderBottom: `1px solid ${colors.gray[100]}`, flexShrink: 0,
        }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing[1], display: 'flex' }}>
            <ArrowLeft size={24} color={colors.gray[900]} />
          </button>
          <span style={{ fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
            할인없이 충전(무혜택)
          </span>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {/* 금액 표시 */}
          <div style={{ backgroundColor: colors.surface.card, padding: `${spacing[4]} ${layout.margin}`, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: sizes.xs, color: colors.gray[500] }}>최소 충전 금액 10,000원</p>
            <p style={{
              margin: `${spacing[2]} 0 0`, fontSize: sizes.balanceLarge, fontWeight: typography.weight.bold,
              color: hasAmount ? colors.gray[900] : colors.gray[400],
            }}>
              {hasAmount ? `${amount.toLocaleString('ko-KR')}원` : '0원'}
            </p>
          </div>

          {/* 빠른 금액. S28 카피원문 그대로(+1만/+3만/+5만/+10만) */}
          <div style={{
            backgroundColor: colors.surface.card, display: 'flex', gap: spacing[2],
            padding: `0 ${layout.margin} ${spacing[4]}`, borderBottom: `1px solid ${colors.gray[100]}`,
          }}>
            <QuickAmountChip label="+1만원" onClick={() => setAmount((v) => Math.min(v + 10000, MAX_AMOUNT))} />
            <QuickAmountChip label="+3만원" onClick={() => setAmount((v) => Math.min(v + 30000, MAX_AMOUNT))} />
            <QuickAmountChip label="+5만원" onClick={() => setAmount((v) => Math.min(v + 50000, MAX_AMOUNT))} />
            <QuickAmountChip label="+10만원" onClick={() => setAmount((v) => Math.min(v + 100000, MAX_AMOUNT))} />
          </div>

          {/* 비할인충전가능전액 */}
          <div style={{ padding: `${spacing[3]} ${layout.margin}`, backgroundColor: colors.surface.card, borderBottom: `1px solid ${colors.gray[100]}` }}>
            <button
              onClick={() => setAmount(MAX_AMOUNT)}
              style={{
                width: '100%', minHeight: layout.touchMin, background: 'none', border: `1px solid ${colors.gray[200]}`,
                borderRadius: layout.radiusButton, color: colors.gray[700], fontSize: sizes.sm, cursor: 'pointer',
              }}
            >
              비할인 충전 가능 전액 ({MAX_AMOUNT.toLocaleString('ko-KR')}원)
            </button>
          </div>

          {/* 연결계좌 */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: `${spacing[4]} ${layout.margin}`, backgroundColor: colors.surface.card, borderBottom: `1px solid ${colors.gray[100]}`,
          }}>
            <span style={{ fontSize: sizes.sm, color: colors.gray[500] }}>연결계좌</span>
            {linkedBank ? (
              <span style={{ fontSize: sizes.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>{linkedBank}</span>
            ) : (
              <button
                onClick={() => navigate('/account-link')}
                style={{
                  padding: `${spacing[1]} ${spacing[3]}`, borderRadius: layout.radiusPill, border: `1px solid ${colors.primary[700]}`,
                  background: 'none', color: colors.primary[700], fontSize: sizes.xs, fontWeight: typography.weight.semibold, cursor: 'pointer',
                  minHeight: layout.touchMin,
                }}
              >
                계좌 등록
              </button>
            )}
          </div>

          {/* 충전카드 */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: `${spacing[4]} ${layout.margin}`, backgroundColor: colors.surface.card, borderBottom: `1px solid ${colors.gray[100]}`,
          }}>
            <span style={{ fontSize: sizes.sm, color: colors.gray[500] }}>충전카드</span>
            <span style={{ fontSize: sizes.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>대구로페이(5960)</span>
          </div>

          {/* 충전상세. S28 카피원문(할인 없음이라 세 값이 동일) */}
          {hasAmount && (
            <div style={{ padding: `${spacing[4]} ${layout.margin}`, backgroundColor: colors.surface.card, borderBottom: `1px solid ${colors.gray[100]}` }}>
              {[
                ['비할인 충전금액', amount],
                ['실제 출금 금액', amount],
                ['총 충전금액', amount],
              ].map(([label, value], i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: `${spacing[1]} 0` }}>
                  <span style={{ fontSize: sizes.xs, color: colors.gray[500] }}>{label}</span>
                  <span style={{ fontSize: sizes.xs, fontWeight: i === 2 ? typography.weight.bold : typography.weight.regular, color: i === 2 ? colors.primary[700] : colors.gray[700] }}>
                    {value.toLocaleString('ko-KR')}원
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 이용안내 */}
          <div style={{ padding: `${spacing[3]} ${layout.margin}` }}>
            <button
              onClick={() => setShowUsage((v) => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: spacing[1], background: 'none', border: 'none', cursor: 'pointer', padding: 0, minHeight: layout.touchMin }}
            >
              <span style={{ fontSize: sizes.xs, color: colors.gray[500] }}>이용안내</span>
              {showUsage ? <ChevronUp size={16} color={colors.gray[400]} /> : <ChevronDown size={16} color={colors.gray[400]} />}
            </button>
            {showUsage && (
              <ul style={{ margin: `${spacing[2]} 0 0`, paddingLeft: spacing[4], display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
                {USAGE_NOTES.map((note) => (
                  <li key={note} style={{ fontSize: sizes.xs, color: colors.gray[500], lineHeight: typography.lineHeight.body }}>{note}</li>
                ))}
              </ul>
            )}
          </div>

          <NumPad onPress={handleNumPress} />
        </div>

        {/* 하단 고정 충전 버튼 */}
        <div style={{ padding: `${spacing[3]} ${layout.margin}`, paddingBottom: `calc(env(safe-area-inset-bottom) + ${spacing[3]})`, backgroundColor: colors.surface.card, borderTop: `1px solid ${colors.gray[100]}`, flexShrink: 0 }}>
          {/* Button은 forwardRef가 아니라 div로 감싸 코치마크 대상 좌표를 잡는다 */}
          <div ref={chargeButtonRef}>
            <Button variant="filled" size="lg" disabled={!canCharge} onClick={() => setShowAuth(true)}>충전</Button>
          </div>
        </div>
      </div>

      <PaymentAuthOverlay
        open={showAuth}
        onComplete={() => {
          setShowAuth(false)
          // 06차 1번: 할인없이충전은 월 할인한도(30만원)를 소비하지 않는다
          chargeBalance(amount, { discounted: false })
          setDone(true)
        }}
        onCancel={() => setShowAuth(false)}
      />

      {/* 06차 2번: 신규 화면 첫 방문 안내 */}
      {!hasSeenChargeFreeCoach && (
        <CoachMarkOverlay
          targetRef={chargeButtonRef}
          message="금액을 정하고 충전을 누르면 할인 없이 바로 충전돼요."
          step={1}
          totalSteps={1}
          onNext={() => markSeen('chargeFree')}
          onSkip={() => markSeen('chargeFree')}
        />
      )}
    </ScreenContainer>
  )
}
