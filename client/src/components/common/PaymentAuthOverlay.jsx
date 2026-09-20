import { useState, useEffect, useRef } from 'react'
import { X, Settings } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { colors, typography, layout, spacing } from '../../tokens/tokens'
import faceIdLottie from '../../assets/lottie/face-id-ios.json?url'
import fingerprintLottie from '../../assets/lottie/Fingerprint.json?url'
import StatusBar from '../layout/StatusBar'
import { usePlatform } from '../../hooks/usePlatform'

const FACE_ID_DELAY = 100        // 키패드 진입 후 페이스 ID 등장
const RAF_DURATION = 2500        // CardBackModal과 동일
const FALLBACK_MS = 2700         // CardBackModal과 동일
const FADE_OUT = 100             // 완료 후 페이드 아웃 (자연스럽고 빠름)

// CardBackModal Phase 1과 동일한 iOS-style easing
function easingCurve(t) {
  if (t < 0.3) {
    const x = t / 0.3
    return 0.4 * (1 - Math.pow(1 - x, 2))
  }
  if (t < 0.7) {
    return 0.4 + (t - 0.3) * 0.75
  }
  const x = (t - 0.7) / 0.3
  // ease-out. 원래 ease-in(x*x)이었으나 완료 직전을 느리게 만들어 되돌렸다
  return 0.7 + 0.3 * (1 - Math.pow(1 - x, 2))
}

const KEYPAD = [
  ['7', '2', '0'],
  ['8', '6', '5'],
  ['4', '9', '1'],
  ['', '3', 'back'],
]

// showSecureKeyboardNotice: 결제 흐름에서는 그대로 두고, /design-system 비교 화면에서만 끔다.
// 생체인증 모양을 비교하는 자리에서 빨간 막대가 딱기 때문이다.
export default function PaymentAuthOverlay({ open, onComplete, onCancel, showSecureKeyboardNotice = true }) {
  const [showFaceId, setShowFaceId] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const completedRef = useRef(false)
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)
  const fallbackTimerRef = useRef(null)
  const cleanupListenersRef = useRef(null)
  const setupDoneRef = useRef(false)

  const platform = usePlatform()
  const isAndroid = platform === 'android'
  const authLottie = isAndroid ? fingerprintLottie : faceIdLottie
  const TOTAL_FRAMES = isAndroid ? 180 : 244
  const authLabel = isAndroid ? '지문을 인식해주세요' : null

  // open 변경 시 리셋
  useEffect(() => {
    if (!open) {
      setShowFaceId(false)
      setFadingOut(false)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current)
      if (cleanupListenersRef.current) cleanupListenersRef.current()
      return
    }
    completedRef.current = false
    setFadingOut(false)
    const timer = setTimeout(() => setShowFaceId(true), FACE_ID_DELAY)
    return () => clearTimeout(timer)
  }, [open])

  const handleAuthComplete = () => {
    if (completedRef.current) return
    completedRef.current = true
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current)
    setFadingOut(true)
    setTimeout(() => {
      onComplete?.()
    }, FADE_OUT)
  }

  // CardBackModal 방식 — instance를 클로저로 캡처
  const handleLottieRef = (instance) => {
    if (instance == null) {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = null
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (cleanupListenersRef.current) {
        cleanupListenersRef.current()
        cleanupListenersRef.current = null
      }
      setupDoneRef.current = false
      return
    }
    if (setupDoneRef.current) return
    setupDoneRef.current = true

    fallbackTimerRef.current = setTimeout(() => {
      if (completedRef.current) return
      handleAuthComplete()
    }, FALLBACK_MS)

    const startRAFLoop = () => {
      startTimeRef.current = performance.now()
      const tick = (now) => {
        if (completedRef.current) return
        const elapsed = now - startTimeRef.current
        const t = Math.min(1, elapsed / RAF_DURATION)
        const targetFrame = Math.floor(easingCurve(t) * TOTAL_FRAMES)
        try {
          if (typeof instance.setFrame === 'function') {
            instance.setFrame(targetFrame)
          }
        } catch (e) {
          console.warn('[PaymentAuthOverlay] setFrame failed:', e)
        }
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          handleAuthComplete()
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (typeof instance.addEventListener === 'function') {
      const onLoad = () => startRAFLoop()
      instance.addEventListener('load', onLoad)
      cleanupListenersRef.current = () => {
        try {
          if (typeof instance.removeEventListener === 'function') {
            instance.removeEventListener('load', onLoad)
          }
        } catch (e) {}
      }
    } else {
      startRAFLoop()
    }
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: layout.viewport,
        backgroundColor: colors.surface.card,
        // 07차: 코치마크(9999)가 뜬 채로 실제 결제 인증을 열면 코치마크가 이 화면을
        // 덮어버리는 문제가 있었다(ChargeScreen/ChargeFreePage). 실거래 인증이 항상 위에 오게 한다.
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: typography.fontFamily,
        opacity: fadingOut ? 0 : 1,
        transition: `opacity ${FADE_OUT}ms ease-out`,
        pointerEvents: showFaceId ? 'none' : 'auto',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* StatusBar — 데스크탑 41px 시뮬레이션 / 모바일 OS 처리 */}
      <StatusBar backgroundColor={colors.surface.card} />

      {/* 우상단 X 닫기 */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: `${spacing[4]} ${layout.margin}`,
      }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: spacing[2],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="닫기"
        >
          <X size={28} color={colors.gray[700]} strokeWidth={2} />
        </button>
      </div>

      {/* 톱니바퀴 + 타이틀 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[5],
        padding: `${spacing[3]} 0`,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: colors.gray[200],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Settings size={28} color={colors.gray[500]} strokeWidth={2} />
        </div>
        <span style={{
          fontSize: typography.size.lg,
          fontWeight: typography.weight.bold,
          color: colors.gray[900],
        }}>
          간편 비밀번호 입력
        </span>
        {/* 점 4개 (전부 빈 막대) */}
        <div style={{
          display: 'flex',
          gap: spacing[5],
          marginTop: spacing[2],
        }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '2px',
                backgroundColor: colors.gray[300],
                borderRadius: '1px',
              }}
            />
          ))}
        </div>
      </div>

      {/* 비밀번호 잊으셨나요 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: spacing[6],
      }}>
        <span style={{
          fontSize: typography.size.sm,
          color: colors.gray[700],
        }}>
          비밀번호를 잊으셨나요? ›
        </span>
      </div>

      {/* 얼굴인증 사용하기 + 보안키보드 안내 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: spacing[2],
        paddingBottom: spacing[3],
      }}>
        <div style={{
          padding: `${spacing[2]} ${spacing[4]}`,
          backgroundColor: colors.primary[50],
          borderRadius: layout.radiusPill,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
          color: colors.primary[700],
        }}>
          {isAndroid ? '지문인증 사용하기' : '얼굴인증 사용하기'}
        </div>
        {showSecureKeyboardNotice && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            <div style={{
              width: '12px',
              height: '14px',
              backgroundColor: colors.error,
              borderRadius: '2px',
            }} />
            <span style={{
              fontSize: typography.size.xs,
              color: colors.gray[700],
            }}>
              보안키보드 작동 중
            </span>
          </div>
        )}
      </div>

      {/* 숫자 키패드 */}
      <div style={{
        padding: `${spacing[4]} ${layout.margin} ${spacing[6]}`,
      }}>
        {KEYPAD.map((row, ri) => (
          <div key={ri} style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: `${spacing[3]} 0`,
          }}>
            {row.map((key, ki) => (
              <div
                key={`${ri}-${ki}`}
                style={{
                  flex: 1,
                  fontSize: '34px',
                  fontWeight: typography.weight.regular,
                  color: colors.gray[900],
                  textAlign: 'center',
                }}
              >
                {key === 'back' ? '←' : key}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ─────── 생체인증 모달 (iOS: 얼굴인증 중앙 / Android: 지문 하단) ─────── */}
      {showFaceId && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isAndroid ? 'flex-end' : 'center',
          paddingBottom: isAndroid ? '120px' : '0',
          zIndex: 10,
          pointerEvents: 'auto',
        }}>
          <div style={{
            width: 150,
            height: 148,
            backgroundColor: isAndroid ? 'transparent' : colors.gray[900],
            borderRadius: layout.radiusCard,
            overflow: 'hidden',
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <DotLottieReact
              src={authLottie}
              autoplay={false}
              loop={false}
              dotLottieRefCallback={handleLottieRef}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          {isAndroid && (
            <p style={{
              marginTop: spacing[5],
              fontSize: typography.size.md,
              fontWeight: typography.weight.semibold,
              color: colors.onDark.primary,
              textAlign: 'center',
              fontFamily: typography.fontFamily,
            }}>
              지문을 인식해주세요
            </p>
          )}
        </div>
      )}
    </div>
  )
}
