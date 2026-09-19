import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, layout, typography, spacing, shadow } from '../tokens/tokens'
import { useUser } from '../context/UserContext'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import BottomSheet from '../components/common/BottomSheet'
import Button from '../components/common/Button'
import SettingsToggleRow from '../components/common/SettingsToggleRow'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { resetDemo } = useUser()

  const [notifications, setNotifications] = useState(true)
  const [marketingNotif, setMarketingNotif] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="설정" onBack={() => navigate(-1)} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '24px',
          backgroundColor: colors.surface.background,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 알림 설정 그룹 */}
        <div
          style={{
            backgroundColor: colors.surface.card,
            margin: `${layout.margin} ${layout.margin} 0`,
            borderRadius: layout.radiusCard,
            overflow: 'hidden',
            boxShadow: shadow.card,
            flexShrink: 0,
          }}
        >
          <SettingsToggleRow
            label="알림 설정"
            description="결제, 충전 등 주요 알림"
            value={notifications}
            onChange={setNotifications}
          />
          <div style={{ height: '1px', backgroundColor: colors.gray[100], margin: `0 ${layout.margin}` }} />
          <SettingsToggleRow
            label="마케팅 알림"
            description="이벤트, 혜택 정보 알림"
            value={marketingNotif}
            onChange={setMarketingNotif}
          />
        </div>

        {/* 시연용: 카드 신청 상태를 지우고 처음부터 다시 시작한다 */}
        <div style={{ marginTop: 'auto', padding: `${spacing[8]} ${layout.margin} 0` }}>
          <Button variant="outlined" size="lg" onClick={() => setConfirmingReset(true)}>
            데모 초기화
          </Button>
          <p style={{
            margin: `${spacing[2]} 0 0`,
            fontSize: typography.size.xs,
            color: colors.gray[500],
            textAlign: 'center',
          }}>
            카드 신청 상태를 지우고 앱을 처음부터 다시 시작해요
          </p>
        </div>
      </div>

      <BottomSheet isOpen={confirmingReset} onClose={() => setConfirmingReset(false)} title="데모 초기화">
        <div style={{ padding: `${spacing[4]} ${layout.margin} 0` }}>
          <p style={{
            margin: `0 0 ${spacing[5]}`,
            fontSize: typography.size.sm,
            color: colors.gray[700],
            lineHeight: 1.6,
          }}>
            카드 신청 상태를 지우고 앱을 처음 화면부터 다시 시작해요. 초기화할까요?
          </p>
          <div style={{ display: 'flex', gap: spacing[2] }}>
            <Button
              variant="text"
              size="lg"
              fullWidth={false}
              style={{ flex: 1, backgroundColor: colors.gray[100], color: colors.gray[700] }}
              onClick={() => setConfirmingReset(false)}
            >
              취소
            </Button>
            <Button variant="filled" size="lg" fullWidth={false} style={{ flex: 1.5 }} onClick={resetDemo}>
              초기화
            </Button>
          </div>
        </div>
      </BottomSheet>
    </ScreenContainer>
  )
}
