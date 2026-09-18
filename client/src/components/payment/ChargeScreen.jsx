/**
 * ChargeScreen (Phase 2 redesigned)
 * Strategy: S4, S5
 * Nielsen: #1 visibility, #4 closure, #5 error prevention, #8 memory load
 * Shneiderman: #3 informative feedback, #4 design for closure, #8 reduce memory load
 * Phase 1 ref: components/payment/ChargeScreen.jsx
 * Preserved: header style, quick amount chips, numpad, primary button style, background colors
 * Changed: 3-step flow (C-01·C-06), balance display (C-02), step indicator always visible
 */

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import { useTypography } from '../../hooks/useTypography'
import { usePlatform } from '../../hooks/usePlatform'
import QuickAmountChip from './QuickAmountChip'
import NumPad from './NumPad'
import PaymentAuthOverlay from '../common/PaymentAuthOverlay'
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

export default function ChargeScreen({ onClose, onRefundGuide, onCharge, balance = 120000, chargeLimit = 500000 }) {
  const sizes = useTypography()
  const { showSnackbar } = useApp()
  const isAndroid = usePlatform() === 'android'
  const [amount, setAmount] = useState(0)
  const [step, setStep] = useState(1)
  const [charged, setCharged] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

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
            <Button
              variant="filled"
              size="lg"
              disabled={!canProceed}
              onClick={() => setStep(2)}
            >
              다음
            </Button>
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
            <Button
              variant="filled"
              size="lg"
              fullWidth={false}
              style={{ flex: 2 }}
              disabled={charged}
              onClick={() => {
                if (charged) return
                setShowAuth(true)
              }}
            >
              충전하기
            </Button>
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
    </div>
  )
}
