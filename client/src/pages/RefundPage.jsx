/**
 * RefundPage (C5)
 * 충전 내역 리스트 → 항목 선택 → 확인 다이얼로그 → refundTransaction(id)
 * Strategy: S2 — 환불 동등 위계
 * Nielsen: #1 visibility, #3 user control
 */

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useApp } from '../context/AppContext'
import { formatDate } from '../utils/date'
import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { useTypography } from '../hooks/useTypography'
import { usePlatform } from '../hooks/usePlatform'
import ScreenContainer from '../components/layout/ScreenContainer'
import BottomNavBar from '../components/layout/BottomNavBar'
import PaymentAuthOverlay from '../components/common/PaymentAuthOverlay'
import Button from '../components/common/Button'

export default function RefundPage() {
  const navigate = useNavigate()
  const sizes = useTypography()
  const { transactions, balance, refundTransaction } = useUser()
  const { isLargeText, showSnackbar } = useApp()
  const isAndroid = usePlatform() === 'android'
  const [confirmId, setConfirmId] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  // 큰글씨 모드: 본문/statusBar 회색 (surface.background)
  // 일반 모드: 흰색 (surface.card)
  const bodyBg = isLargeText ? colors.surface.background : colors.surface.card

  const chargeList = transactions.filter((t) => t.type === 'charge')

  const grouped = chargeList.reduce((acc, t) => {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}년 ${d.getMonth() + 1}월`
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const fmt = (n) => n.toLocaleString('ko-KR') + '원'
  const fmtDate = (iso) => formatDate(iso, { withTime: true })

  const handleRefund = (id) => {
    const tx = chargeList.find((t) => t.id === id)
    refundTransaction(id)
    if (tx) showSnackbar(`${tx.totalAmount.toLocaleString('ko-KR')}원 환불이 완료됐어요`)
    setConfirmId(null)
  }

  const confirmTarget = chargeList.find((t) => t.id === confirmId)

  const isRefundable = (chargeTx) => {
    if (chargeTx.refunded) return { ok: false, reason: '이미 환불됨' }
    if (balance <= 0) return { ok: false, reason: '잔액이 없습니다' }
    if (chargeTx.totalAmount > balance) return { ok: false, reason: '잔액 부족' }
    const chargeDate = new Date(chargeTx.date).getTime()
    const spentAfter = transactions
      .filter((t) => t.type === 'spend' && new Date(t.date).getTime() >= chargeDate)
      .reduce((sum, t) => sum + t.totalAmount, 0)
    const requiredRatio = chargeTx.totalAmount > 10000 ? 0.6 : 0.8
    if (spentAfter / chargeTx.totalAmount < requiredRatio) {
      return { ok: false, reason: `${Math.floor(requiredRatio * 100)}% 이상 사용 후 환불 가능` }
    }
    return { ok: true }
  }

  return (
    <ScreenContainer statusBarBg={bodyBg}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: `${spacing[3]} ${layout.margin}`,
        backgroundColor: colors.surface.card,
        borderBottom: `1px solid ${colors.gray[200]}`,
        minHeight: layout.topBarHeight,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} color={colors.gray[900]} />
        </button>
        <h1 style={{
          margin: 0,
          fontSize: sizes.lg,
          fontWeight: typography.weight.bold,
          color: colors.gray[900],
        }}>
          환불
        </h1>
      </div>

      <div style={{ padding: layout.margin, flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: bodyBg }}>
        {/* 현재 잔액 */}
        <div style={{
          backgroundColor: colors.surface.darkCard,
          borderRadius: layout.radiusCard,
          padding: spacing[5],
          marginBottom: spacing[5],
          boxShadow: shadow.button,
        }}>
          <p style={{ margin: 0, color: colors.onDark.secondary, fontSize: sizes.xs }}>
            현재 잔액
          </p>
          <p style={{
            margin: `${spacing[1]} 0 0 0`,
            color: colors.onDark.primary,
            fontSize: sizes.largeTitle,
            fontWeight: typography.weight.bold,
          }}>
            {fmt(balance)}
          </p>
        </div>

        <div style={{
          marginBottom: spacing[4],
          padding: spacing[4],
          backgroundColor: colors.primary[50],
          borderRadius: layout.radiusCard,
          fontSize: sizes.xs,
          color: colors.gray[700],
          lineHeight: 1.6,
        }}>
          <p style={{ fontWeight: typography.weight.semibold, margin: `0 0 ${spacing[2]} 0`, color: colors.primary[700] }}>
            환불 가능 조건
          </p>
          <p style={{ margin: `0 0 ${spacing[1]} 0` }}>• 충전 잔액 기준 일정 비율 이상 사용 시 환불 가능</p>
          <p style={{ margin: `0 0 ${spacing[1]} 0` }}>• 충전 금액 1만원 초과: 60% 이상 사용</p>
          <p style={{ margin: 0 }}>• 충전 금액 1만원 이하: 80% 이상 사용</p>
        </div>

        <h2 style={{
          margin: `0 0 ${spacing[3]} 0`,
          fontSize: sizes.md,
          fontWeight: typography.weight.semibold,
          color: colors.gray[900],
        }}>
          충전 내역
        </h2>

        {balance === 0 ? (
          <div style={{
            backgroundColor: colors.surface.card,
            borderRadius: layout.radiusCard,
            padding: spacing[8],
            textAlign: 'center',
          }}>
            <p style={{ color: colors.gray[700], fontWeight: typography.weight.semibold, margin: `0 0 ${spacing[2]} 0` }}>
              환불할 잔액이 없습니다
            </p>
            <p style={{ color: colors.gray[500], fontSize: sizes.xs, margin: 0 }}>
              충전 후 이용해보세요
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {Object.entries(grouped).map(([monthKey, items]) => (
              <div key={monthKey}>
                <div style={{
                  fontSize: sizes.xs,
                  fontWeight: typography.weight.semibold,
                  color: colors.gray[700],
                  paddingBottom: spacing[2],
                }}>
                  {monthKey}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                  {items.map((t) => {
                    const result = isRefundable(t)
                    return (
                    <div key={t.id} style={{
                      backgroundColor: colors.surface.card,
                      borderRadius: layout.radiusCard,
                      padding: spacing[4],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing[3],
                    }}>
                      <div>
                        <p style={{ margin: 0, fontSize: sizes.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
                          충전
                        </p>
                        <p style={{ margin: `${spacing[1]} 0 0 0`, fontSize: sizes.xs, color: colors.gray[500] }}>
                          {fmtDate(t.date)}
                        </p>
                        <p style={{ margin: `${spacing[1]} 0 0 0`, fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
                          {fmt(t.totalAmount)}
                        </p>
                      </div>
                      {result.ok ? (
                        <button
                          onClick={() => setConfirmId(t.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: `1px solid ${colors.primary[700]}`,
                            color: colors.primary[700],
                            borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                            padding: `${spacing[2]} ${spacing[4]}`,
                            fontSize: sizes.sm,
                            fontWeight: typography.weight.semibold,
                            cursor: 'pointer',
                            minHeight: layout.touchMin,
                            fontFamily: typography.fontFamily,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          환불
                        </button>
                      ) : (
                        <span style={{
                          fontSize: sizes.xs,
                          color: colors.gray[400],
                          whiteSpace: 'nowrap',
                          textAlign: 'right',
                          lineHeight: typography.lineHeight.normal,
                        }}>
                          {result.reason}
                        </span>
                      )}
                    </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 환불 확인 바텀 시트 */}
      {confirmTarget && (
        <>
          {/* 딤드 — 뷰포트 전체 */}
          <div
            onClick={() => setConfirmId(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 200,
            }}
          />
          {/* 시트 — 390px 제한 + 중앙 정렬 */}
          <div
            style={{
              position: 'fixed',
              left: '50%',
              bottom: 0,
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: layout.viewport,
              backgroundColor: colors.surface.card,
              borderTopLeftRadius: layout.radiusModal,
              borderTopRightRadius: layout.radiusModal,
              padding: `${spacing[5]} ${spacing[5]} 0`,
              paddingBottom: `calc(${spacing[6]} + env(safe-area-inset-bottom))`,
              fontFamily: typography.fontFamily,
              zIndex: 201,
            }}
          >
            {/* 핸들 바 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: spacing[5],
            }}>
              <div style={{
                width: '40px',
                height: '4px',
                borderRadius: layout.radiusPill,
                backgroundColor: colors.gray[300],
              }} />
            </div>

            {/* 타이틀 */}
            <h3 style={{
              margin: `0 0 ${spacing[2]}`,
              fontSize: sizes.lg,
              fontWeight: typography.weight.bold,
              color: colors.gray[900],
              textAlign: 'center',
              lineHeight: 1.4,
            }}>
              iM샵 계좌로<br />
              {fmt(confirmTarget.totalAmount)} 환불하시겠어요?
            </h3>

            {/* 서브 텍스트 */}
            <p style={{
              margin: `0 0 ${spacing[5]}`,
              fontSize: sizes.sm,
              color: colors.gray[500],
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              7일 이내 충전한 미사용 금액은 수수료 없이 환불할 수 있어요.
            </p>

            {/* 최종 환불 금액 박스 */}
            <div style={{
              backgroundColor: colors.surface.background,
              borderRadius: layout.radiusCard,
              padding: `${spacing[4]} ${spacing[4]}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing[4],
            }}>
              <span style={{ fontSize: sizes.sm, color: colors.gray[700] }}>
                최종 환불 금액
              </span>
              <span style={{
                fontSize: sizes.md,
                fontWeight: typography.weight.bold,
                color: colors.gray[900],
              }}>
                {fmt(confirmTarget.totalAmount)}
              </span>
            </div>

            {/* 경고 메시지 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              marginBottom: spacing[5],
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: colors.error,
                color: colors.onDark.primary,
                fontSize: '11px',
                fontWeight: typography.weight.bold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                !
              </div>
              <span style={{
                fontSize: sizes.xs,
                color: colors.error,
              }}>
                신청 후에는 취소할 수 없습니다.
              </span>
            </div>

            {/* 버튼 2개 */}
            <div style={{ display: 'flex', gap: spacing[2] }}>
              <Button
                variant="text"
                size="lg"
                fullWidth={false}
                style={{ flex: 1, backgroundColor: colors.gray[100], color: colors.gray[700] }}
                onClick={() => setConfirmId(null)}
              >
                다음에 하기
              </Button>
              <Button
                variant="filled"
                size="lg"
                fullWidth={false}
                style={{ flex: 1.5 }}
                onClick={() => setShowAuth(true)}
              >
                신청하기
              </Button>
            </div>
          </div>
        </>
      )}

      <BottomNavBar />

      <PaymentAuthOverlay
        open={showAuth}
        onComplete={() => {
          setShowAuth(false)
          if (confirmTarget) handleRefund(confirmTarget.id)
        }}
        onCancel={() => setShowAuth(false)}
      />
    </ScreenContainer>
  )
}
