// usage-guide/HomeCoachMini.jsx
// 홈 화면 + 코치마크 말풍선 스냅샷
// variant: 'cardApply' | 'charge' | 'refund'
//
// cardApply: CardApplyCTA → 코치마크가 신청하기 버튼 가리킴
// charge:    BalanceCard  → 코치마크가 충전 버튼 가리킴
// refund:    BalanceCard  → 코치마크가 환불 버튼 가리킴

import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const COACH = {
    cardApply: { message: '대구로페이 카드를 신청해보세요. 신청하기를 누르면 카드를 받을 수 있어요.', step: 1, total: 1 },
    charge: { message: '[충전] 버튼을 눌러 iM샵 잔액을 충전할 수 있습니다.', step: 1, total: 2, highlight: 'charge' },
    refund: { message: '[환불] 버튼으로 충전한 금액을 다시 환불받을 수 있습니다.', step: 2, total: 2, highlight: 'refund' },
}

// ── 미니 상단 앱바 ──
function MiniTopBar() {
    return (
        <div style={{ height: '52px', backgroundColor: colors.surface.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${layout.margin}`, borderBottom: `1px solid ${colors.gray[100]}` }}>
            <span style={{ fontSize: typography.size.appTitle, fontWeight: typography.weight.bold, color: colors.primary[700], fontFamily: typography.fontFamily }}>대구로페이</span>
            <div style={{ display: 'flex', gap: spacing[3], alignItems: 'center' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${colors.gray[300]}` }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 18, height: 2, backgroundColor: colors.gray[700] }} />)}
                </div>
            </div>
        </div>
    )
}

// ── CardApplyCTA 복제 (신청하기 버튼 하이라이트) ──
function CardApplyCTA() {
    return (
        <div style={{ margin: layout.margin }}>
            <div style={{ backgroundColor: colors.surface.darkCard, borderRadius: layout.radiusCard, padding: spacing[5], boxShadow: shadow.button, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* 좌측: 텍스트 + 버튼 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3], flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.onDark.primary, lineHeight: 1.3, fontFamily: typography.fontFamily }}>
                        대구로페이 카드를<br />신청하세요
                    </h3>
                    <p style={{ margin: 0, fontSize: typography.size.sm, color: colors.onDark.secondary, fontFamily: typography.fontFamily }}>최대 10% 캐시백 혜택</p>
                    {/* 신청하기 버튼 — 하이라이트 */}
                    <div style={{
                        alignSelf: 'flex-start',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        borderRadius: layout.radiusButton,
                        color: colors.onDark.primary,
                        fontSize: typography.size.sm,
                        fontWeight: typography.weight.semibold,
                        padding: `${spacing[2]} ${spacing[5]}`,
                        minHeight: layout.touchMin,
                        marginTop: spacing[2],
                        display: 'flex', alignItems: 'center',
                        boxShadow: '0 0 0 3px rgba(255,255,255,0.5)',
                        fontFamily: typography.fontFamily,
                    }}>신청하기</div>
                </div>
                {/* 우측: 카드 SVG */}
                <div style={{ flexShrink: 0, marginRight: spacing[2] }}>
                    <svg width="90" height="75" viewBox="0 0 100 64" fill="none" style={{ transform: 'rotate(-8deg)' }}>
                        <rect x="0" y="0" width="100" height="64" rx="8" fill={colors.surface.card} />
                        <text x="8" y="22" fontSize="13" fontWeight="700" fill={colors.primary[700]} fontFamily="sans-serif">대구로페이</text>
                        <rect x="8" y="32" width="26" height="16" rx="3" fill={colors.gray[200]} />
                        <rect x="8" y="54" width="14" height="3" rx="1.5" fill={colors.gray[300]} />
                    </svg>
                </div>
            </div>
        </div>
    )
}

// ── BalanceCardExpanded 축약 ──
function BalanceCard({ highlight }) {
    const fmt = (n) => n.toLocaleString('ko-KR') + '원'
    const btn = (key) => ({
        flex: 1, height: '48px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        border: `1px solid rgba(255,255,255,${highlight === key ? 0.9 : 0.3})`,
        borderRadius: layout.radiusSmall, color: colors.onDark.primary,
        fontSize: typography.size.sm, fontWeight: typography.weight.medium,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: typography.fontFamily,
        boxShadow: highlight === key ? '0 0 0 3px rgba(255,255,255,0.5)' : 'none',
    })
    return (
        <div style={{ margin: layout.margin }}>
            <div style={{ backgroundColor: colors.surface.darkCard, borderRadius: layout.radiusCard, padding: spacing[4], boxShadow: shadow.button }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], marginBottom: spacing[3] }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: typography.size.sm, color: 'rgba(255,255,255,0.7)' }}>대구로페이</span>
                        <span style={{ fontSize: typography.size.largeTitle, color: colors.onDark.primary, fontWeight: typography.weight.bold, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{fmt(112671)}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: spacing[2], paddingTop: spacing[3], borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={btn('charge')}>충전</div>
                    <div style={btn('refund')}>환불</div>
                    <div style={btn(null)}>QR결제</div>
                </div>
            </div>
        </div>
    )
}

// ── 코치마크 말풍선 ──
function CoachTooltip({ message, step, total, top }) {
    return (
        <>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 50 }} />
            <div style={{ position: 'absolute', top, left: spacing[4], right: spacing[4], zIndex: 51 }}>
                <div style={{ paddingLeft: '24px', marginBottom: '-1px' }}>
                    <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: `10px solid ${colors.surface.card}` }} />
                </div>
                <div style={{ backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[5], boxShadow: shadow.modal }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
                        {Array.from({ length: total }, (_, i) => (
                            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: i + 1 === step ? colors.primary[700] : colors.gray[200] }} />
                        ))}
                        <span style={{ fontSize: typography.size.xxs, color: colors.gray[400] }}>{step} / {total}</span>
                    </div>
                    <p style={{ margin: `0 0 ${spacing[4]}`, fontSize: typography.size.sm, color: colors.gray[900], lineHeight: 1.6, fontFamily: typography.fontFamily }}>{message}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: typography.size.sm, color: colors.gray[500], fontFamily: typography.fontFamily }}>건너뛰기</span>
                        <div style={{ backgroundColor: colors.primary[700], borderRadius: layout.radiusButton, color: colors.onDark.primary, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, padding: `${spacing[2]} ${spacing[5]}`, fontFamily: typography.fontFamily }}>다음</div>
                    </div>
                </div>
            </div>
        </>
    )
}

// ── 메인 ──
export default function HomeCoachMini({ variant = 'cardApply' }) {
    const c = COACH[variant]
    const isApply = variant === 'cardApply'

    // 말풍선 위치 (하이라이트 버튼 바로 아래)
    // cardApply: MiniTopBar(52) + CTA margin(16) + padding(20) + h3(47) + gap(12) + p(21) + gap(12) + marginTop(8) + button(48) ≈ 237
    // charge/refund: MiniTopBar(52) + balance margin(16) + balance(~130) ≈ 200
    const tooltipTop = isApply ? '243px' : '200px'

    return (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface.background, fontFamily: typography.fontFamily, position: 'relative' }}>
            <MiniTopBar />
            {isApply ? <CardApplyCTA /> : <BalanceCard highlight={c.highlight} />}
            <CoachTooltip message={c.message} step={c.step} total={c.total} top={tooltipTop} />
        </div>
    )
}