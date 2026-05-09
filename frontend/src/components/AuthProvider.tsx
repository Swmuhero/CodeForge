"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthResponse = {
  token: string;
  user: User;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    const storedUser = window.localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as User);
    }

    setReady(true);
  }, []);

  function persistSession(auth: AuthResponse) {
    window.localStorage.setItem("token", auth.token);
    window.localStorage.setItem("user", JSON.stringify(auth.user));
    setToken(auth.token);
    setUser(auth.user);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      ready,
      login: async (email, password) => {
        const auth = await apiRequest<AuthResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        persistSession(auth);
      },
      register: async (name, email, password) => {
        const auth = await apiRequest<AuthResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password })
        });
        persistSession(auth);
      },
      logout: async () => {
        if (token) {
          await apiRequest("/auth/logout", {
            method: "POST",
            token
          }).catch(() => {});
        }
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        router.push("/login");
      }
    }),
    [ready, router, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
