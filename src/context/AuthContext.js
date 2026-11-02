'use client';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { USER } from '@/data/site';

const AuthContext = createContext(null);

/** Demo auth: stores the user in localStorage. Replace login/logout with real API calls. */
export function AuthProvider({ children }) {
  const [user, setUser, ready] = useLocalStorage('tinyadds:user', null);

  const login = useCallback(() => setUser(USER), [setUser]);
  const logout = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
