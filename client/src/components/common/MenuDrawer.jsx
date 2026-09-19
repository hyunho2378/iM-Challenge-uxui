import { useNavigate } from 'react-router-dom'
import {
  User,
  HeadphonesIcon,
  Settings,
  Bell,
  RefreshCw,
  BookOpen,
  Store,
  Package,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  Gift,
  Tag,
  Megaphone,
  FileText,
  Share2,
  X,
  ChevronRight,
} from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const MENU_ITEMS = [
  { label: '내 정보', icon: User, path: '/myinfo' },
  { label: '고객센터', icon: HeadphonesIcon, path: '/support' },
  { label: '설정', icon: Settings, path: '/settings' },
  { label: '알림', icon: Bell, path: '/notifications' },
  { label: '연결계좌 변경', icon: RefreshCw, path: '/account-change' },
  { label: '앱 사용 가이드', icon: BookOpen, path: '/usage-guide' },
  { label: '가맹점 등록', icon: Store, path: '/merchant-register', tag: 'B2B' },
  { label: '카드 배송 현황', icon: Package, path: '/card-delivery' },
  { label: '주카드/잔액 변경', icon: CreditCard, path: '/card-manage' },
  { label: '분실신고/재발급', icon: AlertTriangle, path: '/card-lost' },
  { label: '환불(출금) 신청', icon: RotateCcw, path: '/refund' },
  { label: '내가 받은 혜택 보기', icon: Gift, path: '/benefits' },
  { label: '내 쿠폰', icon: Tag, path: '/coupons' },
  { label: '공지사항', icon: Megaphone, path: '/announcements' },
  { label: '이용약관', icon: FileText, path: '/terms' },
  { label: '지인에게 소개하기', icon: Share2, path: '/invite' },
]

export default function MenuDrawer({ isOpen, onClose }) {
  const navigate = useNavigate()

  const handleNav = (path) => {
    navigate(path)
    onClose && onClose()
  }

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          onClick={onClose}
         
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: colors.surface.overlay,
            zIndex: 900,
          }}
        />
      )}

      {/* 드로어 패널 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '280px',
          height: '100dvh',
          backgroundColor: colors.surface.card,
          zIndex: 1000,
          boxShadow: shadow.modal,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
          overflowY: 'auto',
        }}
      >
        {/* 상단 헤더 */}
        <div
          style={{
            backgroundColor: colors.primary[700],
            padding: `${spacing[10]} ${spacing[4]} ${spacing[5]}`,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: spacing[4],
              right: spacing[4],
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: spacing[1],
              color: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={22} color="rgba(255,255,255,0.8)" />
          </button>

          {/* 사용자 아바타 */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing[3],
            }}
          >
            <User size={26} color={colors.onDark.primary} />
          </div>

          {/* 사용자 정보 */}
          <p
            style={{
              margin: `0 0 2px 0`,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.onDark.primary,
            }}
          >
            김민서
          </p>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.xs,
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            minseo@example.com
          </p>
        </div>

        {/* 메뉴 리스트 */}
        <div style={{ flex: 1, paddingBottom: spacing[6] }}>
          {MENU_ITEMS.map((item, idx) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing[4]} ${spacing[4]}`,
                  background: 'none',
                  border: 'none',
                  borderBottom: `1px solid ${colors.gray[100]}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                  {/* 아이콘 컨테이너 */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: layout.radiusSmall,
                      backgroundColor: colors.gray[50],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={colors.primary[700]} strokeWidth={1.8} />
                  </div>

                  <span
                    style={{
                      fontSize: typography.size.sm,
                      fontWeight: typography.weight.regular,
                      color: colors.gray[900],
                    }}
                  >
                    {item.label}
                  </span>

                  {item.tag && (
                    <span
                      style={{
                        fontSize: typography.size.xxs,
                        fontWeight: typography.weight.semibold,
                        color: colors.primary[700],
                        backgroundColor: colors.primary[100],
                        borderRadius: layout.radiusPill,
                        paddingTop: '2px',
                        paddingBottom: '2px',
                        paddingLeft: spacing[1],
                        paddingRight: spacing[1],
                        lineHeight: 1,
                      }}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>

                <ChevronRight size={16} color={colors.gray[400]} strokeWidth={1.8} />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
