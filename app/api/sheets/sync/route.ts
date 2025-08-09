import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

type Row = Record<string, string>;

export async function POST(req: NextRequest) {
  try {
    const { projectId, csvUrl, offset = 0, limit = 1000 } = await req.json();
    if (!projectId || !csvUrl) return NextResponse.json({ error: "projectId, csvUrl required" }, { status: 400 });

    const res = await fetch(csvUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
    const text = await res.text();
    const parsed = Papa.parse<Row>(text, { header: true, skipEmptyLines: true });
    const allRows = (parsed.data || []) as Row[];

    const slice = allRows.slice(offset, offset + limit);
    const records = slice.map((r) => ({
      project_id: projectId,
      name: r["성함"] ?? r["name"] ?? "",
      email: r["메일주소"] ?? r["email"] ?? "",
      phone: r["연락처"] ?? r["phone"] ?? "",
      source: r["어디에서 신청주셨나요?"] ?? r["source"] ?? "",
      url_threads: r["후기 작성할 스레드 URL"] ?? r["url_threads"] ?? "",
      url_instagram: r["후기 작성할 인스타그램 URL"] ?? r["url_instagram"] ?? "",
      url_blog: r["후기 작성할 블로그 URL"] ?? r["url_blog"] ?? "",
      created_at: r["타임스탬프"] ?? r["timestamp"] ?? new Date().toISOString(),
      status: "pending",
    }));

    // filter out rows without minimal identity
    const upserts = records.filter((x) => x.email || x.phone || x.name);

    if (upserts.length > 0) {
      const supabase = getSupabase();
      // Note: requires unique constraint on (project_id,email) ideally
      const { error } = await supabase
        .from("applicants")
        .upsert(upserts, { onConflict: "email" });
      if (error) throw error;
    }

    const nextOffset = offset + slice.length;
    const done = nextOffset >= allRows.length;
    return NextResponse.json({ processed: slice.length, nextOffset: done ? null : nextOffset, total: allRows.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


