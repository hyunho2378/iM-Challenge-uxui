# 강릉페이 큰글씨 모드 디자인 사양

> 큰글씨 모드는 단순히 폰트만 키우는 게 아니라 **레이아웃, 컴포넌트, UX가 모두 다른 모드**다. 시니어 사용자와 시각 제약 사용자를 위한 별도 디자인 시스템.

---

## 1. 설계 원칙

### 1.1 HIG Dynamic Type 기반

iOS HIG는 "Large Accessibility Text" 모드를 별도 정의. 모든 폰트 1.3~1.4배 확대 + 레이아웃 자체 재구성. 좌우 배치 → 상하 배치 전환이 핵심.

### 1.2 4가지 핵심 원칙

| 원칙 | 의미 |
|------|------|
| **정보 밀도 다운** | 한 화면에 너무 많은 정보 X. 캐러셀 같은 자동 변경 UI 제거 |
| **액션 명확도 업** | 충전, QR, 환불 등 핵심 액션을 큰 박스로 분리. 한 카드 한 의도 |
| **의사결정 줄이기** | 시각 추적 부담 줄임. 정적 UI 우선. 자동 슬라이드 X |
| **텍스트 라벨 우선** | 아이콘 단독 → 텍스트 또는 아이콘+텍스트 변환 |

### 1.3 시니어 멘탈 모델 대응

- "메뉴" 햄버거 = 한국 시니어 친숙
- 🔍 돋보기 = 추상적, 큰글씨에서 제거
- 🔔 알림 = 큰글씨에서 텍스트 "알림"으로 변환

---

## 2. typography 토큰

### 2.1 sizeLarge 정의

`client/src/tokens/tokens.js`에 추가:

```js
typography.size = {
  largeTitle: '34px',
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
}

typography.sizeLarge = {
  largeTitle: '44px',     // +10
  balance: '40px',        // +12
  balanceLarge: '48px',   // +12
  appTitle: '30px',       // +8
  xl: '26px',             // +6
  lg: '24px',             // +6
  md: '22px',             // +5
  sm: '20px',             // +5
  xs: '17px',             // +4
  xxs: '15px',            // +3
  nav: '14px',            // +3
}
```

배율 약 1.3~1.4배. HIG Dynamic Type 권장 비율.

### 2.2 useTypography hook

`client/src/hooks/useTypography.js`:

```js
import { useApp } from '../context/AppContext'
import { typography } from '../tokens/tokens'

export function useTypography() {
  const { isLargeText } = useApp()
  return isLargeText ? typography.sizeLarge : typography.size
}
```

### 2.3 사용 패턴

```jsx
import { useTypography } from '../hooks/useTypography'

function MyComponent() {
  const sizes = useTypography()
  return <span style={{ fontSize: sizes.md }}>텍스트</span>
}
```

기존 `typography.size.xxx` 참조를 `sizes.xxx`로 일괄 교체.

---

## 3. 헤더 변형

### 3.1 일반 모드

```
[로고] [강릉페이]  [큰글씨] [🔍] [🔔]
```

좌측: 로고 + "강릉페이" 텍스트
우측: 큰글씨 토글 pill, 검색 아이콘, 알림 아이콘

### 3.2 큰글씨 모드

```
강릉페이              [큰글씨 끄기] [알림]
```

좌측: "강릉페이" 30px bold (로고 제거)
우측 1: "큰글씨 끄기" pill outline 버튼 (라벨 변경: "큰글씨" → "큰글씨 끄기")
우측 2: "알림" 텍스트 버튼

검색 아이콘 제거 (큰글씨 모드는 정보 밀도 다운 원칙).

### 3.3 헤더 컴포넌트

`components/layout/TopAppBarLargeText.jsx` 이미 존재. 위 사양으로 작성됨.

---

## 4. HomePage 큰글씨 모드 (HomePageLarge)

### 4.1 분기 처리

`pages/HomePage.jsx`:

```jsx
import { useApp } from '../context/AppContext'
import HomePageLarge from './HomePageLarge'

export default function HomePage() {
  const { isLargeText } = useApp()
  if (isLargeText) return <HomePageLarge />
  return (
    // 기존 일반 모드 코드 유지
  )
}
```

### 4.2 레이아웃 (위에서 아래)

```
┌──────────────────────────┐
│ [상태바 흰색]              │
├──────────────────────────┤
│ 강릉페이   [큰글씨 끄기][알림]│ ← 헤더
├──────────────────────────┤
│                            │
│ ╔══════════════════════╗ │
│ ║ 캐시백          0원    ║ │ ← 1단
│ ╠══════════════════════╣ │
│ ║ 강릉페이(1)     0원    ║ │ ← 2단
│ ║ 충전 잔액        0원   ║ │ ← 3단
│ ║                        ║ │
│ ║ [QR결제]  [충전]       ║ │ ← 2버튼
│ ╚══════════════════════╝ │
│                            │
│ ┌─캐시백 10%          ▷┐│ ← 캐시백 카드
│ │ 받은 금액 0원          ││
│ │ 이번 달 최대 3만원      ││
│ └──────────────────────┘│
│                            │
│ ┌─이용 내역           📋┐│ ← 이용내역 카드
│ └──────────────────────┘│
│                            │
│ ┌─환불(출금)        💰  ┐│ ← 환불 카드
│ │   큰 일러스트          ││
│ └──────────────────────┘│
│                            │
│ ┌─강릉페이 이용안내    ❓┐│ ← 안내 카드
│ └──────────────────────┘│
│                            │
├──────────────────────────┤
│ [홈][결제매장][이용내역][지원금·혜택][MY] │
└──────────────────────────┘
```

### 4.3 제거된 요소

| 일반 모드 | 큰글씨 모드 |
|----------|------------|
| 캐러셀 (카드 신청 / 캐시백 / 카카오 / 네이버) | 제거 |
| 위젯 추가하기 버튼 | 제거 |
| 카드 일러스트 3D | 제거 |
| 캐시백 진행바 + 직관 메시지 | 제거 (캐시백 카드만 유지) |
| 결제 가능 매장 섹션 | 제거 (바텀 탭에서 진입) |
| 강릉페이 120% 활용하기 | 제거 |

### 4.4 잔액 카드 구조

3단 정보 + 2버튼 구조:

| 단 | 라벨 | 값 | 라벨 폰트 | 값 폰트 |
|----|------|-----|---------|---------|
| 1단 | 캐시백 | monthlyCashback | sizes.md medium | sizes.xl bold |
| 2단 | 강릉페이(1) | balance | sizes.md medium | sizes.xl bold |
| 3단 | 충전 잔액 | balance | sizes.sm regular | sizes.md medium |

1단 배경: surface.background (회색)
2-3단 배경: surface.card (흰색)
1단과 2-3단 사이 1px 구분선

버튼
- QR결제: outline (white bg, gray-200 border, gray-900 text)
- 충전: fill (primary-700 bg, white text)
- height: 68px (일반 52px보다 큼)
- fontSize: sizes.md bold

### 4.5 카드 컴포넌트 사양

**캐시백 카드**
- padding: spacing[5]
- height: auto
- 우측 chevron 32px
- 클릭 시: navigate('/cashback')
- 텍스트 구성
  - 1줄: "캐시백 **10%**" (10% 부분 primary-700 bold)
  - 2줄: "받은 금액 {monthlyCashback}원" sizes.lg teal-500 bold
  - 3줄: "이번 달 최대 3만원" sizes.sm gray-500

**액션 카드 (이용내역, 강릉페이 이용안내)**
- padding: spacing[5]
- 좌측: 타이틀 sizes.lg bold
- 우측: 56x56 아이콘 박스 (radiusCard)
- 클릭 시: 각 페이지로 navigate

**환불 카드 (강조)**
- padding: spacing[6]
- minHeight: 140px
- 좌측: 타이틀 "환불(출금)" sizes.lg bold + 부제 sizes.sm gray-500
- 우측: 80x80 3D 일러스트 (돈주머니 + 코인)
- 클릭 시: navigate('/refund')

### 4.6 일러스트 사양 (환불 카드)

3D 스타일 SVG, 80x80:
- 돈주머니: 초록 그라데이션 (#22C55E + #15803D opacity)
- 묶음 끈: #15803D 짙은 초록
- ₩ 문자: 흰색 bold 20px
- 코인: 황색 #FBBF24, 우측 상단, 10px 반지름
- 코인 ₩ 문자: #92400E bold 11px

---

## 5. 다른 페이지 큰글씨 적용

### 5.1 전략

HomePage만 완전 재설계, 다른 페이지는 useTypography hook으로 폰트만 1.3배 확장.

### 5.2 적용 우선순위

1. **ChargePage** (충전) - 핵심 액션
2. **RefundPage** (환불) - 핵심 액션
3. **CashbackPage** (캐시백) - 홈에서 진입
4. **HistoryPage** (이용내역) - 시니어 자주 확인
5. **SupportPage** (지원금·혜택)
6. **MyPage**
7. **CardApplyPage** (카드 신청)

### 5.3 작업 패턴

각 페이지:

```jsx
// 1. import 추가
import { useTypography } from '../hooks/useTypography'

// 2. 컴포넌트 함수 안에 hook 호출
function SomePage() {
  const sizes = useTypography()
  // ...
}

// 3. fontSize 참조 교체
// Before: fontSize: typography.size.md
// After: fontSize: sizes.md
```

### 5.4 핵심 컴포넌트 (페이지 외)

- TopAppBar.jsx (이미 LargeText 버전 있음)
- BottomNavBar.jsx (라벨 폰트 확장 필요)
- 헤더 타이틀 컴포넌트 (HistoryPage, SupportPage 등)

---

## 6. 레이아웃 깨짐 대처

### 6.1 빈번한 깨짐 위치

| 위치 | 증상 | 대처 |
|------|------|------|
| 잔액 표시 ("100,000원") | 박스 안에 안 들어감 | wordBreak: 'keep-all', minWidth 조정 |
| 버튼 텍스트 | 줄바꿈 또는 짤림 | 버튼 height 키움, padding 증가 |
| 카드 라벨 | 두 줄로 늘어남 | lineHeight 1.4, 카드 minHeight 키움 |
| 잔액 카드 | 전체 높이 부족 | padding spacing[5]로 증가 |

### 6.2 대처 패턴

**A. wordBreak 적용**
```jsx
<span style={{ wordBreak: 'keep-all', lineHeight: 1.4 }}>
  텍스트
</span>
```

**B. minHeight 보장**
```jsx
<button style={{ minHeight: 68 }}>버튼</button>
```

**C. isLargeText 분기로 별도 처리**
```jsx
const { isLargeText } = useApp()
const padding = isLargeText ? spacing[5] : spacing[3]
```

---

## 7. 작업 체크리스트

### 7.1 인프라 (1단계)

- [ ] tokens.js에 typography.sizeLarge 추가
- [ ] hooks/useTypography.js 생성
- [ ] AppContext.isLargeText state 확인
- [ ] 빌드 0 오류

### 7.2 HomePage 큰글씨 (2단계)

- [ ] HomePage.jsx에 isLargeText 분기 추가
- [ ] HomePageLarge.jsx 신규 작성
- [ ] 잔액 카드 3단 + 2버튼 구조
- [ ] 캐시백 카드
- [ ] 이용내역 카드
- [ ] 환불 카드 (3D 일러스트)
- [ ] 강릉페이 이용안내 카드
- [ ] 큰글씨 토글 시 즉시 전환 동작

### 7.3 다른 페이지 확산 (3단계)

- [ ] ChargePage useTypography 적용
- [ ] RefundPage useTypography 적용
- [ ] CashbackPage useTypography 적용
- [ ] HistoryPage useTypography 적용
- [ ] SupportPage useTypography 적용
- [ ] MyPage useTypography 적용
- [ ] CardApplyPage useTypography 적용
- [ ] BottomNavBar 라벨 폰트 확장
- [ ] 각 페이지 레이아웃 깨짐 검증

---

## 8. 시각 검증 시나리오

큰글씨 모드 토글 후 다음 확인:

| 화면 | 확인 항목 |
|------|----------|
| 홈 | 캐러셀 없음, 잔액 카드 3단, 환불 카드 일러스트 |
| 충전 | 숫자패드 큰 폰트, 빠른금액 칩 크기 적절 |
| 환불 | 매장 정보, 환불 가능 여부 텍스트 가독성 |
| 캐시백 | 적립 금액 큰 폰트, 한도 정보 명확 |
| 이용내역 | 거래 내역 폰트 1.3배, 매장명 잘림 없음 |
| 헤더 | "강릉페이" 30px, 검색 아이콘 사라짐, "알림" 텍스트 |
| 바텀 네비 | 라벨 폰트 14px, 아이콘 크기 유지 |

---

## 9. 디벨롭 백로그

향후 추가 가능 항목 (발표 후 디벨롭):

- 음성 안내 (TTS) 통합
- 고대비 모드 (high contrast)
- 한 손 모드 (one-hand reach)
- 큰글씨 + 다크 모드 동시 지원
- 큰글씨 모드 전용 차트/그래프