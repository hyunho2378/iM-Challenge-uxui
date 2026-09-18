/**
 * CardApplyPage (Task 10 + B1-B5)
 * Strategy: S7
 * Nielsen: #1 visibility, #3 user control, #8 memory load
 * Shneiderman: #4 closure, #8 reduce memory load
 * B1: 카드 SVG 140×88 축소, 캐러셀 200px 고정
 * B2: 발급 비용 캡슐 박스
 * B3: 카테고리 아코디언
 * B4: 배경 그라데이션 (colors.pageBg.cardApply)
 * B5: 한 화면 레이아웃 최적화
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { useTypography } from '../hooks/useTypography'
import ScreenContainer from '../components/layout/ScreenContainer'
import Button from '../components/common/Button'

// B1: 140×88 축소 (viewBox 좌표계 220×138 유지)
function CardSVG({ type }) {
  const isTransit = type === 'transit'
  return (
    <svg width="120" height="75" viewBox="0 0 220 138" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="138" rx="12" fill={colors.primary[700]} />
      <rect width="220" height="138" rx="12" fill="url(#cardGrad)" />
      <defs>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="220" y2="138" gradientUnits="userSpaceOnUse">
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
      <text x="16" y="30" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.9)" fontFamily="sans-serif">iM샵</text>
      <text x="16" y="122" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">강릉시</text>
      {isTransit && (
        <rect x="170" y="108" width="36" height="18" rx="4" fill="rgba(255,255,255,0.2)" />
      )}
      {isTransit && (
        <text x="174" y="121" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.9)" fontFamily="sans-serif">eZL</text>
      )}
      <text x="16" y="107" fontSize="10" fill="rgba(255,255,255,0.6)" letterSpacing="2" fontFamily="monospace">•••• •••• •••• ••••</text>
    </svg>
  )
}

const CARD_TYPES = [
  {
    id: 'standard',
    name: 'iM샵(1)',
    badges: [],
    cost: null,
  },
  {
    id: 'transit',
    name: 'iM샵(교통)',
    badges: ['교통카드 겸용'],
    cost: '발급 비용 5,000원',
  },
]

function getBenefits(sizes) {
  return [
  {
    iconBg: colors.warmBg,
    iconContent: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill={colors.store.category.food} />
        <text x="10" y="15" textAnchor="middle" fontSize="11" fontWeight="900" fill={colors.surface.card} fontFamily="sans-serif">W</text>
      </svg>
    ),
    text: (
      <span>
        결제할 때마다 <b>10%</b>
        <br />
        <span style={{ fontSize: sizes.xxs, color: colors.gray[500] }}>월 <b>최대 3만원</b> 적립</span>
      </span>
    ),
  },
  {
    iconBg: colors.primary[50],
    iconContent: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill={colors.primary[600]} />
        <text x="10" y="15" textAnchor="middle" fontSize="11" fontWeight="900" fill={colors.surface.card} fontFamily="sans-serif">%</text>
      </svg>
    ),
    text: (
      <span>
        혜택가맹점 최대 <b>7%</b> 할인
      </span>
    ),
  },
  {
    iconBg: colors.greenBg,
    iconContent: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill={colors.teal[500]} />
        <rect x="6" y="6" width="8" height="8" rx="1" fill={colors.surface.card} />
        <rect x="7.5" y="7.5" width="2" height="2" fill={colors.teal[500]} />
        <rect x="10.5" y="7.5" width="2" height="2" fill={colors.teal[500]} />
        <rect x="7.5" y="10.5" width="2" height="2" fill={colors.teal[500]} />
        <rect x="10.5" y="10.5" width="2" height="2" fill={colors.teal[500]} />
      </svg>
    ),
    text: (
      <span>
        지갑없이 <b>QR</b> 코드로 간편 결제
      </span>
    ),
  },
  {
    iconBg: colors.gray[100],
    iconContent: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill={colors.gray[400]} />
        <rect x="6" y="5" width="8" height="10" rx="1" fill={colors.surface.card} />
        <line x1="8" y1="8" x2="12" y2="8" stroke={colors.gray[400]} strokeWidth="1" />
        <line x1="8" y1="10" x2="12" y2="10" stroke={colors.gray[400]} strokeWidth="1" />
        <line x1="8" y1="12" x2="11" y2="12" stroke={colors.gray[400]} strokeWidth="1" />
      </svg>
    ),
    text: (
      <span>
        소득공제 최대 <b>40%</b> 혜택
      </span>
    ),
  },
  {
    iconBg: colors.primary[50],
    iconContent: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill={colors.primary[500]} />
        <circle cx="10" cy="7" r="2.5" fill={colors.surface.card} />
        <path d="M5 16 Q5 12 10 12 Q15 12 15 16" fill={colors.surface.card} />
      </svg>
    ),
    text: (
      <span>
        만 <b>14세</b> 이상이면 누구나
        <br />
        <span style={{ fontSize: sizes.xxs, color: colors.gray[500] }}>온라인으로 서류없이 간편 신청</span>
      </span>
    ),
  },
  ]
}

const CATEGORY_ICONS = [
  { label: '서적', color: colors.primary[500] },
  { label: '의료', color: colors.error },
  { label: '약국', color: colors.success },
  { label: '주유소', color: colors.warning },
  { label: '미용', color: colors.store.category.cafe },
  { label: '음식', color: colors.store.category.food },
  { label: '생활', color: colors.gray[500] },
]

function CategoryIcon({ label }) {
  const icons = {
    '서적': <path d="M4 3 Q4 2 5 2 L15 2 Q16 2 16 3 L16 17 Q16 18 15 18 L5 18 Q4 18 4 17 Z M7 2 L7 18 M10 5 L14 5 M10 8 L14 8" stroke={colors.onDark.primary} strokeWidth="1.2" fill="none" strokeLinecap="round" />,
    '의료': <><rect x="7" y="4" width="6" height="12" rx="1" fill={colors.surface.card} /><rect x="4" y="7" width="12" height="6" rx="1" fill={colors.surface.card} /></>,
    '약국': <><text x="10" y="14" textAnchor="middle" fontSize="11" fontWeight="900" fill={colors.surface.card} fontFamily="sans-serif">Rx</text></>,
    '주유소': <path d="M6 16 L6 6 Q6 4 8 4 L12 4 Q14 4 14 6 L14 10 L16 10 L16 14 Q16 16 14 16 Z M8 8 L12 8" stroke={colors.onDark.primary} strokeWidth="1.2" fill="none" strokeLinecap="round" />,
    '미용': <path d="M10 4 Q10 4 8 8 Q6 12 8 14 Q10 16 12 14 Q14 12 12 8 Q10 4 10 4 Z M10 10 L14 6" stroke={colors.onDark.primary} strokeWidth="1.2" fill="none" strokeLinecap="round" />,
    '음식': <path d="M7 4 L7 16 M7 4 Q11 4 11 8 Q11 12 7 12 M13 4 L13 8 Q16 8 16 12 L13 12 L13 16" stroke={colors.onDark.primary} strokeWidth="1.2" fill="none" strokeLinecap="round" />,
    '생활': <path d="M4 10 L10 4 L16 10 M6 10 L6 16 L14 16 L14 10 M9 16 L9 12 L11 12 L11 16" stroke={colors.onDark.primary} strokeWidth="1.2" fill="none" strokeLinecap="round" />,
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {icons[label] || <circle cx="10" cy="10" r="8" fill={colors.surface.card} fillOpacity="0.5" />}
    </svg>
  )
}

export default function CardApplyPage() {
  const navigate = useNavigate()
  const sizes = useTypography()
  const { cardStatus, applyCard, shipCard, registerCard } = useUser()
  const BENEFITS = getBenefits(sizes)

  useEffect(() => {
    if (cardStatus === 'applying') {
      const t = setTimeout(() => shipCard(), 1000)
      return () => clearTimeout(t)
    }
  }, [cardStatus, shipCard])
  const [cardIndex, setCardIndex] = useState(0)
  const [cardCode, setCardCode] = useState('')
  const [accordionOpen, setAccordionOpen] = useState(false)

  const selectedCard = CARD_TYPES[cardIndex]

  // 배송 완료 → 등록 화면
  if (cardStatus === 'shipped') {
    return (
      <ScreenContainer statusBarBg={colors.surface.card}>
        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.surface.card,
          fontFamily: typography.fontFamily,
        }}>
          <div style={{
            backgroundColor: colors.surface.card,
            display: 'flex',
            alignItems: 'center',
            padding: `${spacing[3]} ${layout.margin}`,
            borderBottom: `1px solid ${colors.gray[100]}`,
            flexShrink: 0,
          }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing[1], marginRight: spacing[3] }}>
              <ChevronLeft size={24} color={colors.gray[900]} />
            </button>
            <span style={{ fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
              카드 등록
            </span>
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                margin: `${spacing[4]} ${layout.margin} 0`,
                backgroundColor: colors.successBg,
                border: `1px solid ${colors.successBorder}`,
                borderRadius: layout.radiusCard,
                padding: `${spacing[3]} ${spacing[4]}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8 L7 12 L13 4" stroke={colors.success} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: sizes.sm, color: colors.success, fontWeight: typography.weight.semibold }}>
                  배송 완료
                </span>
                <span style={{ fontSize: sizes.xs, color: colors.gray[500] }}>
                  카드를 등록해주세요
                </span>
              </div>

              <div style={{ padding: `${spacing[5]} ${layout.margin}` }}>
                <div style={{ fontSize: sizes.md, fontWeight: typography.weight.bold, color: colors.gray[900], marginBottom: spacing[2] }}>
                  카드 번호를 입력해주세요
                </div>
                <div style={{ fontSize: sizes.xs, color: colors.gray[500], marginBottom: spacing[4] }}>
                  카드 앞면의 16자리 번호를 입력해주세요
                </div>
                <input
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  style={{
                    width: '100%',
                    height: '48px',
                    border: `1px solid ${colors.gray[200]}`,
                    borderRadius: layout.radiusButton,
                    padding: `0 ${spacing[4]}`,
                    fontSize: sizes.sm,
                    color: colors.gray[900],
                    fontFamily: typography.fontFamily,
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: colors.surface.card,
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{
              flexShrink: 0,
              borderTop: `1px solid ${colors.gray[100]}`,
              padding: `${spacing[3]} ${layout.margin}`,
              paddingBottom: `calc(env(safe-area-inset-bottom) + ${spacing[3]})`,
            }}>
              <Button
                variant="filled"
                size="lg"
                onClick={() => { registerCard(); navigate('/') }}
              >
                카드 등록하기
              </Button>
            </div>
          </div>
        </div>
      </ScreenContainer>
    )
  }

  // 신청 처리 중
  if (cardStatus === 'applying') {
    return (
      <ScreenContainer statusBarBg={colors.surface.card}>
        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.surface.card,
          fontFamily: typography.fontFamily,
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[4],
          }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <circle cx="20" cy="20" r="16" stroke={colors.gray[200]} strokeWidth="3" fill="none" />
              <path d="M20 4 A16 16 0 0 1 36 20" stroke={colors.primary[700]} strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
            <div style={{ fontSize: sizes.sm, color: colors.gray[500] }}>신청 처리 중입니다...</div>
            <div style={{ fontSize: sizes.xs, color: colors.gray[400] }}>잠시 후 배송 준비가 완료됩니다</div>
          </div>
          <div style={{
            padding: `${spacing[3]} ${layout.margin}`,
            paddingBottom: `calc(env(safe-area-inset-bottom) + ${spacing[3]})`,
          }}>
            <Button
              variant="filled"
              size="lg"
              disabled
            >
              카드 발송 중...
            </Button>
          </div>
        </div>
      </ScreenContainer>
    )
  }

  // 기본: 카드 선택 화면
  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${colors.pageBg.cardApply} 0%, ${colors.surface.card} 60%)`,
        fontFamily: typography.fontFamily,
      }}>
        {/* 헤더 */}
        <div style={{
          backgroundColor: colors.surface.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${spacing[3]} ${layout.margin}`,
          borderBottom: `1px solid ${colors.gray[100]}`,
          flexShrink: 0,
        }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing[1] }}>
            <ChevronLeft size={24} color={colors.gray[900]} />
          </button>
          <button style={{
            background: 'none',
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: layout.radiusPill,
            padding: `${spacing[1]} ${spacing[3]}`,
            fontSize: sizes.xs,
            color: colors.gray[600],
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
          }}>
            신청 안내
          </button>
        </div>

        {/* 타이틀 + 카드 캐러셀 — flexShrink: 0 */}
        <div style={{ flexShrink: 0 }}>
          {/* B5: 타이틀 padding 축소 */}
          <div style={{
            textAlign: 'center',
            padding: `${spacing[3]} ${layout.margin}`,
          }}>
            <p style={{
              margin: 0,
              fontSize: sizes.xl,
              fontWeight: typography.weight.bold,
              color: colors.gray[900],
              lineHeight: 1.3,
            }}>
              강릉시에서
            </p>
            <p style={{
              margin: 0,
              fontSize: sizes.xl,
              fontWeight: typography.weight.bold,
              color: colors.gray[900],
              lineHeight: 1.3,
            }}>
              혜택받을 카드를 선택해주세요
            </p>
          </div>

          {/* B1: 카드 캐러셀 + 라벨 고정 160px */}
          <div style={{
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: spacing[2],
          }}>
            {/* 이전/다음 화살표 + 카드 이미지 */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: `0 ${spacing[8]}`,
              marginBottom: spacing[2],
            }}>
              <button
                onClick={() => setCardIndex(prev => Math.max(0, prev - 1))}
                disabled={cardIndex === 0}
                style={{
                  position: 'absolute',
                  left: spacing[2],
                  background: 'none',
                  border: 'none',
                  cursor: cardIndex === 0 ? 'default' : 'pointer',
                  opacity: cardIndex === 0 ? 0.3 : 1,
                  padding: spacing[2],
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronLeft size={24} color={colors.gray[700]} />
              </button>

              <div>
                <CardSVG type={selectedCard.id === 'transit' ? 'transit' : 'standard'} />
              </div>

              <button
                onClick={() => setCardIndex(prev => Math.min(CARD_TYPES.length - 1, prev + 1))}
                disabled={cardIndex === CARD_TYPES.length - 1}
                style={{
                  position: 'absolute',
                  right: spacing[2],
                  background: 'none',
                  border: 'none',
                  cursor: cardIndex === CARD_TYPES.length - 1 ? 'default' : 'pointer',
                  opacity: cardIndex === CARD_TYPES.length - 1 ? 0.3 : 1,
                  padding: spacing[2],
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronRight size={24} color={colors.gray[700]} />
              </button>
            </div>

            {/* 카드 라벨 + 배지 */}
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: sizes.md,
                fontWeight: typography.weight.bold,
                color: colors.gray[900],
              }}>
                {selectedCard.name}
              </span>
              {selectedCard.badges.map(badge => (
                <span key={badge} style={{
                  marginLeft: spacing[2],
                  backgroundColor: colors.primary[50],
                  color: colors.primary[700],
                  fontSize: sizes.xxs,
                  fontWeight: typography.weight.semibold,
                  padding: `2px 8px`,
                  borderRadius: layout.radiusPill,
                  border: `1px solid ${colors.primary[100]}`,
                }}>
                  {badge}
                </span>
              ))}
            </div>

            {/* B2: 발급 비용 캡슐 박스 */}
            {selectedCard.cost && (
              <div style={{ marginTop: spacing[2], display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: colors.surface.card,
                  border: `1px solid ${colors.gray[200]}`,
                  borderRadius: layout.radiusPill,
                  padding: `${spacing[1]} ${spacing[3]}`,
                  fontSize: sizes.sm,
                  color: colors.gray[900],
                }}>
                  발급 비용 <strong style={{ marginLeft: spacing[1], color: colors.gray[900] }}>5,000원</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* B5: 혜택 리스트 — flexShrink: 0 */}
        <div style={{
          flexShrink: 0,
          margin: `0 ${layout.margin} ${spacing[2]}`,
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          boxShadow: shadow.card,
          overflow: 'hidden',
        }}>
          {BENEFITS.map((benefit, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                padding: `${spacing[2]} ${spacing[4]}`,
                borderBottom: idx < BENEFITS.length - 1 ? `1px solid ${colors.gray[100]}` : 'none',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: benefit.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {benefit.iconContent}
              </div>
              <div style={{
                fontSize: sizes.sm,
                color: colors.gray[900],
                lineHeight: 1.5,
                fontFamily: typography.fontFamily,
              }}>
                {benefit.text}
              </div>
            </div>
          ))}
        </div>

        {/* 점선 구분선 — flexShrink: 0 */}
        <div style={{
          flexShrink: 0,
          margin: `${spacing[2]} 0`,
          borderTop: `1.5px dashed ${colors.gray[200]}`,
        }} />

        {/* B3: 아코디언 영역 — flex: 1, 접히면 헤더만, 펼치면 내부 스크롤 */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          margin: `0 ${layout.margin}`,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setAccordionOpen((v) => !v)}
            style={{
              flexShrink: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: spacing[2],
              minHeight: '40px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
            }}
          >
            <span style={{ fontSize: sizes.sm, color: colors.gray[700] }}>
              다양한 매장에서 혜택 누리세요!
            </span>
            {accordionOpen ? (
              <ChevronUp size={20} color={colors.gray[500]} />
            ) : (
              <ChevronDown size={20} color={colors.gray[500]} />
            )}
          </button>
          {accordionOpen && (
            <div style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: `0 ${spacing[3]} ${spacing[3]}`,
            }}>
              <div style={{
                display: 'flex',
                gap: spacing[3],
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}>
                {CATEGORY_ICONS.map(({ label, color }) => (
                  <div key={label} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing[1],
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CategoryIcon label={label} />
                    </div>
                    <span style={{
                      fontSize: sizes.xxs,
                      color: colors.gray[500],
                      whiteSpace: 'nowrap',
                      fontFamily: typography.fontFamily,
                    }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 신청하기 버튼 — flexShrink: 0, 항상 하단 고정 */}
        <div style={{
          flexShrink: 0,
          borderTop: `1px solid ${colors.gray[100]}`,
          padding: `${spacing[3]} ${layout.margin}`,
          paddingBottom: `calc(env(safe-area-inset-bottom) + ${spacing[3]})`,
        }}>
          <Button
            variant="filled"
            size="lg"
            onClick={applyCard}
          >
            간편 신청하기
          </Button>
        </div>
      </div>
    </ScreenContainer>
  )
}
