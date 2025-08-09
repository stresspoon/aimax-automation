import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status") || undefined;
    const channel = searchParams.get("channel") || undefined; // threads | instagram | blog
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Math.min(100, Number(searchParams.get("pageSize") || 20));
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = getSupabase();
    let q = supabase.from("applicants").select("*", { count: "exact" }).eq("project_id", projectId);
    if (status) q = q.eq("status", status);
    if (channel) {
      if (channel === "threads") q = q.not("url_threads", "is", null);
      if (channel === "instagram") q = q.not("url_instagram", "is", null);
      if (channel === "blog") q = q.not("url_blog", "is", null);
    }
    const { data, error, count } = await q.order("created_at", { ascending: false }).range(from, to);
    if (error) throw error;
    return NextResponse.json({ items: data ?? [], page, pageSize, total: count ?? 0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


