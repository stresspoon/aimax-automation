"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/components/auth/auth-provider";

export default function Home() {
  const { isAuthenticated } = useAuthMock();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  return <main className="min-h-dvh flex items-center justify-center text-4xl font-semibold">AIMAX</main>;
}
