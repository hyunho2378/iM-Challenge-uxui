# AGENTS.md — 에이전트 실행 구조 & 할루시네이션 방지

> 프로젝트 전체에 걸쳐 고정 적용. 수정하지 않는다.
> 프로젝트별 커스텀 로직은 PROGRESS.md에 기록.

---

## 실행 원칙

에이전트는 명세(DESIGN.md / IA.md / COMPONENTS.md / PATTERNS.md / ROUTES.md)를 벗어나는 결정을 스스로 내리지 않는다.
명세에 없는 상황은 **반드시 사용자에게 물어보고 대기**한다.
"못한다는 것을 말하는 것"이 "잘못된 결정을 내리는 것"보다 낫다.
디자인 시스템 검증 시 "통일 = 위반값으로 맞추기" 절대 금지.
DESIGN.md 기준으로 위반 파악 후 올바른 토큰으로 교체.
위반값이 여러 파일에 동일하게 있어도 "기준 정답"으로 삼지 않는다.
---

## 하네스 엔지니어링 구조

```
PHASE 0  초기 세팅     (1개 에이전트 단독)
PHASE 1  병렬 구현     (3개 에이전트 동시 실행)
PHASE 2  검증 및 연동  (1개 에이전트, PHASE 1 완료 후)
```

---

## PHASE 0 — AGENT-SETUP

**담당**
- 폴더 구조 생성
- 패키지 설치 (package.json, npm install)
- tailwind.config.js 초기 설정
- index.css 초기 설정
- .env.example 생성

**완료 조건**
- npm run dev로 client 정상 실행 확인
- 빈 App.jsx 라우팅 1개 이상 동작 확인

> PHASE 0 완료 전까지 PHASE 1 시작 금지
---
1. 모든 페이지는 ScreenContainer 사용
2. statusBarBg prop 명시 (대부분 colors.surface.card)
3. position: fixed inset: 0 패턴 금지 (ChargeScreen 같은 외톨이 패턴 회피)
4. 자식 wrapper는 flex: 1 + minHeight: 0 패턴 (flex column 부모 전제)
---

## PHASE 1 — 병렬 구현 (동시 실행)

### AGENT-1: 기반 + 데이터

**담당**
- tailwind.config.js (DESIGN.md 토큰 그대로 반영)
- index.html (Pretendard 또는 프로젝트 지정 폰트 CDN)
- src/index.css (전환 애니메이션, 글로벌 스타일)
- src/data/ (IA.md 정의 데이터 파일 전체)
- src/App.jsx (ROUTES.md 기준 라우팅 설정)
- src/main.jsx
- tokens.js

**완료 조건**
- tailwind 토큰 색상 클래스 전부 동작 확인 (bg-accent, text-text-pri 등)
- 폰트 로드 확인
- 데이터 파일 IA.md 전체 항목 커버

---

### AGENT-2: 페이지 + 핵심 흐름

**담당**
- src/pages/ 전체 (IA.md 정의 페이지 목록 기준)
- src/components/Layout.jsx
- 핵심 사용자 흐름 상태 관리 (Context 또는 props drilling 최소화)

**완료 조건**
- IA.md의 전체 화면 전환 흐름 동작
- 이전/다음 네비게이션 동작
- 각 페이지 라우팅 정상 연결

---

### AGENT-3: 재사용 컴포넌트

**담당**
- src/components/ 전체 (COMPONENTS.md 목록 기준)

**완료 조건**
- COMPONENTS.md 스펙 그대로 구현 (이탈 없음)
- PATTERNS.md 패턴 그대로 사용
- 각 컴포넌트 단독 렌더링 확인

---

## PHASE 2 — AGENT-REVIEW

**실행 조건**: PHASE 1 세 에이전트 전부 완료 후에만 시작

**담당**
- PHASE 1 전체 산출물 CHECKLIST 검증
- 외부 API 연동 (server/index.js, server/routes/, server/prompts/)
- 클라이언트 ↔ 서버 통신 연결 및 테스트

---

## CHECKLIST — AGENT-REVIEW 필수 실행

### 디자인 시스템 위배 검사
- [ ] 프로젝트 지정 폰트 외 다른 폰트 없음 (system-ui fallback 제거됨)
- [ ] 색상 하드코딩 없음 (HEX 직접 입력 금지, tailwind 토큰만 사용)
- [ ] 그라데이션 사용 없음 (DESIGN.md에 명시된 경우만 허용)
- [ ] box-shadow 사용 없음 (DESIGN.md에 명시된 경우만 허용)
- [ ] scale transform 사용 없음 (명시된 경우만 허용)
- [ ] 이모지 사용 없음 (모든 .jsx, .json, .md 파일)
- [ ] AI 응답에 *, ㅡ, :, 작은따옴표 사용 없음

### 레이아웃 검사
- [ ] A형: max-w-[430px] 모든 페이지에 적용
- [ ] B형: 320px 화면에서 콘텐츠 잘림 없음
- [ ] 가로 스크롤 발생 없음
- [ ] 상하좌우 여백 일관성 (DESIGN.md 기준값 준수)
- [ ] 폰트 사이즈가 DESIGN.md 스케일 그대로

### 타이포그래피 검사
- [ ] 모든 텍스트 요소 DESIGN.md 타이포그래피 스케일 준수
- [ ] 자간 본문 -0.01em, 제목 -0.02em (DESIGN.md 명시 시)
- [ ] 폰트 웨이트 tokens.js 기준값 준수

### 컴포넌트 검사
- [ ] COMPONENTS.md 스펙 이탈 없음
- [ ] 인터랙션 상태 (hover, active, disabled, selected) 전부 구현
- [ ] A형: 모든 터치 타깃 최소 44px
- [ ] B형: hover / focus-visible 상태 전부 구현

### 사용자 흐름 검사
- [ ] IA.md 정의 전체 화면 전환 동작
- [ ] 분기 로직 정상 작동 (IA.md 명시 분기 기준)
- [ ] 이전 버튼으로 이전 단계 복귀 가능
- [ ] 사용자 입력 누적 상태 관리 정상 (데이터 누락 없음)

### AI 연동 검사 (AI 기능 포함 프로젝트만)
- [ ] API 호출 정상
- [ ] 응답에 *, -, :, 작은따옴표 없음
- [ ] AI 메타 발화 없음 ("저는 AI입니다" 등)
- [ ] 프롬프트 지정 톤 유지
- [ ] API 오작동 시 fallback 처리 존재

### 할루시네이션 방지 검사
- [ ] DESIGN.md에 없는 색상값 없음
- [ ] COMPONENTS.md에 없는 컴포넌트 추가 없음
- [ ] PATTERNS.md 패턴 임의 변형 없음
- [ ] IA.md 페이지 구조 그대로
- [ ] 데이터 파일 임의 항목 추가 없음

### 데이터 무결성 검사
- [ ] 모든 데이터 id unique
- [ ] 분기 로직 id 참조 정확
- [ ] 사용자 응답 객체 누락 필드 없음
- [ ] API 응답 형식 서버 명세와 일치

---

## 임의 결정 금지 상황

다음 상황에서는 반드시 사용자에게 물어보고 대기한다.

- DESIGN.md, COMPONENTS.md, PATTERNS.md, IA.md 간 충돌이 있을 때
- 명세에 없는 컴포넌트가 필요해 보일 때
- 색상이나 폰트가 tokens.js에 없을 때
- API 응답 형식이 명세와 다를 때
- 분기 로직이 IA.md에 정의되지 않은 경우

---
## 사양 해석 원칙

작업 사양이 발견 사항보다 좁을 때, 사양의 정신을 따른다.

예: 사양에 "3건 수정"으로 명시되어 있어도, 같은 파일 안에서 같은 패턴의 6건이 추가 발견되면 모두 처리한다. 작업 범위 (파일/책임)는 엄격히 지키되, 사양의 정신 (낡은 필드 모두 정리)을 따른다.

이유: AI 사양은 사용자가 모든 위반을 미리 알지 못한 채 작성된다. AI가 진단에서 추가 발견한 동일 패턴 위반은 사양의 누락이 아닌 발견의 누락이다.

단, 사양과 다른 책임 영역 (다른 파일, 다른 함수)으로 확장은 금지. "같은 파일 + 같은 패턴"에만 적용.
---

## 컨텍스트 관리

컨텍스트 85% 도달 시:
1. 즉시 작업 중단
2. PROGRESS.md 업데이트 (완료 / 진행중 / 다음 작업 명시)
3. 대기 — 재시작 시 PROGRESS.md 먼저 읽고 이어서 진행

PROGRESS.md 형식:
```
## 완료
- [AGENT-X] 파일명: 완료

## 진행중
- [AGENT-X] 파일명: 어디까지 했는지

## 다음
- [AGENT-X] 파일명: 무엇부터 시작할지

## 블로커
- 사용자 확인이 필요한 항목
```

---

## 커밋 규칙

```
[A0] chore: 초기 세팅 (folder, packages, config)
[A1] feat: 기반 데이터 + 라우팅 (data, App, tailwind, tokens)
[A2] feat: 페이지 흐름 (pages, layout)
[A3] feat: 재사용 컴포넌트 (components)
[AR] fix: REVIEW 수정사항 반영
[AR] feat: 서버 연동 (server, external API)
```