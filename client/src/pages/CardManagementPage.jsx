/**
 * CardManagementPage — AS-IS iM샵 톤 + 카카오페이/토스 패턴 융합
 * 카드 시각 + 3버튼 + 충전/확인·변경/상태 관리 3그룹
 * 카드 번호 보기 → CardBackModal (Phase 1 Face ID → Phase 2 카드 뒷면)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import CardBackModal from '../components/home/CardBackModal'
import { usePlatform } from '../hooks/usePlatform'

const MASKED_CARD = '1234-56**-****-7890 | 03/36'
const FULL_CARD = '1234-5678-0000-7890'

function ToggleSwitch({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      style={{
        width: 48,
        height: 28,
        borderRadius: layout.radiusPill,
        backgroundColor: on ? colors.primary[700] : colors.gray[300],
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 2,
        left: on ? 22 : 2,
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: colors.surface.card,
        transition: 'left 160ms cubic-bezier(0.23,1,0.32,1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

function SectionHeader({ title }) {
  return (
    <div style={{
      padding: `${spacing[4]} ${spacing[4]} ${spacing[2]}`,
      backgroundColor: colors.surface.background,
    }}>
      <span style={{
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.gray[700],
        fontFamily: typography.fontFamily,
      }}>
        {title}
      </span>
    </div>
  )
}

function ToggleRow({ label, on, onChange }) {
  return (
    <div style={{
      width: '100%',
      padding: `${spacing[4]} ${spacing[4]}`,
      backgroundColor: colors.surface.card,
      borderBottom: `1px solid ${colors.gray[100]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
      minHeight: layout.touchMin,
      fontFamily: typography.fontFamily,
    }}>
      <span style={{
        fontSize: typography.size.md,
        color: colors.gray[900],
      }}>
        {label}
      </span>
      <ToggleSwitch on={on} onChange={onChange} />
    </div>
  )
}

function MenuRow({ label, badge, value, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        backgroundColor: colors.surface.card,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${spacing[4]} ${spacing[4]}`,
        minHeight: layout.touchMin,
        borderBottom: `1px solid ${colors.gray[100]}`,
        gap: spacing[3],
        fontFamily: typography.fontFamily,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], minWidth: 0 }}>
        <span style={{
          fontSize: typography.size.md,
          color: colors.gray[900],
          whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
        {badge && (
          <span style={{
            fontSize: typography.size.xxs,
            fontWeight: typography.weight.semibold,
            color: colors.primary[700],
            backgroundColor: colors.primary[50],
            padding: `2px ${spacing[2]}`,
            borderRadius: layout.radiusPill,
            flexShrink: 0,
          }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], minWidth: 0 }}>
        {value && (
          <span style={{
            fontSize: typography.size.sm,
            color: colors.gray[500],
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {value}
          </span>
        )}
        <ChevronRight size={20} color={colors.gray[400]} style={{ flexShrink: 0 }} />
      </div>
    </button>
  )
}

function CardThumbSVG() {
  return (
    <svg width="84" height="56" viewBox="0 0 100 64" fill="none" style={{ transform: 'rotate(-6deg)', flexShrink: 0 }}>
      <rect width="100" height="64" rx="8" fill={colors.surface.card} fillOpacity="0.95" />
      <text x="8" y="22" fontSize="13" fontWeight="700" fill={colors.primary[700]} fontFamily="sans-serif">iM샵</text>
      <rect x="8" y="32" width="26" height="16" rx="3" fill={colors.gray[200]} />
      <rect x="8" y="54" width="14" height="3" rx="1.5" fill={colors.gray[300]} />
    </svg>
  )
}

export default function CardManagementPage() {
  const navigate = useNavigate()
  const { balance } = useUser()

  const [showCardBack, setShowCardBack] = useState(false)
  const [autoFillOn, setAutoFillOn] = useState(true)
  const [scheduleOn, setScheduleOn] = useState(false)

  const isAndroid = usePlatform() === 'android'
  const fmt = (n) => n.toLocaleString('ko-KR') + '원'

  const handleViewCardNumber = () => {
    if (showCardBack) return
    setShowCardBack(true)
  }

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack
        title="카드 관리"
        onBack={() => navigate(-1)}
      />

      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: colors.surface.background,
      }}>
        {/* 카드 시각 + 잔액 + 3버튼 */}
        <div style={{
          margin: layout.margin,
          padding: spacing[5],
          backgroundColor: colors.surface.darkCard,
          borderRadius: layout.radiusCard,
          boxShadow: shadow.button,
          fontFamily: typography.fontFamily,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: spacing[3],
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: typography.size.sm,
                color: 'rgba(255,255,255,0.7)',
                fontWeight: typography.weight.medium,
              }}>
                iM샵(1)
              </p>
              <p style={{
                margin: `${spacing[1]} 0 0 0`,
                fontSize: typography.size.largeTitle,
                fontWeight: typography.weight.bold,
                color: colors.onDark.primary,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                {fmt(balance)}
              </p>
            </div>
            <CardThumbSVG />
          </div>

          <div style={{
            display: 'flex',
            gap: spacing[2],
            marginTop: spacing[4],
            paddingTop: spacing[3],
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}>
            <button
              onClick={() => navigate('/card-apply')}
              style={{
                flex: 1,
                height: 44,
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                color: colors.onDark.primary,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.medium,
                cursor: 'pointer',
                fontFamily: typography.fontFamily,
              }}
            >
              카드 등록
            </button>
            <button
              onClick={() => navigate('/qr')}
              style={{
                flex: 1,
                height: 44,
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                color: colors.onDark.primary,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.medium,
                cursor: 'pointer',
                fontFamily: typography.fontFamily,
              }}
            >
              QR결제
            </button>
            <button
              onClick={() => navigate('/charge')}
              style={{
                flex: 1,
                height: 44,
                backgroundColor: colors.primary[700],
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                color: colors.onDark.primary,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
                cursor: 'pointer',
                fontFamily: typography.fontFamily,
              }}
            >
              충전
            </button>
          </div>
        </div>

        {/* 충전 */}
        <SectionHeader title="충전" />
        <ToggleRow
          label="결제 시 부족 금액 충전"
          on={autoFillOn}
          onChange={() => setAutoFillOn((v) => !v)}
        />
        <ToggleRow
          label="충전 예약"
          on={scheduleOn}
          onChange={() => setScheduleOn((v) => !v)}
        />

        {/* 확인·변경 */}
        <SectionHeader title="확인·변경" />
        <MenuRow
          label="카드 번호 보기"
          badge="모바일"
          value={MASKED_CARD}
          onClick={handleViewCardNumber}
        />
        <MenuRow label="카드 이름 변경" />
        <MenuRow label="혜택 정보" />

        {/* 상태 관리 */}
        <SectionHeader title="상태 관리" />
        <MenuRow label="CVC 인증 오류 해제" />
        <MenuRow label="카드 폐기" />

        <div style={{ height: spacing[6] }} />
      </div>

      <CardBackModal
        open={showCardBack}
        onClose={() => setShowCardBack(false)}
        fullCardNumber={FULL_CARD}
      />
    </ScreenContainer>
  )
}
