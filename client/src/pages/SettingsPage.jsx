import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, layout, typography, shadow } from '../tokens/tokens'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import SettingsToggleRow from '../components/common/SettingsToggleRow'

export default function SettingsPage() {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState(true)
  const [marketingNotif, setMarketingNotif] = useState(false)

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="설정" onBack={() => navigate(-1)} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '24px',
          backgroundColor: colors.surface.background,
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


      </div>

    </ScreenContainer>
  )
}
