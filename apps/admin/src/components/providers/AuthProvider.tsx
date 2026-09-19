//apps/admin/src/components/providers/AuthProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

import type { User } from '@kobi/types';
import {
  setAccessToken,
  setOnUnauthorized,
  tryRefresh,
  getAccessToken,
} from '@/lib/api/client';
import {
  login as loginApi,
  logout as logoutApi,
  fetchMe,
} from '@/lib/api/endpoints';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap: on mount, try to refresh & fetch user
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const ok = await tryRefresh();
        if (!ok || cancelled) {
          setLoading(false);
          return;
        }
        const me = await fetchMe();
        if (!cancelled) setUser(me);
      } catch {
        // ignore — user not logged in
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle global 401 — redirect to login
  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setAccessToken(null);
      if (pathname !== '/login') {
        router.push('/login');
      }
    });
    return () => setOnUnauthorized(null);
  }, [pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password);
    setAccessToken(result.accessToken);
    setUser(result.user);
    router.push('/');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    setAccessToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}