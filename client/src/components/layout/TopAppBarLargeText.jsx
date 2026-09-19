import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { colors, typography, layout, spacing } from '../../tokens/tokens'
import Logo from '../../assets/logos/logo.png'

export default function TopAppBarLargeText() {
  const navigate = useNavigate()
  const { toggleLargeText } = useApp()

  return (
    <div
      style={{
      // 08차 4·5번: 리퀴드글래스 제거 + fixed→sticky(데스크탑 미리보기 상태바를 가리던 원인)
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '52px',
      backgroundColor: colors.surface.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: layout.margin,
      paddingRight: layout.margin,
      borderBottom: `1px solid ${colors.gray[100]}`,
      flexShrink: 0,
    }}>
      {/* 로고 + 텍스트 — 큰글씨 모드에서 더 크게 */}
      {/* 장식 예외: 브랜드 마크 tight grouping (디자인시스템 단계 3-B) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: spacing[1] }}>
        <img src={Logo} alt="iM샵" style={{ height: '28px' }} />
        <span style={{
          fontSize: typography.size.xl,
          fontWeight: typography.weight.bold,
          color: colors.primary[700],
          fontFamily: typography.fontFamily,
          lineHeight: 1,
        }}>
          iM샵
        </span>
      </div>

      {/* 우측: 큰글씨 끄기 pill + 메뉴 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
        <button
          onClick={toggleLargeText}
          style={{
            // 04차: 큰글씨 모드일수록 터치 타깃도 더 커야 한다 — touchMin 이상 보장
            minHeight: layout.touchMin,
            padding: `0 ${spacing[3]}`,
            borderRadius: layout.radiusPill,
            border: `1px solid ${colors.primary[500]}`,
            backgroundColor: colors.primary[100],
            color: colors.primary[700],
            fontSize: typography.size.xs,
            fontWeight: typography.weight.semibold,
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
          }}
        >
          큰글씨 끄기
        </button>

        <button
          onClick={() => navigate('/menu')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.gray[700],
            fontSize: typography.size.xs,
            fontWeight: typography.weight.medium,
            fontFamily: typography.fontFamily,
            minHeight: layout.touchMin,
            padding: `0 ${spacing[2]}`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          메뉴
        </button>
      </div>
    </div>
  )
}
