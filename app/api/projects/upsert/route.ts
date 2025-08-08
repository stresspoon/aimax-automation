import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { name, mapping } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!mapping || typeof mapping !== "object") {
      return NextResponse.json({ error: "mapping is required" }, { status: 400 });
    }

    const { data, error } = await supabase.from("projects").upsert(
      [{ name, mapping_json: mapping }],
      { onConflict: "name" }
    ).select().single();

    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


