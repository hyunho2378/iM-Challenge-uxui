# 정리 내역 (강릉페이 자산 → iM샵 리브랜딩 베이스)

## 삭제함
- `website/` 전체 — 강릉 포트폴리오 케이스스터디 사이트. iM샵 앱과 무관.
- `DESIGN.md` — 강릉페이 Phase 2 리디자인 기획 문서(강릉 전용 서사).
- `README.md` — 강릉 프로젝트 소개.
- `SETUP.md` — 강릉 포폴 웹사이트 구축 지시서(website/와 한 세트).
- `*.lottie2` — 깨진 확장자 파일.
- `node_modules/`, `dist/`, `.git/` — 용량. `npm install`로 복구.

## 남김 (규칙·지식 자산)
- `MD3.md` — Material Design 3 학습·매핑.
- `LARGETEXT.md` — 큰글씨(시니어) 모드 설계 사양.
- `AGENTS.md` — 에이전트 실행 구조·할루시네이션 방지 규율.
- `claude.md` — LLM 코딩 실수 방지 가이드라인.
- `COMPONENTS.md` / `ROUTES.md` — 컴포넌트 스펙·라우팅 맵(재활용 지도).

## 남김 (재료 — 전량 보존)
- `client/` 전체: 토큰, 훅(usePlatform=iOS/Android 분기), 레이아웃, 공통·홈·결제·스토어 컴포넌트, 모든 페이지(기부·교통카드·캐시백 포함). UX/UI 디벨롭용 재료로 통째 보존.
- `server/` 전체: 세션 로그(charge/refund/qr_pay) → AI 감지 신호로 재해석 예정.

## 아직 안 한 것 (다음 단계)
- 강릉/gangneung 텍스트 치환(56개 파일): iM샵 캡처 보고 브랜드값 확정 후 일괄.
- tokens.js 색·radius: iM샵 캡처 기준으로 재추출.
- ChatBotScreen: 감지형 가이드로 대체 검토.
