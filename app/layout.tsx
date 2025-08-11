import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { AppBar } from "@/components/app/app-bar";
import { AuthProvider } from "@/components/auth/auth-provider";

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
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg)] text-[var(--fg)]" suppressHydrationWarning>
        {/* Skip to content link for screen readers */}
        <a href="#main-content" className="sr-only focus:not-sr-only">
          메인 콘텐츠로 건너뛰기
        </a>
        <AuthProvider>
          {/* AppBar */}
          <AppBar />
          {/* Main container */}
          <main id="main-content" className="max-w-[1440px] mx-auto px-6" tabIndex={-1}>
            {children}
          </main>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
