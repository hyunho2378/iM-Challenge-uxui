const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * GET /api/health
 * 서버 + DB 연결 상태를 확인하는 헬스 체크 엔드포인트
 */
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: result.rows[0].now,
      message: '서버 & DB 연결 정상',
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      message: 'DB 연결 실패',
      error: err.message,
    });
  }
});

module.exports = router;
