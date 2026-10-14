import type { Express } from 'express';
import cvRouter from './cv.js';
import jobsRouter from './jobs.js';
import matchesRouter from './matches.js';
import applicationsRouter from './applications.js';
import alertsRouter from './alerts.js';
import letterRouter from './letter.js';
import paymentsRouter from './payments.js';
import webhooksRouter from './webhooks.js';
import { requireAuth } from '../middleware/auth.js';

export function mountRoutes(app: Express) {
  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  /** Current user's profile (plan, e-mail, name) */
  app.get('/api/me', requireAuth, (req, res) => { res.json(req.user); });

  app.use('/api/cv', cvRouter);
  app.use('/api/jobs', jobsRouter);
  app.use('/api/matches', matchesRouter);
  app.use('/api/applications', applicationsRouter);
  app.use('/api/alerts', alertsRouter);
  app.use('/api/letter', letterRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api/webhooks', webhooksRouter);
}
