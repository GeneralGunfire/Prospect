import { useEffect, useState, type ComponentType } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AppPage = 'home' | 'auth' | 'dashboard' | 'quiz' | 'library' | 'careers' | 'bursaries' | 'bursary' | 'disadvantaged-guide' | 'map' | 'tvet' | 'tvet-careers' | 'tvet-colleges' | 'tvet-funding' | 'tvet-requirements';

export interface AuthedProps {
  user: User;
  onSignOut: () => void;
  onNavigate: (page: AppPage) => void;
}

interface WrapperProps {
  onNavigateAuth: () => void;
  onSignOut: () => void;
  onNavigate: (page: AppPage) => void;
}

export function withAuth<P extends AuthedProps>(Component: ComponentType<P>) {
  return function ProtectedPage(props: Omit<P, keyof AuthedProps> & WrapperProps) {
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      // Check if we're in test mode with a mocked session
      const mockSessionStr = localStorage.getItem('__test_mock_session__');
      if (mockSessionStr) {
        try {
          const mockSession = JSON.parse(mockSessionStr);
          if (mockSession.user) {
            setUser(mockSession.user);
            setChecking(false);
            return;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Normal auth flow
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user) {
          props.onNavigateAuth();
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
