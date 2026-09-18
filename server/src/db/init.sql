-- actions 테이블 — 세션 ID별 충전/환불/QR결제 액션 기록
-- 수동 실행: Neon SQL Editor에서 1회 실행

CREATE TABLE IF NOT EXISTS actions (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('charge', 'refund', 'qr_pay')),
  amount INTEGER NOT NULL,
  store_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_actions_session ON actions(session_id);
CREATE INDEX IF NOT EXISTS idx_actions_created ON actions(created_at);
