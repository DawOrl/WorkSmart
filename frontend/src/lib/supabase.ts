import { createClient } from '@supabase/supabase-js';
import { isDemo } from './env';

// ── Demo: mock Supabase auth, accepts any credentials ────────────────────────
// The session lives in localStorage, so signing out really signs out and the
// sign-in screen is reachable. Storage can be blocked (private mode), so every
// access is guarded and falls back to memory.
const SESSION_KEY = 'worksmart-demo-session';
const DEMO_USER = { id: 'demo-user-00000000-0000-0000-0000-000000000001', email: 'demo@worksmart.pl' };
const DEMO_SESSION = { access_token: 'demo-token', refresh_token: 'demo-refresh', user: DEMO_USER };

type Listener = (event: string, session: typeof DEMO_SESSION | null) => void;

let memorySignedIn = false;
const listeners = new Set<Listener>();

function readSignedIn() {
  try {
    return window.localStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return memorySignedIn;
  }
}

function writeSignedIn(value: boolean) {
  memorySignedIn = value;
  try {
    if (value) window.localStorage.setItem(SESSION_KEY, '1');
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // storage blocked: memory fallback above is enough for one tab
  }
}

function emit(event: string) {
  const session = readSignedIn() ? DEMO_SESSION : null;
  listeners.forEach(cb => cb(event, session));
}

const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: readSignedIn() ? DEMO_SESSION : null }, error: null }),

    onAuthStateChange: (cb: Listener) => {
      listeners.add(cb);
      setTimeout(() => cb('INITIAL_SESSION', readSignedIn() ? DEMO_SESSION : null), 0);
      return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
    },

    signInWithPassword: async (_creds: { email: string; password: string }) => {
      writeSignedIn(true);
      emit('SIGNED_IN');
      return { data: { user: DEMO_USER, session: DEMO_SESSION }, error: null };
    },

    signUp: async (creds: { email: string; password: string }) => {
      writeSignedIn(true);
      emit('SIGNED_IN');
      return { data: { user: { ...DEMO_USER, email: creds.email }, session: DEMO_SESSION }, error: null };
    },

    signOut: async () => {
      writeSignedIn(false);
      emit('SIGNED_OUT');
      return { error: null };
    },

    getUser: async () => ({ data: { user: readSignedIn() ? DEMO_USER : null }, error: null }),
  },

  // The frontend never queries tables directly; all data goes through the API.
  from: (_table: string) => ({
    upsert: async () => ({ data: null, error: null }),
    select: async () => ({ data: [], error: null }),
  }),
};

function realClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Missing Supabase environment variables');
  return createClient(url, anonKey);
}

export const supabase: any = isDemo ? mockSupabase : realClient();
