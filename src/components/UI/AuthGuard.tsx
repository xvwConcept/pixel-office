import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '@/lib/supabase';
import type { MockSession } from '@/lib/supabase';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [session, setSession] = useState<MockSession | null | 'loading'>('loading');

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  if (session === 'loading') {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
