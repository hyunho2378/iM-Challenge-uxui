import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { colors, typography, layout, spacing } from '../../tokens/tokens'
import KakaoLogo from '../../assets/icons/Kakao.svg'
import NaverLogo from '../../assets/icons/Naver.svg'
import { usePlatform } from '../../hooks/usePlatform'

const KAKAO_SLIDE = {
  id: 'kakao',
  bgColor: colors.kakaoBg,
  textColor: colors.kakaoDark,
  subTextColor: colors.explore.amberDark,
  title: '카카오페이로도\n결제하세요',
  description: '카카오페이와 연결하면 더 편리해요',
  illustration: (
    <img
      src={KakaoLogo}
      alt="카카오페이"
      style={{ height: '40px', objectFit: 'contain' }}
    />
  ),
}

const NAVER_SLIDE = {
  id: 'naver',
  bgColor: colors.pageBg.bannerMint,
  textColor: colors.illustration.leafDark,
  subTextColor: colors.illustration.leafDark,
  title: '네이버페이로도\n결제하세요',
  description: '네이버페이와 연결하면 더 편리해요',
  illustration: (
    <img
      src={NaverLogo}
      alt="네이버페이"
      style={{ height: '40px', objectFit: 'contain' }}
    />
  ),
}

// R5: 캐시백 충전 슬라이드 — primary-100 라이트 블루 (teal-600 초록 제거)
const BASE_SLIDES = [
  {
    id: 'cashback',
    bgColor: colors.primary[100],
    textColor: colors.primary[800],
    subTextColor: colors.primary[700],
    buttonBg: colors.primary[200],
    buttonTextColor: colors.primary[800],
    title: '캐시백 충전하고',
    description: '강릉 전역에서 사용하세요',
    buttonLabel: '충전하기',
    buttonPath: '/charge',
    illustration: (
      <svg width="76" height="64" viewBox="0 0 100 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-8deg)' }}>
        <rect x="0" y="0" width="100" height="64" rx="8" fill={colors.surface.card} />
        <text x="8" y="22" fontSize="13" fontWeight="700" fill={colors.primary[700]} fontFamily="sans-serif">iM샵</text>
        <rect x="8" y="32" width="26" height="16" rx="3" fill={colors.gray[200]} />
        <rect x="8" y="54" width="14" height="3" rx="1.5" fill={colors.gray[300]} />
      </svg>
    ),
  },
]

const CARD_APPLY_SLIDE = {
  id: 'cardApply',
  bgColor: colors.primary[700],
  textColor: colors.onDark.primary,
  subTextColor: 'rgba(255,255,255,0.85)',
  title: '강릉 곳곳에서 10% 캐시백',
  description: '신청만 하면 바로 적용',
  buttonLabel: '신청하기',
  buttonPath: '/card-apply',
  illustration: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default function BannerCarousel({ applyButtonRef }) {
  const navigate = useNavigate()
  const { hasCard } = useUser()
  const isAndroid = usePlatform() === 'android'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startX, setStartX] = useState(null)

  const slides = hasCard
    ? [...BASE_SLIDES, KAKAO_SLIDE, NAVER_SLIDE]
    : [CARD_APPLY_SLIDE, ...BASE_SLIDES, KAKAO_SLIDE, NAVER_SLIDE]

  const safeIndex = Math.min(currentIndex, slides.length - 1)

  // 자동 회전을 없앴다. 5초마다 슬라이드가 바뀌면 시니어가 읽는 도중 내용이 사라지고,
  // 누르려던 대상이 손가락 아래에서 움직인다. 이제 사용자가 스와이프할 때만 이동한다.
  const go = (dir) => {
    const next = dir > 0
      ? Math.min(safeIndex + 1, slides.length - 1)
      : Math.max(safeIndex - 1, 0)
    setCurrentIndex(next)
  }

  const handleTouchStart = (e) => setStartX(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    if (startX === null) return
    const diff = startX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1)
    setStartX(null)
  }
  const handleMouseDown = (e) => setStartX(e.clientX)
  const handleMouseUp = (e) => {
    if (startX === null) return
    const diff = startX - e.clientX
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1)
    setStartX(null)
  }

  return (
    <div style={{
      margin: `0 ${layout.margin}`,
      borderRadius: layout.radiusCard,
      overflow: 'hidden',
      userSelect: 'none',
      position: 'relative',
    }}>
      {/* 슬라이드 트랙 */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          display: 'flex',
          transform: `translateX(-${safeIndex * 100}%)`,
          transition: 'transform 300ms ease-out',
          width: '100%',
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            onClick={() => {
              if (slide.id === 'kakao') navigate('/kakao-guide')
              else if (slide.id === 'naver') navigate('/naver-guide')
            }}
            style={{
              width: '100%',
              flexShrink: 0,
              backgroundColor: slide.bgColor,
              height: '120px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `0 ${spacing[4]} 0 ${spacing[5]}`,
              cursor: (slide.id === 'kakao' || slide.id === 'naver') ? 'pointer' : 'default',
            }}
          >
            {/* 좌측 텍스트 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], flex: 1 }}>
              <p style={{
                margin: 0,
                color: slide.textColor,
                fontSize: typography.size.md,
                fontWeight: typography.weight.bold,
                lineHeight: 1.35,
                whiteSpace: 'pre-line',
              }}>
                {slide.title}
              </p>
              <p style={{
                margin: 0,
                color: slide.subTextColor,
                fontSize: typography.size.xs,
                fontWeight: typography.weight.medium,
              }}>
                {slide.description}
              </p>
              {slide.buttonLabel && slide.id !== 'kakao' && hasCard && (
                <button
                  ref={slide.id === 'cardApply' ? applyButtonRef : undefined}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(slide.buttonPath)
                  }}
                  style={{
                    marginTop: spacing[1],
                    alignSelf: 'flex-start',
                    backgroundColor: slide.buttonBg || 'rgba(255,255,255,0.25)',
                    color: slide.buttonTextColor || slide.textColor,
                    border: 'none',
                    borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
                    padding: `6px 14px`,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.semibold,
                    cursor: 'pointer',
                    fontFamily: typography.fontFamily,
                  }}
                >
                  {slide.buttonLabel}
                </button>
              )}
            </div>

            {/* 우측 일러스트 */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {slide.illustration}
            </div>
          </div>
        ))}
      </div>

      {/* dot 인디케이터 — 슬라이드 트랙 위 오버레이 */}
      <div style={{
        position: 'absolute',
        bottom: spacing[2],
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: spacing[1],
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {slides.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: idx === safeIndex ? '18px' : '6px',
              height: '6px',
              borderRadius: layout.radiusPill,
              backgroundColor: idx === safeIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
