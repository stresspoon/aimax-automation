import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "AIMAX",
  description: "AIMAX Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-[var(--bg)] text-[var(--fg)]">
        {/* AppBar */}
        <header className="sticky top-0 z-50 h-14 border-b border-[#ddd] bg-[var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg)]/80">
          <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
            <a href="/" aria-label="홈으로 이동" className="font-semibold text-lg tracking-tight">
              AIMAX
            </a>
            <button
              type="button"
              aria-label="프로필 메뉴"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[color:oklch(0.85_0.01_0)] bg-white/80 text-[var(--fg)]"
            >
              <span aria-hidden>👤</span>
            </button>
          </div>
        </header>

        {/* Main container */}
        <div className="max-w-[1440px] mx-auto px-6">
          {children}
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
