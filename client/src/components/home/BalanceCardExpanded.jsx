/**
 * BalanceCardExpanded — 한 다크 카드 (잔액 + 캐시백 + 토글 + 3버튼)
 * 큰글씨 모드(HomePageLarge)는 잔액/캐시백 분리 구조, 일반 모드는 한 카드 통합 구조 유지
 * 자동/수동 토글: 글래스 톤 + 활성 시 체크 아이콘 (대비 강화)
 * Strategy: S1, S3 | Nielsen: #1, #3, #7 | Shneiderman: #7
 */

import { useNavigate } from 'react-router-dom'
import { useUser, MONTHLY_DISCOUNT_LIMIT } from '../../context/UserContext'
// 08차 9번: "캐시백 0원" 줄 제거 — 이 카드 안 "이번 달 할인충전" 위젯이 이미 그 역할을 한다
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import { usePlatform } from '../../hooks/usePlatform'

// 전사.md S08/S17: 대구로페이 카드는 빨간색. 잔액 위젯에서 어떤 카드의 잔액인지 바로 보이게 한다
function CardThumb() {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect width="44" height="28" rx="5" fill={colors.error} />
      <rect x="6" y="9" width="11" height="8" rx="2" fill={colors.illustration.cardChip} />
      <rect x="6" y="21" width="18" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
    </svg>
  )
}

export default function BalanceCardExpanded({
  chargeButtonRef,
  refundButtonRef,
}) {
  const navigate = useNavigate()
  const { balance, monthlyDiscountCharged } = useUser()
  const isAndroid = usePlatform() === 'android'

  const fmt = (n) => n.toLocaleString('ko-KR') + '원'

  const glassBtn = {
    flex: 1,
    height: '48px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
    color: colors.onDark.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
  }

  return (
    <div style={{ margin: layout.margin }}>
      <div
        style={{
          backgroundColor: colors.surface.darkCard,
          borderRadius: layout.radiusCard,
          padding: spacing[4],
          boxShadow: shadow.button,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 잔액 표시 — iM샵 + 캐시백 별도 줄 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[2],
          marginBottom: spacing[3],
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              fontSize: typography.size.sm,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: typography.weight.medium,
            }}>
              <CardThumb />
              대구로페이
            </span>
            <span style={{
              fontSize: typography.size.largeTitle,
              color: colors.onDark.primary,
              fontWeight: typography.weight.bold,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}>
              {fmt(balance)}
            </span>
          </div>
        </div>

        {/* 06차 1번: 캐시백 자동/수동 토글 → 이번 달 할인충전 한도 진행률로 교체.
            iM샵 실측(전사.md S09 "월충전한도 300,000")을 그대로 쓴다. 이 한도를 넘기면
            ChargeScreen이 AI 개입(할인없이충전 유도)을 띄운다 — 그 배경을 여기서 미리 보여준다. */}
        {(() => {
          const progressPct = Math.min(100, (monthlyDiscountCharged / MONTHLY_DISCOUNT_LIMIT) * 100)
          return (
            <div style={{
              marginTop: spacing[3],
              marginBottom: spacing[4],
              padding: spacing[4],
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
            }}>
              {/* 1줄: 라벨 + % */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing[2],
              }}>
                <span style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.semibold,
                  color: colors.gray[900],
                }}>
                  이번 달 할인충전
                </span>
                <span style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: colors.primary[700],
                }}>
                  {Math.round(progressPct)}%
                </span>
              </div>

              {/* 2줄: 진행바 (인디고) */}
              <div style={{
                height: 6,
                backgroundColor: colors.gray[100],
                borderRadius: layout.radiusPill,
                overflow: 'hidden',
                marginBottom: spacing[2],
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  backgroundColor: colors.primary[700],
                  transition: 'width 280ms cubic-bezier(0.23,1,0.32,1)',
                }} />
              </div>

              {/* 3줄: 금액 정보 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: typography.size.xs,
              }}>
                <span style={{ color: colors.gray[500] }}>
                  사용액
                </span>
                <span style={{
                  color: colors.gray[900],
                  fontWeight: typography.weight.medium,
                }}>
                  {monthlyDiscountCharged.toLocaleString('ko-KR')}원 / {MONTHLY_DISCOUNT_LIMIT.toLocaleString('ko-KR')}원
                </span>
              </div>

              {/* 한도를 넘기면 실제로 무슨 일이 생기는지 설명 — ChargeScreen의 AI 개입과 같은 문구 톤 */}
              <p style={{
                margin: `${spacing[2]} 0 0`,
                fontSize: typography.size.xxs,
                color: colors.gray[500],
              }}>
                한도를 넘으면 할인 없이 충전해요
              </p>
            </div>
          )
        })()}

        {/* 충전 / 환불 / QR결제 — 글래스 톤 통일 */}
        <div style={{
          display: 'flex',
          gap: spacing[2],
          paddingTop: spacing[3],
          borderTop: '1px solid rgba(255,255,255,0.15)',
        }}>
          <button ref={chargeButtonRef} onClick={() => navigate('/charge')} style={glassBtn}>
            충전
          </button>
          <button ref={refundButtonRef} onClick={() => navigate('/refund')} style={glassBtn}>
            환불
          </button>
          <button onClick={() => navigate('/qr')} style={glassBtn}>
            QR결제
          </button>
        </div>
      </div>
    </div>
  )
}
