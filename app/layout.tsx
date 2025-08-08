import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { AppBar } from "@/components/app/app-bar";

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
        {/* AppBar + Breadcrumbs */}
        <AppBar />

        {/* Main container */}
        <div className="max-w-[1440px] mx-auto px-6">
          {children}
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
