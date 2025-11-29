"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/types/entities";
import { getMe, login as loginApi, logout as logoutApi } from "./auth";
import { axios } from "./axios";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const refreshRes = await axios.post('/users/token/refresh');
      const newAccess = refreshRes.data?.accessToken;
      if (newAccess) {
        axios.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newAccess);
        }
        const me = await getMe();
        setUser(me);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (stored) {
        axios.defaults.headers.common.Authorization = `Bearer ${stored}`;
        const me = await getMe();
        setUser(me);
        setLoading(false);
        return;
      }
      await refresh();
    } catch {
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const login = async (identifier: string, password: string) => {
    const result = await loginApi(identifier, password);
    if (result?.accessToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${result.accessToken}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', result.accessToken);
      }
    }
    await refresh();
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
