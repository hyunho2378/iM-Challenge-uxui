// tokens.js — iM샵 AS-IS 디자인 토큰
// 스크린샷 79장 분석 기반 추출값
// 모든 컴포넌트는 이 파일에서만 값을 가져온다

export const colors = {
  // 브랜드 (iM샵 인디고). 캡처 IMG_0733 추출값
  primary: {
    50:  '#F4F3FA',
    100: '#E8E6F4',
    200: '#CDC7F0',
    300: '#ABA0EE',  // 큰글씨 버튼 테두리
    400: '#816FEE',
    500: '#6651EB',
    600: '#5C46EA',
    700: '#5139E8',  // 버튼, 링크, 활성 탭, 텍스트 강조 (캡처 시드값)
    800: '#3218D2',  // 잔액 카드 다크 배경
    900: '#2613A0',
  },

  // 캐시백 틸
  teal: {
    400: '#2DD4BF',
    500: '#14B8A6',  // 캐시백 진행바, "받은 금액" 텍스트
    600: '#0D9488',  // 배너 슬라이드 배경 (teal-600)
  },

  // 상태
  error: '#EF4444',
  errorDark: '#DC2626',  // red-600 (TransportCardPage 주의사항 텍스트)
  warning: '#F59E0B',
  success: '#10B981',

  // 그레이
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',  // 구분선, 비활성 입력창
    300: '#D1D5DB',
    400: '#9CA3AF',  // 비활성 탭 아이콘, placeholder
    500: '#6B7280',  // 보조 텍스트 (날짜, 거리 등)
    700: '#374151',
    800: '#1F2937',
    900: '#111827',  // 주요 본문 텍스트
  },

  // 서피스
  surface: {
    background: '#F2F4F8',
    card: '#FFFFFF',
    // 05차: 원본 스크린샷 실측값(IMG_0744 드로어 다크 배경, 지배색 97만 픽셀·최고 신뢰도).
    // IMG_0924(이벤트 페이지 CTA 섹션)에서도 같은 계열의 다크 네이비를 재확인했다.
    darkCard: '#241F45',
    overlay: 'rgba(0,0,0,0.5)',
    // QR 스캐너 카메라 뷰포트 배경 (검정이어야 카메라 영상이 정확히 보인다)
    scannerBackdrop: '#000000',
  },

  // 경고/주의 배경
  alertBg: '#FEF2F2',      // red-50 (CardLostPage·TransportCardPage 경고 박스)
  alertBorder: '#FECACA',  // red-200 (TransportCardPage 경고 박스 테두리)
  warmBorder: '#FED7AA',   // orange-200 (CardLostPage 주의사항 박스 테두리)
  warnDark: '#C2410C',     // orange-700 (CardLostPage 주의 제목 텍스트)

  // 카카오 전용 색상
  kakaoYellow: '#FEF08A', // yellow-200 (KakaoPayGuidePage 배경)
  kakaoDark:   '#78350F', // amber-900 (KakaoPayGuidePage 텍스트)

  // 특수 배너 배경
  kakaoBg: '#FEF3C7',   // 카카오 프로모 카드 배경
  donationBg: '#FFF0F3', // 기부 캠페인 핑크 배경
  tourBg: '#FFF3E0',    // 관광 섹션 따뜻한 배경
  chatBg: '#EFF6FF',    // 챗봇/파랑 배경
  pinkBg: '#FCE7F3',    // 관광 카드 분홍 배경
  greenBg: '#F0FDF4',   // 기부 카드 연두 배경
  warmBg: '#FFF7ED',    // 기부 카드 오렌지크림 배경
  purpleBg: '#EDE9FE',  // 퍼플 배경 (기부 카드, 이용안내 아이콘)
  purpleAccent: '#6D28D9', // 기부 카드 퍼플 액센트
  purpleDark: '#5B21B6', // 이용안내 아이콘 짙은 퍼플 (purple-800)
  successBg: '#F0FDF4',  // 성공/완료 화면 배경 (green-50)
  successBorder: '#BBF7D0', // 성공/완료 화면 테두리 (green-200)
  wishBg: '#FFFBEB',    // 원하는 지원금 별 아이콘 배경 (amber-50)
  warningBg: '#FFFBEB',     // Phase 2 — S5 잔액 부족 경고 배경 (amber-50)
  warningBorder: '#FDE68A', // Phase 2 — S5 잔액 부족 경고 테두리 (amber-200)

  // 배너 캐러셀 슬라이드 텍스트 색상
  banner: {
    darkRed: '#991B1B',  // 기부 배너 제목/버튼 (red-800)
    pink:    '#BE185D',  // 기부 배너 서브텍스트 (pink-700)
  },

  // 탐색 카드(ExploreScrollCard) 텍스트 계열
  explore: {
    amberDark: '#B45309',   // 카카오 카드 설명 (amber-700)
    emeraldDark: '#047857', // 지원금 카드 설명 (emerald-700)
    purpleDarker: '#4C1D95',// 소통 카드 제목 (purple-900)
    purpleMid: '#7C3AED',   // 소통 카드 화살표 (purple-600)
  },

  // 지원금 랭킹 메달 색상
  medal: {
    goldBg: '#FEF3C7',    // 1위 배경 (amber-100)
    goldIcon: '#F59E0B',  // 1위 아이콘 (amber-400)
    goldBorder: '#FDE68A',// 1위 테두리 (amber-200)
    silverBg: '#F1F5F9',  // 2위 배경 (slate-100)
    silverIcon: '#94A3B8',// 2위 아이콘 (slate-400)
    silverBorder: '#E2E8F0', // 2위 테두리 (slate-200)
    bronzeBg: '#FEF2E9',  // 3위 배경
    bronzeIcon: '#CD7C3E',// 3위 아이콘
    bronzeBorder: '#FDE8C8', // 3위 테두리
  },

  // TagChip 변형 색상
  tag: {
    cashBg:     '#D1FAE5',  // 현금 태그 배경 (emerald-100)
    cashText:   '#065F46',  // 현금 태그 글자 (emerald-800)
    voucherBg:  '#FFEDD5',  // 이용권 태그 배경 (orange-100)
    voucherText:'#9A3412',  // 이용권 태그 글자 (orange-800)
    noticeText: '#92400E',  // 알림/공지 텍스트 (amber-800)
  },

  // 매장 카테고리 아이콘 배경색 (StoreListItem)
  store: {
    category: {
      food:        '#FF6B35',  // 음식점 (오렌지)
      cafe:        '#8B5CF6',  // 카페 (보라)
      convenience: '#10B981',  // 편의점 (초록)
      lodging:     '#3B82F6',  // 숙박 (파랑)
      tour:        '#F59E0B',  // 관광 (노랑)
      mart:        '#EF4444',  // 마트 (빨강)
      medical:     '#06B6D4',  // 의료 (시안)
      beauty:      '#EC4899',  // 미용 (핑크)
      transit:     '#64748B',  // 교통 (슬레이트)
      living:      '#F97316',  // 생활 (오렌지)
      education:   '#0EA5E9',  // 교육 (하늘)
    },
  },

  // 일러스트 전용 색 (브랜드색 아님. SVG 삽화의 고정 색상이라 리브랜딩 대상이 아니다)
  illustration: {
    cardChip:       '#E8C840',  // 카드 IC칩 금색 면
    cardChipLine:   '#C8A830',  // 카드 IC칩 금색 선
    leaf:           '#22C55E',  // 큰글씨 홈 나무 잎
    leafDark:       '#15803D',  // 큰글씨 홈 나무 잎 그늘 + 배너 초록 텍스트
    coin:           '#FBBF24',  // 큰글씨 홈 동전
    coinText:       '#92400E',  // 큰글씨 홈 동전 원화 기호
  },

  // 페이지 전용 배경
  pageBg: {
    cardApply:  '#E4EFFD',  // 카드 신청 화면 상단 그라디언트 시작색
    bannerMint: '#E6F9EC',  // 캐시백 배너 슬라이드 배경
  },

  // 안드로이드 상태바 (OS 렌더 값 모사. 브랜드색 아님)
  androidStatusBar: '#222227',

  // 다크 카드 위 텍스트
  onDark: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
  },
};

// ─── Liquid Glass (iOS 26 규격을 CSS backdrop-filter로 재현) ──────────────────
// CSS는 tokens.js를 직접 읽지 못한다. 키를 CSS 변수명으로 두고 App.jsx가 :root에 주입한다.
// index.css의 .glass 규칙이 이 변수들만 참조하므로 색 단일 소스가 유지된다.
// 굴절(픽셀 변위)은 넣지 않는다. backdrop-filter로는 불가능하고, SVG feDisplacementMap은
// Chromium 전용이라 iOS 사파리에서 어차피 폴백되며, 텍스트가 일그러져 시니어 가독을 해친다.
export const glass = {
  '--glass-blur': '12px',
  '--glass-saturate': '170%',
  '--glass-tint': 'rgba(255,255,255,0.13)',
  '--glass-border': 'rgba(255,255,255,0.30)',
  // specular edge. 유리 느낌의 대부분이 이 상단 흰 선에서 나온다
  '--glass-specular-top': 'rgba(255,255,255,0.85)',
  '--glass-specular-bottom': 'rgba(255,255,255,0.14)',
  '--glass-drop-shadow': 'rgba(0,0,0,0.18)',

  // 시니어 모드 / prefers-reduced-transparency: 유리를 끄지 않고 읽을 수 있게 낮춘다
  '--glass-blur-senior': '4px',
  '--glass-saturate-senior': '110%',
  '--glass-tint-senior': 'rgba(255,255,255,0.92)',
  '--glass-border-senior': 'rgba(17,24,39,0.18)',
  '--glass-specular-top-senior': 'rgba(255,255,255,0.60)',

  // backdrop-filter 미지원 기기 폴백 (구형 저사양 단말)
  '--glass-tint-fallback': 'rgba(255,255,255,0.96)',
};

// ─── MD3 타입스케일 (안드로이드 브랜치 기준, rem) ─────────────────────────────
// MD3 baseline 정확값. 단 본문은 시니어 하한 때문에 bodyLarge(1rem=16px)를 기본으로 쓴다.
// bodyMedium/bodySmall은 스케일 완전성을 위해 두되 본문 카피에는 쓰지 않는다.
export const md3Type = {
  displayLarge:  { size: '3.5625rem', weight: 400 },
  displayMedium: { size: '2.8125rem', weight: 400 },
  displaySmall:  { size: '2.25rem',   weight: 400 },
  headlineLarge: { size: '2rem',      weight: 400 },
  headlineMedium:{ size: '1.75rem',   weight: 400 },
  headlineSmall: { size: '1.5rem',    weight: 400 },
  titleLarge:    { size: '1.375rem',  weight: 400 },
  titleMedium:   { size: '1rem',      weight: 500 },
  titleSmall:    { size: '0.875rem',  weight: 500 },
  bodyLarge:     { size: '1rem',      weight: 400 },  // 시니어 본문 하한
  bodyMedium:    { size: '0.875rem',  weight: 400 },
  bodySmall:     { size: '0.75rem',   weight: 400 },
  labelLarge:    { size: '0.875rem',  weight: 500 },
  labelMedium:   { size: '0.75rem',   weight: 500 },
  labelSmall:    { size: '0.6875rem', weight: 500 },
};

// ─── MD3 shape scale (안드로이드 브랜치) ─────────────────────────────────────
export const md3Shape = {
  none: '0px',
  extraSmall: '4px',
  small: '8px',
  medium: '12px',
  large: '16px',
  largeIncreased: '20px',
  extraLarge: '28px',
  extraLargeIncreased: '32px',
  full: '999px',
};

export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard', 'Noto Sans KR', sans-serif",

  size: {
    largeTitle: '34px',   // Phase 2 — S1,S3 잔액 Large Title (Nielsen #1, Shneiderman #3)
    balance: '28px',
    balanceLarge: '36px',
    appTitle: '22px',

    xl: '20px',
    lg: '18px',
    md: '17px',
    sm: '15px',
    xs: '13px',
    xxs: '12px',
    nav: '11px',
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 800,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    body: 1.5,    // 전역 본문 기본값. 브라우저 기본(약 1.2)은 한글 본문에 좁다
    loose: 1.6,
  },

  sizeLarge: {
    largeTitle: '44px',
    balance: '40px',
    balanceLarge: '48px',
    appTitle: '30px',
    xl: '26px',
    lg: '24px',
    md: '22px',
    sm: '20px',
    xs: '17px',
    xxs: '15px',
    nav: '14px',
  },
};

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
};

export const layout = {
  columns: 4,
  gutter: '8px',
  margin: '16px',
  viewport: '390px',

  topBarHeight: '48px',  // touchMin 48px 아이콘 버튼을 담으려면 상단바도 48px이어야 한다
  bottomNavHeight: '83px',
  qrBarHeight: '56px',

  touchMin: '48px',  // 시니어 기준. WCAG 최소 44px보다 높게 잡는다

  radiusCard: '16px',
  radiusPill: '999px',
  radiusChip: '20px',
  radiusButton: '12px',
  radiusModal: '20px',
  radiusSmall: '8px',
};

export const shadow = {
  card: '0 2px 8px rgba(0,0,0,0.08)',
  modal: '0 -4px 20px rgba(0,0,0,0.12)',
  button: '0 2px 6px rgba(81,57,232,0.25)',  // primary.700(#5139E8) 기준
  nav: '0 -1px 0 rgba(0,0,0,0.08)',
};
