/**
 * PeriodPickerModal (C3-3)
 * 기간 선택 바텀시트 — 390px 앱 고정형
 * CashbackPage, HistoryPage 공용
 * Nielsen #3 user control, Shneiderman #4 closure
 */

import { useState, useEffect } from 'react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const SLIDE_MS = 300

export default function PeriodPickerModal({ open, onClose, onSelect, selectedYear, selectedMonth, showAll = false }) {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setClosing(false)
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      setClosing(false)
    }
  }, [open])

  if (!open) return null

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, SLIDE_MS)
  }

  const dimOpacity = closing || !visible ? 0 : 1
  const sheetY = closing || !visible ? '100%' : '0%'

  const periods = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(2026, 4 - i)
    periods.push({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }

  return (
    <>
      {/* 전체화면 dim */}
      <div
        onClick={handleClose}
       
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: dimOpacity,
          transition: `opacity ${SLIDE_MS}ms ease`,
          zIndex: 350,
        }}
      />

      {/* 390px 고정 바텀시트 */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 0,
          transform: `translate(-50%, ${sheetY})`,
          width: '100%',
          maxWidth: layout.viewport,
          backgroundColor: colors.surface.card,
          borderRadius: `${layout.radiusModal} ${layout.radiusModal} 0 0`,
          boxShadow: shadow.modal,
          maxHeight: '70vh',
          overflowY: 'auto',
          transition: `transform ${SLIDE_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
          zIndex: 351,
          fontFamily: typography.fontFamily,
        }}
      >
        {/* 핸들 */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: spacing[3] }}>
          {/* 장식 예외: 핸들 4px 높이의 perfect rounded */}
          <div style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            backgroundColor: colors.gray[300],
          }} />
        </div>

        {/* 제목 */}
        <p style={{
          margin: `${spacing[3]} ${spacing[5]} ${spacing[2]}`,
          fontSize: typography.size.md,
          fontWeight: typography.weight.semibold,
          color: colors.gray[900],
        }}>
          기간 선택
        </p>

        {/* 전체 기간 옵션 — showAll=true 시 첫 항목으로 노출 */}
        {showAll && (() => {
          const isAllSelected = selectedYear == null && selectedMonth == null
          return (
            <button
              key="all"
              onClick={() => { onSelect(null, null); handleClose() }}
              style={{
                width: '100%',
                padding: `${spacing[4]} ${spacing[5]}`,
                backgroundColor: isAllSelected ? colors.primary[50] : 'transparent',
                border: 'none',
                borderBottom: `1px solid ${colors.gray[100]}`,
                textAlign: 'left',
                fontSize: typography.size.md,
                fontWeight: isAllSelected ? typography.weight.semibold : typography.weight.regular,
                color: isAllSelected ? colors.primary[700] : colors.gray[900],
                cursor: 'pointer',
                fontFamily: typography.fontFamily,
              }}
            >
              전체 기간
            </button>
          )
        })()}

        {/* 기간 목록 */}
        {periods.map(({ year, month }) => {
          const isSelected = year === selectedYear && month === selectedMonth
          return (
            <button
              key={`${year}-${month}`}
              onClick={() => { onSelect(year, month); handleClose() }}
              style={{
                width: '100%',
                padding: `${spacing[4]} ${spacing[5]}`,
                backgroundColor: isSelected ? colors.primary[50] : 'transparent',
                border: 'none',
                borderBottom: `1px solid ${colors.gray[100]}`,
                textAlign: 'left',
                fontSize: typography.size.md,
                fontWeight: isSelected ? typography.weight.semibold : typography.weight.regular,
                color: isSelected ? colors.primary[700] : colors.gray[900],
                cursor: 'pointer',
                fontFamily: typography.fontFamily,
              }}
            >
              {year}년 {month}월
            </button>
          )
        })}

        <div style={{ height: 'max(env(safe-area-inset-bottom), 16px)' }} />
      </div>
    </>
  )
}
