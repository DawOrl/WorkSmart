import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import type { UserProfile } from '@/types';

/** Subscribe to auth changes once, at the app root. */
export function useAuthListener() {
  const { setUser, setSession, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const apply = async (session: { user?: unknown } | null) => {
      setSession(session as never);
      setUser((session?.user ?? null) as never);
      setLoading(false);
      if (!session?.user) {
        setProfile(null);
        return;
      }
      try {
        const { data } = await api.get<UserProfile>('/api/me');
        setProfile(data);
      } catch {
        // Profile is optional for rendering; pages show their own errors.
      }
    };

    supabase.auth.getSession().then(({ data }: { data: { session: { user?: unknown } | null } }) => apply(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user?: unknown } | null) => { void apply(session); },
    );
    return () => subscription.unsubscribe();
  }, [setSession, setUser, setLoading, setProfile]);
}

export async function signOut() {
  await supabase.auth.signOut();
  useAuthStore.getState().reset();
}
