/**
 * AuthGateScreen — 스플래시-홈 사이 최소 본인인증 게이트 (07차 2·3·4번)
 * 실제 화면 근거: 전사.md S02(이름 입력)+S03(주민등록번호 입력)를 1단계 한 화면으로 합쳤고,
 * S04(인증번호 입력)를 2단계로 뒀다. 라우터 밖(App.jsx)에서 렌더돼 딥링크·뒤로가기에 영향 없다.
 * SMS 인증은 목업이다 — 실제 로직을 검증/우회하지 않는다. 6자리를 다 채우면 무조건 통과한다.
 * 탈출구: 두 단계 모두 우상단 "건너뛰기"로 즉시 홈 진입 가능(필수 요구사항, 절대 막히면 안 됨).
 */

import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import { useTypography } from '../../hooks/useTypography'
import NumPad from '../payment/NumPad'
import Button from '../common/Button'

const RESEND_START_SEC = 179 // 전사.md S04 실측 "02:59"

function formatTimer(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function SkipLink({ onSkip }) {
  return (
    <button
      onClick={onSkip}
      style={{
        position: 'absolute',
        top: spacing[3],
        right: layout.margin,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: typography.size.xs,
        color: colors.gray[400],
        padding: spacing[2],
        minHeight: layout.touchMin,
        zIndex: 5,
        fontFamily: typography.fontFamily,
      }}
    >
      건너뛰기
    </button>
  )
}

function DigitGroup({ length, value, focused, masked, onFocus }) {
  return (
    <div onClick={onFocus} style={{ display: 'flex', gap: '3px', flex: length }}>
      {Array.from({ length }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            minWidth: 0,
            height: '44px',
            border: `1.5px solid ${focused && i === value.length ? colors.primary[700] : colors.gray[200]}`,
            borderRadius: layout.radiusSmall,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.size.sm,
            fontWeight: typography.weight.semibold,
            color: colors.gray[900],
            backgroundColor: colors.surface.card,
          }}
        >
          {i < value.length ? (masked ? '•' : value[i]) : ''}
        </div>
      ))}
    </div>
  )
}

// AI 개입지점 3 — 감지형. 인증번호 재요청을 2회 이상 누르면(수신 실패로 해석) 쉬운 말 안내를 띄운다.
// 충전에러(DiscountErrorModal)와 같은 시각 패턴: 어두운 스크림 + 중앙 카드 + 문장 + 버튼 2개.
function ResendAssistModal({ onRetry, onSkip }) {
  const sizes = useTypography()
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onRetry} style={{ position: 'absolute', inset: 0, backgroundColor: colors.surface.overlay }} />
      <div style={{
        position: 'relative', width: 'calc(100% - 64px)', maxWidth: '320px',
        backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[5], boxShadow: shadow.modal,
      }}>
        <p style={{ margin: `0 0 ${spacing[2]}`, fontSize: sizes.sm, fontWeight: typography.weight.bold, color: colors.gray[900], textAlign: 'center' }}>
          인증번호를 못 받으셨나요?
        </p>
        <p style={{ margin: `0 0 ${spacing[5]}`, fontSize: sizes.sm, color: colors.gray[700], lineHeight: typography.lineHeight.body, textAlign: 'center' }}>
          본인 명의 휴대폰이 맞는지, 입력한 정보가 정확한지 확인해보세요. 지금 당장 안 되면 나중에 다시 인증할 수 있어요.
        </p>
        <div style={{ display: 'flex', gap: spacing[2] }}>
          <Button variant="outlined" fullWidth={false} style={{ flex: 1 }} onClick={onRetry}>다시 시도</Button>
          <Button variant="filled" fullWidth={false} style={{ flex: 1 }} onClick={onSkip}>둘러보기</Button>
        </div>
      </div>
    </div>
  )
}

export default function AuthGateScreen({ onDone, onSkip }) {
  const sizes = useTypography()
  const [step, setStep] = useState(1)

  // 1단계: 이름 + 주민등록번호
  const [name, setName] = useState('')
  const [rrnFront, setRrnFront] = useState('')
  const [rrnBack, setRrnBack] = useState('')
  const [rrnFocus, setRrnFocus] = useState('front')

  // 2단계: 인증번호
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(RESEND_START_SEC)
  const [resendCount, setResendCount] = useState(0)
  const [showAssist, setShowAssist] = useState(false)

  useEffect(() => {
    if (step !== 2 || seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [step, seconds])

  const canProceedStep1 = name.trim().length > 0 && rrnFront.length === 6 && rrnBack.length === 7

  const handleRrnPad = (key) => {
    if (key === 'backspace') {
      if (rrnFocus === 'back') {
        if (rrnBack.length > 0) setRrnBack(rrnBack.slice(0, -1))
        else { setRrnFocus('front'); setRrnFront(rrnFront.slice(0, -1)) }
      } else {
        setRrnFront(rrnFront.slice(0, -1))
      }
      return
    }
    if (rrnFocus === 'front') {
      const next = (rrnFront + key).slice(0, 6)
      setRrnFront(next)
      if (next.length === 6) setRrnFocus('back')
    } else {
      setRrnBack((rrnBack + key).slice(0, 7))
    }
  }

  const handleCodePad = (key) => {
    if (key === 'backspace') { setCode(code.slice(0, -1)); return }
    const next = (code + key).slice(0, 6)
    setCode(next)
    if (next.length === 6) {
      // 목업: 실제 SMS 인증을 검증하지 않는다. 6자리를 다 채우면 통과한다.
      setTimeout(() => onDone(), 300)
    }
  }

  const handleResend = () => {
    setCode('')
    setSeconds(RESEND_START_SEC)
    const next = resendCount + 1
    setResendCount(next)
    if (next >= 2) setShowAssist(true)
  }

  if (step === 1) {
    return (
      <div style={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        backgroundColor: colors.surface.card, fontFamily: typography.fontFamily, position: 'relative',
      }}>
        <SkipLink onSkip={onSkip} />

        <div style={{ padding: `${spacing[8]} ${layout.margin} ${spacing[5]}` }}>
          <p style={{ margin: 0, fontSize: sizes.xl, fontWeight: typography.weight.bold, color: colors.gray[900] }}>
            이름을 입력해주세요.
          </p>
        </div>

        <div style={{ padding: `0 ${layout.margin}`, marginBottom: spacing[6] }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            placeholder="이름"
            style={{
              width: '100%', height: '52px', border: 'none', borderBottom: `2px solid ${colors.primary[700]}`,
              fontSize: sizes.lg, color: colors.gray[900], fontFamily: typography.fontFamily,
              outline: 'none', boxSizing: 'border-box', backgroundColor: 'transparent',
            }}
          />
        </div>

        <div style={{ padding: `0 ${layout.margin}`, marginBottom: spacing[3] }}>
          <p style={{ margin: `0 0 ${spacing[3]}`, fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
            주민등록번호를 입력해주세요.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <DigitGroup length={6} value={rrnFront} focused={rrnFocus === 'front'} onFocus={() => setRrnFocus('front')} />
            <span style={{ color: colors.gray[400], fontSize: sizes.md }}>-</span>
            <DigitGroup length={7} value={rrnBack} masked focused={rrnFocus === 'back'} onFocus={() => setRrnFocus('back')} />
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: `0 ${layout.margin} ${spacing[3]}` }}>
          <NumPad onPress={handleRrnPad} />
        </div>

        <div style={{
          flexShrink: 0, padding: `${spacing[3]} ${layout.margin}`,
          paddingBottom: `calc(env(safe-area-inset-bottom) + ${spacing[3]})`,
        }}>
          <Button variant="filled" size="lg" disabled={!canProceedStep1} onClick={() => setStep(2)}>
            다음
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
      backgroundColor: colors.surface.card, fontFamily: typography.fontFamily, position: 'relative',
    }}>
      <SkipLink onSkip={onSkip} />

      <div style={{ display: 'flex', alignItems: 'center', padding: `${spacing[3]} ${layout.margin}` }}>
        <button
          onClick={() => setStep(1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing[1], display: 'flex' }}
        >
          <ChevronLeft size={24} color={colors.gray[900]} />
        </button>
      </div>

      <div style={{ padding: `${spacing[5]} ${layout.margin} ${spacing[6]}` }}>
        <p style={{ margin: 0, fontSize: sizes.xl, fontWeight: typography.weight.bold, color: colors.gray[900] }}>
          인증번호 6자리를 입력해주세요.
        </p>
      </div>

      <div style={{ padding: `0 ${layout.margin}`, marginBottom: spacing[3] }}>
        <DigitGroup length={6} value={code} focused onFocus={() => {}} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${layout.margin}` }}>
        <span style={{
          fontSize: sizes.sm, fontVariantNumeric: 'tabular-nums',
          color: seconds <= 30 ? colors.error : colors.gray[500],
        }}>
          {formatTimer(seconds)}
        </span>
        <button
          onClick={handleResend}
          style={{
            background: 'none', border: `1px solid ${colors.gray[300]}`, borderRadius: layout.radiusPill,
            padding: `${spacing[1]} ${spacing[3]}`, fontSize: sizes.xs, color: colors.gray[700],
            cursor: 'pointer', minHeight: layout.touchMin, fontFamily: typography.fontFamily,
          }}
        >
          재요청
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: `0 ${layout.margin} ${spacing[3]}` }}>
        <NumPad onPress={handleCodePad} />
      </div>

      {showAssist && (
        <ResendAssistModal
          onRetry={() => setShowAssist(false)}
          onSkip={onSkip}
        />
      )}
    </div>
  )
}
