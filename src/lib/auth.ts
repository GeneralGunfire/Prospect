import { supabase } from './supabase';

export interface AuthError {
  message: string;
}

export async function signUp(email: string, password: string, fullName: string) {
  // Sign up without email confirmation — user is logged in immediately
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      // No emailRedirectTo — confirmation emails disabled in Supabase dashboard
    },
  });

  if (error) {
    if (
      error.message.toLowerCase().includes('already registered') ||
      error.message.toLowerCase().includes('already exists') ||
      error.message.toLowerCase().includes('user already')
    ) {
      throw new Error('Email already in use. Please log in instead.');
    }
    if (error.message.toLowerCase().includes('rate limit')) {
      throw new Error('Too many attempts. Please wait a moment and try again.');
    }
    throw new Error(error.message);
  }

  // Supabase returns an identities array; if empty the email is already registered
  if (data.user && data.user.identities?.length === 0) {
    throw new Error('Email already in use. Please log in instead.');
  }

  // Auto sign-in so the user lands on the dashboard immediately
  const signInResult = await supabase.auth.signInWithPassword({ email, password });
  if (signInResult.error) throw new Error(signInResult.error.message);

  return signInResult.data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Incorrect email or password. Please try again.');
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Email confirmation is required. Please contact support or try signing up again.');
    }
    throw new Error(error.message);
  }

  return data;
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?mode=reset`,
  });

  if (error) throw new Error(error.message);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export function getPasswordStrength(password: string): {
  score: number;
  label: 'weak' | 'medium' | 'strong';
  checks: Record<string, boolean>;
} {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const label = score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong';

  return { score, label, checks };
}
