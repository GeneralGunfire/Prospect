import { supabase } from './supabase';
import { CACHE_KEYS } from '../config/storageStrategy';

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

  if (signInResult.data.session) {
    storeSessionLocally(signInResult.data.session, signInResult.data.user);
  }

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

  if (data.session) {
    storeSessionLocally(data.session, data.user);
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
  clearSessionLocally();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

function storeSessionLocally(session: any, user: any) {
  try {
    localStorage.setItem(CACHE_KEYS.AUTH_SESSION, JSON.stringify(session));
    localStorage.setItem(CACHE_KEYS.AUTH_ACCESS_TOKEN, session.access_token);
    localStorage.setItem(CACHE_KEYS.AUTH_REFRESH_TOKEN, session.refresh_token || '');
    localStorage.setItem(
      CACHE_KEYS.AUTH_USER,
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
      })
    );
    localStorage.setItem(CACHE_KEYS.AUTH_LAST_LOGIN, new Date().toISOString());
  } catch (e) {
    console.error('Failed to store session:', e);
  }
}

function clearSessionLocally() {
  try {
    localStorage.removeItem(CACHE_KEYS.AUTH_SESSION);
    localStorage.removeItem(CACHE_KEYS.AUTH_ACCESS_TOKEN);
    localStorage.removeItem(CACHE_KEYS.AUTH_REFRESH_TOKEN);
    localStorage.removeItem(CACHE_KEYS.AUTH_USER);
    localStorage.removeItem(CACHE_KEYS.AUTH_LAST_LOGIN);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
}

function isTokenExpired(expiresAt: number): boolean {
  if (!expiresAt) return true;
  return Math.floor(Date.now() / 1000) >= expiresAt;
}

export async function restoreSessionFromStorage() {
  try {
    const storedSession = localStorage.getItem(CACHE_KEYS.AUTH_SESSION);
    const storedRefreshToken = localStorage.getItem(CACHE_KEYS.AUTH_REFRESH_TOKEN);
    const storedUser = localStorage.getItem(CACHE_KEYS.AUTH_USER);

    if (!storedSession || !storedRefreshToken) return null;

    const session = JSON.parse(storedSession);
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (isTokenExpired(session.expires_at)) {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: storedRefreshToken });
      if (error || !data.session) {
        clearSessionLocally();
        return null;
      }
      storeSessionLocally(data.session, data.user);
      return { session: data.session, user: data.user };
    }

    // Restore session into Supabase client so it behaves as authenticated
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: storedRefreshToken,
    });

    return { session, user };
  } catch (e) {
    console.error('Failed to restore session:', e);
    clearSessionLocally();
    return null;
  }
}

export function getCurrentUserFromStorage() {
  try {
    const raw = localStorage.getItem(CACHE_KEYS.AUTH_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAuthTokensFromStorage() {
  return {
    accessToken: localStorage.getItem(CACHE_KEYS.AUTH_ACCESS_TOKEN),
    refreshToken: localStorage.getItem(CACHE_KEYS.AUTH_REFRESH_TOKEN),
  };
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
