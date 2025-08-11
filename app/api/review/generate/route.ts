import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { token, kind } = await req.json();
    if (!token || !kind) return NextResponse.json({ error: "token/kind required" }, { status: 400 });

    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0] || "0.0.0.0";
    const ua = req.headers.get("user-agent") || "unknown";

    const supabase = getSupabase();

    // rate limit: per IP per second (no more than 1), and per IP per minute (<=10)
    const nowIso = new Date().toISOString();
    const oneSecondAgo = new Date(Date.now() - 1000).toISOString();
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();

    const { count: secCount } = await supabase
      .from("logs")
      .select("id", { count: "exact", head: true })
      .eq("action", "review-generate")
      .eq("actor", ip)
      .gt("created_at", oneSecondAgo);

    if ((secCount ?? 0) >= 1) {
      return NextResponse.json({ error: "rate limited (per second)" }, { status: 429 });
    }

    const { count: minCount } = await supabase
      .from("logs")
      .select("id", { count: "exact", head: true })
      .eq("action", "review-generate")
      .eq("actor", ip)
      .gt("created_at", oneMinuteAgo);

    if ((minCount ?? 0) >= 10) {
      return NextResponse.json({ error: "rate limited (per minute)" }, { status: 429 });
    }

    await supabase
      .from("logs")
      .insert([{ action: "review-generate", actor: ip, meta: { token, kind, ua }, created_at: nowIso }]);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


