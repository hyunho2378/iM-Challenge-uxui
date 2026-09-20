/**
 * BottomNavBar
 * 05차 지시서 2번: iM샵 실제 구조엔 바텀내비가 없고 햄버거 드로어 하나뿐이다(IA 병리 확정).
 * 이미 완성된 이 컴포넌트를 재사용해 바텀내비를 to-be 개선으로 얹는다.
 * 08차 11번: "충전·결제"(→/qr)는 "결제매장"(→/store, 가맹점찾기)으로, "SHOP·쿠폰"(→/store)은
 * "지원금·혜택"(→/benefits, 혜택현황 신설로 대응 화면이 생겼다)으로 바꿨다. QR결제(/qr)는
 * 탭에서 빠졌지만 홈 카드 위젯의 QR결제 버튼으로 계속 갈 수 있다.
 * 5탭: 홈·결제매장·이용내역·지원금·혜택·MY.
 * Strategy: Nielsen #4 consistency, Shneiderman #1
 */

import { cloneElement } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Store, Gift, Receipt, User } from 'lucide-react'
import { colors, typography, layout, spacing, md3Shape, shadow } from '../../tokens/tokens'
import { useTypography } from '../../hooks/useTypography'
import { usePlatform } from '../../hooks/usePlatform'

export default function BottomNavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  function getActiveKey() {
    const p = location.pathname
    if (p === '/') return 'home'
    if (p.startsWith('/store') || p.startsWith('/coupon')) return 'merchant'
    if (p.startsWith('/history')) return 'history'
    if (p.startsWith('/benefits')) return 'benefits'
    if (p.startsWith('/my')) return 'my'
    return ''
  }
  const activeKey = getActiveKey()
  const isAndroid = usePlatform() === 'android'

  // MD3 2025에서 기존 navigation bar는 deprecated되고 높이가 더 짧은
  // flexible navigation bar로 바뀌었다. 안드로이드는 짧은 높이를 쓴다.
  const NAV_HEIGHT = isAndroid ? '44px' : '49px'

  return (
    <div
      style={{
      // 08차 4번: 리퀴드글래스 제거 — 단색 배경 + 위쪽 그림자(shadow.nav)로 대체
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: layout.viewport,
      zIndex: 200,
      backgroundColor: colors.surface.card,
      boxShadow: shadow.nav,
      display: 'flex',
      alignItems: 'center',
      paddingTop: isAndroid ? spacing[1] : spacing[2],
      paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
    }}>
      <NavTab
        label="홈"
        icon={<Home size={24} strokeWidth={1.8} />}
        active={activeKey === 'home'}
        onClick={() => navigate('/')}
        height={NAV_HEIGHT}
        isAndroid={isAndroid}
      />
      <NavTab
        label="결제매장"
        icon={<Store size={24} strokeWidth={1.8} />}
        active={activeKey === 'merchant'}
        onClick={() => navigate('/store')}
        height={NAV_HEIGHT}
        isAndroid={isAndroid}
      />
      <NavTab
        label="이용내역"
        icon={<Receipt size={24} strokeWidth={1.8} />}
        active={activeKey === 'history'}
        onClick={() => navigate('/history')}
        height={NAV_HEIGHT}
        isAndroid={isAndroid}
      />
      <NavTab
        label="지원금과 혜택"
        icon={<Gift size={24} strokeWidth={1.8} />}
        active={activeKey === 'benefits'}
        onClick={() => navigate('/benefits')}
        height={NAV_HEIGHT}
        isAndroid={isAndroid}
      />
      <NavTab
        label="MY"
        icon={<User size={24} strokeWidth={1.8} />}
        active={activeKey === 'my'}
        onClick={() => navigate('/my')}
        height={NAV_HEIGHT}
        isAndroid={isAndroid}
      />
    </div>
  )
}

function NavTab({ label, icon, active, onClick, height, isAndroid }) {
  const sizes = useTypography()
  const color = active ? colors.primary[700] : colors.gray[400]
  // iOS HIG: 선택 탭은 채운 아이콘, 비선택은 외곽선으로 구분한다.
  // 색만으로 구분하면 색각 이상 사용자가 현재 위치를 읽지 못한다 (정적 단서 이중화).
  const iconEl = !isAndroid && active
    ? cloneElement(icon, { fill: color, fillOpacity: 0.18 })
    : icon
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        gap: '4px',
        minHeight: height,
        color,
      }}
    >
      <span style={{
        width: isAndroid ? '56px' : undefined,
        height: isAndroid ? '32px' : undefined,
        borderRadius: isAndroid ? md3Shape.full : undefined,
        backgroundColor: isAndroid && active ? colors.primary[100] : 'transparent',
        // A-3: 탭 전환은 하루에도 수십 번 반복한다. MD3 Expressive 기본 모션은
        // 오버슈트가 있지만 시니어에게 과하므로 짧은 감속만 남긴다. iOS는 즉시 전환.
        transition: isAndroid ? 'background-color 120ms cubic-bezier(0.23,1,0.32,1)' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
      }}>{iconEl}</span>
      <span style={{
        fontSize: sizes.nav,
        fontWeight: active ? typography.weight.medium : typography.weight.regular,
        color,
        fontFamily: typography.fontFamily,
        lineHeight: 1.2,
      }}>
        {label}
      </span>
    </button>
  )
}
