import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

function assertAdmin() {
  const uid = cookies().get("aimax_uid")?.value;
  if (uid !== "u_1") throw new Error("forbidden");
}

export async function GET() {
  try {
    assertAdmin();
    const supabase = getSupabase();
    const { data, error } = await supabase.from("catalog_tools").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ items: data ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    const status = message === "forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    assertAdmin();
    const body = await req.json();
    const {
      id,
      slug,
      title,
      subtitle,
      badge,
      price_cents,
      currency = "KRW",
      is_active = false,
      icon_url,
    } = body ?? {};
    if (!slug || !title) return NextResponse.json({ error: "slug, title required" }, { status: 400 });

    const supabase = getSupabase();
    // upsert catalog_tools by slug
    const { data: tool, error: uerr } = await supabase
      .from("catalog_tools")
      .upsert([{ id, slug, title, subtitle, badge, price_cents, currency, is_active, icon_url }], { onConflict: "slug" })
      .select()
      .single();
    if (uerr) throw uerr;

    // sync products table by slug
    const { error: perr } = await supabase
      .from("products")
      .upsert([
        {
          slug,
          title,
          price_cents: price_cents ?? 0,
          currency: currency ?? "KRW",
          active: !!is_active,
        },
      ], { onConflict: "slug" });
    if (perr) throw perr;

    return NextResponse.json({ ok: true, tool });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    const status = message === "forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    assertAdmin();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
    const supabase = getSupabase();
    const { error } = await supabase.from("catalog_tools").delete().eq("slug", slug);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    const status = message === "forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}


