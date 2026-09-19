import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { colors, typography, layout, spacing } from '../../tokens/tokens'
import NaverLogo from '../../assets/icons/Naver.svg'
import { usePlatform } from '../../hooks/usePlatform'

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

const CARD_APPLY_SLIDE = {
  id: 'cardApply',
  bgColor: colors.primary[700],
  textColor: colors.onDark.primary,
  subTextColor: 'rgba(255,255,255,0.85)',
  title: '대구 곳곳에서 10% 캐시백',
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

  // 08차 9번: "캐시백 충전하고" 배너 제거 — 홈 카드의 "이번 달 할인충전" 위젯이 이미 그 역할을 한다
  const slides = hasCard
    ? [NAVER_SLIDE]
    : [CARD_APPLY_SLIDE, NAVER_SLIDE]

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
              if (slide.id === 'naver') navigate('/naver-guide')
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
              cursor: slide.id === 'naver' ? 'pointer' : 'default',
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
              {slide.buttonLabel && hasCard && (
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

      {/* dot 인디케이터 — 04차 대기 항목: 자동회전을 껐으니 탭으로도 이동 가능해야 한다.
          점 자체는 6px지만 버튼 히트 영역을 32px로 넓힌다. 슬라이드 수가 많아 48px씩 주면
          서로 겹치므로(MIFB 충돌 규칙) 겹치지 않는 한도 안에서 최대로 키운 값이다. */}
      <div style={{
        position: 'absolute',
        bottom: spacing[2],
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
      }}>
        {slides.length > 1 && slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentIndex(idx) }}
            aria-label={`${idx + 1}번째 배너로 이동`}
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{
              width: idx === safeIndex ? '18px' : '6px',
              height: '6px',
              borderRadius: layout.radiusPill,
              backgroundColor: idx === safeIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
            }} />
          </button>
        ))}
      </div>
    </div>
  )
}
