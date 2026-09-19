/**
 * CardBackModal — 카드 뒷면(번호/유효기간) 조회 모달
 * 07차: 마스킹 조회는 인증 없이 즉시 보여준다(불편사례 #21 — 자동로그인을 꺼두면
 * 카드번호 확인할 때마다 비밀번호를 매번 재입력해야 하는 문제). "전체번호 보기"를
 * 눌러 완전한 번호를 볼 때만 PaymentAuthOverlay 재인증을 요구한다 — 실거래(충전/환불)와
 * 완전번호 노출, 이 두 곳만 재인증 대상이다. 완전번호 노출 이후에만 60초 자동 닫힘을 건다.
 */

import { useState, useEffect } from 'react'
import { usePlatform } from '../../hooks/usePlatform'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import PaymentAuthOverlay from '../common/PaymentAuthOverlay'
const COUNTDOWN_SEC = 60

// 기존 MASKED_CARD 표기('1234-56**-****-7890')와 같은 규칙으로 완전번호에서 마스킹본을 만든다.
function maskCardNumber(full) {
  const groups = full.split('-')
  if (groups.length !== 4) return full
  const [g1, g2, , g4] = groups
  return `${g1}-${g2.slice(0, 2)}**-****-${g4}`
}

function CardBackSVG({ cardNumber }) {
  return (
    <svg width="100%" viewBox="0 0 280 176" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 08차 0번: 카드 아트워크는 실제 색(빨강)으로. 앱 UI색(보라)과 별개다 */}
      <rect width="280" height="176" rx="12" fill={colors.error} />
      <rect width="280" height="176" rx="12" fill="url(#backGrad)" />
      <defs>
        <linearGradient id="backGrad" x1="0" y1="0" x2="280" y2="176" gradientUnits="userSpaceOnUse">
          <stop stopColor={colors.error} />
          <stop offset="1" stopColor={colors.errorDark} />
        </linearGradient>
      </defs>
      <rect x="0" y="28" width="280" height="44" fill="rgba(0,0,0,0.55)" />
      <rect x="16" y="92" width="180" height="32" rx="4" fill={colors.surface.card} fillOpacity="0.9" />
      <text x="24" y="113" fontSize="11" fill={colors.gray[400]} fontFamily="sans-serif">AUTHORIZED SIGNATURE</text>
      <rect x="206" y="92" width="58" height="32" rx="4" fill={colors.surface.card} fillOpacity="0.9" />
      <text x="235" y="112" textAnchor="middle" fontSize="16" fontWeight="700" fill={colors.error} fontFamily="monospace">123</text>
      <text x="225" y="86" fontSize="9" fill="rgba(255,255,255,0.65)" fontFamily="sans-serif">CVC</text>
      <text x="16" y="152" fontSize="13" fill="rgba(255,255,255,0.95)" letterSpacing="1.5" fontFamily="monospace">{cardNumber}</text>
      <text x="16" y="170" fontSize="9" fill="rgba(255,255,255,0.55)" fontFamily="sans-serif">03/36</text>
    </svg>
  )
}

export default function CardBackModal({ open, onClose, fullCardNumber = '9465-4421-3567-8145' }) {
  const isAndroid = usePlatform() === 'android'

  const [revealed, setRevealed] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [seconds, setSeconds] = useState(COUNTDOWN_SEC)

  useEffect(() => {
    if (!open) {
      setRevealed(false)
      setShowAuth(false)
      setSeconds(COUNTDOWN_SEC)
    }
  }, [open])

  // 완전번호를 보여주는 동안에만 노출 시간을 제한한다. 마스킹 조회는 계속 떠 있어도 된다.
  useEffect(() => {
    if (!open || !revealed) return
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
  }, [open, revealed])

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[5],
          zIndex: 400,
          fontFamily: typography.fontFamily,
        }}
      >
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

          <CardBackSVG cardNumber={revealed ? fullCardNumber : maskCardNumber(fullCardNumber)} />

          {revealed ? (
            <p style={{
              margin: `${spacing[4]} 0 ${spacing[4]} 0`,
              fontSize: typography.size.sm,
              color: seconds <= 10 ? colors.error : colors.gray[500],
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {seconds}초 후 자동으로 닫혀요
            </p>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                width: '100%',
                height: 44,
                margin: `${spacing[4]} 0`,
                background: 'none',
                border: `1px solid ${colors.gray[200]}`,
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                color: colors.primary[700],
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                cursor: 'pointer',
                fontFamily: typography.fontFamily,
              }}
            >
              전체번호 보기
            </button>
          )}

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
      </div>

      <PaymentAuthOverlay
        open={showAuth}
        onComplete={() => {
          setShowAuth(false)
          setRevealed(true)
          setSeconds(COUNTDOWN_SEC)
        }}
        onCancel={() => setShowAuth(false)}
      />
    </>
  )
}
