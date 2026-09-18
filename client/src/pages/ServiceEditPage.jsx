import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, layout, typography, shadow } from '../tokens/tokens'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import Button from '../components/common/Button'

const allServices = [
  { id: 'qr', label: 'QR 결제', icon: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="2" width="8" height="8" rx="1.5" stroke={colors.primary[700]} strokeWidth="1.5" />
      <rect x="12" y="2" width="8" height="8" rx="1.5" stroke={colors.primary[700]} strokeWidth="1.5" />
      <rect x="2" y="12" width="8" height="8" rx="1.5" stroke={colors.primary[700]} strokeWidth="1.5" />
      <rect x="12" y="12" width="4" height="4" rx="0.5" fill={colors.primary[700]} />
      <rect x="18" y="12" width="2" height="2" fill={colors.primary[700]} />
      <rect x="12" y="18" width="2" height="2" fill={colors.primary[700]} />
      <rect x="16" y="16" width="4" height="4" rx="0.5" fill={colors.primary[700]} />
    </svg>
  )},
  { id: 'charge', label: '충전', icon: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8.5" stroke={colors.primary[700]} strokeWidth="1.5" />
      <path d="M11 6v10M8 9h5l-2 3h3" stroke={colors.primary[700]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )},
  { id: 'cashback', label: '캐시백', icon: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8.5" stroke={colors.teal[500]} strokeWidth="1.5" />
      <path d="M11 6v10M9 8h3.5a1.5 1.5 0 010 3H9" stroke={colors.teal[500]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )},
  { id: 'history', label: '이용내역', icon: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 4h14v14H4V4z" stroke={colors.gray[700]} strokeWidth="1.5" rx="2" />
      <path d="M7 8h8M7 12h6M7 16h4" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )},
  { id: 'store', label: '매장 찾기', icon: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="10" cy="10" r="6" stroke={colors.gray[700]} strokeWidth="1.5" />
      <path d="M15 15l4 4" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )},
  { id: 'support', label: '지원금', icon: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke={colors.warning} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )},
  { id: 'coupon', label: '쿠폰', icon: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="7" width="18" height="9" rx="2" stroke={colors.gray[700]} strokeWidth="1.5" />
      <path d="M14 7V6a1 1 0 00-1-1H9a1 1 0 00-1 1v1" stroke={colors.gray[700]} strokeWidth="1.5" />
      <path d="M6 11h10M6 13.5h6" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )},
  { id: 'donation', label: '기부', icon: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 7c-1.5 0-3 1.3-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.5-3-3-3z" stroke={colors.error} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )},
]

const defaultActive = ['qr', 'charge', 'cashback', 'history']

export default function ServiceEditPage() {
  const navigate = useNavigate()
  const [activeServices, setActiveServices] = useState(defaultActive)

  const handleRemove = (id) => {
    setActiveServices((prev) => prev.filter((s) => s !== id))
  }

  const handleAdd = (id) => {
    if (activeServices.length < 6) {
      setActiveServices((prev) => [...prev, id])
    }
  }

  const handleSave = () => {
    navigate(-1)
  }

  const inactiveServices = allServices.filter((s) => !activeServices.includes(s.id))

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="서비스 바로가기 편집" onBack={() => navigate(-1)} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '100px',
          backgroundColor: colors.surface.background,
        }}
      >
        {/* 현재 바로가기 */}
        <div style={{ padding: `16px ${layout.margin} 0` }}>
          <p
            style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.semibold,
              color: colors.gray[500],
              margin: '0 0 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            현재 바로가기 ({activeServices.length}/6)
          </p>
          <div
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
              overflow: 'hidden',
              boxShadow: shadow.card,
            }}
          >
            {activeServices.map((id, index) => {
              const service = allServices.find((s) => s.id === id)
              if (!service) return null
              return (
                <div key={id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      gap: '12px',
                    }}
                  >
                    {/* 드래그 핸들 */}
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M3 5h12M3 9h12M3 13h12" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>

                    {/* 아이콘 */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: colors.gray[100],
                        borderRadius: layout.radiusSmall,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {service.icon}
                    </div>

                    {/* 이름 */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: typography.size.sm,
                        fontWeight: typography.weight.medium,
                        color: colors.gray[900],
                      }}
                    >
                      {service.label}
                    </span>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemove(id)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: colors.error,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M4 4l6 6M10 4l-6 6" stroke={colors.onDark.primary} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {index < activeServices.length - 1 && (
                    <div style={{ height: '1px', backgroundColor: colors.gray[100], margin: `0 ${layout.margin}` }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 추가 가능한 서비스 */}
        {inactiveServices.length > 0 && (
          <div style={{ padding: `16px ${layout.margin} 0` }}>
            <p
              style={{
                fontSize: typography.size.xs,
                fontWeight: typography.weight.semibold,
                color: colors.gray[500],
                margin: '0 0 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              추가 가능한 서비스
            </p>
            <div
              style={{
                backgroundColor: colors.surface.card,
                borderRadius: layout.radiusCard,
                overflow: 'hidden',
                boxShadow: shadow.card,
              }}
            >
              {inactiveServices.map((service, index) => (
                <div key={service.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      gap: '12px',
                    }}
                  >
                    <div style={{ width: '18px', flexShrink: 0 }} />
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: colors.gray[100],
                        borderRadius: layout.radiusSmall,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        opacity: 0.5,
                      }}
                    >
                      {service.icon}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        fontSize: typography.size.sm,
                        fontWeight: typography.weight.medium,
                        color: colors.gray[500],
                      }}
                    >
                      {service.label}
                    </span>
                    <button
                      onClick={() => handleAdd(service.id)}
                      disabled={activeServices.length >= 6}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: activeServices.length >= 6 ? colors.gray[200] : colors.primary[700],
                        border: 'none',
                        cursor: activeServices.length >= 6 ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 3v8M3 7h8" stroke={colors.onDark.primary} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {index < inactiveServices.length - 1 && (
                    <div style={{ height: '1px', backgroundColor: colors.gray[100], margin: `0 ${layout.margin}` }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 저장 버튼 */}
      <div
        style={{
          padding: `12px ${layout.margin} 24px`,
          backgroundColor: colors.surface.card,
          borderTop: `1px solid ${colors.gray[200]}`,
          flexShrink: 0,
        }}
      >
        <Button variant="filled" size="lg" onClick={handleSave}>
          저장
        </Button>
      </div>
    </ScreenContainer>
  )
}
