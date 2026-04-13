import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

export function useAuth() {
  const { user, session, profile, loading, setUser, setSession, setProfile, setLoading, reset } =
    useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        try {
          const { data } = await api.get('/api/cv/me');
          setProfile(data);
        } catch {
          // Profile not loaded yet – OK
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser, setLoading, setProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    reset();
  };

  return { user, session, profile, loading, signOut };
}
