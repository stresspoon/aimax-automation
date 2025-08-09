"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthMock } from "@/components/auth/auth-provider";

type Tool = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string | null;
  price_cents: number;
  currency: string;
  is_active: boolean;
  icon_url: string | null;
};

export function ToolsSection() {
  const [active, setActive] = useState<Tool[]>([]);
  const [inactive, setInactive] = useState<Tool[]>([]);
  const { user } = useAuthMock();
  const isAdmin = user?.id === "u_1";
  const allowPreview = (process.env.NEXT_PUBLIC_AIMAX_ENV || process.env.AIMAX_ENV || "prod") !== "prod" && isAdmin;

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/catalog/tools", { cache: "no-store" });
      const json = await res.json();
      setActive(json.active || []);
      setInactive(json.inactive || []);
    })();
  }, []);

  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold">개별 판매 도구</h2>
      {/* active tools */}
      {active.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((t) => (
            <Link key={t.id} href={`/tools/${t.slug}`} className="group">
              <Card className="transition-colors group-hover:bg-white">
                <CardHeader>
                  <CardTitle>{t.title}</CardTitle>
                  <CardDescription>{t.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-[var(--muted)]">
                  {(t.price_cents / 100).toLocaleString()} {t.currency}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* inactive tools */}
      {inactive.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-[var(--fg)]/70">준비 중</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactive.map((t) => (
              <div key={t.id} className="opacity-70">
                <Card className="cursor-not-allowed pointer-events-none" title="오픈 예정">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle>{t.title}</CardTitle>
                      {t.badge && <Badge variant="secondary">{t.badge}</Badge>}
                    </div>
                    <CardDescription>{t.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allowPreview && (
                      <div className="pointer-events-auto mt-2">
                        <Link
                          href={`/tools/${t.slug}?preview=1`}
                          className="inline-flex items-center h-9 px-3 rounded-md border text-sm bg-white hover:bg-white"
                        >
                          프리뷰
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}


