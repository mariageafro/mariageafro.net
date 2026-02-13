import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [userType, setUserType] = useState<'client' | 'prestataire'>('client');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [signUpData, setSignUpData] = useState<SignUpFormValues>({ email: '', password: '', confirmPassword: '' });
  const [signInData, setSignInData] = useState<SignInFormValues>({ email: '', password: '' });
  const { signUp, signIn, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateSignUp = (data: SignUpFormValues): boolean => {
    try {
      signUpSchema.parse(data);
      setFormError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFormError(err.errors[0].message);
      }
      return false;
    }
  };

  const validateSignIn = (data: SignInFormValues): boolean => {
    try {
      signInSchema.parse(data);
      setFormError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFormError(err.errors[0].message);
      }
      return false;
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp(signUpData)) return;

    const result = await signUp(signUpData.email, signUpData.password, userType);
    if (result.success) {
      setSuccessMessage(result.message);
      setSignUpData({ email: '', password: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn(signInData)) return;

    const result = await signIn(signInData.email, signInData.password);
    if (result.success) {
      // Check user role to redirect appropriately
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', currentUser.id).maybeSingle();
        if (roleData?.role === 'prestataire') {
          navigate('/dashboard');
          return;
        }
      }
      navigate('/');
    }
  };

  const displayError = formError || error;

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-display text-chocolate">
              {isSignIn ? 'Connexion' : 'Inscription'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignIn
                ? 'Connectez-vous à votre compte MariageAfro'
                : 'Créez votre compte MariageAfro'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {displayError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {successMessage && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {!isSignIn && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-chocolate">Type de compte</p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={userType === 'client' ? 'gold' : 'outline'}
                    className="flex-1"
                    onClick={() => setUserType('client')}
                  >
                    Client
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'prestataire' ? 'gold' : 'outline'}
                    className="flex-1"
                    onClick={() => setUserType('prestataire')}
                  >
                    Prestataire
                  </Button>
                </div>
              </div>
            )}

            {isSignIn ? (
              <form onSubmit={onSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Mot de passe</label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            ) : (
              <form onSubmit={onSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Mot de passe</label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Confirmer le mot de passe</label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Inscription...' : "S'inscrire"}
                </Button>
              </form>
            )}

            {/* Apple Sign In */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={async () => {
                const { error } = await lovable.auth.signInWithOAuth("apple", {
                  redirect_uri: window.location.origin,
                });
                if (error) {
                  setFormError(error.message || "Erreur lors de la connexion Apple");
                }
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continuer avec Apple
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  {isSignIn ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSignIn(!isSignIn);
                setSuccessMessage(null);
                setFormError(null);
                setSignInData({ email: '', password: '' });
                setSignUpData({ email: '', password: '', confirmPassword: '' });
              }}
            >
              {isSignIn ? "S'inscrire" : 'Se connecter'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
