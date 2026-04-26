import { useEffect, useState, type ComponentType } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { getCurrentUserFromStorage } from './auth';

export type AppPage = 'home' | 'auth' | 'dashboard' | 'quiz' | 'subject-selector' | 'library' | 'careers' | 'bursaries' | 'bursary' | 'disadvantaged-guide' | 'map' | 'tvet' | 'tvet-careers' | 'tvet-colleges' | 'tvet-funding' | 'tvet-requirements' | 'calendar' | 'school-assist' | 'school-assist-chat' | 'aps-calculator' | 'impact-auth' | 'demo-learning' | 'community-impact' | 'pothole-map' | 'flag-pothole' | 'my-pothole-contributions' | 'water-dashboard' | 'news' | 'tax-budget' | 'cost-of-living' | 'civics';

export interface AuthedProps {
  user: User;
  onSignOut: () => void;
  onNavigate: (page: AppPage) => void;
}

interface WrapperProps {
  onNavigateAuth: () => void;
  onSignOut: () => void;
  onNavigate: (page: AppPage) => void;
  /** When true, unauthenticated users are given a guest session instead of being redirected to auth */
  guestMode?: boolean;
}

export function withAuth<P extends AuthedProps>(Component: ComponentType<P>) {
  return function ProtectedPage(props: Omit<P, keyof AuthedProps> & WrapperProps) {
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      // Check if we're in test mode - allow tests to bypass auth
      const isTestMode =
        (window as any).__PLAYWRIGHT_TEST__ ||
        sessionStorage.getItem('__test_mode__') === 'true' ||
        localStorage.getItem('__playwright_test_mode__') ||
        new URLSearchParams(window.location.search).get('__test_mode') === 'true';

      if (isTestMode) {
        // Create a mock user for testing
        const mockUser: User = {
          id: 'test-user-' + Math.random().toString(36).substr(2, 9),
          email: 'test@example.com',
          email_confirmed_at: new Date().toISOString(),
          phone: null,
          last_sign_in_at: new Date().toISOString(),
          app_metadata: { provider: 'email', providers: ['email'] },
          user_metadata: { name: 'Test User' },
          identities: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_anonymous: false,
        } as User;

        setUser(mockUser);
        setChecking(false);
        return;
      }

      // Check if we're in test mode with a mocked session in localStorage
      const mockSessionStr = localStorage.getItem('__test_mock_session__');
      if (mockSessionStr) {
        try {
          const mockSession = JSON.parse(mockSessionStr);
          if (mockSession.user) {
            setUser(mockSession.user as User);
            setChecking(false);
            return;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Normal auth flow — check localStorage first for a fast synchronous result
      const storedUser = getCurrentUserFromStorage();

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user) {
          if (storedUser) {
            // localStorage has a user — session restore is in progress via App.tsx
            // Use stored user to avoid flickering to login
            setUser(storedUser as unknown as User);
            setChecking(false);
            return;
          }
          if (props.guestMode) {
            // Guest mode: allow unauthenticated access with a placeholder user
            setUser({
              id: 'guest',
              email: '',
              email_confirmed_at: null,
              phone: null,
              last_sign_in_at: null,
              app_metadata: {},
              user_metadata: { name: 'Guest' },
              identities: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_anonymous: true,
              aud: 'authenticated',
              role: 'anon',
            } as unknown as User);
          } else {
            props.onNavigateAuth();
          }
        } else {
          setUser(session.user);
        }
        setChecking(false);
      });
    }, []);

    // Blank while checking — App-level LoadingScreen already handles initial load
    if (checking || !user) return null;

    return (
      <Component
        {...(props as unknown as P)}
        user={user}
        onSignOut={props.onSignOut}
        onNavigate={props.onNavigate}
      />
    );
  };
}
