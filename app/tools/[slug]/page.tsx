import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tool } from "@/lib/catalog/types";

async function fetchTool(slug: string): Promise<Tool | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/catalog/tools`, { cache: "no-store" });
  const json = await res.json();
  const all: Tool[] = [...(json.active ?? []), ...(json.inactive ?? [])];
  return all.find((t) => t.slug === slug) ?? null;
}

export default async function ToolDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await fetchTool(slug);
  if (!tool) notFound();
  if (!tool.is_active) {
    // 준비 중 화면 또는 404로 처리
    return (
      <main className="py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">준비 중</h1>
        <p className="text-[var(--fg)]/70">곧 오픈 예정입니다.</p>
        <div className="mt-6">
          <Link href="/tools" className="underline">목록으로</Link>
        </div>
      </main>
    );
  }
  return (
    <main className="py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 justify-between">
            <div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.subtitle}</CardDescription>
            </div>
            {tool.badge && <span className="text-xs px-2 py-0.5 rounded bg-[var(--muted)]/30">{tool.badge}</span>}
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-lg font-semibold">{(tool.price_cents / 100).toLocaleString()} {tool.currency}</div>
          <Link href={`/checkout?tool=${tool.slug}`} className="inline-flex items-center h-10 px-4 rounded-md bg-[var(--accent)] text-[var(--bg)]">구매하기</Link>
        </CardContent>
      </Card>
    </main>
  );
}


