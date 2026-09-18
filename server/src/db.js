const { Pool } = require('pg');
require('dotenv').config();

/**
 * NeonDB 연결 풀
 * .env 파일에 DATABASE_URL을 설정하면 자동 연결됩니다.
 *
 * 예시:
 *   DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (err) => {
  console.error('❌ DB Pool 에러:', err.message);
});

module.exports = pool;
