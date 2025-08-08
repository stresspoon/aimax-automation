"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthContextShape, User } from "@/lib/auth/types";

const AuthContext = createContext<AuthContextShape | null>(null);

export function useAuthMock(): AuthContextShape {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext not available");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Persist in-memory to sessionStorage for mock UX
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("aimax_auth_mock");
      if (cached) setUser(JSON.parse(cached));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("aimax_auth_mock", JSON.stringify(user));
    } catch {}
  }, [user]);

  const value: AuthContextShape = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      login: () =>
        setUser({ id: "u_1", name: "AIMAX User", email: "user@example.com" }),
      logout: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


