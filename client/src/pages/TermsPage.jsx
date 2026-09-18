// TermsPage.jsx — 아코디언 방식 (탭 → 목록 펼치기)
// 토스/카카오페이 약관 방식: 전체 목록 한눈에 보임 + 눌러서 펼침

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'
import ScreenContainer from '../components/layout/ScreenContainer'
import BottomNavBar from '../components/layout/BottomNavBar'
import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { TERMS_TABS, TERMS_CONTENT } from '../data/termsData'

// ── 뱃지 ──
function Badge({ label }) {
    const isRequired = label === '필수'
    return (
        <span style={{
            display: 'inline-block',
            fontSize: typography.size.xxs,
            fontWeight: typography.weight.semibold,
            color: isRequired ? colors.primary[700] : colors.gray[500],
            backgroundColor: isRequired ? colors.primary[50] : colors.gray[100],
            borderRadius: layout.radiusPill,
            padding: `2px ${spacing[2]}`,
            marginRight: spacing[2],
            verticalAlign: 'middle',
            fontFamily: typography.fontFamily,
        }}>
            {label}
        </span>
    )
}

// ── 표 ──
function TermsTable({ headers, rows, caption }) {
    const isTwoCol = headers && headers.length === 2

    return (
        <div style={{ margin: `${spacing[4]} 0` }}>
            {caption && (
                <div style={{ fontSize: typography.size.xs, fontWeight: typography.weight.semibold, color: colors.gray[600], marginBottom: spacing[2], fontFamily: typography.fontFamily }}>
                    {caption}
                </div>
            )}

            {isTwoCol ? (
                // 2컬럼 → 스택형 카드
                <div style={{ border: `1px solid ${colors.gray[200]}`, borderRadius: layout.radiusCard, overflow: 'hidden' }}>
                    {rows.map((row, i) => (
                        <div key={i} style={{
                            padding: `${spacing[3]} ${spacing[4]}`,
                            borderBottom: i < rows.length - 1 ? `1px solid ${colors.gray[100]}` : 'none',
                            backgroundColor: i % 2 === 0 ? colors.surface.card : colors.gray[50],
                        }}>
                            <div style={{
                                fontSize: typography.size.xxs,
                                fontWeight: typography.weight.semibold,
                                color: colors.gray[500],
                                marginBottom: spacing[1],
                                fontFamily: typography.fontFamily,
                            }}>
                                {row[0]}
                            </div>
                            <div style={{
                                fontSize: typography.size.xs,
                                color: colors.gray[800],
                                lineHeight: 1.7,
                                fontFamily: typography.fontFamily,
                                whiteSpace: 'pre-wrap',
                            }}>
                                {row[1]}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // 3컬럼 이상 → 가로 스크롤 table
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.size.xs, fontFamily: typography.fontFamily, minWidth: '500px' }}>
                        {headers && (
                            <thead>
                                <tr>
                                    {headers.map((h, i) => (
                                        <th key={i} style={{ padding: `${spacing[2]} ${spacing[3]}`, backgroundColor: colors.gray[50], border: `1px solid ${colors.gray[200]}`, textAlign: 'left', fontWeight: typography.weight.semibold, color: colors.gray[700], fontSize: typography.size.xs }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? colors.surface.card : colors.gray[50] }}>
                                    {row.map((cell, j) => (
                                        <td key={j} style={{ padding: `${spacing[2]} ${spacing[3]}`, border: `1px solid ${colors.gray[200]}`, color: colors.gray[800], fontSize: typography.size.xs, lineHeight: 1.6, verticalAlign: 'top', whiteSpace: 'pre-wrap' }}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

// ── 조항 본문 ──
function ArticleBody({ body }) {
    const lines = body.split('\n')
    return (
        <div>
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} style={{ height: spacing[2] }} />
                const isCircled = /^[①-⑳]/.test(line.trim())
                return (
                    <div key={i} style={{
                        fontSize: typography.size.xs, color: isCircled ? colors.gray[800] : colors.gray[700],
                        lineHeight: 1.8, fontFamily: typography.fontFamily, marginBottom: '2px',
                        fontWeight: isCircled ? typography.weight.medium : typography.weight.regular,
                        marginTop: isCircled ? spacing[2] : 0,
                    }}>
                        {line.trim()}
                    </div>
                )
            })}
        </div>
    )
}

// ── 조항 ──
function Article({ no, title, body, tables, extra }) {
    return (
        <div style={{ marginBottom: spacing[5] }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing[2], marginBottom: spacing[3], paddingBottom: spacing[2], borderBottom: `1px solid ${colors.gray[100]}` }}>
                <span style={{ fontSize: typography.size.xxs, fontWeight: typography.weight.bold, color: colors.primary[700], backgroundColor: colors.primary[50], borderRadius: layout.radiusPill, padding: `2px ${spacing[2]}`, whiteSpace: 'nowrap', fontFamily: typography.fontFamily }}>제{no}조</span>
                <span style={{ fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.gray[900], fontFamily: typography.fontFamily }}>{title}</span>
            </div>
            {body && <ArticleBody body={body} />}
            {tables && tables.map((t, i) => <TermsTable key={i} {...t} />)}
            {extra && <div style={{ fontSize: typography.size.xs, color: colors.gray[600], lineHeight: 1.7, marginTop: spacing[3], fontFamily: typography.fontFamily, whiteSpace: 'pre-line' }}>{extra}</div>}
        </div>
    )
}

// ── 동의서 카드 ──
function ConsentCard({ item }) {
    return (
        <div style={{ backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, border: `1px solid ${colors.gray[100]}`, padding: spacing[5], marginBottom: spacing[4], boxShadow: shadow.card }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[2], marginBottom: spacing[4] }}>
                {item.badge && <Badge label={item.badge} />}
                <span style={{ fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.gray[900], fontFamily: typography.fontFamily, lineHeight: 1.4 }}>{item.title}</span>
            </div>
            {item.tables && item.tables.map((t, i) => <TermsTable key={i} {...t} />)}
            {item.note && <div style={{ fontSize: typography.size.xs, color: colors.gray[500], lineHeight: 1.7, marginTop: spacing[3], fontFamily: typography.fontFamily, paddingTop: spacing[3], borderTop: `1px dashed ${colors.gray[200]}` }}>{item.note}</div>}
        </div>
    )
}

// ── 탭별 컨텐츠 ──
function TabContent({ tabId }) {
    const data = TERMS_CONTENT[tabId]
    if (!data) return null

    if (tabId === 'consent') {
        return <div>{data.items.map((item, i) => <ConsentCard key={i} item={item} />)}</div>
    }

    if (tabId === 'openbank') {
        return (
            <div>
                <div style={{ fontSize: typography.size.xxs, color: colors.gray[400], marginBottom: spacing[5], fontFamily: typography.fontFamily }}>{data.effective}</div>
                {data.articles.map((a) => <Article key={a.no} {...a} />)}
                <div style={{ height: '8px', backgroundColor: colors.surface.background, margin: `${spacing[6]} -${layout.margin}` }} />
                <div style={{ paddingTop: spacing[5] }}>
                    <div style={{ fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.gray[700], marginBottom: spacing[4], fontFamily: typography.fontFamily }}>관련 동의서</div>
                    {data.consents.map((item, i) => <ConsentCard key={i} item={item} />)}
                </div>
            </div>
        )
    }

    if (tabId === 'location') {
        return (
            <div>
                {data.intro && <div style={{ fontSize: typography.size.xs, color: colors.gray[600], lineHeight: 1.8, marginBottom: spacing[5], padding: spacing[4], backgroundColor: colors.primary[50], borderRadius: layout.radiusCard, fontFamily: typography.fontFamily }}>{data.intro}</div>}
                <div style={{ fontSize: typography.size.xxs, color: colors.gray[400], marginBottom: spacing[5], fontFamily: typography.fontFamily }}>{data.effective}</div>
                {data.articles.map((a) => <Article key={a.no} {...a} />)}
                {data.extra && (
                    <>
                        <div style={{ height: '8px', backgroundColor: colors.surface.background, margin: `${spacing[6]} -${layout.margin}` }} />
                        <div style={{ paddingTop: spacing[5] }}><ConsentCard item={data.extra} /></div>
                    </>
                )}
            </div>
        )
    }

    if (tabId === 'privacy') {
        return (
            <div>
                <div style={{ fontSize: typography.size.xxs, color: colors.gray[400], marginBottom: spacing[4], fontFamily: typography.fontFamily }}>{data.effective}</div>
                {data.intro && <div style={{ fontSize: typography.size.xs, color: colors.gray[600], lineHeight: 1.8, marginBottom: spacing[5], fontFamily: typography.fontFamily }}>{data.intro}</div>}
                {data.toc && (
                    <div style={{ backgroundColor: colors.gray[50], borderRadius: layout.radiusCard, padding: spacing[4], marginBottom: spacing[6] }}>
                        <div style={{ fontSize: typography.size.xs, fontWeight: typography.weight.semibold, color: colors.gray[700], marginBottom: spacing[3], fontFamily: typography.fontFamily }}>목차</div>
                        {data.toc.map((item, i) => <div key={i} style={{ fontSize: typography.size.xs, color: colors.gray[600], lineHeight: 1.8, fontFamily: typography.fontFamily }}>{item}</div>)}
                    </div>
                )}
                {data.articles.map((a) => <Article key={a.no} {...a} />)}
            </div>
        )
    }

    return (
        <div>
            {data.intro && <div style={{ fontSize: typography.size.xs, color: colors.gray[600], lineHeight: 1.8, marginBottom: spacing[5], fontFamily: typography.fontFamily }}>{data.intro}</div>}
            <div style={{ fontSize: typography.size.xxs, color: colors.gray[400], marginBottom: spacing[5], fontFamily: typography.fontFamily }}>{data.effective}</div>
            {data.articles.map((a) => <Article key={a.no} {...a} />)}
            {data.appendix && (
                <div style={{ marginTop: spacing[6], paddingTop: spacing[4], borderTop: `1px solid ${colors.gray[200]}`, fontSize: typography.size.xs, color: colors.gray[500], fontFamily: typography.fontFamily }}>
                    <span style={{ fontWeight: typography.weight.semibold }}>부칙 · </span>{data.appendix}
                </div>
            )}
        </div>
    )
}

// ── 아코디언 항목 ──
function AccordionItem({ tab, isOpen, onToggle }) {
    const data = TERMS_CONTENT[tab.id]
    return (
        <div style={{
            backgroundColor: colors.surface.card,
            borderRadius: layout.radiusCard,
            marginBottom: spacing[3],
            boxShadow: shadow.card,
            overflow: 'hidden',
        }}>
            {/* 헤더 — 누르면 펼침 */}
            <button
                onClick={onToggle}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: `${spacing[4]} ${spacing[5]}`, background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left', gap: spacing[3],
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1], flex: 1 }}>
                    <span style={{ fontSize: typography.size.md, fontWeight: typography.weight.semibold, color: colors.gray[900], fontFamily: typography.fontFamily }}>
                        {tab.label}
                    </span>
                    {data && (
                        <span style={{ fontSize: typography.size.xs, color: colors.gray[400], fontFamily: typography.fontFamily }}>
                            {data.effective || (data.items ? `${data.items.length}개 동의서` : '')}
                        </span>
                    )}
                </div>
                {isOpen
                    ? <ChevronUp size={20} color={colors.primary[700]} style={{ flexShrink: 0 }} />
                    : <ChevronDown size={20} color={colors.gray[400]} style={{ flexShrink: 0 }} />
                }
            </button>

            {/* 펼쳐진 내용 */}
            {isOpen && (
                <div style={{
                    padding: `0 ${spacing[5]} ${spacing[5]}`,
                    borderTop: `1px solid ${colors.gray[100]}`,
                    paddingTop: spacing[5],
                }}>
                    {data && (
                        <div style={{ marginBottom: spacing[3] }}>
                            <h2 style={{ margin: `0 0 ${spacing[4]} 0`, fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.gray[900], fontFamily: typography.fontFamily }}>
                                {data.title}
                            </h2>
                        </div>
                    )}
                    <TabContent tabId={tab.id} />
                </div>
            )}
        </div>
    )
}

// ── 메인 ──
export default function TermsPage() {
    const navigate = useNavigate()
    const [openId, setOpenId] = useState(null)

    const handleToggle = (id) => {
        setOpenId(prev => prev === id ? null : id)
    }

    return (
        <ScreenContainer statusBarBg={colors.surface.card}>
            {/* 헤더 */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: spacing[2],
                padding: `${spacing[4]} ${layout.margin}`,
                backgroundColor: colors.surface.card,
                borderBottom: `1px solid ${colors.gray[100]}`,
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing[1], display: 'flex', alignItems: 'center', color: colors.gray[700] }}>
                    <ChevronLeft size={22} strokeWidth={2} />
                </button>
                <span style={{ fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.gray[900], fontFamily: typography.fontFamily }}>
                    이용약관
                </span>
            </div>

            {/* 아코디언 목록 */}
            <div style={{
                flex: 1, overflowY: 'auto',
                padding: `${spacing[4]} ${layout.margin}`,
                paddingBottom: `calc(${layout.bottomNavHeight} + ${spacing[6]})`,
                backgroundColor: colors.surface.background,
            }}>
                {/* 안내 텍스트 */}
                <p style={{
                    margin: `0 0 ${spacing[4]} 0`,
                    fontSize: typography.size.xs,
                    color: colors.gray[500],
                    lineHeight: 1.6,
                    fontFamily: typography.fontFamily,
                }}>
                    항목을 탭하면 전체 내용을 확인할 수 있습니다.
                </p>

                {TERMS_TABS.map((tab) => (
                    <AccordionItem
                        key={tab.id}
                        tab={tab}
                        isOpen={openId === tab.id}
                        onToggle={() => handleToggle(tab.id)}
                    />
                ))}
            </div>

            <BottomNavBar />
        </ScreenContainer>
    )
}