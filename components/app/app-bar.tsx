"use client";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// import { cn } from "@/lib/utils";
import { useAuthMock } from "@/components/auth/auth-provider";

export function AppBar() {
  // const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const { isAuthenticated, login, logout } = useAuthMock();

  return (
    <div>
      <header className="sticky top-0 z-50 h-14 border-b border-[#ddd] bg-[var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg)]/80">
        <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" aria-label="홈으로 이동" className="font-semibold text-lg tracking-tight">
            AIMAX
          </Link>
          <nav aria-label="주요 메뉴" className="hidden sm:flex items-center gap-5" />
          <div className="relative" ref={menuRef}>
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => login()}
                className="h-9 px-3 rounded-md border border-[color:oklch(0.85_0.01_0)] bg-white/80 text-[var(--fg)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                로그인
              </button>
            ) : (
              <>
                <button
                  type="button"
                  aria-label="프로필 메뉴"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[color:oklch(0.85_0.01_0)] bg-white/80 text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <span aria-hidden>👤</span>
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    aria-label="사용자 메뉴"
                    className="absolute right-0 mt-2 w-44 rounded-md border border-[color:oklch(0.85_0.01_0)] bg-white/95 shadow-md p-1 text-sm"
                  >
                    <Link className="block px-3 py-2 rounded hover:bg-[var(--muted)]/10" href="/dashboard" role="menuitem">
                      대시보드
                    </Link>
                    <button
                      className="w-full text-left px-3 py-2 rounded hover:bg-[var(--muted)]/10"
                      role="menuitem"
                      onClick={() => logout()}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}


