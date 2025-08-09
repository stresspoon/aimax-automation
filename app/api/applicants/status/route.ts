import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { applicantId, status, actor } = await req.json();
    if (!applicantId || !status) return NextResponse.json({ error: "invalid payload" }, { status: 400 });

    const supabase = getSupabase();
    // 상태 업데이트
    const { error: upErr } = await supabase.from("applicants").update({ status }).eq("id", applicantId);
    if (upErr) throw upErr;

    const { error: logErr } = await supabase
      .from("logs")
      .insert([{ applicant_id: applicantId, action: `manual-${status}`, actor: actor ?? "system", created_at: new Date().toISOString() }]);
    if (logErr) throw logErr;

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


