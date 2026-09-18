// usage-guide/RefundMini.jsx
// 환불 화면 스냅샷 (RefundPage 복제, useUser/useApp/PaymentAuthOverlay 제거)
// mock 충전내역 주입한 정상 화면. step prop으로 리스트/확인시트 전환.

import { ChevronLeft } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const sizes = {
    largeTitle: typography.size.largeTitle, lg: typography.size.lg, md: typography.size.md,
    sm: typography.size.sm, xs: typography.size.xs, xxs: typography.size.xxs,
}

const MOCK_CHARGES = [
    { id: 1, date: '2026년 5월 20일 14:32', amount: 50000, refundable: true },
    { id: 2, date: '2026년 5월 12일 09:15', amount: 30000, refundable: false, reason: '60% 이상 사용 후 환불 가능' },
]

const fmt = (n) => n.toLocaleString('ko-KR') + '원'

// props: { step = 'list', balance = 112671 }  ('list' | 'confirm')
export default function RefundMini({ step = 'list', balance = 112671 }) {
    return (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface.card, fontFamily: typography.fontFamily, position: 'relative' }}>
            {/* 헤더 */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: spacing[3], padding: `${spacing[3]} ${layout.margin}`,
                backgroundColor: colors.surface.card, borderBottom: `1px solid ${colors.gray[200]}`, minHeight: layout.topBarHeight,
            }}>
                <ChevronLeft size={24} color={colors.gray[900]} />
                <span style={{ margin: 0, fontSize: sizes.lg, fontWeight: typography.weight.bold, color: colors.gray[900] }}>환불</span>
            </div>

            <div style={{ padding: layout.margin, flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: colors.surface.card }}>
                {/* 현재 잔액 */}
                <div style={{ backgroundColor: colors.surface.darkCard, borderRadius: layout.radiusCard, padding: spacing[5], marginBottom: spacing[5], boxShadow: shadow.button }}>
                    <p style={{ margin: 0, color: colors.onDark.secondary, fontSize: sizes.xs }}>현재 잔액</p>
                    <p style={{ margin: `${spacing[1]} 0 0 0`, color: colors.onDark.primary, fontSize: sizes.largeTitle, fontWeight: typography.weight.bold }}>{fmt(balance)}</p>
                </div>

                {/* 환불 가능 조건 */}
                <div style={{ marginBottom: spacing[4], padding: spacing[4], backgroundColor: colors.primary[50], borderRadius: layout.radiusCard, fontSize: sizes.xs, color: colors.gray[700], lineHeight: 1.6 }}>
                    <p style={{ fontWeight: typography.weight.semibold, margin: `0 0 ${spacing[2]} 0`, color: colors.primary[700] }}>환불 가능 조건</p>
                    <p style={{ margin: `0 0 ${spacing[1]} 0` }}>• 충전 잔액 기준 일정 비율 이상 사용 시 환불 가능</p>
                    <p style={{ margin: `0 0 ${spacing[1]} 0` }}>• 충전 금액 1만원 초과: 60% 이상 사용</p>
                    <p style={{ margin: `0 0 ${spacing[1]} 0` }}>• 충전 금액 1만원 이하: 80% 이상 사용</p>
                    <p style={{ margin: 0 }}>• 과거 월 거래는 환불 불가</p>
                </div>

                <h2 style={{ margin: `0 0 ${spacing[3]} 0`, fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>충전 내역</h2>

                <div style={{ fontSize: sizes.xs, fontWeight: typography.weight.semibold, color: colors.gray[700], paddingBottom: spacing[2] }}>2026년 5월</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                    {MOCK_CHARGES.map((t) => (
                        <div key={t.id} style={{
                            backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[4],
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3],
                            border: `1px solid ${colors.gray[100]}`,
                        }}>
                            <div>
                                <p style={{ margin: 0, fontSize: sizes.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>충전</p>
                                <p style={{ margin: `${spacing[1]} 0 0 0`, fontSize: sizes.xs, color: colors.gray[500] }}>{t.date}</p>
                                <p style={{ margin: `${spacing[1]} 0 0 0`, fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>{fmt(t.amount)}</p>
                            </div>
                            {t.refundable ? (
                                <div style={{
                                    border: `1px solid ${colors.primary[700]}`, color: colors.primary[700], borderRadius: layout.radiusButton,
                                    padding: `${spacing[2]} ${spacing[4]}`, fontSize: sizes.sm, fontWeight: typography.weight.semibold,
                                    minHeight: layout.touchMin, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
                                }}>환불</div>
                            ) : (
                                <span style={{ fontSize: sizes.xs, color: colors.gray[400], whiteSpace: 'nowrap', textAlign: 'right', lineHeight: 1.4 }}>{t.reason}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 확인 바텀시트 (step === 'confirm') */}
            {step === 'confirm' && (
                <>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
                    <div style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0,
                        backgroundColor: colors.surface.card, borderTopLeftRadius: layout.radiusModal, borderTopRightRadius: layout.radiusModal,
                        padding: `${spacing[5]} ${spacing[5]} ${spacing[6]}`, fontFamily: typography.fontFamily, zIndex: 201,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing[5] }}>
                            <div style={{ width: '40px', height: '4px', borderRadius: layout.radiusPill, backgroundColor: colors.gray[300] }} />
                        </div>
                        <h3 style={{ margin: `0 0 ${spacing[2]}`, fontSize: sizes.lg, fontWeight: typography.weight.bold, color: colors.gray[900], textAlign: 'center', lineHeight: 1.4 }}>
                            iM샵 계좌로<br />50,000원 환불하시겠어요?
                        </h3>
                        <p style={{ margin: `0 0 ${spacing[5]}`, fontSize: sizes.sm, color: colors.gray[500], textAlign: 'center', lineHeight: 1.5 }}>
                            7일 이내 충전한 미사용 금액은 수수료 없이 환불할 수 있어요.
                        </p>
                        <div style={{ backgroundColor: colors.surface.background, borderRadius: layout.radiusCard, padding: spacing[4], display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
                            <span style={{ fontSize: sizes.sm, color: colors.gray[700] }}>최종 환불 금액</span>
                            <span style={{ fontSize: sizes.md, fontWeight: typography.weight.bold, color: colors.gray[900] }}>50,000원</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[5] }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: colors.error, color: colors.onDark.primary, fontSize: '11px', fontWeight: typography.weight.bold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>!</div>
                            <span style={{ fontSize: sizes.xs, color: colors.error }}>신청 후에는 취소할 수 없습니다.</span>
                        </div>
                        <div style={{ display: 'flex', gap: spacing[2] }}>
                            <div style={{ flex: 1, backgroundColor: colors.gray[100], borderRadius: layout.radiusButton, padding: `${spacing[4]} 0`, fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[700], minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>다음에 하기</div>
                            <div style={{ flex: 1.5, backgroundColor: colors.primary[700], borderRadius: layout.radiusButton, padding: `${spacing[4]} 0`, fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.onDark.primary, minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadow.button }}>신청하기</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}