import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type SupabaseUser = {
  id: string;
  email?: string;
};

export function useSupabaseUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error: sessionError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (sessionError) {
        // AuthSessionMissingError just means "no session yet" – treat as logged out, not an error.
        if (sessionError.name === 'AuthSessionMissingError') {
          setUser(null);
          setLoading(false);
          return;
        }

        console.error('[auth] getUser error', sessionError);
        setError('Could not load user session.');
        setUser(null);
        setLoading(false);
        return;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? undefined,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? undefined,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}

