import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { inviteId, extendDays = 0, addCredits = 1 } = await req.json();
    if (!inviteId) return NextResponse.json({ error: "inviteId required" }, { status: 400 });
    const supabase = getSupabase();
    const { data: invite } = await supabase
      .from("review_invites")
      .select("id, credits, used, expires_at")
      .eq("id", inviteId)
      .maybeSingle();
    if (!invite) return NextResponse.json({ error: "not found" }, { status: 404 });
    const newCredits = (invite.credits ?? 0) + (addCredits ?? 0);
    const newExpires = extendDays > 0 ? new Date((invite.expires_at ? new Date(invite.expires_at).getTime() : Date.now()) + extendDays * 86400000).toISOString() : invite.expires_at;
    const { data, error } = await supabase
      .from("review_invites")
      .update({ credits: newCredits, expires_at: newExpires })
      .eq("id", inviteId)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, invite: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


