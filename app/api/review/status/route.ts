import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
    const supabase = getSupabase();

    // invites joined with latest submission per invite (optional)
    const { data: invites } = await supabase
      .from("review_invites")
      .select("id, applicant_id, credits, used, expires_at")
      .eq("project_id", projectId);

    const items: any[] = [];
    for (const inv of invites ?? []) {
      const { data: app } = await supabase.from("applicants").select("name").eq("id", inv.applicant_id).maybeSingle();
      const { data: sub } = await supabase
        .from("review_submissions")
        .select("channel, url, checks")
        .eq("invite_id", inv.id)
        .order("created_at", { ascending: false })
        .maybeSingle();
      items.push({
        invite_id: inv.id,
        applicant: app?.name ?? null,
        channel: sub?.channel ?? "-",
        credits: inv.credits,
        used: inv.used,
        expires_at: inv.expires_at,
        url: sub?.url ?? null,
        passed: sub?.checks?.ok ?? null,
      });
    }

    return NextResponse.json({ items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


