import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';
import { DEMO_PROFILE } from '../demo/data.js';

/** Verify Supabase JWT from Authorization: Bearer <token> header */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // ── DEMO_MODE: accept any Bearer token, inject demo user ──────────────────
  if (process.env.DEMO_MODE === 'true') {
    req.user = DEMO_PROFILE;
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  // Fetch profile with plan info
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile) {
    res.status(401).json({ error: 'User profile not found' });
    return;
  }

  req.user = profile;
  next();
}

/** Guard for Pro or Premium plan features */
export function requirePro(req: Request, res: Response, next: NextFunction) {
  if (req.user?.plan === 'free') {
    res.status(403).json({ error: 'This feature requires a Pro plan', upgrade: true });
    return;
  }
  next();
}
