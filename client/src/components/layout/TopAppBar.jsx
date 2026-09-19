/**
 * TopAppBar (Phase 3 rewrite)
 * Feedback: 햄버거 삭제 → 알림종, 검색 → /search
 * Strategy: Nielsen #4 consistency, Shneiderman #1
 */
import { Search, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { colors, typography, layout, spacing } from '../../tokens/tokens'
// 08차 4번: 리퀴드글래스 제거. sticky는 자기 자리(정상 플로우)에서만 붙기 때문에
// 앞에 있는 형제 요소(데스크탑 미리보기의 상태바)를 가리지 않는다 — 08차 5번(상태바 안 보임) 원인이었다.
// iM샵 실캡처(S01) 로고. 자체 배경(민트-그린 그라디언트)을 내장한 아이콘이라
// 밝은/어두운 배경 어디서든 대비가 유지된다. 배경별 변형이 따로 필요 없다.
import Logo from '../../assets/logos/logo.png'

export default function TopAppBar() {
  const navigate = useNavigate()
  const { isLargeText, toggleLargeText } = useApp()

  return (
    <div
      style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: layout.topBarHeight,
      backgroundColor: colors.surface.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: layout.margin,
      paddingRight: '8px',
      borderBottom: `1px solid ${colors.gray[100]}`,
      flexShrink: 0,
    }}>
      {/* 로고 + 텍스트 */}
      {/* 장식 예외: 브랜드 마크 tight grouping (디자인시스템 단계 3-B) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: spacing[1] }}>
        <img src={Logo} alt="iM샵" style={{ height: '22px' }} />
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

      {/* 우측 액션 */}
      {/* 장식 예외: 아이콘 버튼 그룹 마이크로 간격 (디자인시스템 단계 3-B) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {/* 큰글씨 pill */}
        <button
          onClick={toggleLargeText}
          style={{
            // 04차: 시니어 접근성 진입점 자체가 약 24px로 화면에서 가장 작은 문제 — touchMin으로 상향
            minHeight: layout.touchMin,
            padding: `0 ${spacing[3]}`,
            borderRadius: layout.radiusPill,
            border: `1px solid ${isLargeText ? colors.primary[300] : colors.gray[200]}`,
            backgroundColor: isLargeText ? colors.primary[100] : colors.surface.card,
            color: isLargeText ? colors.primary[700] : colors.gray[500],
            fontSize: typography.size.xxs,
            fontWeight: typography.weight.medium,
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
            whiteSpace: 'nowrap',
          }}
        >
          {isLargeText ? '큰글씨 켜짐' : '큰글씨'}
        </button>

        {/* 검색 → /search (Phase 3: 매장이 아닌 검색 전용 페이지) */}
        <button
          onClick={() => navigate('/search')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: layout.touchMin,
            height: layout.touchMin,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Search size={20} color={colors.gray[800]} strokeWidth={1.8} />
        </button>

        {/* 알림 종 (Phase 3: 햄버거 → Bell) */}
        <button
          onClick={() => navigate('/notification')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: layout.touchMin,
            height: layout.touchMin,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell size={20} color={colors.gray[800]} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}
