/**
 * ChargeScreen (Phase 2 redesigned)
 * Strategy: S4, S5
 * Nielsen: #1 visibility, #4 closure, #5 error prevention, #8 memory load
 * Shneiderman: #3 informative feedback, #4 design for closure, #8 reduce memory load
 * Phase 1 ref: components/payment/ChargeScreen.jsx
 * Preserved: header style, quick amount chips, numpad, primary button style, background colors
 * Changed: 3-step flow (C-01·C-06), balance display (C-02), step indicator always visible
 */

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useOnboarding } from '../../context/OnboardingContext'
import { MONTHLY_DISCOUNT_LIMIT } from '../../context/UserContext'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import { useTypography } from '../../hooks/useTypography'
import { usePlatform } from '../../hooks/usePlatform'
import QuickAmountChip from './QuickAmountChip'
import NumPad from './NumPad'
import PaymentAuthOverlay from '../common/PaymentAuthOverlay'
import CoachMarkOverlay from '../common/CoachMarkOverlay'
import Button from '../common/Button'

const MAX_AMOUNT = 999999999
const UNIT_AMOUNT = 10000

// 단계 표시기 — Shneiderman #8, Nielsen #1
function StepIndicator({ current }) {
  const sizes = useTypography()
  const steps = ['금액 입력', '충전 확인', '완료']
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: `${spacing[3]} ${layout.margin} ${spacing[2]}`,
        backgroundColor: colors.surface.card,
        borderBottom: `1px solid ${colors.gray[100]}`,
      }}
    >
      {steps.flatMap((label, i) => {
        const num = i + 1
        const isActive = num === current
        const isComplete = num < current
        const circleColor = isComplete
          ? colors.success
          : isActive
          ? colors.primary[700]
          : colors.gray[200]
        const textColor = isActive ? colors.primary[700] : isComplete ? colors.success : colors.gray[400]

        const stepEl = (
          <div
            key={`step-${num}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[1] }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: circleColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              {isComplete ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7L5.5 10L11.5 4"
                    stroke={colors.onDark.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span
                  style={{
                    fontSize: sizes.nav,
                    fontWeight: 600,
                    color: isActive ? colors.onDark.primary : colors.gray[400],
                    fontFamily: typography.fontFamily,
                  }}
                >
                  {num}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: sizes.xxs,
                color: textColor,
                fontWeight: isActive ? typography.weight.semibold : typography.weight.regular,
                fontFamily: typography.fontFamily,
                whiteSpace: 'nowrap',
                transition: 'color 120ms cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              {label}
            </span>
          </div>
        )

        if (i < steps.length - 1) {
          const connector = (
            <div
              key={`conn-${i}`}
              style={{
                width: '40px',
                height: '2px',
                backgroundColor: num < current ? colors.success : colors.gray[200],
                marginTop: '13px',
                flexShrink: 0,
                transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)',
              }}
            />
          )
          return [stepEl, connector]
        }
        return [stepEl]
      })}
    </div>
  )
}

// AI 개입지점 2 — 감지형. "할인판매 기간이 아닙니다" 에러(S16 실캡처 카피)가 뜨는
// 바로 그 순간에 할인없이충전으로의 대안 경로를 짚어준다. IA 분석 2번(PAY-02/03 갈림길)의 해법.
// 08차: 라이브 API 호출 없이 순수 프론트엔드 계산으로 문구를 만든다(네트워크/키 불필요, 즉시 렌더링).
// 시도금액·이미 사용한 할인충전액·남은 한도 세 값을 실제로 계산해 문장에 그대로 꽂는다.
function DiscountErrorModal({ amount, monthlyDiscountCharged, onStay, onGoChargeFree }) {
  const sizes = useTypography()
  const remaining = Math.max(0, MONTHLY_DISCOUNT_LIMIT - monthlyDiscountCharged)
  const overAmount = amount - remaining
  return (
    // 07차: 충전 코치마크(9999)가 뜬 채로 이 에러가 뜨면 코치마크가 이 모달을 가려
    // "할인 없이 충전하기" 버튼을 못 누르는 문제가 있었다. 실제 액션 모달을 항상 위에 둔다.
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onStay} style={{ position: 'absolute', inset: 0, backgroundColor: colors.surface.overlay }} />
      <div style={{
        position: 'relative', width: 'calc(100% - 64px)', maxWidth: '320px',
        backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[5], boxShadow: shadow.modal,
      }}>
        <p style={{ margin: `0 0 ${spacing[2]}`, fontSize: sizes.sm, fontWeight: typography.weight.bold, color: colors.error, textAlign: 'center' }}>
          할인판매 기간이 아닙니다
        </p>
        <p style={{ margin: `0 0 ${spacing[3]}`, fontSize: sizes.sm, color: colors.gray[700], lineHeight: typography.lineHeight.body, textAlign: 'center' }}>
          {amount.toLocaleString('ko-KR')}원을 넣으셨는데 이번 달 할인한도가 {remaining.toLocaleString('ko-KR')}원 남아서, 나머지 {overAmount.toLocaleString('ko-KR')}원은 할인 없이 충전돼요.
        </p>
        <p style={{ margin: `0 0 ${spacing[5]}`, fontSize: sizes.xs, color: colors.gray[500], textAlign: 'center' }}>
          이번 달 할인충전 사용액 {monthlyDiscountCharged.toLocaleString('ko-KR')}원 / {MONTHLY_DISCOUNT_LIMIT.toLocaleString('ko-KR')}원
        </p>
        <div style={{ display: 'flex', gap: spacing[2] }}>
          <Button variant="outlined" fullWidth={false} style={{ flex: 1 }} onClick={onStay}>아니요</Button>
          <Button variant="filled" fullWidth={false} style={{ flex: 1 }} onClick={onGoChargeFree}>할인 없이 충전하기</Button>
        </div>
      </div>
    </div>
  )
}

export default function ChargeScreen({ onClose, onRefundGuide, onCharge, balance = 120000, chargeLimit = 500000, monthlyDiscountCharged = 0 }) {
  const sizes = useTypography()
  const navigate = useNavigate()
  const { showSnackbar } = useApp()
  const { hasSeenChargeFlowCoach, markSeen } = useOnboarding()
  const isAndroid = usePlatform() === 'android'
  const [amount, setAmount] = useState(0)
  const [step, setStep] = useState(1)
  const [charged, setCharged] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showDiscountError, setShowDiscountError] = useState(false)
  // 06차 2번: 처음 보는 사용자에게 단계별로 뭘 눌러야 할지 짚어준다
  const nextButtonRef = useRef(null)
  const chargeButtonRef = useRef(null)
  // 1단계 코치마크는 이번 방문에서 한 번 닫으면 다시 안 뜬다. 전체를 봤다는 표시(hasSeenChargeFlowCoach)는
  // 2단계까지 봐야 남긴다 — 그래야 실제로 2단계에 도달했을 때 2단계 코치마크가 뜬다.
  const [step1CoachDismissed, setStep1CoachDismissed] = useState(false)

  const handleNumPress = (key) => {
    if (key === 'backspace') {
      setAmount((prev) => {
        const str = String(prev)
        if (str.length <= 1) return 0
        return parseInt(str.slice(0, -1), 10)
      })
      return
    }
    setAmount((prev) => {
      const str = prev === 0 ? '' : String(prev)
      const next = str + key
      const parsed = parseInt(next, 10)
      if (isNaN(parsed)) return prev
      if (parsed > MAX_AMOUNT) return prev
      return parsed
    })
  }

  const handleQuickAdd = (value) => {
    setAmount((prev) => Math.min(prev + value, MAX_AMOUNT))
  }

  const formattedAmount = amount.toLocaleString('ko-KR')
  const hasAmount = amount > 0
  const isOverLimit = amount > chargeLimit
  const isNotUnit10000 = hasAmount && amount % UNIT_AMOUNT !== 0
  const canProceed = hasAmount && !isOverLimit && !isNotUnit10000
  const newBalance = balance + amount

  // 헤더 뒤로가기 동작: step별 분기
  const handleBack = () => {
    if (step === 1) onClose()
    else if (step === 2) {
      setStep(1)
      setCharged(false)
    }
  }

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        backgroundColor: colors.surface.background,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: typography.fontFamily,
      }}
    >
      {/* ── 헤더 ── */}
      <div
        style={{
          backgroundColor: colors.surface.card,
          display: 'flex',
          alignItems: 'center',
          padding: `${spacing[3]} ${layout.margin}`,
          gap: spacing[3],
          borderBottom: `1px solid ${colors.gray[100]}`,
          flexShrink: 0,
        }}
      >
        {step < 3 && (
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: spacing[1],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={24} color={colors.gray[900]} />
          </button>
        )}
        <span
          style={{
            fontSize: sizes.md,
            fontWeight: typography.weight.semibold,
            color: colors.gray[900],
          }}
        >
          {step === 1 ? '충전' : step === 2 ? '충전 확인' : '충전 완료'}
        </span>
      </div>

      {/* ── 단계 표시기 — Nielsen #1, Shneiderman #8 ── */}
      <StepIndicator current={step} />

      {/* ══ STEP 1: 금액 입력 ══ */}
      {step === 1 && (
        <>
          {/* 현재 잔액 + 금액 표시 — S5, Nielsen #1, Shneiderman #3 */}
          <div
            style={{
              backgroundColor: colors.surface.card,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: `${spacing[3]} ${layout.margin} ${spacing[3]}`,
              gap: spacing[2],
            }}
          >
            <span
              style={{
                fontSize: sizes.xs,
                color: colors.gray[500],
              }}
            >
              현재 잔액{' '}
              <span style={{ color: colors.primary[700], fontWeight: typography.weight.semibold }}>
                {balance.toLocaleString('ko-KR')}원
              </span>
            </span>

            <span
              style={{
                fontSize: sizes.balanceLarge,
                fontWeight: typography.weight.bold,
                color: hasAmount ? colors.gray[900] : colors.gray[400],
                letterSpacing: '-0.5px',
                transition: 'color 120ms cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              {hasAmount ? `${formattedAmount}원` : '0원'}
            </span>

            <button
              onClick={onRefundGuide}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: sizes.xs,
                fontWeight: typography.weight.medium,
                color: colors.primary[600],
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              환불 안내 보기
            </button>
          </div>

          {/* 빠른 금액 버튼 */}
          <div
            style={{
              backgroundColor: colors.surface.card,
              display: 'flex',
              flexDirection: 'row',
              gap: spacing[2],
              padding: `${isAndroid ? spacing[4] : spacing[3]} ${layout.margin} ${spacing[4]}`,
              borderBottom: `1px solid ${colors.gray[100]}`,
            }}
          >
            <QuickAmountChip label="+1만원" onClick={() => handleQuickAdd(10000)} />
            <QuickAmountChip label="+5만원" onClick={() => handleQuickAdd(50000)} />
            <QuickAmountChip label="+10만원" onClick={() => handleQuickAdd(100000)} />
          </div>

          {/* 숫자패드 */}
          <div
            style={{
              flex: 1,
              backgroundColor: colors.surface.background,
              paddingTop: spacing[3],
            }}
          >
            <NumPad onPress={handleNumPress} />
          </div>

          {/* 충전 버튼 */}
          <div
            style={{
              padding: `${spacing[3]} ${layout.margin}`,
              paddingBottom: `calc(env(safe-area-inset-bottom) + ${spacing[3]})`,
              backgroundColor: colors.surface.card,
              borderTop: `1px solid ${colors.gray[100]}`,
            }}
          >
            {/* Button은 forwardRef가 아니라 div로 감싸 코치마크 대상 좌표를 잡는다 */}
            <div ref={nextButtonRef}>
              <Button
                variant="filled"
                size="lg"
                disabled={!canProceed}
                onClick={() => setStep(2)}
              >
                다음
              </Button>
            </div>
            {/* C-04: Disabled 버튼 사유 명시 (Nielsen #5, #9 — 한국어 평문) */}
            {isOverLimit && (
              <p style={{ margin: `${spacing[2]} 0 0`, textAlign: 'center', fontSize: sizes.xs, color: colors.error }}>
                1회 충전 한도 {chargeLimit.toLocaleString('ko-KR')}원을 초과했습니다
              </p>
            )}
            {isNotUnit10000 && !isOverLimit && (
              <p style={{
                margin: `${spacing[2]} 0 0`,
                textAlign: 'center',
                fontSize: sizes.xs,
                color: colors.error,
              }}>
                1만 원 단위로만 충전할 수 있습니다
              </p>
            )}
            {!hasAmount && !isOverLimit && (
              <p style={{ margin: `${spacing[2]} 0 0`, textAlign: 'center', fontSize: sizes.xs, color: colors.gray[400] }}>
                충전 금액을 입력하세요
              </p>
            )}
          </div>
        </>
      )}

      {/* ══ STEP 2: 충전 확인 ══ */}
      {step === 2 && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: `${spacing[5]} ${layout.margin}`,
            gap: spacing[4],
          }}
        >
          {/* 요약 카드 — Shneiderman #4 closure, #8 memory load */}
          <div
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
              padding: spacing[5],
              boxShadow: shadow.card,
            }}
          >
            {[
              { label: '충전 금액', value: `${amount.toLocaleString('ko-KR')}원`, bold: true, color: colors.gray[900] },
              { label: '현재 잔액', value: `${balance.toLocaleString('ko-KR')}원`, bold: false, color: colors.gray[600] },
              {
                label: '충전 후 잔액',
                value: `${newBalance.toLocaleString('ko-KR')}원`,
                bold: true,
                color: colors.primary[700],
              },
            ].map(({ label, value, bold, color }, i, arr) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: i === 0 ? 0 : spacing[4],
                  paddingBottom: i === arr.length - 1 ? 0 : spacing[4],
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${colors.gray[100]}` : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: sizes.sm,
                    color: colors.gray[500],
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: sizes.md,
                    fontWeight: bold ? typography.weight.bold : typography.weight.regular,
                    color,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* 하단 버튼 2개 */}
          <div style={{ display: 'flex', gap: spacing[3] }}>
            <Button
              variant="outlined"
              size="lg"
              fullWidth={false}
              style={{
                flex: 1,
                backgroundColor: colors.surface.card,
                border: `1px solid ${colors.gray[200]}`,
                color: colors.gray[700],
                fontWeight: typography.weight.medium,
              }}
              onClick={() => {
                setStep(1)
                setCharged(false)
              }}
            >
              수정
            </Button>
            {/* Button은 forwardRef가 아니라 div로 감싸 코치마크 대상 좌표를 잡는다 */}
            <div ref={chargeButtonRef} style={{ flex: 2 }}>
            <Button
              variant="filled"
              size="lg"
              fullWidth={false}
              style={{ width: '100%' }}
              disabled={charged}
              onClick={() => {
                if (charged) return
                // AI 개입지점 2: 이번 달 누적 할인충전액이 월한도(30만원)를 넘기면
                // "할인판매 기간이 아닙니다"가 뜬다. 한도 이내면 바로 정상 충전된다.
                if (monthlyDiscountCharged + amount > MONTHLY_DISCOUNT_LIMIT) {
                  setShowDiscountError(true)
                } else {
                  setShowAuth(true)
                }
              }}
            >
              충전하기
            </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 3: 충전 완료 ══ */}
      {step === 3 && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${spacing[8]} ${layout.margin}`,
            gap: spacing[5],
          }}
        >
          {/* 성공 아이콘 — Shneiderman #3 informative feedback */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: colors.successBg,
              border: `2px solid ${colors.successBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M7 18L14 25L29 10"
                stroke={colors.success}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            <p
              style={{
                margin: 0,
                fontSize: sizes.xl,
                fontWeight: typography.weight.bold,
                color: colors.gray[900],
              }}
            >
              충전 완료
            </p>
            <p
              style={{
                margin: 0,
                fontSize: sizes.md,
                color: colors.gray[500],
              }}
            >
              {amount.toLocaleString('ko-KR')}원을 충전했습니다
            </p>
          </div>

          {/* 잔액 요약 */}
          <div
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
              padding: spacing[4],
              boxShadow: shadow.card,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: sizes.sm, color: colors.gray[500] }}>현재 잔액</span>
            <span
              style={{
                fontSize: sizes.lg,
                fontWeight: typography.weight.bold,
                color: colors.primary[700],
              }}
            >
              {balance.toLocaleString('ko-KR')}원
            </span>
          </div>

          {/* 홈으로 버튼 — Shneiderman #4 closure */}
          <Button
            variant="filled"
            size="lg"
            onClick={() => { showSnackbar('충전이 완료됐어요'); onClose() }}
          >
            홈으로 가기
          </Button>
        </div>
      )}

      <PaymentAuthOverlay
        open={showAuth}
        onComplete={() => {
          setShowAuth(false)
          setCharged(true)
          onCharge && onCharge(amount)
          setStep(3)
        }}
        onCancel={() => setShowAuth(false)}
      />

      {showDiscountError && (
        <DiscountErrorModal
          amount={amount}
          monthlyDiscountCharged={monthlyDiscountCharged}
          onStay={() => setShowDiscountError(false)}
          onGoChargeFree={() => navigate('/charge-free', { state: { fromAssist: true, amount } })}
        />
      )}

      {/* 06차 2번: 충전 플로우 단계별 코치마크. 1단계(금액 입력→다음), 2단계(확인→충전하기) */}
      {!hasSeenChargeFlowCoach && !step1CoachDismissed && step === 1 && (
        <CoachMarkOverlay
          targetRef={nextButtonRef}
          message="금액을 정하고 다음을 눌러주세요. 빠른 금액 버튼을 눌러도 좋아요."
          step={1}
          totalSteps={2}
          onNext={() => setStep1CoachDismissed(true)}
          onSkip={() => markSeen('chargeFlow')}
        />
      )}
      {!hasSeenChargeFlowCoach && step === 2 && (
        <CoachMarkOverlay
          targetRef={chargeButtonRef}
          message="내용을 확인하고 충전하기를 누르면 충전이 완료돼요."
          step={2}
          totalSteps={2}
          onNext={() => markSeen('chargeFlow')}
          onSkip={() => markSeen('chargeFlow')}
        />
      )}
    </div>
  )
}
