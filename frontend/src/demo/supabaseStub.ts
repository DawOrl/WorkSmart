// Replaces @supabase/supabase-js in the static demo build (see vite.config.ts).
// The demo uses the mock client from lib/supabase.ts; this only satisfies the import.
export function createClient(): never {
  throw new Error('Supabase is not available in the static demo');
}
