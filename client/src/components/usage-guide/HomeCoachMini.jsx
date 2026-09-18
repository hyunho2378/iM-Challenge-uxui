// usage-guide/HomeCoachMini.jsx
// 홈 화면 + 코치마크 말풍선 스냅샷
// variant: 'cardApply' | 'charge' | 'refund'
//
// cardApply: BannerCarousel(CARD_APPLY_SLIDE) + CardApplyCTA → 코치마크가 신청하기 버튼 가리킴
// charge:    BannerCarousel(CASHBACK_SLIDE) + BalanceCard   → 코치마크가 충전 버튼 가리킴
// refund:    BannerCarousel(CASHBACK_SLIDE) + BalanceCard   → 코치마크가 환불 버튼 가리킴

import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

// ── 슬라이드 데이터 (BannerCarousel.jsx에서 복제) ──
const CARD_APPLY_SLIDE = {
    bgColor: colors.primary[700],
    textColor: colors.onDark.primary,
    subTextColor: 'rgba(255,255,255,0.85)',
    title: '강릉 곳곳에서 10% 캐시백',
    description: '신청만 하면 바로 적용',
    buttonLabel: '신청하기',
    illustration: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="8" y="20" width="64" height="42" rx="8" fill="rgba(255,255,255,0.18)" />
            <rect x="8" y="20" width="64" height="42" rx="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <rect x="16" y="34" width="20" height="14" rx="3" fill="rgba(255,255,255,0.5)" />
            <rect x="16" y="50" width="10" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
            <rect x="30" y="50" width="10" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
            <circle cx="56" cy="34" r="10" fill="rgba(255,255,255,0.25)" />
            <path d="M52 34 L56 38 L62 30" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="27" r="3" fill="rgba(255,255,255,0.6)" />
            <circle cx="62" cy="27" r="3" fill="rgba(255,255,255,0.6)" />
        </svg>
    ),
}

const CASHBACK_SLIDE = {
    bgColor: colors.primary[100],
    textColor: colors.primary[800],
    subTextColor: colors.primary[700],
    buttonBg: colors.primary[200],
    buttonTextColor: colors.primary[800],
    title: '캐시백 충전하고',
    description: '강릉 전역에서 사용하세요',
    buttonLabel: '충전하기',
    illustration: (
        <svg width="76" height="64" viewBox="0 0 100 64" fill="none" style={{ transform: 'rotate(-8deg)' }}>
            <rect width="100" height="64" rx="8" fill={colors.surface.card} />
            <text x="8" y="22" fontSize="13" fontWeight="700" fill={colors.primary[700]} fontFamily="sans-serif">iM샵</text>
            <rect x="8" y="32" width="26" height="16" rx="3" fill={colors.gray[200]} />
            <rect x="8" y="54" width="14" height="3" rx="1.5" fill={colors.gray[300]} />
        </svg>
    ),
}

const COACH = {
    cardApply: { message: 'iM샵 카드를 신청해보세요. 신청하기를 누르면 카드를 받을 수 있어요.', step: 1, total: 1 },
    charge: { message: '[충전] 버튼을 눌러 iM샵 잔액을 충전할 수 있습니다.', step: 1, total: 2, highlight: 'charge' },
    refund: { message: '[환불] 버튼으로 충전한 금액을 다시 환불받을 수 있습니다.', step: 2, total: 2, highlight: 'refund' },
}

// ── 미니 상단 앱바 ──
function MiniTopBar() {
    return (
        <div style={{ height: '52px', backgroundColor: colors.surface.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${layout.margin}`, borderBottom: `1px solid ${colors.gray[100]}` }}>
            <span style={{ fontSize: typography.size.appTitle, fontWeight: typography.weight.bold, color: colors.primary[700], fontFamily: typography.fontFamily }}>iM샵</span>
            <div style={{ display: 'flex', gap: spacing[3], alignItems: 'center' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${colors.gray[300]}` }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 18, height: 2, backgroundColor: colors.gray[700] }} />)}
                </div>
            </div>
        </div>
    )
}

// ── 정적 배너 슬라이드 1장 ──
function StaticBanner({ slide }) {
    return (
        <div style={{ margin: `${spacing[3]} ${layout.margin} 0`, borderRadius: layout.radiusCard, overflow: 'hidden', position: 'relative' }}>
            <div style={{ backgroundColor: slide.bgColor, height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${spacing[4]} 0 ${spacing[5]}` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], flex: 1 }}>
                    <p style={{ margin: 0, color: slide.textColor, fontSize: typography.size.md, fontWeight: typography.weight.bold, lineHeight: 1.35, whiteSpace: 'pre-line', fontFamily: typography.fontFamily }}>{slide.title}</p>
                    <p style={{ margin: 0, color: slide.subTextColor, fontSize: typography.size.xs, fontWeight: typography.weight.medium, fontFamily: typography.fontFamily }}>{slide.description}</p>
                    {slide.buttonLabel && (
                        <div style={{ marginTop: spacing[1], alignSelf: 'flex-start', backgroundColor: slide.buttonBg || 'rgba(255,255,255,0.25)', color: slide.buttonTextColor || slide.textColor, borderRadius: layout.radiusButton, padding: '6px 14px', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, fontFamily: typography.fontFamily }}>
                            {slide.buttonLabel}
                        </div>
                    )}
                </div>
                <div style={{ flexShrink: 0 }}>{slide.illustration}</div>
            </div>
            <div style={{ position: 'absolute', bottom: spacing[2], left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: spacing[1] }}>
                {[0, 1, 2, 3].map(i => <div key={i} style={{ width: i === 0 ? '18px' : '6px', height: '6px', borderRadius: layout.radiusPill, backgroundColor: i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)' }} />)}
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
                        iM샵 카드를<br />신청하세요
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
                        <text x="8" y="22" fontSize="13" fontWeight="700" fill={colors.primary[700]} fontFamily="sans-serif">iM샵</text>
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
                        <span style={{ fontSize: typography.size.sm, color: 'rgba(255,255,255,0.7)' }}>iM샵</span>
                        <span style={{ fontSize: typography.size.largeTitle, color: colors.onDark.primary, fontWeight: typography.weight.bold, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{fmt(112671)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: typography.size.sm, color: 'rgba(255,255,255,0.7)' }}>캐시백</span>
                        <span style={{ fontSize: typography.size.xl, color: colors.teal[400], fontWeight: typography.weight.bold }}>{fmt(3200)}</span>
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

    // cardApply → CARD_APPLY_SLIDE, charge/refund → CASHBACK_SLIDE
    const bannerSlide = isApply ? CARD_APPLY_SLIDE : CASHBACK_SLIDE

    // 말풍선 위치
    // cardApply: MiniTopBar(52) + banner margin(12) + banner(120) + CTA margin(16) + padding(20) + h3(47) + gap(12) + p(21) + gap(12) + marginTop(8) ≈ 320px
    // charge/refund: MiniTopBar(52) + banner margin(12) + banner(120) + balance margin(16) + balance(~160) ≈ 370px
    const tooltipTop = isApply ? '375px' : '370px'

    return (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface.background, fontFamily: typography.fontFamily, position: 'relative' }}>
            <MiniTopBar />
            <StaticBanner slide={bannerSlide} />
            {isApply ? <CardApplyCTA /> : <BalanceCard highlight={c.highlight} />}
            <CoachTooltip message={c.message} step={c.step} total={c.total} top={tooltipTop} />
        </div>
    )
}