// usage-guide/CardApplyMini.jsx
// 카드 신청 플로우 스냅샷 (CardApplyPage 기본 화면 복제, 로직/useEffect 제거)
// useTypography 제거 → 고정 sizes. applyCard/shipCard 등 사이드이펙트 없음.

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const sizes = {
    xl: typography.size.xl, lg: typography.size.lg, md: typography.size.md,
    sm: typography.size.sm, xs: typography.size.xs, xxs: typography.size.xxs,
}

function CardSVG() {
    return (
        <svg width="120" height="75" viewBox="0 0 220 138" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="220" height="138" rx="12" fill={colors.primary[700]} />
            <rect width="220" height="138" rx="12" fill="url(#cardGradMini)" />
            <defs>
                <linearGradient id="cardGradMini" x1="0" y1="0" x2="220" y2="138" gradientUnits="userSpaceOnUse">
                    <stop stopColor={colors.primary[600]} />
                    <stop offset="1" stopColor={colors.primary[800]} />
                </linearGradient>
            </defs>
            <path d="M0 100 Q40 70 80 85 Q120 60 160 80 Q190 65 220 75 L220 138 L0 138 Z" fill={colors.primary[800]} fillOpacity="0.35" />
            <rect x="16" y="48" width="28" height="22" rx="4" fill={colors.illustration.cardChip} />
            <line x1="22" y1="48" x2="22" y2="70" stroke={colors.illustration.cardChipLine} strokeWidth="1" />
            <line x1="28" y1="48" x2="28" y2="70" stroke={colors.illustration.cardChipLine} strokeWidth="1" />
            <line x1="34" y1="48" x2="34" y2="70" stroke={colors.illustration.cardChipLine} strokeWidth="1" />
            <line x1="16" y1="55" x2="44" y2="55" stroke={colors.illustration.cardChipLine} strokeWidth="1" />
            <line x1="16" y1="62" x2="44" y2="62" stroke={colors.illustration.cardChipLine} strokeWidth="1" />
            <text x="16" y="30" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.9)" fontFamily="sans-serif">대구로페이</text>
            <text x="16" y="122" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">대구시</text>
            <text x="16" y="107" fontSize="10" fill="rgba(255,255,255,0.6)" letterSpacing="2" fontFamily="monospace">•••• •••• •••• ••••</text>
        </svg>
    )
}

const BENEFITS = [
    { bg: colors.warmBg, dot: colors.store.category.food, mark: 'W', text: <span>결제할 때마다 <b>10%</b><br /><span style={{ fontSize: sizes.xxs, color: colors.gray[500] }}>월 <b>최대 3만원</b> 적립</span></span> },
    { bg: colors.primary[50], dot: colors.primary[600], mark: '%', text: <span>혜택가맹점 최대 <b>7%</b> 할인</span> },
    { bg: colors.greenBg, dot: colors.teal[500], mark: 'Q', text: <span>지갑없이 <b>QR</b> 코드로 간편 결제</span> },
    { bg: colors.gray[100], dot: colors.gray[400], mark: '%', text: <span>소득공제 최대 <b>40%</b> 혜택</span> },
]

// props: { step = 'select' }  ('select' | 'shipped')
export default function CardApplyMini({ step = 'select' }) {
    // 카드 등록(배송완료) 화면
    if (step === 'shipped') {
        return (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface.card, fontFamily: typography.fontFamily }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: `${spacing[3]} ${layout.margin}`, borderBottom: `1px solid ${colors.gray[100]}` }}>
                    <ChevronLeft size={24} color={colors.gray[900]} style={{ marginRight: spacing[3] }} />
                    <span style={{ fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>카드 등록</span>
                </div>
                <div style={{
                    margin: `${spacing[4]} ${layout.margin} 0`, backgroundColor: colors.successBg,
                    border: `1px solid ${colors.successBorder}`, borderRadius: layout.radiusCard,
                    padding: `${spacing[3]} ${spacing[4]}`, display: 'flex', alignItems: 'center', gap: spacing[2],
                }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8 L7 12 L13 4" stroke={colors.success} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: sizes.sm, color: colors.success, fontWeight: typography.weight.semibold }}>배송 완료</span>
                    <span style={{ fontSize: sizes.xs, color: colors.gray[500] }}>카드를 등록해주세요</span>
                </div>
                <div style={{ padding: `${spacing[5]} ${layout.margin}` }}>
                    <div style={{ fontSize: sizes.md, fontWeight: typography.weight.bold, color: colors.gray[900], marginBottom: spacing[2] }}>카드 번호를 입력해주세요</div>
                    <div style={{ fontSize: sizes.xs, color: colors.gray[500], marginBottom: spacing[4] }}>카드 앞면의 16자리 번호를 입력해주세요</div>
                    <div style={{
                        width: '100%', height: '48px', border: `1px solid ${colors.gray[200]}`, borderRadius: layout.radiusButton,
                        padding: `0 ${spacing[4]}`, fontSize: sizes.sm, color: colors.gray[400], display: 'flex', alignItems: 'center', boxSizing: 'border-box',
                    }}>0000 0000 0000 0000</div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ borderTop: `1px solid ${colors.gray[100]}`, padding: `${spacing[3]} ${layout.margin}` }}>
                    <div style={{
                        width: '100%', height: '52px', backgroundColor: colors.primary[700], borderRadius: layout.radiusButton,
                        color: colors.onDark.primary, fontSize: sizes.md, fontWeight: typography.weight.semibold,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>카드 등록하기</div>
                </div>
            </div>
        )
    }

    // 기본: 카드 선택 화면
    return (
        <div style={{
            flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            background: `linear-gradient(180deg, ${colors.pageBg.cardApply} 0%, ${colors.surface.card} 60%)`, fontFamily: typography.fontFamily,
        }}>
            <div style={{
                backgroundColor: colors.surface.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: `${spacing[3]} ${layout.margin}`, borderBottom: `1px solid ${colors.gray[100]}`,
            }}>
                <ChevronLeft size={24} color={colors.gray[900]} />
                <div style={{
                    border: `1px solid ${colors.gray[300]}`, borderRadius: layout.radiusPill,
                    padding: `${spacing[1]} ${spacing[3]}`, fontSize: sizes.xs, color: colors.gray[600],
                }}>신청 안내</div>
            </div>

            <div style={{ textAlign: 'center', padding: `${spacing[3]} ${layout.margin}` }}>
                <p style={{ margin: 0, fontSize: sizes.xl, fontWeight: typography.weight.bold, color: colors.gray[900], lineHeight: 1.3 }}>대구시에서</p>
                <p style={{ margin: 0, fontSize: sizes.xl, fontWeight: typography.weight.bold, color: colors.gray[900], lineHeight: 1.3 }}>혜택받을 카드를 선택해주세요</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: spacing[2] }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: `0 ${spacing[8]}`, marginBottom: spacing[2] }}>
                    <div style={{ position: 'absolute', left: spacing[2], opacity: 0.3 }}><ChevronLeft size={24} color={colors.gray[700]} /></div>
                    <CardSVG />
                    <div style={{ position: 'absolute', right: spacing[2] }}><ChevronRight size={24} color={colors.gray[700]} /></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: sizes.md, fontWeight: typography.weight.bold, color: colors.gray[900] }}>iM샵(1)</span>
                </div>
            </div>

            <div style={{
                margin: `${spacing[3]} ${layout.margin} ${spacing[2]}`, backgroundColor: colors.surface.card,
                borderRadius: layout.radiusCard, boxShadow: shadow.card, overflow: 'hidden',
            }}>
                {BENEFITS.map((b, idx) => (
                    <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: spacing[3], padding: `${spacing[2]} ${spacing[4]}`,
                        borderBottom: idx < BENEFITS.length - 1 ? `1px solid ${colors.gray[100]}` : 'none',
                    }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="10" fill={b.dot} />
                                <text x="10" y="15" textAnchor="middle" fontSize="11" fontWeight="900" fill={colors.surface.card} fontFamily="sans-serif">{b.mark}</text>
                            </svg>
                        </div>
                        <div style={{ fontSize: sizes.sm, color: colors.gray[900], lineHeight: 1.5 }}>{b.text}</div>
                    </div>
                ))}
            </div>

            <div style={{ margin: `${spacing[2]} 0`, borderTop: `1.5px dashed ${colors.gray[200]}` }} />

            <div style={{
                backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, margin: `0 ${layout.margin}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: spacing[2], minHeight: '40px',
            }}>
                <span style={{ fontSize: sizes.sm, color: colors.gray[700] }}>다양한 매장에서 혜택 누리세요!</span>
                <ChevronDown size={20} color={colors.gray[500]} />
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ borderTop: `1px solid ${colors.gray[100]}`, padding: `${spacing[3]} ${layout.margin}` }}>
                <div style={{
                    width: '100%', height: '48px', backgroundColor: colors.primary[700], color: colors.onDark.primary,
                    borderRadius: layout.radiusButton, fontSize: sizes.md, fontWeight: typography.weight.semibold,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>간편 신청하기</div>
            </div>
        </div>
    )
}