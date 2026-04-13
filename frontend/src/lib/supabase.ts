import { createClient } from '@supabase/supabase-js';

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// ── DEMO_MODE: mock Supabase auth – accepts any credentials ──────────────────
const DEMO_SESSION = {
  access_token: 'demo-token',
  refresh_token: 'demo-refresh',
  user: { id: 'demo-user-00000000-0000-0000-0000-000000000001', email: 'demo@worksmart.pl' },
};

const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: DEMO_SESSION }, error: null }),

    onAuthStateChange: (cb: (event: string, session: any) => void) => {
      // Fire immediately so useAuth picks up the demo session
      setTimeout(() => cb('SIGNED_IN', DEMO_SESSION), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },

    signInWithPassword: async (_creds: { email: string; password: string }) => ({
      data: { user: DEMO_SESSION.user, session: DEMO_SESSION },
      error: null,
    }),

    signUp: async (creds: { email: string; password: string }) => ({
      data: { user: { ...DEMO_SESSION.user, email: creds.email }, session: DEMO_SESSION },
      error: null,
    }),

    signOut: async () => {
      // In demo mode, sign-out reloads the page to reset state
      window.location.href = '/';
      return { error: null };
    },

    getUser: async () => ({ data: { user: DEMO_SESSION.user }, error: null }),
  },

  // Frontend doesn't query DB directly – all data goes through the backend API.
  // This stub prevents errors if any component accidentally calls supabase.from().
  from: (_table: string) => ({
    select: () => ({ data: [], error: null }),
  }),
};

// ── Real Supabase client (production) ─────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isDemoMode && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: any = isDemoMode
  ? mockSupabase
  : createClient(supabaseUrl, supabaseAnonKey);
