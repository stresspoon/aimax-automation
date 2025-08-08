"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function toTitle(seg: string): string {
  const map: Record<string, string> = {
    dashboard: "Dashboard",
    automation: "Automation",
    marketing: "Marketing",
    recruiting: "Recruiting",
  };
  return map[seg] ?? (seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : "");
}

export function AppBar() {
  const pathname = usePathname();
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

  const nav = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/automation/marketing", label: "Marketing" },
    { href: "/automation/recruiting", label: "Recruiting" },
  ];

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return { href, label: toTitle(seg) };
  });

  return (
    <div>
      <header className="sticky top-0 z-50 h-14 border-b border-[#ddd] bg-[var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg)]/80">
        <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" aria-label="홈으로 이동" className="font-semibold text-lg tracking-tight">
            AIMAX
          </Link>
          <nav className="hidden sm:flex items-center gap-5" aria-label="주요 메뉴">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium leading-6 transition-colors",
                    active
                      ? "text-[var(--fg)] border-b-2 border-[var(--accent)] pb-1"
                      : "text-[var(--fg)]/70 hover:text-[var(--fg)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="relative" ref={menuRef}>
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
                  프로필
                </Link>
                <Link className="block px-3 py-2 rounded hover:bg-[var(--muted)]/10" href="/dashboard" role="menuitem">
                  대시보드
                </Link>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-[var(--muted)]/10" role="menuitem">
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumbs (header 높이 유지 위해 별도 영역) */}
      <div className="bg-[var(--bg)]">
        <div className="max-w-[1440px] mx-auto px-6 py-2 text-sm text-[var(--fg)]/70" aria-label="경로">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[var(--fg)]">Home</Link>
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-2">
                <span aria-hidden>›</span>
                {i < crumbs.length - 1 ? (
                  <Link href={c.href} className="hover:text-[var(--fg)]">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-[var(--fg)]">
                    {c.label || ""}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


