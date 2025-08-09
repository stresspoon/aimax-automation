import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { applicantId } = await req.json();
    if (!applicantId) return NextResponse.json({ error: "applicantId required" }, { status: 400 });

    const supabase = getSupabase();
    // 트랜잭션 대용: 상태 업데이트와 로그 기록을 순차 처리 (Supabase RPC/트리거로 대체 권장)
    const { error: upErr } = await supabase
      .from("applicants")
      .update({ status: "pending" })
      .eq("id", applicantId);
    if (upErr) throw upErr;

    const { error: logErr } = await supabase
      .from("logs")
      .insert([{ applicant_id: applicantId, action: "requeue", created_at: new Date().toISOString() }]);
    if (logErr) throw logErr;

    // TODO: Upstash 큐에 재큐잉 작업 추가 (mock)
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


