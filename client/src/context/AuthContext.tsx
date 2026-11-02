'use client';
import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { USER } from '@/data/site';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Demo auth: stores the user in localStorage. Replace login/logout with real API calls. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, ready] = useLocalStorage<User | null>('tinyadds:user', null);

  const login = useCallback(() => setUser(USER), [setUser]);
  const logout = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
