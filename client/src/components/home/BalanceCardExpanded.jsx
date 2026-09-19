/**
 * BalanceCardExpanded — 한 다크 카드 (잔액 + 캐시백 + 토글 + 3버튼)
 * 큰글씨 모드(HomePageLarge)는 잔액/캐시백 분리 구조, 일반 모드는 한 카드 통합 구조 유지
 * 자동/수동 토글: 글래스 톤 + 활성 시 체크 아이콘 (대비 강화)
 * Strategy: S1, S3 | Nielsen: #1, #3, #7 | Shneiderman: #7
 */

import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import { usePlatform } from '../../hooks/usePlatform'

export default function BalanceCardExpanded({
  chargeButtonRef,
  refundButtonRef,
}) {
  const navigate = useNavigate()
  const { balance, cashbackBalance, cashbackMode, setCashbackMode, monthlyAccumulated } = useUser()
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
            alignItems: 'baseline',
          }}>
            <span style={{
              fontSize: typography.size.sm,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: typography.weight.medium,
            }}>
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

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}>
            <span style={{
              fontSize: typography.size.sm,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: typography.weight.medium,
            }}>
              캐시백
            </span>
            <span style={{
              fontSize: typography.size.xl,
              color: colors.teal[400],
              fontWeight: typography.weight.bold,
            }}>
              {fmt(cashbackBalance)}
            </span>
          </div>

          {/* 04차 D-2: 잔액과 캐시백의 관계를 설명 없이 병렬로만 보여주던 문제 — 한 줄 설명 추가 */}
          <p style={{
            margin: 0,
            fontSize: typography.size.xxs,
            color: 'rgba(255,255,255,0.55)',
          }}>
            캐시백은 잔액과 별도로 결제에 쓸 수 있는 돈이에요
          </p>
        </div>

        {/* 캐시백 통합 박스 — 흰 배경 + 민트 진행바 + 토글 */}
        {(() => {
          const progressPct = Math.min(100, (monthlyAccumulated / 30000) * 100)
          const modeBtn = (active) => ({
            flex: 1,
            height: 48,
            backgroundColor: active ? colors.primary[700] : colors.surface.card,
            border: `2px solid ${active ? colors.primary[700] : colors.gray[200]}`,
            color: active ? colors.onDark.primary : colors.gray[500],
            borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[1],
            transition: 'background-color 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out',
          })
          return (
            <div style={{
              marginTop: spacing[3],
              marginBottom: spacing[4],
              padding: spacing[4],
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
            }}>
              {/* 1줄: 캐시백 라벨 + % */}
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
                  캐시백
                </span>
                <span style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: colors.teal[500],
                }}>
                  {Math.round(progressPct)}%
                </span>
              </div>

              {/* 2줄: 진행바 (민트) */}
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
                  backgroundColor: colors.teal[500],
                  transition: 'width 280ms cubic-bezier(0.23,1,0.32,1)',
                }} />
              </div>

              {/* 3줄: 금액 정보 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: typography.size.xs,
                marginBottom: spacing[4],
              }}>
                <span style={{ color: colors.gray[500] }}>
                  이번달 적립
                </span>
                <span style={{
                  color: colors.gray[900],
                  fontWeight: typography.weight.medium,
                }}>
                  {monthlyAccumulated.toLocaleString('ko-KR')}원 / 30,000원
                </span>
              </div>

              {/* 4줄: 구분선 */}
              <div style={{
                height: 1,
                backgroundColor: colors.gray[100],
                marginBottom: spacing[3],
              }} />

              {/* 5줄: 자동/수동 토글 */}
              <div style={{ display: 'flex', gap: spacing[2] }}>
                <button onClick={() => setCashbackMode('auto')} style={modeBtn(cashbackMode === 'auto')}>
                  {cashbackMode === 'auto' && <Check size={14} />}
                  자동 충전
                </button>
                <button onClick={() => setCashbackMode('manual')} style={modeBtn(cashbackMode === 'manual')}>
                  {cashbackMode === 'manual' && <Check size={14} />}
                  수동 사용
                </button>
              </div>

              {/* 04차 D-2: 두 모드가 무엇을 바꾸는지 설명이 없던 문제 — 실제 동작 그대로 한 줄 설명 */}
              <p style={{
                margin: `${spacing[2]} 0 0`,
                fontSize: typography.size.xxs,
                color: colors.gray[500],
              }}>
                {cashbackMode === 'auto'
                  ? '결제할 때 캐시백을 자동으로 먼저 써요'
                  : '결제할 때 잔액만 쓰고 캐시백은 남겨둬요'}
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
