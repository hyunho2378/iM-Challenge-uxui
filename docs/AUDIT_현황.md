# AUDIT 현황 (리디자인 착수 전 스냅샷)

검수일: 2026-09-13
검수 대상: `client/src` 전체 (JSX 116파일, 약 15,600 LOC)
근거 스킬: `.claude/skills/apple-design`, `.claude/skills/make-interfaces-feel-better`(이하 MIFB), `.claude/skills/review-animations`(이하 RA)
참고 문서: `docs/md3-reference/` (스킬 아님, 읽기 전용)

**이 검수에서 코드는 한 줄도 수정하지 않았다. 진단만 기록한다.**

---

## 요약 10줄

1. 홈 첫 화면이 프로모션을 먼저 보여주고 핵심 태스크를 아래로 밀어낸다. 위젯 배너와 5초 자동 회전 캐러셀이 잔액/충전/결제 카드보다 위에 있다.
2. 심사 관점: 시니어가 앱을 여는 이유는 충전과 결제다. 첫 화면이 그 두 가지를 즉시 주지 않으면 접근성 점수와 사업화 설득력을 동시에 잃는다.
3. 충전과 결제 흐름에 실패 상태가 아예 없다. 단계는 입력/확인/완료 3개뿐이고 서버 호출 실패는 `.catch(() => {})`로 삼킨다.
4. 심사 관점: 금융 앱에서 실패 복구 안내 부재는 기능 결함이자 시니어 이탈의 1순위 원인이다. 사업화 심사에서 가장 먼저 지적당한다.
5. 색 단일 소스 규칙이 이미 깨져 있다. `index.css`가 `tokens.js`와 별개로 29개 hex를 중복 정의해 브랜드 교체 시 두 곳이 갈라진다.
6. 심사 관점: iM샵 리브랜딩을 하려면 색을 한 곳에서만 바꿔야 한다. 지금 구조로는 교체 누락이 확실히 발생한다.
7. 시니어용 터치 타깃이 기준 미달이다. 특히 "큰글씨" 토글 자체가 약 24px로 화면에서 가장 작은 버튼 중 하나다.
8. 심사 관점: 접근성 기능으로 내세울 요소가 접근성 기준을 스스로 위반하면 심사에서 역효과를 낸다.
9. 잔액과 금액 표시 32곳 중 tabular-nums를 쓴 곳이 2곳뿐이고, 홈 잔액(34px)은 미적용이라 충전 직후 숫자가 흔들린다.
10. 기본 모드 본문에 11~13px 글자가 117곳 쓰인다. 큰글씨 모드로만 접근성을 해결한 구조라 기본 모드가 노안 기준에 미달한다.

### 가장 심각한 문제 Top 5

| 순위 | 문제 | 대표 위치 | 심각도 |
| --- | --- | --- | --- |
| 1 | 충전/결제 실패 상태와 복구 안내가 존재하지 않음 | `client/src/components/payment/ChargeScreen.jsx:28` | 상 **[부분: 에러 상태 세팅 완료. 실패 화면 UX는 대기]** |
| 2 | 홈 첫 화면에서 핵심 태스크가 프로모션 2개 아래로 밀림 | `client/src/pages/HomePage.jsx:84-96` | 상 **[부분: 캐러셀 자동회전 정지. 순서 변경은 대기]** |
| 3 | 색 단일 소스 규칙 위반 (`index.css`가 병행 색 정의) | `client/src/index.css:9-47` | 상 **[해결]** |
| 4 | 시니어 터치 타깃 미달, 특히 큰글씨 토글 | `client/src/components/layout/TopAppBar.jsx:52` | 상 **[부분: touchMin 48px 상향 완료. 큰글씨 토글 자체는 대기]** |
| 5 | 금액 표시에 tabular-nums 미적용 | `client/src/components/home/BalanceCardExpanded.jsx:75` | 중 **[해결]** |

---

## 02차 작업 결과 (2026-09-13, 지시서 02)

`npm run build` 통과. 아래는 이번에 실제로 바꾼 것과, 캡처를 받은 뒤로 미룬 것이다.

### 선행 조치: 깨져 있던 빌드 복구

검수 시점에는 확인하지 않았으나, 이 저장소는 **처음부터 빌드가 실패하는 상태**였다.
로고 SVG 2종의 파일명이 깨진 형태(`#Uac15#Ub989...svg`)로 저장되어 있는데 import는 한글 파일명을
가리켜 3개 파일에서 모듈을 찾지 못했다. 각 STEP의 빌드 검증이 불가능하므로 먼저 복구했다.

| 조치 | 위치 |
| --- | --- |
| 로고 파일명을 브랜드 중립 이름으로 변경 (`logo-blue.svg`, `logo-white.svg`) | `client/src/assets/logos/` |
| import 3곳 경로 수정 | `client/src/components/layout/TopAppBar.jsx:10`, `client/src/components/layout/TopAppBarLargeText.jsx:4`, `client/src/pages/SplashPage.jsx:1` |

이제 iM 로고를 같은 파일명으로 덮어쓰면 코드 수정 없이 교체된다.

### 해결

| # | 항목 | 조치 | 위치 |
| --- | --- | --- | --- |
| 1 | 색 이중 정의 제거 | `index.css`의 Tailwind `@theme` 색 변수 29개 삭제. 이 프로젝트는 `className`을 한 번도 쓰지 않아 소비자가 없는 죽은 코드였다 | `client/src/index.css` |
| 2 | `body` 배경 하드코딩 제거 | CSS는 토큰을 읽을 수 없으므로 `App.jsx`가 `colors.surface.background`를 주입한다 | `client/src/App.jsx:35-38`, `client/src/index.css:20` |
| 3 | 하드코딩 색 전량 토큰화 | 110건 → 0건 (국기 SVG 22건 제외). 흰색·검정 리터럴 31건, 매장 카테고리 5색, 일러스트 6색, 페이지 배경 2색, 안드로이드 상태바 1색을 토큰으로 옮겼다 | `client/src` 전역 21개 파일 |
| 4 | iM샵 primary 스케일 적용 | `colors.primary` 10단계 교체. 700에 캡처 시드 `#5139E8`을 앉혀 기존 매핑을 그대로 유지했고, 이를 참조하는 61개 파일이 자동으로 따라왔다 | `client/src/tokens/tokens.js:6-18` |
| 5 | rgba에 숨어 있던 구 브랜드색 | `shadow.button`이 구 블루 `rgba(29,78,216,...)`였다. 색 grep에 잡히지 않는 형태라 놓치면 파란 그림자만 남을 뻔했다 | `client/src/tokens/tokens.js:246` |
| 6 | 앱 이름 교체 | `강릉페이` → `iM샵` 100건, 27개 파일. 조사도 함께 맞췄다 (`iM샵`은 받침이 있어 `를 → 을`, `로 → 으로`) | `client/src` 전역 |
| 7 | 터치 타깃 상향 | `layout.touchMin` 44px → 48px | `client/src/tokens/tokens.js:233` |
| 8 | 상단바 높이 상향 | 44px 고정 바 안에 48px 버튼이 들어가 2px씩 넘쳤다. `topBarHeight`도 48px로 올려야 48px가 실제로 확보된다 | `client/src/tokens/tokens.js:229` |
| 9 | 캐시백 모드 토글 높이 | 토큰을 쓰지 않고 `height: 44`로 박혀 있어 48px 기준에 미달했다 | `client/src/components/home/BalanceCardExpanded.jsx:106` |
| 10 | ease-in 제거 (인증 곡선) | 인증 애니메이션 후반 30%가 2제곱 ease-in이라 사용자가 결과를 기다리는 마지막 순간을 느리게 만들었다. 시작·끝값을 보존한 채 ease-out으로 교체 | `client/src/components/home/CardBackModal.jsx:20-28`, `client/src/components/common/PaymentAuthOverlay.jsx:16-26` |
| 11 | ease-in 머리 커브 제거 | 위젯 패널 펼침이 MD3 `cubic-bezier(0.4,0,0.2,1)`이라 앞머리가 ease-in이었다. 강한 ease-out으로 바꾸고 400ms를 240ms로 줄였다 | `client/src/components/home/WidgetAddBanner.jsx:68` |
| 12 | **배너 캐러셀 자동회전 정지** | 5초 무한 자동회전을 제거했다. 읽는 도중 내용이 바뀌고 누르려던 대상이 손가락 아래에서 움직이는 문제가 사라진다. 배치와 정보위계는 건드리지 않았다 | `client/src/components/home/BannerCarousel.jsx:102-109` |
| 13 | `transition: all` 제거 | 6건 → 0건. 실제로 바뀌는 속성만 명시했다. `CardApplyPage`의 1건은 전환되는 속성이 없는 죽은 선언이라 삭제 | 6개 파일 |
| 14 | tabular-nums 적용 | 금액 렌더 지점이 20곳이 넘어 개별 수정은 누락이 생긴다. `font-variant-numeric`은 상속되므로 `body`에 한 번 선언해 홈 잔액(34px)을 포함한 모든 숫자에 적용했다 | `client/src/index.css:23-26` |
| 15 | concentric radius | 이용안내 카드(16px) 안의 48px 아이콘 칩이 카드와 같은 radius라 눌려 보였다. `radiusSmall`(8px)로 조정 | `client/src/pages/HomePage.jsx:136` |
| 16 | 깊이용 border를 shadow로 | 캐시백 진입 카드만 테두리로 깊이를 표현했다. 다른 카드와 같은 `shadow.card`로 통일 | `client/src/components/home/CashbackEntryCard.jsx:18-19` |
| 17 | 에러를 삼키지 않게 | `logAction(...).catch(() => {})` 3곳이 서버 기록 실패를 조용히 버렸다. `lastError` 상태를 세팅하고 context로 노출했다. 실패 화면은 아직 그리지 않는다 | `client/src/context/UserContext.jsx:156, 185, 193, 202, 223-224` |

검증: 패치한 이징 곡선 2개를 수치로 확인했다. 끝점 보존(`f(0)=0`, `f(1)=1`), 단조증가,
후반 감속(0.8~0.9 구간 증가분이 0.9~1.0 구간보다 큼). 교체 전에는 후반이 가속했다.

### 대기 (캡처 확보 후 처리)

| # | 항목 | 미룬 이유 | AUDIT 항목 |
| --- | --- | --- | --- |
| 1 | 홈 정보위계 재설계 | 프로모션 2개가 잔액·충전 카드 위에 있는 구조. 순서 변경은 홈 재설계 범위라 이번에 손대지 않았다 | D-4 |
| 2 | 큰글씨 모드 진입점 (약 24px) | 지시서에서 이번 범위 제외를 명시했다. 홈 재설계와 함께 처리한다 | B-4 |
| 3 | 잔액 카드 다크 배경 정밀 보정 | 캡처 IMG_0733에 잔액 카드가 없어 `primary.800`(`#3218D2`)을 임시로 앉혔다. 코드에 임시임을 주석으로 명시했다 | STEP 2 |
| 4 | 실패 화면 UX | 에러 상태만 세팅했다. 사용자에게 보여줄 복구 안내 화면 설계는 캡처 이후 | D-3 |
| 5 | 가맹점 데이터 교체 | `stores.json`·`qr-stores.json`의 15,818건은 문자열 치환 대상이 아니라 대구 데이터로 통째 교체할 대상이다 | E |
| 6 | 로고 에셋 | 파일명만 중립화했고 그림은 강릉 로고 그대로다. iM 로고 확보 후 같은 이름으로 덮어쓰면 된다 | E |
| 7 | `surface.background` 미세조정 | 캡처의 `#F5F5F5`와 현재 `#F2F4F8`의 근소 차이. 지시서에서 이번엔 건드리지 말라고 했다 | STEP 2 |
| 8 | 잔액 카드 concentric radius | 바깥 16px + padding 16px + 안쪽 16px. 엄밀히 맞추려면 바깥 radius나 padding을 바꿔야 하는데, 둘 다 홈 hero 카드의 시각 결정이라 재설계가 판단할 몫이다 | B-1 |
| 9 | 캐러셀 수동 컨트롤 | 자동회전을 껐으므로 이동 수단이 스와이프뿐이다. dot을 48px로 키우면 배너 자체의 탭 영역과 겹쳐 레이아웃 판단이 필요하다 | B-4, C-3 |
| 10 | 기본 모드 글자 크기 (11~13px, 117곳) | 토큰 한 곳을 올리면 117곳이 따라오지만 모든 화면의 줄바꿈과 카드 높이가 동시에 변한다. 캡처로 기준 크기를 정한 뒤 올린다 | D-1 |
| 11 | 금융 용어 설명 | 캐시백·자동/수동 모드·위젯 등의 설명 추가는 카피 재설계 범위 | D-2 |
| 12 | 광학 정렬, 아이콘 스트로크 | 지시서에서 이번 범위 제외를 명시했다 | B-2 |
| 13 | 수동태 카피 14건 | 문구 재작성은 카피 단계에서 일괄 처리 | A-5 |
| 14 | em대시 117건 | 전부 주석이라 사용자 노출은 0건이다. 이번 작업에서 새로 추가하지는 않았다 | A-2 |
| 15 | `prefers-reduced-motion` | 자동회전을 껐고 과한 duration도 줄였다. 남은 모션에 대한 감소 처리는 재설계 후 한 번에 넣는 편이 낫다 | C-5 |
| 16 | 잔여 300ms 초과 duration 4건 | 진행바 500ms·400ms 등. 값 자체보다 진행바 표현 방식을 재설계에서 정하는 편이 낫다 | C-2 |

### 이번에 일부러 건드리지 않은 선

- 홈 화면의 컴포넌트 **순서와 배치**를 바꾸지 않았다. 캐러셀은 자동회전만 껐고 위치는 그대로다.
- `surface.background`, 그레이 스케일, 본문 텍스트 색(`gray.900`)을 바꾸지 않았다.
- 가맹점 데이터(`stores.json`, `qr-stores.json`)와 좌표 상수(`GANGNEUNG_STATION`)를 건드리지 않았다.
- `강릉시`, `강릉머니`, `강릉 사랑페이`, 지역·장소명은 치환하지 않았다. 앱 이름이 아니라 지자체·별도 서비스·데이터다.
- 국기 SVG 색 22건은 토큰화하지 않았다. 국가 상징의 고정 규격색이라 브랜드색이 아니며, 파일에 예외 사유를 주석으로 남겼다.
- 애니메이션을 새로 추가하지 않았다. 이번 작업은 제거와 완화만 했다.

---

## 04차 작업 결과 (2026-09-13, 지시서 04)

`npm run build` 통과 (iOS·Android 두 빌드 모두). 외부 라이브러리 신규 설치 0건, TypeScript 파일 0건.

### PART A. 전역 규칙형 검수 마무리

| 항목 | 상태 | 조치 | 위치 |
| --- | --- | --- | --- |
| A-1 모션 감소 존중 | 해결 | `prefers-reduced-motion: reduce`에서 transition·animation을 0.01ms로 낮추고 무한 반복을 1회로 끊는다. 단 버튼·스위치·탭의 색 전환은 80ms로 남겨 눌렸는지 알 수 있게 했다 | `client/src/index.css:62-78` |
| A-2 정적 단서 병행 | 해결(일부) | iOS 탭바가 색으로만 현재 위치를 알렸다. 선택 탭을 채운 아이콘으로 바꿔 색각 이상 사용자도 읽을 수 있게 했다. 단계 표시기·토글·필터칩은 이미 체크 아이콘과 라벨 굵기를 함께 쓰고 있어 추가 조치가 필요 없었다 | `client/src/components/layout/BottomNavBar.jsx:99-103` |
| A-3 고빈도 모션 축소 | 해결 | 반복 상태 전환 19건의 duration을 120~160ms로 낮추고 곡선을 강한 ease-out으로 통일했다. 모달·시트·스낵바처럼 가끔 뜨는 것의 진입 모션은 공간 연속성을 위해 남겼다 | 10개 파일 |
| A-4 font smoothing | 확인만 | 이미 적용되어 있다 | `client/src/index.css:21-22` |
| A-5 로드 시 enter 애니메이션 | 확인만 | 해당 없음. BottomSheet·Snackbar는 열릴 때만 마운트되고, CardApplyPage의 회전은 로딩 표시다. 첫 렌더에 우르르 나타나는 애니메이션은 없다 | 해당 없음 |
| A-6 will-change 정리 | 확인만 | 2건 모두 `transform`이라 허용 범위다. Lottie 첫 프레임 끊김을 막는 용도로 근거가 있다 | `client/src/components/home/CardBackModal.jsx:176`, `client/src/components/common/PaymentAuthOverlay.jsx:340` |
| A-7 본문 줄간격 | 해결 | 전역 줄간격이 지정되지 않아 브라우저 기본값(약 1.2)으로 렌더됐다. 한글 본문에 좁다. 토큰에 `lineHeight.body = 1.5`를 추가하고 `:root`를 통해 주입했다 | `client/src/tokens/tokens.js:239`, `client/src/index.css:25` |

**추가로 발견해 처리한 것**: 02차의 색 점검은 hex만 훑어서 `white`·`black` **색 키워드 34건**을 놓치고 있었다.
색 하드코딩 금지 규칙 위반이므로 이번에 전부 토큰으로 옮겼다 (9개 파일).
이 과정에서 `CardBackFaceId.jsx`가 `colors`를 import 없이 참조하는 상태가 되어 함께 고쳤다.

### PART B. iOS HIG / 안드로이드 MD3 준수

| 항목 | 상태 | 조치 | 위치 |
| --- | --- | --- | --- |
| B-1 iOS 탭바 | 해결 | 선택 탭을 채운 아이콘으로, 비선택을 외곽선으로 구분한다. 탭 전환에 애니메이션을 두지 않는다(HIG: 계층 변화 암시 금지) | `client/src/components/layout/BottomNavBar.jsx:99-103, 127` |
| B-1 안드로이드 네비게이션 바 | 해결 | MD3 2025에서 기존 navigation bar가 deprecated되고 높이가 짧은 flexible navigation bar로 바뀌었다. 안드로이드 높이를 49px에서 44px로 낮추고 상단 여백도 줄였다 | `client/src/components/layout/BottomNavBar.jsx:33, 45` |
| B-1 안드로이드 pill indicator | 해결 | MD3 규격 56x32로 맞추고 radius를 `md3Shape.full`로 바꿨다 | `client/src/components/layout/BottomNavBar.jsx:121-127` |
| B-2 상단바 | 확인만 | iOS는 `-apple-system`으로 SF 계열이 잡히고, 안드로이드는 `body.platform-android *` 규칙이 Noto Sans KR를 강제한다. 정렬도 규격대로다 | `client/src/index.css:3-6`, `client/src/components/layout/TopAppBarBack.jsx` |
| B-3 MD3 타입스케일 | 해결(토큰까지) | `md3Type` 15단계를 지시서 rem 정확값으로 추가했다. 본문은 시니어 하한 때문에 `bodyLarge`(1rem)를 기준으로 삼고, `bodyMedium`·`bodySmall`은 스케일 완전성을 위해 두되 본문 카피에는 쓰지 않는다고 주석에 명시했다 | `client/src/tokens/tokens.js:193-210` |
| B-4 shape | 확인 + 일부 | `md3Shape` 9단계를 추가했다. 점검 결과 안드로이드 버튼은 이미 pill(=`full`), 카드는 16px(=`large`)로 MD3에 맞는다. 바텀시트만 리터럴 `28px`을 쓰고 있어 `md3Shape.extraLarge`로 바꿨다 | `client/src/tokens/tokens.js:212-222`, `client/src/components/common/BottomSheet.jsx:41-42` |
| B-5 모션 절제 | 해결 | MD3 Expressive 기본 모션의 오버슈트를 쓰지 않는다. 전 구간을 오버슈트 없는 강한 ease-out `cubic-bezier(0.23,1,0.32,1)`으로 통일했다. iOS 제스처 물리는 도입하지 않았다 | 10개 파일 |

### PART C. Liquid Glass (CSS backdrop-filter)

구현 방식: 값은 `tokens.js`의 `glass` 토큰에만 두고, `App.jsx`가 이를 `:root`의 CSS 변수로 주입한다.
`index.css`의 `.glass` 규칙은 그 변수만 참조한다. CSS가 JS 토큰을 직접 읽지 못하는 문제를 이렇게 우회해
**색 단일 소스 규칙을 깨지 않으면서** `@supports`와 미디어쿼리를 쓸 수 있게 했다.

| 항목 | 상태 | 내용 |
| --- | --- | --- |
| C-1 유리 토큰 | 해결 | `glass` 토큰 13개. 하드코딩 0건 | `client/src/tokens/tokens.js:169-191` |
| C-1 폴백 | 해결 | `@supports`로 `backdrop-filter` 지원을 확인하고, 미지원 기기에는 불투명 배경을 준다 | `client/src/index.css:92-98` |
| C-2 적용 대상 | 해결 | 아래 표 참조. 본문 카드와 텍스트에는 적용하지 않았다 | |
| C-3 시니어 유리 | 해결 | 큰글씨 모드에서 `body.senior-mode`가 붙고 유리가 낮아진다. `prefers-reduced-transparency: reduce`도 같은 결과를 낸다 | `client/src/index.css:100-125`, `client/src/context/AppContext.jsx:38-41` |
| C-4 참고 자료 보관 | 해결(일부) | `docs/liquid-glass-reference/`에 `liquidGL-main`과 배제 사유 README를 뒀다. 나머지 2종은 로컬에 파일이 없어 보관하지 못했고 README에 적어 뒀다 | `docs/liquid-glass-reference/` |

**유리 적용 대상 목록**

| 대상 | 파일 | 클래스 | 비고 |
| --- | --- | --- | --- |
| 하단 탭바 | `client/src/components/layout/BottomNavBar.jsx:37` | `glass glass-top-only` | 콘텐츠가 아래로 지나가 유리가 실제로 작동한다 |
| 홈 상단바 | `client/src/components/layout/TopAppBar.jsx:18` | `glass glass-bottom-only` | 아래 "대기" 항목 참조 |
| 하위 화면 상단바 | `client/src/components/layout/TopAppBarBack.jsx:21` | `glass glass-bottom-only` | 같음 |
| 큰글씨 상단바 | `client/src/components/layout/TopAppBarLargeText.jsx:12` | `glass glass-bottom-only` | 같음 |
| 바텀시트 | `client/src/components/common/BottomSheet.jsx:34` | `glass` | |
| QR 플로팅 바 | `client/src/components/layout/QRFloatingBar.jsx:26` | `glass glass-top-only` | 현재 `StorePage`에서 주석 처리되어 마운트되지 않는다 |
| 모달 딤 4곳 | `BottomSheet`, `MenuDrawer`, `AnnouncementModal`, `PeriodPickerModal` | `glass-scrim` | 딤 색은 각 컴포넌트 인라인 유지, 뒤 배경만 흐린다 |

**검증 (실측)**: iOS·Android 빌드를 각각 헤드리스 브라우저로 렌더해 계산된 스타일을 읽었다.

| 모드 | background | backdrop-filter | border |
| --- | --- | --- | --- |
| 기본 | `rgba(255,255,255,0.13)` | `blur(12px) saturate(1.7)` | `rgba(255,255,255,0.3)` |
| senior-mode | `rgba(255,255,255,0.92)` | `blur(4px) saturate(1.1)` | `rgba(17,24,39,0.18)` |

플랫폼 비교 렌더로 확인한 것: iOS는 선택 탭이 채운 아이콘이고 버튼이 둥근 사각형,
안드로이드는 pill indicator에 버튼이 pill이며 네비게이션 바가 더 짧다. 가로 오버플로는 없다(`scrollWidth=400`).

### 이번에 하지 않은 것 (대기)

| # | 항목 | 사유 |
| --- | --- | --- |
| 1 | 상단바 유리의 실제 블러 효과 | `ScreenContainer`에서 상단바와 스크롤 영역이 형제로 쌓여 있어 콘텐츠가 상단바 아래를 지나가지 않는다. 유리는 올바르게 적용됐지만 블러가 흐릴 대상이 없다. 스크롤 영역을 전체 높이로 바꾸고 상단 패딩을 주는 구조 변경이 필요한데 이는 홈 재설계 몫이다 |
| 2 | QR 플로팅 바 | 적용 대상 목록에 있어 유리와 대비를 맞췄으나 현재 화면에 마운트되지 않는다. 되살릴지 여부를 알려달라 |
| 3 | 흰 배경 위 specular edge | 유리 레시피의 흰 specular 선은 어두운 배경에서 가장 잘 보인다. 현재 앱 배경이 밝아 선이 약하게 읽힌다. 수치는 지시서 값을 그대로 지켰다. 캡처로 배경 톤이 정해지면 함께 조정할 것을 권한다 |
| 4 | MD3 타입스케일 실제 적용 | 토큰만 추가했다. 화면에 꽂으면 모든 줄바꿈과 카드 높이가 동시에 변한다. 기본 모드 글자 크기 상향과 함께 처리하는 것이 맞다 |
| 5 | 본문 기본 글자 크기 11~13px | 03차와 동일한 사유로 대기 |

---

## 화면별 to-be 체크리스트 (캡처 후 재설계 때 적용)

지금까지 "화면 종속형"이라 미룬 항목을 화면 단위로 모았다. 재설계 시 각 화면에서 이 표를 소진한다.

| 화면 | 항목 | 근거 | 출처 |
| --- | --- | --- | --- |
| 홈 | 프로모션 2개(위젯 배너·캐러셀)보다 잔액·충전 카드를 위로 올린다 | 핵심 태스크가 프로모션에 묻힌다 | D-4 |
| 홈 | 잔액 카드 concentric radius. 바깥 radius나 padding 중 하나를 정해 안쪽과 맞춘다 | MIFB #1 | B-1 |
| 홈 | 잔액 카드 다크 배경색 정밀 보정 (현재 `primary.800` 임시값) | 캡처에 잔액 카드 없음 | 02차 |
| 홈 | 큰글씨 토글 진입점을 48px 이상으로. 현재 약 24px | MIFB #16 | B-4 |
| 홈 | 캐러셀 수동 컨트롤. 자동회전을 껐으므로 스와이프 외 이동 수단이 필요하다 | WCAG, 시니어 조작 | C-3 |
| 홈 | 캐시백 잔액과 결제 잔액의 차이를 설명하는 문구 | 금융 용어 설명 없음 | D-2 |
| 홈 | 자동/수동 캐시백 모드가 무엇을 바꾸는지 설명 | 같음 | D-2 |
| 홈 | 상단바 아래로 콘텐츠가 지나가도록 스크롤 구조 변경 (유리 블러가 작동하려면 필요) | Liquid Glass | 04차 |
| 충전 | 실패 상태와 복구 안내 화면. 지금은 에러 상태만 세팅되어 있다 | 복구 경로 부재 | D-3 |
| 충전 | 충전 버튼 scale on press 피드백 | MIFB #12 | B-6 |
| 충전 | 빠른 금액 칩 터치 타깃 48px (현재 약 30px) | MIFB #16 | B-4 |
| 결제(QR) | 실패 상태와 복구 안내 | 복구 경로 부재 | D-3 |
| 결제(QR) | 지우기 키를 `←` 기호 단독이 아닌 라벨로 | 기호 의존 | A-3 |
| 환불 | 거절 사유를 개발자 문구가 아닌 복구 안내로 | `'이미 환불됨'` | D-3 |
| 이용내역 | 헤더 제목 정렬을 플랫폼 규격으로 (현재 자체 헤더라 iOS에서도 좌측 정렬) | HIG | B-2 |
| 매장 | 카테고리 필터 칩 터치 타깃 48px (현재 약 32px) | MIFB #16 | B-4 |
| 매장 | 상세 시트 태그 버튼 터치 타깃 (현재 약 22px) | MIFB #16 | B-4 |
| 마이 | 편집·변경 버튼 터치 타깃 48px (현재 약 34px) | MIFB #16 | B-4 |
| 설정 | 토글 스위치 터치 타깃 (현재 28~32px) | MIFB #16 | B-4 |
| 서비스 편집 | 추가·삭제 버튼 28x28을 48px로 | MIFB #16 | B-4 |
| 약관 | 13px 본문과 가로 스크롤 표의 밀도 완화 | 시니어 가독 | D-1 |
| 공통 버튼 | 누름 피드백 `scale(0.96)` 추가 | MIFB #12 | B-6 |
| 공통 | 아이콘 버튼 광학 정렬 (아이콘 쪽 padding 2px 축소) | MIFB #2 | B-2 |
| 공통 | 수동태 카피 14건을 능동태로 | 절대 규칙 | A-5 |
| 공통 | em대시 117건 정리 (전부 주석, 사용자 노출 0건) | 절대 규칙 | A-2 |
| 전역 | 기본 모드 글자 크기 토큰 상향 + MD3 타입스케일 실제 적용 | 시니어 가독 | D-1, B-3 |
| 전역 | 가맹점 데이터를 대구 데이터로 교체 | 리브랜딩 | E |
| 전역 | iM 로고 에셋 교체 (`logo-blue.svg`, `logo-white.svg` 덮어쓰기) | 리브랜딩 | E |

---

## A. 절대 규칙 위반 스캔

### A-1. 색 하드코딩 (tokens.js 밖 hex)

전체 187건 중 `tokens.js` 77건을 제외한 **110건**이 외부에 있다.

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| `index.css`가 `tokens.js`와 동일한 색을 CSS 변수로 중복 정의. 단일 소스 규칙의 정면 위반이며 리브랜딩 시 한쪽만 바뀔 위험이 크다 | `client/src/index.css:9-47` (29건) | 프로젝트 절대 규칙 | 상 **[해결]** |
| `body` 배경색을 토큰이 아닌 리터럴로 고정 | `client/src/index.css:61` | 절대 규칙 | 상 **[해결]** |
| QR 결제 화면 전반이 `'#FFFFFF'`, `'#000000'` 리터럴 사용. 결제 화면이라 브랜드 교체 시 누락 위험이 가장 크다 | `client/src/components/payment/QRScannerScreen.jsx:143,145,163,191,195,286,442` (11건) | 절대 규칙 | 상 **[해결]** |
| 매장 카테고리 색 5종을 컴포넌트 내부 상수로 하드코딩. `tokens.js`에 이미 `colors.store.category`가 있는데 별도 팔레트를 만들었다 | `client/src/components/store/StoreListItem.jsx:15-19` | 절대 규칙 | 상 **[해결]** |
| 배너 슬라이드 배경/텍스트 색 하드코딩 | `client/src/components/home/BannerCarousel.jsx:27-29` | 절대 규칙 | 중 **[해결]** |
| 페이지 전용 그라디언트 `#E4EFFD`를 주석으로 "예외값"이라 선언하고 사용 | `client/src/pages/CardApplyPage.jsx:9,357`, `client/src/components/usage-guide/CardApplyMini.jsx:90` | 절대 규칙 | 중 **[해결]** |
| 큰글씨 홈 일러스트 SVG 색 하드코딩 | `client/src/pages/HomePageLarge.jsx:360-365` (5건) | 절대 규칙 | 하 **[해결]** |

**규칙 위반은 아니나 판단이 필요한 건 (22건)**: `client/src/components/common/LanguageSheet.jsx:14-76`의 국기 SVG 색. 국기는 브랜드 색이 아니라 고정된 국가 상징이므로 토큰화 대상이 아니라고 본다. 리브랜딩 치환 대상에서 제외할 것을 권한다.

### A-2. em대시

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 코드 주석에 em대시 119건 사용. **사용자 노출 카피에는 0건** | 전역 (예: `client/src/context/UserContext.jsx:2`, `client/src/tokens/tokens.js:1`, `client/src/pages/TermsPage.jsx:1`) | 절대 규칙 | 하 **[대기: 전부 주석, 사용자 노출 0건. 카피 단계에서 일괄]** |

사용자가 보는 문자열에는 하나도 없다. 규칙 위반이지만 심사 영향은 없으므로 일괄 치환으로 정리하면 된다.

### A-3. 이모지

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 픽토그래프 이모지 **0건**. 규칙 준수 | 해당 없음 | 절대 규칙 | 없음 |
| 화살표 문자(→, ←) 30건 중 사용자 노출 3건. 이모지는 아니나 시니어에게 기호 의존 안내가 된다 | `client/src/components/payment/QRScannerScreen.jsx:302` (`설정 → 앱 → 카메라 권한 허용`), `:519` (잔액 변화 표기), `client/src/components/common/PaymentAuthOverlay.jsx:312` (지우기 키 라벨을 `←`로만 표시) | MIFB #18 (기호가 아니라 라벨로 상태 전달) | 중 **[대기: 카피 재설계]** |

`PaymentAuthOverlay.jsx:312`는 결제 인증 키패드의 지우기 키다. 시니어에게 `←` 단독 표기는 의미 전달이 약하다.

### A-4. localStorage

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 실제 호출 **0건**. 주석 2건은 금지 정책을 명시한 것이라 정상 | `client/src/context/UserContext.jsx:4`, `client/src/context/OnboardingContext.jsx:4` | 절대 규칙 | 없음 |
| `sessionStorage` 4건은 허용 범위(플랫폼 캐시) | `client/src/hooks/usePlatform.js` 외 | 절대 규칙 | 없음 |

### A-5. 수동태 및 어순

수동 표현 14건. 대표 5건:

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| `캐시백 적립이 시작되었습니다` (주어가 사용자가 아님) | `client/src/components/home/AnnouncementBanner.jsx:48` | 절대 규칙 (능동태) | 중 |
| `10,000원 충전이 완료되었습니다` | `client/src/pages/NotificationPage.jsx:22` | 절대 규칙 | 중 |
| `조건 미충족 시 사유가 표시됩니다` (한자어 + 수동) | `client/src/pages/UsageGuidePage.jsx:42` | 절대 규칙 | 중 |
| `해당 카드의 사용이 즉시 정지됩니다` | `client/src/pages/CardLostPage.jsx:79` | 절대 규칙 | 중 |
| `재발급 카드가 영업일 기준 3~5일 내로 배송됩니다` | `client/src/pages/CardLostPage.jsx:201` | 절대 규칙 | 중 |

`분실신고 접수 시`, `조건 미충족 시` 같은 한자어 압축 표현도 시니어 가독성에 불리하다.

---

## B. make-interfaces-feel-better 기준

### B-1. Concentric border radius 위반

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 홈 잔액 카드. 바깥 카드 radius 16px + padding 16px인데 안쪽 캐시백 박스도 radius 16px. 규칙상 안쪽은 0px이거나 바깥이 32px이어야 한다. 홈의 주인공 요소라 가장 눈에 띈다 | `client/src/components/home/BalanceCardExpanded.jsx:42-43` (바깥), `:119-126` 블록의 내부 박스 | MIFB #1 / surfaces.md | 중 **[대기: 바깥 radius나 padding 변경이 필요해 홈 재설계 몫]** |
| 이용안내 카드. 바깥 radius 16px + padding 20px인데 안쪽 아이콘 박스도 radius 16px | `client/src/pages/HomePage.jsx:113-115`, `:134-137` | MIFB #1 | 중 **[해결]** |
| 충전 완료 요약 카드에서 동일 패턴 반복 | `client/src/components/payment/ChargeScreen.jsx:520-521` | MIFB #1 | 하 |
| 환불 안내 미니 화면에서 동일 패턴 반복 | `client/src/components/usage-guide/RefundMini.jsx:55-56`, `:96` | MIFB #1 | 하 |

`layout.radiusCard`(16px)를 바깥과 안쪽에 동시에 쓰는 관용이 코드 전반에 굳어져 있다. 토큰에 중첩용 값(예: `radiusInner`)이 없는 것이 근본 원인이다.

### B-2. 광학 정렬 필요 지점

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 아이콘 + 텍스트 칩인데 좌우 padding이 대칭(14px). 아이콘 쪽을 2px 줄여야 시각적으로 균형이 맞는다 | `client/src/components/store/CategoryFilterChip.jsx:30` | MIFB #2 / surfaces.md | 하 |
| 위젯 추가 pill. 좌측 14px SVG + 텍스트인데 좌우 padding 동일(12px) | `client/src/components/home/WidgetAddBanner.jsx:38` | MIFB #2 | 하 |
| 공통 Button이 `gap` 기반 중앙 정렬만 하고 아이콘 유무를 구분하지 않는다. 아이콘을 넣는 모든 호출부가 같은 문제를 물려받는다 | `client/src/components/common/Button.jsx:104-105` | MIFB #2 | 중 |

### B-3. 깊이용 border를 shadow로 바꿔야 하는 곳

`1px solid` 46건 중 구조/상태 border가 아닌 깊이 표현이 다수다.

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 카드 컨테이너에 `1px solid gray[200]`으로 깊이를 만든다. `shadow.card` 토큰이 이미 있는데 병행 사용한다 | `client/src/components/home/CashbackEntryCard.jsx:18`, `client/src/pages/MyPage.jsx:152,199` | MIFB #3 / surfaces.md | 중 **[부분 해결: CashbackEntryCard만. MyPage 2건은 outlined 버튼의 구조 border라 유지]** |
| 배너 컨테이너에 `1px solid primary[100]` | `client/src/components/home/AnnouncementBanner.jsx:19`, `client/src/components/home/WidgetAddBanner.jsx:38` | MIFB #3 | 하 |
| border와 shadow를 한 요소에 동시 적용 (중복 깊이) | `client/src/pages/TermsPage.jsx:149`, `client/src/components/usage-guide/RefundMini.jsx:55-57` | MIFB #3 | 하 |

유지해야 할 border: `client/src/pages/TermsPage.jsx:83,94`의 표 셀 경계, 입력창 outline, 선택 상태 border는 구조/상태 표현이므로 그대로 둔다.

### B-4. 터치 타깃 48px 미달 (시니어 기준)

`onClick` 162건 중 `layout.touchMin`(44px)을 적용한 곳이 26건뿐이다. 게다가 토큰 값 자체가 44px이라 시니어 기준 48px에 미달한다.

| 문제 | 위치 | 실측 높이 | 근거 | 심각도 |
| --- | --- | --- | --- | --- |
| **큰글씨 토글**. padding 4px + 12px 폰트 기준 약 24px. 접근성 기능의 진입점이 화면에서 가장 작은 버튼이다 | 약 24px | MIFB #16 | 상 **[대기: 지시서에서 이번 범위 제외. 홈 재설계와 함께]** |
| 위젯 추가 pill | `client/src/components/home/WidgetAddBanner.jsx:31-54` | 약 26px | MIFB #16 | 중 |
| 설정 토글 스위치. iOS 48x28, Android 52x32 | `client/src/components/common/SettingsToggleRow.jsx:47-62` | 28~32px | MIFB #16 | 중 |
| 빠른 금액 칩 (충전 화면 주요 입력 수단) | `client/src/components/payment/QuickAmountChip.jsx:20` | 약 30px | MIFB #16 | 상 |
| 카테고리 필터 칩 | `client/src/components/store/CategoryFilterChip.jsx:30` | 약 32px | MIFB #16 | 중 |
| 마이페이지 편집/변경 버튼 | `client/src/pages/MyPage.jsx:148`, `:196` | 약 34px | MIFB #16 | 중 |
| 서비스 편집 추가/삭제 버튼 28x28 | `client/src/pages/ServiceEditPage.jsx:170-171`, `:259-260` | 28px | MIFB #16 | 중 |
| 매장 상세 태그 버튼 padding 2px | `client/src/components/store/StoreDetailSheet.jsx:84,97` | 약 22px | MIFB #16 | 중 |
| `layout.touchMin`이 44px로 정의되어 있어, 규격대로 써도 시니어 기준 48px에 미달 | `client/src/tokens/tokens.js:233` | 48px | 프로젝트 고유 기준 | 상 **[해결]** |

배너 캐러셀 dot은 `pointerEvents: 'none'`이라 타깃 문제는 없다. 다만 슬라이드 이동 수단이 스와이프뿐이라 시니어에게 조작 경로가 없다 (`client/src/components/home/BannerCarousel.jsx:244`).

### B-5. tabular-nums 미적용 금액 표시

금액을 렌더하는 파일 12개, `toLocaleString` 호출 32건. `fontVariantNumeric: 'tabular-nums'` 적용은 **2건**뿐이다.

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 홈 잔액 34px. 충전/결제 직후 값이 바뀌면 자릿수 폭이 달라져 숫자가 흔들린다 | `client/src/components/home/BalanceCardExpanded.jsx:75` (잔액), `:96` (캐시백) | MIFB #9 / typography.md | 중 **[해결: body 전역 적용]** |
| 큰글씨 홈 잔액 (40~48px이라 흔들림이 더 크게 보인다) | `client/src/pages/HomePageLarge.jsx` 금액 렌더 전반 | MIFB #9 | 중 **[해결: body 전역 적용]** |
| 충전 금액 입력 실시간 표시 | `client/src/components/payment/ChargeScreen.jsx:233` 블록 | MIFB #9 | 중 **[해결: body 전역 적용]** |
| 결제 확인 시트의 결제 전/후 잔액 | `client/src/components/payment/QRScannerScreen.jsx:519` | MIFB #9 | 중 **[해결: body 전역 적용]** |
| 이용내역 목록 금액 (세로로 정렬되는 리스트라 미정렬이 가장 잘 보인다) | `client/src/pages/HistoryPage.jsx` | MIFB #9 | 중 **[해결: body 전역 적용]** |
| 환불 목록 금액 | `client/src/pages/RefundPage.jsx` | MIFB #9 | 중 **[해결: body 전역 적용]** |

적용된 곳: `client/src/components/home/CardBackModal.jsx:230`(카운트다운), `client/src/components/layout/StatusBar.jsx:55`(시계). 정작 금액에는 안 쓰고 부가 정보에만 썼다.

### B-6. 기타 MIFB 항목

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| `transition: all` 6건. 의도치 않은 속성까지 애니메이션되고 성능도 불리하다 | `client/src/components/home/BalanceCardExpanded.jsx:119`, `client/src/components/home/BannerCarousel.jsx:254`, `client/src/components/common/SettingsToggleRow.jsx:74`, `client/src/components/store/CategoryFilterChip.jsx:33`, `client/src/pages/CardApplyPage.jsx:450`, `client/src/pages/HomePageLarge.jsx:106` | MIFB #14 | 중 **[해결]** |
| 누름 피드백이 전무하다. `:active` 및 scale 피드백 0건. 대신 3개 컴포넌트가 `onMouseDown`/`onTouchStart`로 인라인 opacity를 직접 조작한다. 중단 불가능하고 취소 제스처에서 상태가 남는다 | `client/src/components/payment/QuickAmountChip.jsx:27-32`, `client/src/components/payment/NumPad.jsx`, `client/src/components/home/BannerCarousel.jsx` | MIFB #4, #12 | 중 |
| 공통 Button에 누름 피드백이 없어 모든 CTA가 무반응처럼 느껴진다. 시니어는 탭이 먹었는지 확신하지 못해 중복 탭을 한다 | `client/src/components/common/Button.jsx:89-115` | MIFB #12, #19 | 상 **[대기: 누름 피드백 추가는 모션 신설이라 재설계에서 판단]** |
| `text-wrap: balance` / `pretty` 미사용 (0건). 한국어 줄바꿈 고아 단어 방지 안 됨 | 전역 | MIFB #10 | 하 |

준수 확인: `-webkit-font-smoothing: antialiased` 적용됨 (`client/src/index.css:62`).

---

## C. review-animations 기준 (빼야 할 애니메이션)

### C-1. ease-in 사용 (금지)

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 인증 Lottie 재생 커브의 마지막 30% 구간이 `0.6 + 0.4 * ((t-0.7)/0.3)^2`, 즉 2제곱 ease-in이다. 사용자가 결과를 기다리는 마지막 순간에 의도적으로 감속시켜 체감 대기를 늘린다. 주석도 "후반 ... ease-in"이라 명시한다 | `client/src/components/home/CardBackModal.jsx:17-26` | RA STANDARDS "Never ease-in on UI" | 상 **[해결]** |
| 동일 커브가 결제 인증 오버레이에도 복제되어 있다 (RAF_DURATION 2500ms) | `client/src/components/common/PaymentAuthOverlay.jsx:11-13, 109` | RA STANDARDS | 상 **[해결]** |
| MD3 standard 커브 `cubic-bezier(0.4,0,0.2,1)`은 앞머리가 ease-in이다. 탭으로 여는 패널의 진입에는 ease-out이 맞다 | `client/src/components/home/WidgetAddBanner.jsx:68` | RA "Entering → ease-out" | 중 **[해결]** |

### C-2. duration 과다 (UI 300ms 상한 초과)

| 문제 | 위치 | duration | 근거 | 심각도 |
| --- | --- | --- | --- | --- |
| 인증 애니메이션이 2.5초(Android 3.0초) 동안 진행을 막는다. 결제 경로에서 매번 반복된다 | `client/src/components/home/CardBackModal.jsx:56`, `client/src/components/common/PaymentAuthOverlay.jsx:11` | 2500~3000ms | RA duration 표 | 상 |
| 캐시백 진행바 폭 애니메이션 | `client/src/components/home/CashbackProgressCard.jsx:60` | 500ms | RA 300ms 상한 | 중 |
| 위젯 패널 펼침 | `client/src/components/home/WidgetAddBanner.jsx:68` | 240ms | RA 300ms 상한 | 중 **[해결]** |
| 잔액 카드 내부 진행바 | `client/src/components/home/BalanceCardExpanded.jsx:164` | 400ms | RA 300ms 상한 | 중 |
| Face ID 슬라이드 전환 | `client/src/components/home/CardBackFaceId.jsx:14,100` | 400ms | RA 300ms 상한 | 하 |
| QR 오버레이 페이드 | `client/src/components/payment/QRScannerScreen.jsx:341` | 400ms | RA 300ms 상한 | 하 |

### C-3. 빈도 높은 인터랙션에 붙은 불필요한 애니메이션

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| **배너 캐러셀이 5초마다 무한 자동 회전한다.** 홈에 들어올 때마다, 머무는 내내 반복된다. 시니어가 읽는 중에 내용이 바뀌고, 탭하려던 대상이 손가락 아래에서 이동한다. 정지 수단도 없다 | `client/src/components/home/BannerCarousel.jsx:105-115` | RA 빈도표 "Tens of times/day → Remove or drastically reduce", MIFB #19 | 상 **[해결: 자동회전 제거]** |
| 온보딩 스테퍼가 색 변화 4곳에 각각 300ms transition을 건다. 단계 이동은 반복 동작이다 | `client/src/components/home/OnboardingStepper.jsx:47,67,102,116` | RA 빈도표 | 중 |
| 충전 화면 단계 표시기도 동일하게 300ms 색 전환 4곳 | `client/src/components/payment/ChargeScreen.jsx:65,98,116,262` | RA 빈도표 | 중 |
| 캐러셀 dot이 `transition: all 0.25s`로 폭까지 애니메이션한다. 상태 표시에 모션이 필요 없다 | `client/src/components/home/BannerCarousel.jsx:254` | RA, MIFB #14 | 하 **[해결]** |

### C-4. 성능 (레이아웃 유발 속성 애니메이션)

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| `max-height`와 `margin-top`을 애니메이션한다. 레이아웃/페인트/합성 3단계를 모두 유발한다 | `client/src/components/home/WidgetAddBanner.jsx:68` | RA Performance | 중 |
| `width` 애니메이션 2건 | `client/src/components/home/CashbackProgressCard.jsx:60`, `client/src/components/home/BalanceCardExpanded.jsx:164` | RA Performance | 중 |
| `left` 애니메이션 | `client/src/pages/CardManagementPage.jsx:46` | RA Performance | 하 |

### C-5. 접근성

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| `prefers-reduced-motion` 처리 **0건**. OS에서 모션 감소를 켠 사용자에게도 자동 캐러셀과 2.5초 인증 애니메이션이 그대로 재생된다 | 전역 | RA Accessibility | 상 |
| 비중단 keyframes를 상태 전환에 사용 (바텀시트, 스낵바). 빠르게 연속 호출되면 처음부터 다시 재생된다 | `client/src/components/common/BottomSheet.jsx:49,98`, `client/src/components/common/Snackbar.jsx:24,40` | RA Interruptibility, MIFB #4 | 하 |

---

## D. 시니어 접근성 (프로젝트 고유 기준)

### D-1. 기본 모드 본문 글자 크기

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 기본 모드 토큰이 `xs: 13px`, `xxs: 12px`, `nav: 11px`. 노안 권장선(16px 이상)을 크게 밑돈다 | `client/src/tokens/tokens.js:177-179` | 프로젝트 고유 기준 | 상 **[대기: 캡처로 기준 크기 확정 후]** |
| 이 세 토큰이 본문에 **117곳** 사용된다 (`xs` 82, `xxs` 35). 접근성을 큰글씨 모드 하나에만 의존하는 구조다 | 전역. 집중 지점: `client/src/pages/TermsPage.jsx`(23곳), `client/src/components/payment/QRScannerScreen.jsx`(6곳), `client/src/pages/SearchPage.jsx`(5곳), `client/src/components/store/StoreDetailSheet.jsx`(5곳), `client/src/pages/CustomerCenterPage.jsx`(5곳) | 프로젝트 고유 기준 | 상 |
| 토큰을 우회한 11px 하드코딩 | `client/src/pages/RefundPage.jsx:343`, `client/src/components/usage-guide/RefundMini.jsx:101` | 절대 규칙 + 고유 기준 | 중 |
| 약관 화면이 13px 본문에 표까지 가로 스크롤로 제공한다. 시니어가 읽을 수 없는 밀도다 | `client/src/pages/TermsPage.jsx:76-94` | 고유 기준 | 중 |

큰글씨 모드는 `sizeLarge`로 전 토큰을 확대하는 방식이라 구조 자체는 좋다. 문제는 기본값이 낮은 것이다.

### D-2. 설명 없이 던지는 금융 용어

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| `연결계좌 변경`을 메뉴 라벨로만 노출한다. 무엇이 연결되는지, 바꾸면 무엇이 달라지는지 설명이 없다 | `client/src/components/common/MenuDrawer.jsx:30`, `client/src/pages/MenuPage.jsx:24` | 고유 기준 | 중 |
| `캐시백` 43회 사용. 홈 잔액 카드에서 "강릉페이"와 "캐시백" 두 잔액을 병렬로 보여주지만 둘의 차이를 설명하지 않는다. 시니어가 쓸 수 있는 돈이 얼마인지 판단하기 어렵다 | `client/src/components/home/BalanceCardExpanded.jsx:65-99` | 고유 기준 | 상 |
| `자동/수동` 캐시백 모드 토글. 두 모드가 무엇을 바꾸는지 화면에 설명이 없다 | `client/src/components/home/BalanceCardExpanded.jsx:104-126` | 고유 기준 | 상 |
| `QR` 69회. 첫 노출에서 QR이 무엇이고 어떻게 쓰는지 안내 없이 바텀탭 중앙 버튼으로 바로 진입한다 | `client/src/components/layout/BottomNavBar.jsx` | 고유 기준 | 중 |
| `위젯 추가하기`. IT 용어를 그대로 노출한다 | `client/src/components/home/WidgetAddBanner.jsx:54` | 고유 기준 | 중 |
| `가맹점주 포털`, `CVC 인증 오류 해제` 같은 업무 용어를 그대로 노출 | `client/src/components/store/StoreDetailSheet.jsx:343`, `client/src/pages/CardManagementPage.jsx:321` | 고유 기준 | 중 |

`선불`, `정산`은 사용처가 0건이다.

### D-3. 에러 및 실패 상태의 복구 안내

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| **충전 흐름에 실패 단계가 없다.** 단계 배열이 `['금액 입력', '충전 확인', '완료']` 3개뿐이고 실패 분기가 존재하지 않는다 | `client/src/components/payment/ChargeScreen.jsx:28,132-135` | 고유 기준 | 상 **[대기: 실패 화면 UX는 캡처 후]** |
| 서버 기록 실패를 전부 조용히 삼킨다. 사용자도 개발자도 실패를 알 수 없다 | `client/src/context/UserContext.jsx:185,193,202` | 고유 기준 | 상 **[해결: lastError 상태 세팅]** |
| 결제(`spendBalance`)에 실패 반환값이 없다. 잔액 부족 외의 실패를 표현할 방법이 없다 | `client/src/context/UserContext.jsx:187-192` | 고유 기준 | 상 |
| 인증 Lottie 로드 실패를 `catch (e)` 후 무처리 | `client/src/components/home/CardBackModal.jsx:125`, `client/src/components/common/PaymentAuthOverlay.jsx:115,135`, `client/src/components/home/CardBackFaceId.jsx:73` | 고유 기준 | 중 |
| 세션 발급 실패 시 조용히 클라이언트 폴백으로 전환한다. 동작은 이어지지만 사용자에게 상태 고지가 없다 | `client/src/context/AppContext.jsx:32-34` | 고유 기준 | 하 |
| 환불 거절 사유를 `'이미 환불됨'` 같은 개발자 문구로 둔다. 복구 행동을 안내하지 않는다 | `client/src/pages/RefundPage.jsx:58` | 고유 기준 | 중 |

잘 되어 있는 곳: `client/src/components/payment/QRScannerScreen.jsx:263-305`의 카메라 권한 거부 오버레이는 원인과 복구 경로를 한국어 평문으로 안내한다. 이 패턴을 충전/결제/환불 실패에도 확장하면 된다.

### D-4. 첫 화면에서 핵심 태스크가 묻힌 정도

`client/src/pages/HomePage.jsx:84-96`의 렌더 순서:

| 순서 | 요소 | 성격 |
| --- | --- | --- |
| 1 | `WidgetAddBanner` | 프로모션 (위젯 설치 유도) |
| 2 | `BannerCarousel` | 프로모션 (5초 자동 회전, 카카오/네이버 유도) |
| 3 | `BalanceCardExpanded` | **핵심 태스크 (잔액/충전/환불/QR결제)** |
| 4 | `CashbackEntryCard` | 부가 |
| 5 | 결제 가능 매장 | 부가 |
| 6 | 이용안내 | 부가 |

| 문제 | 위치 | 근거 | 심각도 |
| --- | --- | --- | --- |
| 충전/결제 버튼 앞에 프로모션 블록 2개가 놓인다. 캐러셀은 자동으로 움직이기까지 해 시선을 계속 끌어간다 | `client/src/pages/HomePage.jsx:84-87` | 고유 기준, MIFB #19 | 상 **[부분: 캐러셀 자동회전만 정지. 순서 변경은 대기]** |
| 신규 사용자(`hasCard=false`)는 잔액 카드 대신 `CardApplyCTA`를 보는데, 이때도 프로모션 2개가 여전히 위에 있다 | `client/src/pages/HomePage.jsx:103` | 고유 기준 | 중 |
| 코치마크 3종이 순차 자동 노출된다. 앱을 처음 여는 시니어가 콘텐츠보다 오버레이를 먼저 세 번 만난다 | `client/src/pages/HomePage.jsx:54-67` | 고유 기준 | 중 |
| 큰글씨 모드 전환 시 `HomePageLarge`라는 별도 페이지로 완전히 교체된다. 두 화면의 정보 구조가 달라 학습이 이전되지 않는다 | `client/src/pages/HomePage.jsx:69` | 고유 기준 | 중 |

---

## E. 강릉 잔재 현황 (치환하지 않음)

`gangneung` 및 `강릉` 문자열 총 **15,962건 / 40개 파일**.

| 구분 | 건수 | 비고 |
| --- | --- | --- |
| 데이터 JSON (`data/stores.json`, `data/qr-stores.json`) | 15,818 | 실제 가맹점 주소 데이터. 브랜드명이 아니라 지역 데이터이므로 치환이 아니라 **데이터 교체** 대상 |
| 코드 (JSX/JS) | 144 | 브랜드명, 로고 경로, 좌표 상수 등 실제 리브랜딩 대상 |

코드 144건의 파일별 분포:

| 파일 | 건수 | 성격 |
| --- | --- | --- |
| `client/src/data/termsData.js` | 31 | 약관 본문 |
| `client/src/components/usage-guide/HomeCoachMini.jsx` | 9 | 안내 화면 |
| `client/src/pages/HomePageLarge.jsx` | 5 | 브랜드명 + 로고 |
| `client/src/pages/HomePage.jsx` | 5 | 좌표 상수 `GANGNEUNG_STATION` + 카피 |
| `client/src/pages/CardApplyPage.jsx` | 5 | 카드명 |
| `client/src/lib/generateMockData.js` | 5 | 목 데이터 |
| `client/src/components/store/StoreMapScreen.jsx` | 5 | 지도 중심 좌표 |
| `client/src/pages/SearchPage.jsx` | 4 | 검색 플레이스홀더 |
| `client/src/components/usage-guide/CardApplyMini.jsx` | 4 | 안내 화면 |
| `client/src/pages/UsageGuidePage.jsx` | 3 | 안내 |
| `client/src/pages/SplashPage.jsx` | 3 | 스플래시 |
| `client/src/pages/CardManagementPage.jsx` | 3 | 카드명 |
| `client/src/components/layout/TopAppBarLargeText.jsx` | 3 | 로고 + 브랜드명 |
| `client/src/components/layout/TopAppBar.jsx` | 3 | 로고 import + alt + 텍스트 |
| `client/src/components/home/BannerCarousel.jsx` | 3 | 배너 카피 |
| `client/src/components/common/MenuDrawer.jsx` | 3 | 메뉴 |
| 나머지 24개 파일 | 각 1~2 | 카피 산재 |

치환 시 함께 다뤄야 할 비문자열 자산:

| 자산 | 경로 |
| --- | --- |
| 로고 SVG 2종 (파일명이 URL 인코딩된 한글) | `client/src/assets/logos/#Uac15#Ub989#Ud398#Uc774#Ub85c#Uace0_#Ube14#Ub8e8.svg`, `..._#Ud654#Uc774#Ud2b8.svg` |
| 지도 기준 좌표 상수 | `client/src/data/stores.js` (`GANGNEUNG_STATION`) |
| 토큰 파일 헤더 주석 | `client/src/tokens/tokens.js:1` |

**현황 파악만 했고 치환은 하지 않았다.** iM샵 캡처로 브랜드값을 확정한 뒤 일괄 처리한다.

---

## 검수 커버리지

| 카테고리 | 검사한 근거 | 결과 |
| --- | --- | --- |
| 절대 규칙 (색/em대시/이모지/localStorage/카피) | `client/src` 전역 grep, 116개 소스 파일 | 위반 5종, 그중 색 하드코딩이 최다 |
| Typography (MIFB) | 토큰 파일, `useTypography`, 크기 토큰 사용처 117곳 | tabular-nums 미적용 6곳, text-wrap 0건, font-smoothing 준수 |
| Surfaces (MIFB) | 중첩 radius 20개 파일, border 46건, 터치 타깃 162개 onClick | concentric 위반 4건, 깊이용 border 6건, 타깃 미달 9건 |
| Animations (RA + MIFB) | transition 33건, keyframes 3건, duration 상수 전수 | ease-in 3건, 300ms 초과 6건, 고빈도 모션 4건, reduced-motion 0건 |
| Icons (MIFB) | lucide-react 단일 라이브러리, strokeWidth 지정처 | 라이브러리 혼용 없음. `currentColor` 대신 `color` prop 직접 전달이 관용이나 단일 소스라 문제 없음 |
| Performance (MIFB/RA) | 레이아웃 유발 속성 애니메이션 | width/max-height/margin-top/left 4건 |
| 시니어 접근성 (고유) | 크기 토큰, 금융 용어 10종, 에러 경로, 홈 렌더 순서 | 4개 항목 모두 문제 확인 |
| 리브랜딩 현황 (고유) | 전역 문자열 + 자산 경로 | 코드 144건 / 데이터 15,818건 / 자산 3종 |

**미검증 항목**: 실제 브라우저에서 10% 속도 모션 재생, 실기기 터치 타깃 실측, 스크린리더 통과 여부. 이 셋은 정적 분석으로 확인할 수 없어 리디자인 착수 후 실행을 권한다.

---

## 수정 우선순위 제안 (실행하지 않음)

### 0순위: 리디자인과 무관하게 지금 구조가 틀린 것

| # | 항목 | 이유 |
| --- | --- | --- |
| 1 | `index.css`의 색 정의 29건을 제거하고 `tokens.js` 단일 소스로 통합 | 이걸 먼저 안 하면 iM샵 브랜드 색 교체가 두 곳에서 갈라진다. 리브랜딩의 전제 조건이다 |
| 2 | `layout.touchMin`을 44px에서 48px로 올리고, 미적용 인터랙션 요소에 일괄 적용 | 토큰 하나를 고치면 26곳이 따라온다. 비용 대비 효과가 가장 크다 |
| 3 | 충전/결제/환불에 실패 상태와 복구 안내 추가 | 심사에서 가장 크게 감점될 기능 결함이다 |

### 1순위: 시니어 접근성 핵심

| # | 항목 | 이유 |
| --- | --- | --- |
| 4 | 기본 모드 크기 토큰 상향 (`xs` 13px, `xxs` 12px, `nav` 11px) | 접근성을 큰글씨 모드에만 의존하는 구조를 깬다. 토큰만 고치면 117곳이 따라온다 |
| 5 | 배너 캐러셀 자동 회전 제거 또는 정지 수단 제공 | 읽는 중 내용이 바뀌고 탭 대상이 이동하는 문제를 없앤다 |
| 6 | 홈 렌더 순서 변경. 잔액/충전/결제 카드를 최상단으로 | 캡처 기반 리디자인에서 함께 결정할 것을 권한다 |
| 7 | 공통 Button에 누름 피드백 추가 (`scale(0.96)`, 160ms ease-out) | 중복 탭을 줄인다. 모션 추가가 아니라 상태 전달 복구다 |
| 8 | 금액 표시 6곳에 tabular-nums 적용 | 한 줄짜리 수정으로 숫자 흔들림이 사라진다 |

### 2순위: 폴리시

| # | 항목 | 이유 |
| --- | --- | --- |
| 9 | ease-in 3건 제거, 300ms 초과 6건 단축, `prefers-reduced-motion` 추가 | RA 정량 기준 충족 |
| 10 | concentric radius 4건 수정. `tokens.js`에 중첩용 radius 값 추가 | 근본 원인이 토큰 부재라 토큰부터 손대야 재발이 없다 |
| 11 | `transition: all` 6건을 명시적 속성으로 교체 | MIFB #14 |
| 12 | 깊이용 border 6건을 shadow로 교체 | MIFB #3 |

### 3순위: 리브랜딩 (캡처 확보 후)

| # | 항목 | 이유 |
| --- | --- | --- |
| 13 | 코드 144건 브랜드 문자열 일괄 치환 + 로고 자산 2종 교체 + 좌표 상수 변경 | iM샵 브랜드값 확정 후 한 번에 처리 |
| 14 | 데이터 JSON 15,818건은 대구 가맹점 데이터로 교체 | 치환이 아니라 데이터 소스 교체다 |
| 15 | em대시 119건, 수동태 14건 정리 | 규칙 준수용. 사용자 노출 영향은 수동태 14건뿐이다 |

**실행은 지시를 받은 뒤에 한다.**
