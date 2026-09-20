# iM샵 UX/UI 개선 프로젝트 (아이엠대구)

시니어를 위한 iM샵 충전 진입 경로 재설계. iOS와 Android 프로토타입 두 벌.

## 배포본

- iOS 빌드: https://im-challenge-ios.vercel.app
- Android 빌드: https://im-challenge-android.vercel.app
- 두 빌드 비교: https://im-challenge-ios.vercel.app/design-system

주소 뒤에 `?demo=1`을 붙이면 본인인증 게이트를 건너뛴다(시연용).

## 로컬 실행

```bash
cd client
npm install
npm run dev
```

브라우저에서 http://localhost:5173 을 연다. Android 빌드로 보려면 `?platform=android`를 붙인다.

## 환경변수 없이 되는 것과 안 되는 것

`.env` 없이 그대로 실행된다. 실제 키는 저장소에 넣지 않았다.

| 기능 | 키 없이 |
|---|---|
| 카드 신청, 충전, 환불, QR결제 흐름 | 동작 |
| 연결계좌 8초 감지, 충전 한도 안내, 인증 재요청 감지 | 동작 |
| 코치마크 9개 화면, 큰글씨 모드, 바텀내비, 쿠폰함 | 동작 |
| 결제매장 목록, 카테고리 필터, 상세 시트 | 동작 |
| 결제매장 지도 타일 | `VITE_GOOGLE_MAPS_API_KEY` 필요 |
| 서버 행동 로그 저장 | `server/` 실행과 `DATABASE_URL` 필요. 없으면 조용히 건너뛴다 |

키를 넣으려면 `client/.env.example`을 `client/.env`로 복사해 채운다.

## 구조

- `client/` React + Vite + Tailwind. 화면 25개, 컴포넌트 58개.
- `client/src/tokens/tokens.js` 색, 간격, 글자 크기 단일 소스.
- `client/src/hooks/usePlatform.js` iOS와 Android 분기. 26개 파일이 참조.
- `server/` Express + PostgreSQL(Neon). 세션 로그 기록.
- `docs/proposal-screenshots/` 제안서에 쓴 전후 캡처.

## 제출 시점

이 저장소의 제출본은 태그 `submission-2026-09-20` 커밋이다. 마감 이후 변경은 태그 뒤에 남긴다.
