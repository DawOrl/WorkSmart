import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

/** GET /api/jobs – list active job listings with optional filters */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { source, remote_type, location, search, page = '1', limit = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('job_listings')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('scraped_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (source) query = query.eq('source', source);
    if (remote_type) query = query.eq('remote_type', remote_type);
    if (location) query = query.ilike('location', `%${location}%`);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, count, error } = await query;
    if (error) throw error;

    res.json({ jobs: data, total: count, page: parseInt(page), limit: parseInt(limit) });
  }),
);

/** GET /api/jobs/:id – single job listing */
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json(data);
  }),
);

export default router;
