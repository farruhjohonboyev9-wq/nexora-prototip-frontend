import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setToken } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nexora_token');
    if (token) {
      setToken(token);
      api.users.me()
        .then(setUser)
        .catch(() => { setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await api.auth.login({ email, password });
    setToken(resp.access_token);
    const me = await api.users.me();
    setUser(me);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    await api.auth.register({ username, email, password });
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await api.users.me();
      setUser(me);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
