/**
 * CardBackFaceId (FIX-H1)
 * 새 .lottie — State Machine 없음, 60fps 1020프레임 일반 애니메이션
 * 3배속 재생 + complete 이벤트 감지 + 8초 폴백 타이머
 */

import { useState, useEffect, useRef } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import faceIdLottie from '../../assets/lottie/face-id-clean.lottie?url'
import { colors, layout } from '../../tokens/tokens'

const PLAY_SPEED = 9.0
const POST_HOLD_MS = 400
const SLIDE_MS = 400
const FALLBACK_MS = 3000

export default function CardBackFaceId({ open, onClose }) {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const lottieInstance = useRef(null)
  const completedRef = useRef(false)
  const fallbackTimer = useRef(null)
  const slideOutTimer = useRef(null)
  const closeTimer = useRef(null)

  const triggerSlideOut = () => {
    if (closing) return
    slideOutTimer.current = setTimeout(() => {
      setClosing(true)
      closeTimer.current = setTimeout(() => {
        onClose?.()
      }, SLIDE_MS)
    }, POST_HOLD_MS)
  }

  useEffect(() => {
    if (!open) {
      setVisible(false)
      setClosing(false)
      completedRef.current = false
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
      if (slideOutTimer.current) clearTimeout(slideOutTimer.current)
      if (closeTimer.current) clearTimeout(closeTimer.current)
      return
    }

    setClosing(false)
    completedRef.current = false
    requestAnimationFrame(() => setVisible(true))

    fallbackTimer.current = setTimeout(() => {
      if (!completedRef.current) {
        triggerSlideOut()
      }
    }, FALLBACK_MS)

    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
      if (slideOutTimer.current) clearTimeout(slideOutTimer.current)
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [open])

  const handleLottieRef = (instance) => {
    lottieInstance.current = instance
    if (!instance) return

    const setupAnimation = () => {
      try {
        if (typeof instance.setSpeed === 'function') {
          instance.setSpeed(PLAY_SPEED)
        }
      } catch (e) {
        console.warn('Lottie setSpeed failed', e)
      }
    }

    if (typeof instance.addEventListener === 'function') {
      instance.addEventListener('load', setupAnimation)
      instance.addEventListener('complete', () => {
        completedRef.current = true
        triggerSlideOut()
      })
    } else {
      setupAnimation()
    }
  }

  if (!open) return null

  const translateY = closing || !visible ? '-100%' : '24px'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: `translate(-50%, ${translateY})`,
        transition: `transform ${SLIDE_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
        zIndex: 500,
        width: 240,
        height: 80,
        backgroundColor: colors.surface.scannerBackdrop,
        borderRadius: layout.radiusPill,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <DotLottieReact
        src={faceIdLottie}
        autoplay
        loop={false}
        speed={PLAY_SPEED}
        dotLottieRefCallback={handleLottieRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
