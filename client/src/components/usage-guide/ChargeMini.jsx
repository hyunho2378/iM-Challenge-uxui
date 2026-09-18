// usage-guide/ChargeMini.jsx
// 충전 플로우 스냅샷 미니 렌더 (실제 ChargeScreen JSX 복제, 로직 제거)
// - useTypography(Context) 제거 → 고정 sizes 객체로 대체
// - 실제 충전 없음. step prop으로 보여줄 단계만 정적 렌더
// - 포폴 재사용 대비: Context/Navigate 의존 0

import { ArrowLeft } from 'lucide-react'
import { Delete } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

// useTypography 대체 — 미니 렌더 전용 고정 사이즈 (실제 size 토큰 그대로)
const sizes = {
    balanceLarge: typography.size.balanceLarge,
    xl: typography.size.xl,
    lg: typography.size.lg,
    md: typography.size.md,
    sm: typography.size.sm,
    xs: typography.size.xs,
    xxs: typography.size.xxs,
    nav: typography.size.nav,
}

// ── 단계 표시기 (실제 StepIndicator 복제) ──
function StepIndicator({ current }) {
    const steps = ['금액 입력', '충전 확인', '완료']
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: `${spacing[3]} ${layout.margin} ${spacing[2]}`,
            backgroundColor: colors.surface.card,
            borderBottom: `1px solid ${colors.gray[100]}`,
        }}>
            {steps.flatMap((label, i) => {
                const num = i + 1
                const isActive = num === current
                const isComplete = num < current
                const circleColor = isComplete ? colors.success : isActive ? colors.primary[700] : colors.gray[200]
                const textColor = isActive ? colors.primary[700] : isComplete ? colors.success : colors.gray[400]

                const stepEl = (
                    <div key={`step-${num}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[1] }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%', backgroundColor: circleColor,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {isComplete ? (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2.5 7L5.5 10L11.5 4" stroke={colors.onDark.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <span style={{ fontSize: sizes.nav, fontWeight: 600, color: isActive ? colors.onDark.primary : colors.gray[400], fontFamily: typography.fontFamily }}>
                                    {num}
                                </span>
                            )}
                        </div>
                        <span style={{
                            fontSize: sizes.xxs, color: textColor,
                            fontWeight: isActive ? typography.weight.semibold : typography.weight.regular,
                            fontFamily: typography.fontFamily, whiteSpace: 'nowrap',
                        }}>
                            {label}
                        </span>
                    </div>
                )

                if (i < steps.length - 1) {
                    const connector = (
                        <div key={`conn-${i}`} style={{
                            width: '40px', height: '2px',
                            backgroundColor: num < current ? colors.success : colors.gray[200],
                            marginTop: '13px', flexShrink: 0,
                        }} />
                    )
                    return [stepEl, connector]
                }
                return [stepEl]
            })}
        </div>
    )
}

// ── 빠른 금액 칩 (복제) ──
function QuickChip({ label }) {
    return (
        <button style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: colors.primary[50], color: colors.primary[700],
            border: 'none', borderRadius: layout.radiusPill, padding: '6px 14px',
            fontSize: sizes.sm, fontWeight: typography.weight.semibold,
            cursor: 'default', whiteSpace: 'nowrap',
        }}>
            {label}
        </button>
    )
}

// ── 숫자패드 (복제, onPress 제거) ──
const PAD_KEYS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['00', '0', 'backspace']]
function NumPadMini() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[2], padding: `0 ${layout.margin}` }}>
            {PAD_KEYS.flat().map((key, idx) => (
                <div key={idx} style={{
                    height: '56px', backgroundColor: colors.surface.card, border: 'none',
                    borderRadius: layout.radiusSmall, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: sizes.xl, fontWeight: typography.weight.medium, color: colors.gray[900],
                }}>
                    {key === 'backspace' ? <Delete size={22} color={colors.gray[700]} /> : key}
                </div>
            ))}
        </div>
    )
}

// ── 메인: ChargeMini ──
// props: { step = 1, amount = 50000, balance = 120000 }
export default function ChargeMini({ step = 1, amount = 50000, balance = 120000 }) {
    const formattedAmount = amount.toLocaleString('ko-KR')
    const hasAmount = amount > 0
    const newBalance = balance + amount

    return (
        <div style={{
            flex: 1, minHeight: 0, width: '100%', backgroundColor: colors.surface.background,
            display: 'flex', flexDirection: 'column', fontFamily: typography.fontFamily,
        }}>
            {/* 헤더 */}
            <div style={{
                backgroundColor: colors.surface.card, display: 'flex', alignItems: 'center',
                padding: `${spacing[3]} ${layout.margin}`, gap: spacing[3],
                borderBottom: `1px solid ${colors.gray[100]}`, flexShrink: 0,
            }}>
                {step < 3 && <ArrowLeft size={24} color={colors.gray[900]} />}
                <span style={{ fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
                    {step === 1 ? '충전' : step === 2 ? '충전 확인' : '충전 완료'}
                </span>
            </div>

            <StepIndicator current={step} />

            {/* STEP 1 */}
            {step === 1 && (
                <>
                    <div style={{
                        backgroundColor: colors.surface.card, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', padding: `${spacing[3]} ${layout.margin}`, gap: spacing[2],
                    }}>
                        <span style={{ fontSize: sizes.xs, color: colors.gray[500] }}>
                            현재 잔액{' '}
                            <span style={{ color: colors.primary[700], fontWeight: typography.weight.semibold }}>
                                {balance.toLocaleString('ko-KR')}원
                            </span>
                        </span>
                        <span style={{
                            fontSize: sizes.balanceLarge, fontWeight: typography.weight.bold,
                            color: hasAmount ? colors.gray[900] : colors.gray[400], letterSpacing: '-0.5px',
                        }}>
                            {hasAmount ? `${formattedAmount}원` : '0원'}
                        </span>
                        <span style={{
                            fontSize: sizes.xs, fontWeight: typography.weight.medium, color: colors.primary[600],
                            textDecoration: 'underline', textUnderlineOffset: '2px',
                        }}>
                            환불 안내 보기
                        </span>
                    </div>

                    <div style={{
                        backgroundColor: colors.surface.card, display: 'flex', flexDirection: 'row', gap: spacing[2],
                        padding: `${spacing[3]} ${layout.margin} ${spacing[4]}`, borderBottom: `1px solid ${colors.gray[100]}`,
                    }}>
                        <QuickChip label="+1만원" />
                        <QuickChip label="+5만원" />
                        <QuickChip label="+10만원" />
                    </div>

                    <div style={{ flex: 1, backgroundColor: colors.surface.background, paddingTop: spacing[3] }}>
                        <NumPadMini />
                    </div>

                    <div style={{
                        padding: `${spacing[3]} ${layout.margin}`, backgroundColor: colors.surface.card,
                        borderTop: `1px solid ${colors.gray[100]}`,
                    }}>
                        <div style={{
                            width: '100%', height: '52px',
                            backgroundColor: hasAmount ? colors.primary[700] : colors.gray[200],
                            color: hasAmount ? colors.onDark.primary : colors.gray[400],
                            borderRadius: layout.radiusButton, fontSize: sizes.md, fontWeight: typography.weight.semibold,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: hasAmount ? shadow.button : 'none',
                        }}>
                            다음
                        </div>
                    </div>
                </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: `${spacing[5]} ${layout.margin}`, gap: spacing[4] }}>
                    <div style={{ backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[5], boxShadow: shadow.card }}>
                        {[
                            { label: '충전 금액', value: `${amount.toLocaleString('ko-KR')}원`, bold: true, color: colors.gray[900] },
                            { label: '현재 잔액', value: `${balance.toLocaleString('ko-KR')}원`, bold: false, color: colors.gray[500] },
                            { label: '충전 후 잔액', value: `${newBalance.toLocaleString('ko-KR')}원`, bold: true, color: colors.primary[700] },
                        ].map(({ label, value, bold, color }, i, arr) => (
                            <div key={label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                paddingTop: i === 0 ? 0 : spacing[4], paddingBottom: i === arr.length - 1 ? 0 : spacing[4],
                                borderBottom: i < arr.length - 1 ? `1px solid ${colors.gray[100]}` : 'none',
                            }}>
                                <span style={{ fontSize: sizes.sm, color: colors.gray[500] }}>{label}</span>
                                <span style={{ fontSize: sizes.md, fontWeight: bold ? typography.weight.bold : typography.weight.regular, color }}>{value}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', gap: spacing[3] }}>
                        <div style={{
                            flex: 1, height: '52px', backgroundColor: colors.surface.card,
                            border: `1px solid ${colors.gray[200]}`, borderRadius: layout.radiusButton,
                            fontSize: sizes.md, fontWeight: typography.weight.medium, color: colors.gray[700],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>수정</div>
                        <div style={{
                            flex: 2, height: '52px', backgroundColor: colors.primary[700], borderRadius: layout.radiusButton,
                            fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.onDark.primary,
                            boxShadow: shadow.button, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>충전하기</div>
                    </div>
                </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: `${spacing[8]} ${layout.margin}`, gap: spacing[5],
                }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%', backgroundColor: colors.successBg,
                        border: `2px solid ${colors.successBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <path d="M7 18L14 25L29 10" stroke={colors.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                        <p style={{ margin: 0, fontSize: sizes.xl, fontWeight: typography.weight.bold, color: colors.gray[900] }}>충전 완료</p>
                        <p style={{ margin: 0, fontSize: sizes.md, color: colors.gray[500] }}>{amount.toLocaleString('ko-KR')}원을 충전했습니다</p>
                    </div>
                    <div style={{
                        backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[4],
                        boxShadow: shadow.card, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span style={{ fontSize: sizes.sm, color: colors.gray[500] }}>현재 잔액</span>
                        <span style={{ fontSize: sizes.lg, fontWeight: typography.weight.bold, color: colors.primary[700] }}>
                            {newBalance.toLocaleString('ko-KR')}원
                        </span>
                    </div>
                    <div style={{
                        width: '100%', height: '52px', backgroundColor: colors.primary[700], borderRadius: layout.radiusButton,
                        fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.onDark.primary,
                        boxShadow: shadow.button, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>홈으로 가기</div>
                </div>
            )}
        </div>
    )
}