/**
 * CoachMarkOverlay (A1)
 * Strategy: S7
 * Nielsen: #10 help and documentation
 * Shneiderman: #4 dialog closure, #8 reduce memory load
 * A1: ScreenContainer 기준 relative 좌표로 말풍선 위치 고정 (모바일 390px 안에만 표시)
 */

import { useState, useLayoutEffect, useEffect } from 'react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import { usePlatform } from '../../hooks/usePlatform'

// 10차 3번: QR 스캐너처럼 ScreenContainer 밖에서 전체화면으로 열리는 화면은
// #screen-container가 없어 오버레이가 그려지지 않았다. 기준 요소 id를 바꿀 수 있게 둔다.
export default function CoachMarkOverlay({ targetRef, message, step, totalSteps, onNext, onSkip, placement = 'top', containerId = 'screen-container' }) {
  const isAndroid = usePlatform() === 'android'
  const [containerRect, setContainerRect] = useState(null)
  const [targetRect, setTargetRect] = useState(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useLayoutEffect(() => {
    const updateRects = () => {
      const container = document.getElementById(containerId)
      if (container) setContainerRect(container.getBoundingClientRect())
      if (targetRef?.current) setTargetRect(targetRef.current.getBoundingClientRect())
    }

    updateRects()
    // 화면이 처음 그려질 때 함께 마운트되면, 데스크톱 프레임의 상태바가 그 직후에 끼어들어 대상이 아래로 밀린다.
    // 레이아웃이 자리 잡은 뒤(두 프레임 뒤) 한 번 더 잰다.
    let raf2
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(updateRects) })
    window.addEventListener('resize', updateRects)

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.removeEventListener('resize', updateRects)
    }
  }, [targetRef, containerId])

  if (!containerRect) return null

  const hasTarget = targetRect != null && targetRect.width > 0

  let relativeTarget = null
  if (hasTarget) {
    relativeTarget = {
      top: targetRect.top - containerRect.top,
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
      height: targetRect.height,
      bottom: targetRect.bottom - containerRect.top,
    }
  }

  const containerHeight = containerRect.height
  let tooltipPosition = {}
  let arrowDir = null

  const TOOLTIP_ESTIMATED_HEIGHT = 180

  if (relativeTarget) {
    if (placement === 'bottom') {
      tooltipPosition = { top: `${relativeTarget.bottom + 12}px` }
      arrowDir = 'top'
    } else {
      const spaceAbove = relativeTarget.top
      if (spaceAbove >= TOOLTIP_ESTIMATED_HEIGHT + 24) {
        tooltipPosition = { bottom: `${containerHeight - relativeTarget.top + 12}px` }
        arrowDir = 'bottom'
      } else {
        tooltipPosition = { top: '50%', transform: 'translateY(-50%)' }
        arrowDir = null
      }
    }
  } else {
    tooltipPosition = { top: '50%', transform: 'translateY(-50%)' }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: containerRect.top,
        left: containerRect.left,
        width: containerRect.width,
        height: containerRect.height,
        zIndex: 9999,
        fontFamily: typography.fontFamily,
        pointerEvents: 'auto',
      }}
    >
      {relativeTarget ? (
        // 10차 3번: 이전에는 구멍 뒤로 boxShadow '0 0 0 9999px'를 깔아 화면을 어둡혔다.
        // 그런데 spread가 이렇게 크면 크롬이 그리기를 건너뛰어, 딥이 아예 안 보이고
        // 말풍선만 떠 있는 상태로 보였다(스크린샷으로 확인). 위/아래/왼/오른 데 장으로
        // 다시 그려 가운데만 뚫린다. 보이는 모양은 똑같다.
        <>
          {(() => {
            const hole = {
              top: relativeTarget.top - 6,
              left: relativeTarget.left - 6,
              width: relativeTarget.width + 12,
              height: relativeTarget.height + 12,
            }
            const dim = colors.coach.dim
            const base = { position: 'absolute', backgroundColor: dim, pointerEvents: 'none' }
            return (
              <>
                <div style={{ ...base, top: 0, left: 0, right: 0, height: Math.max(0, hole.top) }} />
                <div style={{ ...base, top: hole.top + hole.height, left: 0, right: 0, bottom: 0 }} />
                <div style={{ ...base, top: hole.top, left: 0, width: Math.max(0, hole.left), height: hole.height }} />
                <div style={{ ...base, top: hole.top, left: hole.left + hole.width, right: 0, height: hole.height }} />
                <div
                  style={{
                    position: 'absolute',
                    top: hole.top,
                    left: hole.left,
                    width: hole.width,
                    height: hole.height,
                    borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                    border: `2px solid ${colors.coach.spotBorder}`,
                    pointerEvents: 'none',
                  }}
                />
              </>
            )
          })()}
        </>
      ) : (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: colors.coach.dim,
          pointerEvents: 'none',
        }} />
      )}

      <div
        style={{
          position: 'absolute',
          left: spacing[4],
          right: spacing[4],
          pointerEvents: 'auto',
          ...tooltipPosition,
        }}
      >
        {arrowDir === 'top' && (
          <div style={{ paddingLeft: '24px', marginBottom: '-1px' }}>
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: `10px solid ${colors.surface.card}`,
            }} />
          </div>
        )}

        <div style={{
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          padding: spacing[5],
          boxShadow: shadow.modal,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: i + 1 === step ? colors.primary[700] : colors.gray[200],
                }}
              />
            ))}
            <span style={{ fontSize: typography.size.xxs, color: colors.gray[400] }}>
              {step} / {totalSteps}
            </span>
          </div>

          <p style={{
            margin: `0 0 ${spacing[4]}`,
            fontSize: typography.size.sm,
            color: colors.gray[900],
            lineHeight: 1.6,
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
          }}>
            {message}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: spacing[3],
          }}>
            <button
              onClick={onSkip}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: typography.size.sm,
                color: colors.gray[500],
                padding: `${spacing[2]} 0`,
                fontFamily: typography.fontFamily,
                minHeight: layout.touchMin,
                pointerEvents: 'auto',
              }}
            >
              건너뛰기
            </button>
            <button
              onClick={onNext}
              style={{
                backgroundColor: colors.primary[700],
                border: 'none',
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                color: colors.onDark.primary,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                padding: `${spacing[2]} ${spacing[5]}`,
                cursor: 'pointer',
                minHeight: layout.touchMin,
                fontFamily: typography.fontFamily,
                pointerEvents: 'auto',
              }}
            >
              다음
            </button>
          </div>
        </div>

        {arrowDir === 'bottom' && (
          <div style={{ paddingLeft: '24px', marginTop: '-1px' }}>
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: `10px solid ${colors.surface.card}`,
            }} />
          </div>
        )}
      </div>
    </div>
  )
}
