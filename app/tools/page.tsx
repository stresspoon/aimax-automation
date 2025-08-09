import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tool } from "@/lib/catalog/types";

async function fetchTools(): Promise<Tool[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/catalog/tools`, { cache: "no-store" });
  const json = await res.json();
  return (json.active as Tool[]) ?? [];
}

export default async function ToolsIndex() {
  const tools = await fetchTools();
  return (
    <main className="py-8">
      <h1 className="text-2xl font-semibold mb-4">개별 판매 도구</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t) => (
          <Link key={t.id} href={`/tools/${t.slug}`} className="group">
            <Card className="h-full transition-colors group-hover:bg-white">
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-[var(--muted)]">{(t.price_cents / 100).toLocaleString()} {t.currency}</CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}


