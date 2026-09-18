import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, layout, typography, shadow } from '../tokens/tokens'
import { usePlatform } from '../hooks/usePlatform'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'

export default function CardLostPage() {
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const isAndroid = usePlatform() === 'android'

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="분실신고/재발급" onBack={() => navigate(-1)} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '24px',
          backgroundColor: colors.surface.background,
          padding: layout.margin,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!isSubmitted ? (
          <>
            {/* 안내 카드 */}
            <div
              style={{
                backgroundColor: colors.surface.card,
                borderRadius: layout.radiusCard,
                padding: '24px 20px',
                boxShadow: shadow.card,
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: colors.alertBg,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 8v9" stroke={colors.error} strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="16" cy="22" r="1.5" fill={colors.error} />
                  <path d="M13.5 4a3 3 0 015 0l9.5 16.5A3 3 0 0125.5 26h-19a3 3 0 01-2.5-5.5L13.5 4z" stroke={colors.error} strokeWidth="2" />
                </svg>
              </div>
              <p
                style={{
                  fontSize: typography.size.md,
                  fontWeight: typography.weight.bold,
                  color: colors.gray[900],
                  margin: '0 0 8px',
                  textAlign: 'center',
                }}
              >
                카드 분실신고
              </p>
              <p
                style={{
                  fontSize: typography.size.sm,
                  color: colors.gray[500],
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.6,
                }}
              >
                분실신고 접수 시 해당 카드의 사용이 즉시 정지됩니다.
                신고 후 재발급 카드가 배송됩니다 (영업일 기준 3~5일).
              </p>
            </div>

            {/* 주의사항 */}
            <div
              style={{
                backgroundColor: colors.warmBg,
                borderRadius: layout.radiusCard,
                padding: '16px',
                marginBottom: '24px',
                border: `1px solid ${colors.warmBorder}`,
              }}
            >
              <p
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.semibold,
                  color: colors.warnDark,
                  margin: '0 0 8px',
                }}
              >
                신고 전 확인해주세요
              </p>
              <ul
                style={{
                  margin: 0,
                  padding: '0 0 0 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {[
                  '분실신고 후 카드 사용이 즉시 중단됩니다',
                  '재발급 카드 수령 시까지 앱 결제는 가능합니다',
                  '분실 카드 발견 시 즉시 고객센터에 연락하세요',
                  '재발급 수수료: 무료 (연 1회)',
                ].map((note, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: typography.size.xs,
                      color: colors.tag.noticeText,
                      lineHeight: 1.5,
                    }}
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* 신고하기 버튼 */}
            <button
              onClick={() => setIsSubmitted(true)}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: colors.error,
                border: 'none',
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                color: colors.surface.card,
                fontSize: typography.size.md,
                fontWeight: typography.weight.semibold,
                cursor: 'pointer',
              }}
            >
              분실신고 하기
            </button>
          </>
        ) : (
          /* 완료 상태 */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '60px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: colors.successBg,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" fill={colors.success} opacity="0.15" />
                <path d="M13 20l5 5 9-10" stroke={colors.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p
              style={{
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                color: colors.gray[900],
                margin: '0 0 8px',
                textAlign: 'center',
              }}
            >
              분실신고가 접수되었습니다
            </p>
            <p
              style={{
                fontSize: typography.size.sm,
                color: colors.gray[500],
                margin: 0,
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              카드 사용이 즉시 정지되었습니다.{'\n'}
              재발급 카드가 영업일 기준 3~5일 내로 배송됩니다.
            </p>

            <button
              onClick={() => navigate(-1)}
              style={{
                marginTop: '40px',
                padding: '14px 40px',
                backgroundColor: colors.primary[700],
                border: 'none',
                borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                color: colors.surface.card,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </ScreenContainer>
  )
}
