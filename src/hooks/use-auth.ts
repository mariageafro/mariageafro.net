import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userType: 'client' | 'prestataire') => {
    setError(null);
    setIsLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            user_type: userType,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Signup failed');

      // Set user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: userType === 'prestataire' ? 'prestataire' : 'client',
        });

      if (roleError) throw roleError;

      return { success: true, message: 'Inscription réussie. Veuillez confirmer votre email.' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Identifiants invalides';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    await supabase.auth.signOut();
    navigate('/');
  };

  return {
    user,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
