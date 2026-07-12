import express from 'express';
import { apiRouter } from './routers/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

// Global error handler
app.use(errorHandler);

export default app;
