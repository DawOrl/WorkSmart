import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from '../demo/supabase.js';

// ── DEMO_MODE: use in-memory mock, skip real Supabase connection ──────────────
if (process.env.DEMO_MODE === 'true') {
  console.log('[demo] Supabase → in-memory mock');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (process.env.DEMO_MODE !== 'true' && (!supabaseUrl || !supabaseServiceKey)) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

/**
 * Backend Supabase client – real in production, in-memory mock in DEMO_MODE.
 * Typed as `any` because we don't have generated DB types yet (run `supabase gen types`
 * once you have a real project to replace this with a strongly-typed client).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any =
  process.env.DEMO_MODE === 'true'
    ? (mockSupabase as unknown as ReturnType<typeof createClient>)
    : createClient(supabaseUrl!, supabaseServiceKey!, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
