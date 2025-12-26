import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

type ReviewGuide = {
  common: {
    tone: "정보형" | "친근" | "전문";
    forbiddenWords: string[];
    requiredKeywords: string[];
    linkTargets: string[];
    cta: string;
  };
  blog: {
    subheadingCount: number;
    keywordInsertions: number;
    anchorLinks: boolean;
    paragraphLength: { min: number; max: number };
  };
  social: {
    hashtags: string[];
    sentenceLength: { min: number; max: number };
    allowEmoji: boolean;
  };
};

const DEFAULT_GUIDE: ReviewGuide = {
  common: {
    tone: "정보형",
    forbiddenWords: [],
    requiredKeywords: [],
    linkTargets: [],
    cta: "지금 바로 참여해 주세요",
  },
  blog: {
    subheadingCount: 3,
    keywordInsertions: 5,
    anchorLinks: true,
    paragraphLength: { min: 60, max: 140 },
  },
  social: {
    hashtags: ["#체험단", "#리뷰"],
    sentenceLength: { min: 12, max: 28 },
    allowEmoji: true,
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("review_packs")
      .select("id, rules_json")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json({ guide: (data?.rules_json as ReviewGuide) ?? DEFAULT_GUIDE });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ guide: DEFAULT_GUIDE, error: message, fallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, guide } = (await req.json()) as { projectId?: string; guide?: ReviewGuide };
    if (!projectId || !guide) return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("review_packs")
      .select("id")
      .eq("project_id", projectId)
      .maybeSingle();
    if (existing?.id) {
      const { data, error } = await supabase
        .from("review_packs")
        .update({ rules_json: guide })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ pack: data });
    }
    const { data, error } = await supabase
      .from("review_packs")
      .insert({ project_id: projectId, rules_json: guide })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ pack: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


