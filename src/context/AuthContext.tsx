import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

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

  // =========================
  // INIT AUTH
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("nexora_token");

    if (!token) {
      setLoading(false);
      return;
    }

    setToken(token);

    api.users
      .me()
      .then((u) => setUser(u))
      .catch(() => {
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = useCallback(async (email: string, password: string) => {
    const resp = await api.auth.login({ email, password });

    setToken(resp.access_token);

    // 🔥 ensure token applied before next request
    await new Promise((r) => setTimeout(r, 50));

    const me = await api.users.me();
    setUser(me);
  }, []);

  // =========================
  // REGISTER
  // =========================
  const register = useCallback(async (username: string, email: string, password: string) => {
    await api.auth.register({ username, email, password });

    const resp = await api.auth.login({ email, password });

    setToken(resp.access_token);

    await new Promise((r) => setTimeout(r, 50));

    const me = await api.users.me();
    setUser(me);
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nexora_token");
  }, []);

  // =========================
  // REFRESH USER
  // =========================
  const refreshUser = useCallback(async () => {
    try {
      const me = await api.users.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}
