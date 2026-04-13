import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../lib/supabase.js';
import { computeMatches } from '../agents/matchAgent.js';

const router = Router();

/** GET /api/matches – get top matched jobs for current user */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { limit = '10' } = req.query as Record<string, string>;
    const userId = req.user!.id;
    const isPro = req.user!.plan !== 'free';
    const maxResults = isPro ? parseInt(limit) : Math.min(parseInt(limit), 10);

    const { data, error } = await supabase
      .from('match_scores')
      .select('*, job:job_listings(*)')
      .eq('user_id', userId)
      .order('score', { ascending: false })
      .limit(maxResults);

    if (error) throw error;
    res.json({ matches: data, plan: req.user!.plan });
  }),
);

/** POST /api/matches/refresh – trigger re-compute for current user */
router.post(
  '/refresh',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const count = await computeMatches(userId);
    res.json({ message: `Computed ${count} matches`, count });
  }),
);

export default router;
