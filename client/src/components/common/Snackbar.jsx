// Snackbar.jsx — H
// MD3 스낵바 — Android 전용 (iOS는 null 반환)

import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { usePlatform } from '../../hooks/usePlatform'
import { colors, typography, layout, shadow } from '../../tokens/tokens'

export default function Snackbar() {
  const isAndroid = usePlatform() === 'android'
  const { snackbar, hideSnackbar } = useApp()

  useEffect(() => {
    if (!snackbar) return
    const t = setTimeout(() => hideSnackbar(), 2800)
    return () => clearTimeout(t)
  }, [snackbar, hideSnackbar])

  if (!isAndroid || !snackbar) return null

  return (
    <>
      <style>{`
        @keyframes snackbarSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: `calc(${layout.bottomNavHeight} + 8px)`,
          zIndex: 9998,
          display: 'flex',
          justifyContent: 'center',
          padding: `0 ${layout.margin}`,
          pointerEvents: 'none',
          animation: 'snackbarSlideUp 250ms ease',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: `calc(${layout.viewport} - 32px)`,
            pointerEvents: 'auto',
            backgroundColor: colors.gray[900],
            color: colors.onDark.primary,
            borderRadius: layout.radiusSmall,
            padding: '14px 16px',
            fontSize: typography.size.sm,
            fontFamily: typography.fontFamily,
            boxShadow: shadow.modal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{snackbar.message}</span>
          {snackbar.actionLabel && (
            <button
              onClick={hideSnackbar}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.primary[300],
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                fontFamily: typography.fontFamily,
                paddingLeft: '16px',
                flexShrink: 0,
              }}
            >
              {snackbar.actionLabel}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
