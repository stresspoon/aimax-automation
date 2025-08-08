"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthMock } from "./auth-provider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthMock();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}


