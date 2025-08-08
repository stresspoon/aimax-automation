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
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
