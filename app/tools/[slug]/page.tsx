import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabase } from "@/lib/supabase/client";

export default async function ToolDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const previewParam = sp?.preview;
  const preview = Array.isArray(previewParam) ? previewParam.includes("1") : previewParam === "1";
  const isProd = process.env.AIMAX_ENV === "prod";

  const supabase = getSupabase();
  const { data: tool } = await supabase
    .from("catalog_tools")
    .select("id,slug,title,subtitle,badge,price_cents,currency,is_active,icon_url")
    .eq("slug", slug)
    .maybeSingle();
  if (!tool) notFound();

  // access control
  let allow = !!tool.is_active;
  let isAdmin = false;
  const uid = cookies().get("aimax_uid")?.value;
  if (uid) {
    try {
      const { data: prof } = await supabase
        .from("profiles")
        .select("user_role")
        .eq("id", uid)
        .maybeSingle();
      isAdmin = prof?.user_role === "admin";
    } catch {}
  }
  if (!allow && preview) {
    if (!isProd) {
      allow = true;
    } else {
      if (!uid) return Forbidden();
      if (isAdmin) allow = true; else return Forbidden();
    }
  }

  if (!allow) return <OpenPlanned title={tool.title} subtitle={tool.subtitle} slug={tool.slug} showPreview={isAdmin} />;

  return (
    <main className="py-8">
      {preview && !tool.is_active && (
        <div className="mb-3 text-xs text-[var(--fg)]/80 border border-[color:oklch(0.85_0.01_0)] rounded px-3 py-1">
          프리뷰 모드 — 비활성 도구입니다.
        </div>
      )}
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
          <div className="flex items-center gap-2">
            <Link href={`/checkout?tool=${tool.slug}`} className="inline-flex items-center h-10 px-4 rounded-md bg-[var(--accent)] text-[var(--bg)]">구매하기</Link>
            <form action="/api/checkout/test-grant" method="post">
              <input type="hidden" name="slug" value={tool.slug} />
              <button type="submit" className="h-10 px-3 rounded-md border text-sm">테스트 부여</button>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 text-right">
        <Link href={`/tools/${tool.slug}/use`} className="underline">바로가기</Link>
      </div>
    </main>
  );
}

function Forbidden() {
  return (
    <main className="py-16 text-center">
      <h1 className="text-2xl font-semibold mb-2">403 Forbidden</h1>
      <p className="text-[var(--fg)]/70">접근 권한이 없습니다.</p>
    </main>
  );
}

function OpenPlanned({ title, subtitle, slug, showPreview }: { title: string; subtitle: string; slug: string; showPreview: boolean }) {
  return (
    <main className="py-16">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--muted)]/30">준비 중</span>
          </div>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <button className="h-10 px-4 rounded-md border text-sm opacity-60 cursor-not-allowed" disabled>
            구매하기(비활성)
          </button>
          {showPreview && (
            <Link href={`/tools/${slug}?preview=1`} className="underline">프리뷰로 열기</Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}


