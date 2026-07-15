import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routers/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { pool } from './db/index.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
  let dbStatus = 'ok';
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    dbStatus = 'error';
  }
  
  const status = dbStatus === 'ok' ? 200 : 503;
  res.status(status).json({ 
    status: dbStatus === 'ok' ? 'ok' : 'error', 
    db: dbStatus,
    timestamp: new Date().toISOString() 
  });
});

app.use('/api', apiRouter);

// Global error handler
app.use(errorHandler);

export default app;
