import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

const alertSchema = z.object({
  min_score: z.number().int().min(0).max(100).default(75),
  keywords: z.array(z.string()).default([]),
  locations: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
});

router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', req.user!.id);
  if (error) throw error;
  res.json(data);
}));

router.post('/', requireAuth, validateBody(alertSchema), asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('alerts')
    .insert({ ...req.body, user_id: req.user!.id })
    .select()
    .single();
  if (error) throw error;
  res.status(201).json(data);
}));

router.patch('/:id', requireAuth, validateBody(alertSchema.partial()), asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('alerts')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id)
    .select()
    .single();
  if (error || !data) { res.status(404).json({ error: 'Alert not found' }); return; }
  res.json(data);
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  await supabase.from('alerts').delete().eq('id', req.params.id).eq('user_id', req.user!.id);
  res.status(204).send();
}));

export default router;
