import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requirePro } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { generateLetter } from '../agents/letterWriter.js';

const router = Router();

// Demo data uses readable ids (job-00000001); real job ids are UUIDs.
const jobId = process.env.DEMO_MODE === 'true' ? z.string().min(1) : z.string().uuid();

const letterSchema = z.object({
  job_id: jobId,
  style: z.enum(['formal', 'conversational', 'creative']).default('formal'),
  language: z.enum(['pl', 'en']).default('pl'),
});

/** POST /api/letter/generate – Pro only */
router.post(
  '/generate',
  requireAuth,
  requirePro,
  aiRateLimiter,
  validateBody(letterSchema),
  asyncHandler(async (req, res) => {
    const { job_id, style, language } = req.body as z.infer<typeof letterSchema>;
    const letter = await generateLetter(req.user!.id, job_id, style, language);
    res.json({ letter });
  }),
);

export default router;
