const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRouter = require('./routes/health');
const actionsRouter = require('./routes/actions');

const app = express();
const PORT = process.env.PORT || 4000;

/* ─── 미들웨어 ─── */
app.use(cors());
app.use(express.json());

/* ─── 라우터 ─── */
app.use('/api/health', healthRouter);
app.use('/api', actionsRouter);

/* ─── 서버 시작 ─── */
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
