/**
 * CardBackModal — 통합 인증 + 카드 뒷면 모달
 * Phase 1 (auth): Face ID Lottie 수동 frame 제어 (iOS HIG 베지어, 2.5초, frame 0→244 전체)
 * Phase 2 (card): 카드 뒷면 + 60초 카운트다운 (인증 완료 후 시작)
 * 전환: opacity 200ms 페이드
 */

import { useState, useEffect, useRef } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import faceIdLottie from '../../assets/lottie/face-id-ios.json?url'
import fingerprintLottie from '../../assets/lottie/Fingerprint.json?url'
import { usePlatform } from '../../hooks/usePlatform'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
const FADE_MS = 200
const COUNTDOWN_SEC = 60

// 초반 ease-out, 중반 linear, 후반 ease-out.
// 후반부는 원래 2제곱 ease-in이었으나, 사용자가 결과를 기다리는 마지막 구간을
// 느리게 만들어 체감 대기를 늘리므로 ease-out으로 바꿨다 (시작·끝값은 그대로).
function easingCurve(t) {
  if (t < 0.3) {
    return 0.3 * (1 - Math.pow(1 - t / 0.3, 2))
  } else if (t < 0.7) {
    return 0.3 + (t - 0.3) * 0.75
  } else {
    return 0.6 + 0.4 * (1 - Math.pow(1 - (t - 0.7) / 0.3, 2))
  }
}

function CardBackSVG({ cardNumber }) {
  return (
    <svg width="100%" viewBox="0 0 280 176" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="176" rx="12" fill={colors.primary[700]} />
      <rect width="280" height="176" rx="12" fill="url(#backGrad)" />
      <defs>
        <linearGradient id="backGrad" x1="0" y1="0" x2="280" y2="176" gradientUnits="userSpaceOnUse">
          <stop stopColor={colors.primary[600]} />
          <stop offset="1" stopColor={colors.primary[800]} />
        </linearGradient>
      </defs>
      <rect x="0" y="28" width="280" height="44" fill="rgba(0,0,0,0.55)" />
      <rect x="16" y="92" width="180" height="32" rx="4" fill={colors.surface.card} fillOpacity="0.9" />
      <text x="24" y="113" fontSize="11" fill={colors.gray[400]} fontFamily="sans-serif">AUTHORIZED SIGNATURE</text>
      <rect x="206" y="92" width="58" height="32" rx="4" fill={colors.surface.card} fillOpacity="0.9" />
      <text x="235" y="112" textAnchor="middle" fontSize="16" fontWeight="700" fill={colors.primary[700]} fontFamily="monospace">123</text>
      <text x="225" y="86" fontSize="9" fill="rgba(255,255,255,0.65)" fontFamily="sans-serif">CVC</text>
      <text x="16" y="152" fontSize="13" fill="rgba(255,255,255,0.95)" letterSpacing="1.5" fontFamily="monospace">{cardNumber}</text>
      <text x="16" y="170" fontSize="9" fill="rgba(255,255,255,0.55)" fontFamily="sans-serif">03/36</text>
    </svg>
  )
}

export default function CardBackModal({ open, onClose, fullCardNumber = '9465-4421-3567-8145' }) {
  const platform = usePlatform()
  const isAndroid = platform === 'android'
  const authLottie = isAndroid ? fingerprintLottie : faceIdLottie
  const TOTAL_FRAMES = isAndroid ? 180 : 244
  const DURATION_MS = isAndroid ? 3000 : 2500
  const AUTH_FALLBACK_MS = isAndroid ? 3200 : 2700

  const [phase, setPhase] = useState('auth')
  const [seconds, setSeconds] = useState(COUNTDOWN_SEC)
  const [opacity, setOpacity] = useState(1)
  const fallbackTimer = useRef(null)
  const fadeTimer = useRef(null)
  const rafId = useRef(null)
  const completedRef = useRef(false)

  const switchToCard = () => {
    if (completedRef.current) return
    completedRef.current = true
    if (rafId.current) cancelAnimationFrame(rafId.current)
    setOpacity(0)
    fadeTimer.current = setTimeout(() => {
      setPhase('card')
      setOpacity(1)
    }, FADE_MS)
  }

  useEffect(() => {
    if (!open) {
      setPhase('auth')
      setSeconds(COUNTDOWN_SEC)
      setOpacity(1)
      completedRef.current = false
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
      if (fadeTimer.current) clearTimeout(fadeTimer.current)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      return
    }
    fallbackTimer.current = setTimeout(() => {
      switchToCard()
    }, AUTH_FALLBACK_MS)
    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
      if (fadeTimer.current) clearTimeout(fadeTimer.current)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [open])

  useEffect(() => {
    if (phase !== 'card') return
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval)
          onClose?.()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  const handleLottieRef = (instance) => {
    if (!instance) return

    const startRAFLoop = () => {
      const startTime = performance.now()
      const tick = (now) => {
        const elapsed = now - startTime
        const t = Math.min(1, elapsed / DURATION_MS)
        const targetFrame = Math.floor(easingCurve(t) * TOTAL_FRAMES)
        try {
          if (typeof instance.setFrame === 'function') instance.setFrame(targetFrame)
        } catch (e) {
          console.warn('Lottie setFrame failed', e)
        }
        if (t < 1) {
          rafId.current = requestAnimationFrame(tick)
        } else {
          switchToCard()
        }
      }
      rafId.current = requestAnimationFrame(tick)
    }

    if (typeof instance.addEventListener === 'function') {
      instance.addEventListener('load', startRAFLoop)
    } else {
      startRAFLoop()
    }
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: phase === 'auth' && isAndroid ? 'flex-end' : 'center',
        padding: phase === 'auth' && isAndroid ? `0 0 120px` : spacing[5],
        zIndex: 400,
        fontFamily: typography.fontFamily,
      }}
    >
      <div style={{ opacity, transition: `opacity ${FADE_MS}ms ease`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {phase === 'auth' ? (
          <>
            <div style={{
              width: 150,
              height: 148,
              backgroundColor: isAndroid ? 'transparent' : colors.gray[900],
              borderRadius: layout.radiusCard,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              willChange: 'transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
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
          </>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '320px',
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusModal,
              padding: spacing[5],
              boxShadow: shadow.modal,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p style={{
              margin: `0 0 ${spacing[4]} 0`,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.gray[900],
              textAlign: 'center',
            }}>
              카드 정보
            </p>

            <CardBackSVG cardNumber={fullCardNumber} />

            <p style={{
              margin: `${spacing[4]} 0 ${spacing[4]} 0`,
              fontSize: typography.size.sm,
              color: seconds <= 10 ? colors.error : colors.gray[500],
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {seconds}초 후 자동으로 닫혀요
            </p>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                height: 48,
                backgroundColor: colors.primary[700],
                color: colors.onDark.primary,
                border: 'none',
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                cursor: 'pointer',
                fontFamily: typography.fontFamily,
              }}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
