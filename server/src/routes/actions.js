const express = require('express');
const pool = require('../db');

const router = express.Router();

// POST /api/session — 새 세션 발급 (s_1, s_2 순차)
router.post('/session', async (_req, res) => {
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 임시 session_id로 INSERT → 자동 부여된 id 받기
      const insertResult = await client.query(
        `INSERT INTO sessions (session_id) VALUES ($1) RETURNING id`,
        [`_temp_${Date.now()}_${Math.random()}`]
      );
      const newId = insertResult.rows[0].id;
      const finalSessionId = `s_${newId}`;

      // 임시값을 s_N으로 교체
      await client.query(
        `UPDATE sessions SET session_id = $1 WHERE id = $2`,
        [finalSessionId, newId]
      );

      await client.query('COMMIT');
      res.json({ ok: true, sessionId: finalSessionId });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('POST /api/session error:', err.message);
    res.status(500).json({ error: 'db error', message: err.message });
  }
});

// POST /api/log — 세션 액션 기록
router.post('/log', async (req, res) => {
  const { sessionId, actionType, amount, storeName } = req.body;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'sessionId required' });
  }
  if (!['charge', 'refund', 'qr_pay'].includes(actionType)) {
    return res.status(400).json({ error: 'invalid actionType' });
  }
  if (typeof amount !== 'number' || amount < 0 || !Number.isInteger(amount)) {
    return res.status(400).json({ error: 'invalid amount' });
  }
  const normalizedStore = actionType === 'qr_pay' ? (storeName || null) : null;

  try {
    const result = await pool.query(
      `INSERT INTO actions (session_id, action_type, amount, store_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [sessionId, actionType, amount, normalizedStore]
    );
    res.json({
      ok: true,
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    });
  } catch (err) {
    console.error('POST /api/log error:', err.message);
    res.status(500).json({ error: 'db error', message: err.message });
  }
});

// GET /api/log/stats — 누적 통계 (발표 시연용)
router.get('/log/stats', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         action_type,
         COUNT(*)::int as count,
         COALESCE(SUM(amount), 0)::bigint as total_amount
       FROM actions
       GROUP BY action_type`
    );
    res.json({ ok: true, stats: result.rows });
  } catch (err) {
    console.error('GET /api/log/stats error:', err.message);
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
