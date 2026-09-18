-- sessions 테이블 — 세션 ID 발급 + 카운트
-- 수동 실행: Neon SQL Editor에서 1회 실행

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_id ON sessions(session_id);

-- 보기 좋은 조회 쿼리 (참고용, 발표 시연용)
-- SELECT
--   id,
--   session_id AS 세션,
--   CASE action_type
--     WHEN 'charge' THEN '충전'
--     WHEN 'refund' THEN '환불'
--     WHEN 'qr_pay' THEN 'QR결제'
--   END AS 종류,
--   amount AS 금액,
--   store_name AS 매장,
--   TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD HH24:MI:SS') AS 시각
-- FROM actions
-- ORDER BY id DESC;
