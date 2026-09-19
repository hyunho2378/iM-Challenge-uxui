// usage-guide/CardManageMini.jsx
// 카드 관리 화면 스냅샷 (CardManagementPage 복제, CardBackModal/lottie 제거)
// useUser 제거 → balance 고정값. 토글은 정적.

import { ChevronRight, ChevronLeft } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const MASKED_CARD = '1234-56**-****-7890 | 03/36'

function ToggleSwitch({ on }) {
  return (
    <div style={{
      width: 48, height: 28, borderRadius: 999,
      backgroundColor: on ? colors.primary[700] : colors.gray[300],
      position: 'relative', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 22 : 2, width: 24, height: 24,
        borderRadius: '50%', backgroundColor: colors.surface.card, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div style={{ padding: `${spacing[4]} ${spacing[4]} ${spacing[2]}`, backgroundColor: colors.surface.background }}>
      <span style={{ fontSize: typography.size.sm, fontWeight: typography.weight.bold, color: colors.gray[700], fontFamily: typography.fontFamily }}>
        {title}
      </span>
    </div>
  )
}

function ToggleRow({ label, on }) {
  return (
    <div style={{
      width: '100%', padding: `${spacing[4]} ${spacing[4]}`, backgroundColor: colors.surface.card,
      borderBottom: `1px solid ${colors.gray[100]}`, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: spacing[3], minHeight: layout.touchMin, fontFamily: typography.fontFamily,
    }}>
      <span style={{ fontSize: typography.size.md, color: colors.gray[900] }}>{label}</span>
      <ToggleSwitch on={on} />
    </div>
  )
}

function MenuRow({ label, badge, value }) {
  return (
    <div style={{
      width: '100%', textAlign: 'left', backgroundColor: colors.surface.card, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', padding: `${spacing[4]} ${spacing[4]}`,
      minHeight: layout.touchMin, borderBottom: `1px solid ${colors.gray[100]}`, gap: spacing[3], fontFamily: typography.fontFamily,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], minWidth: 0 }}>
        <span style={{ fontSize: typography.size.md, color: colors.gray[900], whiteSpace: 'nowrap' }}>{label}</span>
        {badge && (
          <span style={{
            fontSize: typography.size.xxs, fontWeight: typography.weight.semibold, color: colors.primary[700],
            backgroundColor: colors.primary[50], padding: `2px ${spacing[2]}`, borderRadius: layout.radiusPill, flexShrink: 0,
          }}>{badge}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], minWidth: 0 }}>
        {value && (
          <span style={{ fontSize: typography.size.sm, color: colors.gray[500], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        )}
        <ChevronRight size={20} color={colors.gray[400]} style={{ flexShrink: 0 }} />
      </div>
    </div>
  )
}

function CardThumbSVG() {
  return (
    <svg width="84" height="56" viewBox="0 0 100 64" fill="none" style={{ transform: 'rotate(-6deg)', flexShrink: 0 }}>
      <rect width="100" height="64" rx="8" fill={colors.error} />
      <text x="8" y="22" fontSize="13" fontWeight="700" fill={colors.surface.card} fontFamily="sans-serif">대구로페이</text>
      <rect x="8" y="32" width="26" height="16" rx="3" fill="rgba(255,255,255,0.3)" />
      <rect x="8" y="54" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
    </svg>
  )
}

// props: { balance = 112671 }
export default function CardManageMini({ balance = 112671 }) {
  const fmt = (n) => n.toLocaleString('ko-KR') + '원'

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface.card, fontFamily: typography.fontFamily }}>
      {/* 헤더 — 뒤로가기 + 중앙 제목 (TopAppBarBack 형태) */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: `${spacing[3]} ${layout.margin}`, borderBottom: `1px solid ${colors.gray[100]}`,
        minHeight: layout.topBarHeight, position: 'relative',
      }}>
        <ChevronLeft size={24} color={colors.gray[900]} />
        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.gray[900],
        }}>카드 관리</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: colors.surface.background }}>
        {/* 카드 + 잔액 + 3버튼 */}
        <div style={{
          margin: layout.margin, padding: spacing[5], backgroundColor: colors.surface.darkCard,
          borderRadius: layout.radiusCard, boxShadow: shadow.button, fontFamily: typography.fontFamily,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing[3] }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: typography.size.sm, color: 'rgba(255,255,255,0.7)', fontWeight: typography.weight.medium }}>대구로페이</p>
              <p style={{ margin: `${spacing[1]} 0 0 0`, fontSize: typography.size.largeTitle, fontWeight: typography.weight.bold, color: colors.onDark.primary, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{fmt(balance)}</p>
            </div>
            <CardThumbSVG />
          </div>
          <div style={{ display: 'flex', gap: spacing[2], marginTop: spacing[4], paddingTop: spacing[3], borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[['QR결제', false], ['충전', true]].map(([label, primary]) => (
              <div key={label} style={{
                flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: primary ? colors.primary[700] : 'rgba(255,255,255,0.2)',
                border: `1px solid rgba(255,255,255,${primary ? 0.4 : 0.3})`, borderRadius: layout.radiusSmall,
                color: colors.onDark.primary, fontSize: typography.size.sm, fontWeight: primary ? typography.weight.bold : typography.weight.medium,
              }}>{label}</div>
            ))}
          </div>
        </div>

        <SectionHeader title="충전" />
        <ToggleRow label="결제 시 부족 금액 충전" on={true} />
        <ToggleRow label="충전 예약" on={false} />

        <SectionHeader title="확인·변경" />
        <MenuRow label="카드 번호 보기" badge="모바일" value={MASKED_CARD} />
        <MenuRow label="카드 이름 변경" />
        <MenuRow label="혜택 정보" />

        <SectionHeader title="상태 관리" />
        <MenuRow label="CVC 인증 오류 해제" />
        <MenuRow label="카드 폐기" />

        <div style={{ height: spacing[6] }} />
      </div>
    </div>
  )
}