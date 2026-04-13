import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { analyzeCV } from '../agents/cvAnalyzer.js';
import { supabase } from '../lib/supabase.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

/** POST /api/cv/upload – upload and analyze CV */
router.post(
  '/upload',
  requireAuth,
  aiRateLimiter,
  upload.single('cv'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const userId = req.user!.id;
    const profile = await analyzeCV(req.file.buffer, req.file.mimetype, userId);
    res.status(201).json(profile);
  }),
);

/** GET /api/cv/me – get current user's CV profile */
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { data, error } = await supabase
      .from('cv_profiles')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      res.status(404).json({ error: 'No CV profile found' });
      return;
    }
    res.json(data);
  }),
);

export default router;
