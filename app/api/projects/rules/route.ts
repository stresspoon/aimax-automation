import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

const DEFAULT_RULES = {
  blog: { min: 300 },
  instagram: { min: 1000 },
  threads: { min: 500 },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
    const supabase = getSupabase();
    const { data, error } = await supabase.from("projects").select("rules_json").eq("id", projectId).single();
    if (error) throw error;
    return NextResponse.json({ rules: data?.rules_json ?? DEFAULT_RULES });
  } catch {
    // fallback to default
    return NextResponse.json({ rules: DEFAULT_RULES, fallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, rules } = await req.json();
    if (!projectId || typeof rules !== "object") return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .update({ rules_json: rules })
      .eq("id", projectId)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


