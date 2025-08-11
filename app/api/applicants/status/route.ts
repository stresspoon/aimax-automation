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

    // When selected, create or reuse review invite
    if (status === "selected") {
      // fetch applicant project's id
      const { data: applicant } = await supabase.from("applicants").select("project_id").eq("id", applicantId).maybeSingle();
      const projectId = applicant?.project_id;
      if (projectId) {
        try {
          const base = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
          const resp = await fetch(`${base}/api/review/invite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, applicantId, credits: 3, ttlDays: 30 }),
          });
          const json = await resp.json();
          // Attach preview link into logs for auditing
          await supabase.from("logs").insert([{ applicant_id: applicantId, action: `invite-link ${json?.link || "-"}` }]);
        } catch {}
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


