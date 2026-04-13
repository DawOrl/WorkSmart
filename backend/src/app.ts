import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { mountRoutes } from './routes/index.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  }));

  // Logging
  app.use(morgan('dev'));

  // Rate limiting
  app.use('/api', rateLimiter);

  // Body parsing (skip for Stripe webhooks – they need raw body)
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
  app.use(express.json({ limit: '10mb' }));

  // Routes
  mountRoutes(app);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
