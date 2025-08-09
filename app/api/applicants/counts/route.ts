import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    const supabase = getSupabase();
    const tables = [
      { key: "selected" },
      { key: "rejected" },
      { key: "pending" },
      { key: "failed" },
    ] as const;

    const { count: total } = await supabase.from("applicants").select("id", { count: "exact", head: true }).eq("project_id", projectId);
    const results = await Promise.all(
      tables.map(async (t) => {
        const { count } = await supabase
          .from("applicants")
          .select("id", { count: "exact", head: true })
          .eq("project_id", projectId)
          .eq("status", t.key);
        return [t.key, count ?? 0] as const;
      })
    );
    const counts = {
      total: total ?? 0,
      selected: results.find(([k]) => k === "selected")?.[1] ?? 0,
      rejected: results.find(([k]) => k === "rejected")?.[1] ?? 0,
      pending: results.find(([k]) => k === "pending")?.[1] ?? 0,
      failed: results.find(([k]) => k === "failed")?.[1] ?? 0,
    };
    return NextResponse.json({ counts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


