/**
 * RefundPage — 잔액환불 (06차 4번, 재작성)
 * 이전 버전은 이전 프로젝트 고유 규칙(충전 건별 60%/80% 사용 후 환불)을 그대로 쓰고 있었다.
 * iM샵 실제 규칙(전사.md FAQ Q19)은 특정 충전 건이 아니라 "현재 잔액"의 40% 이하만 환불
 * 대상이라, 구조 자체를 잔액 기준 환불 신청 폼으로 다시 짰다.
 * 인용 문구는 FAQ Q19 원문 그대로다(data/faqData.js FAQ_ITEMS.대구로페이[18]).
 */

import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useApp } from '../context/AppContext'
import { useOnboarding } from '../context/OnboardingContext'
import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { useTypography } from '../hooks/useTypography'
import ScreenContainer from '../components/layout/ScreenContainer'
import BottomNavBar from '../components/layout/BottomNavBar'
import NumPad from '../components/payment/NumPad'
import PaymentAuthOverlay from '../components/common/PaymentAuthOverlay'
import CoachMarkOverlay from '../components/common/CoachMarkOverlay'
import Button from '../components/common/Button'

// FAQ Q19 원문 그대로. 지자체 정책자금 제외는 이 앱 데이터 모델에 별도 항목이 없어
// 실제로 걸러내지는 못한다 — 안내 문구로만 노출한다(자체점검 보고에 명시).
const REFUND_RULE_NOTES = [
  '상품권 잔액 환불 시, 혜택금은 환수 처리됩니다.',
  '상품권 잔액은 수수료 없이 연결된 계좌로 환불됩니다.',
  '지자체 정책자금은 환불할 수 없습니다.',
]

export default function RefundPage() {
  const navigate = useNavigate()
  const sizes = useTypography()
  const { balance, refundBalance } = useUser()
  const { isLargeText, showSnackbar } = useApp()
  const { hasSeenRefundPageCoach, markSeen } = useOnboarding()
  const refundAreaRef = useRef(null)
  const [amount, setAmount] = useState(0)
  const [confirming, setConfirming] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const bodyBg = isLargeText ? colors.surface.background : colors.surface.card
  const fmt = (n) => n.toLocaleString('ko-KR') + '원'

  // iM샵 실제 규칙: 마지막 충전 후 잔액의 40% 이하만 환불 대상
  const maxRefundable = Math.floor(balance * 0.4)
  const hasAmount = amount > 0
  const isOverLimit = amount > maxRefundable
  const canRequest = hasAmount && !isOverLimit

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
      if (isNaN(parsed) || parsed > maxRefundable) return prev
      return parsed
    })
  }

  const handleConfirmed = () => {
    refundBalance(amount)
    showSnackbar(`${fmt(amount)} 환불이 완료됐어요`)
    setConfirming(false)
    setAmount(0)
  }

  return (
    <ScreenContainer statusBarBg={bodyBg}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: `${spacing[3]} ${layout.margin}`,
        backgroundColor: colors.surface.card,
        borderBottom: `1px solid ${colors.gray[200]}`,
        minHeight: layout.topBarHeight,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="뒤로가기"
        >
          <ArrowLeft size={24} color={colors.gray[900]} />
        </button>
        <h1 style={{ margin: 0, fontSize: sizes.lg, fontWeight: typography.weight.bold, color: colors.gray[900] }}>
          환불
        </h1>
      </div>

      <div style={{ padding: layout.margin, flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: bodyBg }}>
        {/* 현재 잔액 */}
        <div style={{
          backgroundColor: colors.surface.darkCard,
          borderRadius: layout.radiusCard,
          padding: spacing[5],
          marginBottom: spacing[4],
          boxShadow: shadow.button,
        }}>
          <p style={{ margin: 0, color: colors.onDark.secondary, fontSize: sizes.xs }}>
            현재 잔액
          </p>
          <p style={{ margin: `${spacing[1]} 0 0 0`, color: colors.onDark.primary, fontSize: sizes.largeTitle, fontWeight: typography.weight.bold }}>
            {fmt(balance)}
          </p>
        </div>

        {/* 실제 FAQ 인용 — 전사.md FAQ Q19 원문 */}
        <div style={{
          marginBottom: spacing[4],
          padding: spacing[4],
          backgroundColor: colors.primary[50],
          borderRadius: layout.radiusCard,
          fontSize: sizes.xs,
          color: colors.gray[700],
          lineHeight: typography.lineHeight.body,
        }}>
          <p style={{ fontWeight: typography.weight.semibold, margin: `0 0 ${spacing[2]} 0`, color: colors.primary[700] }}>
            환불 가능 조건 (고객센터 안내 원문)
          </p>
          <p style={{ margin: `0 0 ${spacing[3]} 0` }}>
            마지막 충전 후 잔액을 기준으로, 잔액의 40% 이하 금액을 iM샵 앱 또는 영업점에서 환불 받을 수 있습니다.
          </p>
          {REFUND_RULE_NOTES.map((note) => (
            <p key={note} style={{ margin: `0 0 ${spacing[1]} 0` }}>※ {note}</p>
          ))}
        </div>

        {balance === 0 ? (
          <div style={{ backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[8], textAlign: 'center' }}>
            <p style={{ color: colors.gray[700], fontWeight: typography.weight.semibold, margin: `0 0 ${spacing[2]} 0` }}>
              환불할 잔액이 없습니다
            </p>
            <p style={{ color: colors.gray[500], fontSize: sizes.xs, margin: 0 }}>
              충전 후 이용해보세요
            </p>
          </div>
        ) : (
          <>
            <div ref={refundAreaRef}>
              {/* 환불 가능 금액 — 조건 충족 여부를 바로 보여준다 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `${spacing[4]} ${layout.margin}`,
                backgroundColor: colors.surface.card,
                borderRadius: layout.radiusCard,
                marginBottom: spacing[2],
              }}>
                <span style={{ fontSize: sizes.sm, color: colors.gray[700] }}>환불 가능 금액 (잔액의 40%)</span>
                <span style={{ fontSize: sizes.md, fontWeight: typography.weight.bold, color: colors.primary[700] }}>
                  최대 {fmt(maxRefundable)}
                </span>
              </div>

              {/* 금액 표시 */}
              <div style={{ backgroundColor: colors.surface.card, padding: `${spacing[4]} ${layout.margin}`, textAlign: 'center', borderRadius: layout.radiusCard, marginBottom: spacing[2] }}>
                <p style={{
                  margin: 0,
                  fontSize: sizes.balanceLarge,
                  fontWeight: typography.weight.bold,
                  color: hasAmount ? colors.gray[900] : colors.gray[400],
                }}>
                  {hasAmount ? fmt(amount) : '0원'}
                </p>
                {isOverLimit && (
                  <p style={{ margin: `${spacing[2]} 0 0`, fontSize: sizes.xs, color: colors.error }}>
                    환불 가능 금액을 넘었어요
                  </p>
                )}
              </div>

              <div style={{ padding: `${spacing[2]} 0 ${spacing[3]}` }}>
                <button
                  onClick={() => setAmount(maxRefundable)}
                  style={{
                    width: '100%',
                    minHeight: layout.touchMin,
                    background: 'none',
                    border: `1px solid ${colors.gray[200]}`,
                    borderRadius: layout.radiusButton,
                    color: colors.gray[700],
                    fontSize: sizes.sm,
                    cursor: 'pointer',
                  }}
                >
                  환불 가능 전액 신청 ({fmt(maxRefundable)})
                </button>
              </div>
            </div>

            <NumPad onPress={handleNumPress} />
          </>
        )}
      </div>

      {balance > 0 && (
        <div style={{
          padding: `${spacing[3]} ${layout.margin}`,
          // 08차 1번: 이 페이지는 <BottomNavBar/>(fixed, 하단 고정)를 같이 렌더한다.
          // 기존엔 safe-area만 더해서 버튼이 바텀내비 밑에 깔려 안 눌렸다. 바텀내비 높이도 더한다.
          paddingBottom: `calc(env(safe-area-inset-bottom) + ${spacing[3]} + ${layout.bottomNavHeight})`,
          backgroundColor: colors.surface.card,
          borderTop: `1px solid ${colors.gray[100]}`,
        }}>
          <Button variant="filled" size="lg" disabled={!canRequest} onClick={() => setConfirming(true)}>
            환불 신청
          </Button>
        </div>
      )}

      {/* 환불 확인 바텀 시트 */}
      {confirming && (
        <>
          <div
            onClick={() => setConfirming(false)}
           
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200 }}
          />
          <div style={{
            position: 'fixed',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: layout.viewport,
            backgroundColor: colors.surface.card,
            borderTopLeftRadius: layout.radiusModal,
            borderTopRightRadius: layout.radiusModal,
            padding: `${spacing[5]} ${spacing[5]} 0`,
            paddingBottom: `calc(${spacing[6]} + env(safe-area-inset-bottom))`,
            fontFamily: typography.fontFamily,
            zIndex: 201,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing[5] }}>
              <div style={{ width: '40px', height: '4px', borderRadius: layout.radiusPill, backgroundColor: colors.gray[300] }} />
            </div>

            <h3 style={{ margin: `0 0 ${spacing[2]}`, fontSize: sizes.lg, fontWeight: typography.weight.bold, color: colors.gray[900], textAlign: 'center', lineHeight: 1.4 }}>
              연결계좌로<br />{fmt(amount)} 환불하시겠어요?
            </h3>
            <p style={{ margin: `0 0 ${spacing[5]}`, fontSize: sizes.sm, color: colors.gray[500], textAlign: 'center', lineHeight: 1.5 }}>
              상품권 잔액은 수수료 없이 환불돼요. 혜택금은 환수 처리됩니다.
            </p>

            <div style={{
              backgroundColor: colors.surface.background,
              borderRadius: layout.radiusCard,
              padding: `${spacing[4]} ${spacing[4]}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing[4],
            }}>
              <span style={{ fontSize: sizes.sm, color: colors.gray[700] }}>환불 금액</span>
              <span style={{ fontSize: sizes.md, fontWeight: typography.weight.bold, color: colors.gray[900] }}>{fmt(amount)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[5] }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%', backgroundColor: colors.error,
                color: colors.onDark.primary, fontSize: '11px', fontWeight: typography.weight.bold,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                !
              </div>
              <span style={{ fontSize: sizes.xs, color: colors.error }}>신청 후에는 취소할 수 없습니다.</span>
            </div>

            <div style={{ display: 'flex', gap: spacing[2] }}>
              <Button
                variant="text"
                size="lg"
                fullWidth={false}
                style={{ flex: 1, backgroundColor: colors.gray[100], color: colors.gray[700] }}
                onClick={() => setConfirming(false)}
              >
                다음에 하기
              </Button>
              <Button
                variant="filled"
                size="lg"
                fullWidth={false}
                style={{ flex: 1.5 }}
                onClick={() => setShowAuth(true)}
              >
                신청하기
              </Button>
            </div>
          </div>
        </>
      )}

      <BottomNavBar />

      <PaymentAuthOverlay
        open={showAuth}
        onComplete={() => {
          setShowAuth(false)
          handleConfirmed()
        }}
        onCancel={() => setShowAuth(false)}
      />

      {/* 신규 화면 첫 방문 안내: 환불 가능 금액이 자동 계산돼 나온다는 것과 전액 신청 버튼을 짚어준다 */}
      {!hasSeenRefundPageCoach && balance > 0 && (
        <CoachMarkOverlay
          targetRef={refundAreaRef}
          message="환불 가능 금액은 자동으로 계산해서 보여드려요. 전액을 환불하려면 전액 신청을 눌러주세요."
          step={1}
          totalSteps={1}
          onNext={() => markSeen('refundPage')}
          onSkip={() => markSeen('refundPage')}
        />
      )}
    </ScreenContainer>
  )
}
