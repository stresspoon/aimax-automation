import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { projectId, running } = await req.json();
    if (!projectId || typeof running !== "boolean") {
      return NextResponse.json({ error: "projectId and running required" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase.from("projects").update({ running }).eq("id", projectId).select().single();
    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


