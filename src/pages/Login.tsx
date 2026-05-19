import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setToken, getToken } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // INIT USER ON LOAD
  // =========================
  useEffect(() => {
    const token = getToken();

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
  // LOGIN (FIXED)
  // =========================
  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });

    setToken(res.access_token);

    const me = await api.users.me();
    setUser(me);
  };

  // =========================
  // REGISTER
  // =========================
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    await api.auth.register({ username, email, password });

    // auto login after register
    const res = await api.auth.login({ email, password });

    setToken(res.access_token);

    const me = await api.users.me();
    setUser(me);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nexora_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
