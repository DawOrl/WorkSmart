import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

const createSchema = z.object({
  job_id: z.string().uuid(),
  status: z.enum(['sent', 'interview', 'rejected', 'offer']).default('sent'),
  notes: z.string().optional(),
  follow_up_at: z.string().datetime().optional(),
});

const updateSchema = z.object({
  status: z.enum(['sent', 'interview', 'rejected', 'offer']).optional(),
  notes: z.string().optional(),
  follow_up_at: z.string().datetime().nullable().optional(),
});

/** GET /api/applications */
router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*, job:job_listings(*)')
    .eq('user_id', req.user!.id)
    .order('applied_at', { ascending: false });
  if (error) throw error;
  res.json(data);
}));

/** POST /api/applications */
router.post('/', requireAuth, validateBody(createSchema), asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('applications')
    .insert({ ...req.body, user_id: req.user!.id })
    .select()
    .single();
  if (error) throw error;
  res.status(201).json(data);
}));

/** PATCH /api/applications/:id */
router.patch('/:id', requireAuth, validateBody(updateSchema), asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('applications')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id)
    .select()
    .single();
  if (error || !data) { res.status(404).json({ error: 'Application not found' }); return; }
  res.json(data);
}));

/** DELETE /api/applications/:id */
router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  await supabase.from('applications').delete().eq('id', req.params.id).eq('user_id', req.user!.id);
  res.status(204).send();
}));

export default router;
