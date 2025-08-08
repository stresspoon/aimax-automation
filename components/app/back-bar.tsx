"use client";
import { useRouter } from "next/navigation";

export function BackBar() {
  const router = useRouter();
  return (
    <div className="py-3">
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-[color:oklch(0.85_0.01_0)] bg-white/80 hover:bg-white"
        aria-label="대시보드로 이동"
      >
        <span aria-hidden>←</span>
        <span>대시보드로</span>
      </button>
    </div>
  );
}


