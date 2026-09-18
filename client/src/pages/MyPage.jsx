/**
 * MyPage — 토스 톤 재설계
 * 프로필 카드 + 5그룹 메뉴 + 앱 버전 + 로그아웃
 * 시니어 부적합 항목 제거
 */

import { CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useUser } from '../context/UserContext'
import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { useTypography } from '../hooks/useTypography'
import ScreenContainer from '../components/layout/ScreenContainer'
import BottomNavBar from '../components/layout/BottomNavBar'
import MyMenuGroup from '../components/mypage/MyMenuGroup'
import Button from '../components/common/Button'

const USER_PROFILE = {
  name: '김초당',
  email: 'chodang@example.com',
  phone: '010-0000-0000',
}

const ACCOUNT_BANK = '지역농협'
const ACCOUNT_NUMBER = '351-06****-**-***'

function maskEmail(email) {
  const [local, domain] = email.split('@')
  return `${local[0]}***@${domain}`
}

function maskPhone(phone) {
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-$2-****')
}

export default function MyPage() {
  const sizes = useTypography()
  const { isLargeText, toggleLargeText } = useApp()
  const { hasCard } = useUser()

  const initial = USER_PROFILE.name.charAt(0)

  const groups = [
    {
      title: '내 카드',
      items: [
        { label: '카드 관리', href: '/card-management' },
        hasCard
          ? { label: '카드 배송 현황', disabled: true, labelColor: colors.gray[900], value: '배송 완료', valueColor: colors.success }
          : { label: '카드 배송 현황', disabled: true, labelColor: colors.gray[900], value: '배송 중', valueColor: colors.gray[400] },
        { label: '주 카드 변경' },
        { label: '분실신고 / 재발급', href: '/card-lost' },
      ],
    },
    {
      title: '회원정보',
      items: [
        { label: '회원 정보 변경' },
        { label: '비밀번호 변경' },
        { label: '본인확인 정보' },
      ],
    },
    {
      title: '고객지원',
      items: [
        { label: '고객센터', href: '/customer-center' },
        { label: '자주 묻는 질문', href: '/customer-center' },
        { label: '공지사항' },
        { label: '이용약관', href: '/terms' },
      ],
    },
    {
      title: '설정',
      items: [
        // 수정 5: /notification(알림 목록) → /settings(알림 토글 있는 곳)
        { label: '알림 설정', href: '/settings' },
        { label: '언어 설정', value: '한국어', href: '/settings' },
        { label: '큰글씨 모드', value: isLargeText ? '켜짐' : '꺼짐', onClick: toggleLargeText },
      ],
    },
    {
      title: '가맹점 신청',
      items: [
        { label: '가맹점 신청 / 관리', href: '/merchant-apply' },
      ],
    },
  ]

  return (
    <ScreenContainer statusBarBg={colors.surface.background}>
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: colors.surface.background,
      }}>
        {/* 프로필 카드 */}
        <div style={{
          margin: layout.margin,
          padding: spacing[5],
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          boxShadow: shadow.card,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
        }}>
          {/* 아바타 이니셜 */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: layout.radiusPill,
            backgroundColor: colors.primary[100],
            color: colors.primary[700],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: sizes.xl,
            fontWeight: typography.weight.bold,
            flexShrink: 0,
            fontFamily: typography.fontFamily,
          }}>
            {initial}
          </div>

          {/* 이름 + 마스킹 이메일/전화 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: sizes.lg,
              fontWeight: typography.weight.bold,
              color: colors.gray[900],
              marginBottom: spacing[1],
              fontFamily: typography.fontFamily,
            }}>
              {USER_PROFILE.name}
            </div>
            <div style={{
              fontSize: sizes.sm,
              color: colors.gray[500],
              lineHeight: 1.5,
              fontFamily: typography.fontFamily,
            }}>
              {maskEmail(USER_PROFILE.email)}<br />
              {maskPhone(USER_PROFILE.phone)}
            </div>
          </div>

          {/* 편집 버튼 */}
          <button
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: 'transparent',
              border: `1px solid ${colors.gray[200]}`,
              borderRadius: layout.radiusPill,
              fontSize: sizes.xs,
              color: colors.gray[700],
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              flexShrink: 0,
            }}
          >
            편집
          </button>
        </div>

        {/* 계좌 정보 */}
        <div style={{
          margin: `0 ${layout.margin} ${layout.margin}`,
          padding: spacing[5],
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          boxShadow: shadow.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontSize: sizes.xs,
              color: colors.gray[500],
              fontFamily: typography.fontFamily,
              marginBottom: spacing[1],
            }}>
              {ACCOUNT_BANK}
            </div>
            <div style={{
              fontSize: sizes.md,
              fontWeight: typography.weight.semibold,
              color: colors.gray[900],
              fontFamily: typography.fontFamily,
            }}>
              {ACCOUNT_NUMBER}
            </div>
          </div>
          <button
            disabled
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: 'transparent',
              border: `1px solid ${colors.gray[200]}`,
              borderRadius: layout.radiusPill,
              fontSize: sizes.xs,
              color: colors.gray[300],
              cursor: 'default',
              fontFamily: typography.fontFamily,
            }}
          >
            변경
          </button>
        </div>

        {/* 메뉴 5그룹 */}
        {groups.map((g) => (
          <MyMenuGroup key={g.title} title={g.title} items={g.items} />
        ))}

        {/* 앱 버전 정보 */}
        <div style={{
          marginTop: spacing[3],
          padding: spacing[5],
          textAlign: 'center',
          backgroundColor: colors.surface.card,
          borderTop: `1px solid ${colors.gray[100]}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            marginBottom: spacing[1],
          }}>
            <span style={{
              fontSize: sizes.sm,
              color: colors.gray[700],
              fontFamily: typography.fontFamily,
            }}>
              앱 버전 v1.0.0
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} color={colors.success} />
              <span style={{
                fontSize: sizes.xs,
                color: colors.success,
                fontWeight: typography.weight.medium,
                fontFamily: typography.fontFamily,
              }}>
                최신
              </span>
            </div>
          </div>
          <div style={{
            fontSize: sizes.xs,
            color: colors.gray[500],
            fontFamily: typography.fontFamily,
          }}>
            최신 버전을 사용 중이에요
          </div>
        </div>

        {/* 로그아웃 */}
        <Button variant="text" onClick={() => alert('로그아웃')}>
          로그아웃
        </Button>

        {/* 하단 여백 — BottomNavBar 위 공간 확보 */}
        <div style={{ height: spacing[8] }} />
      </div>

      <BottomNavBar />
    </ScreenContainer>
  )
}
