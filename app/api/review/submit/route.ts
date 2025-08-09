import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

function extractText(html: string): string {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  return noScript.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  try {
    const { token, url, channel } = await req.json();
    if (!token || !url) return NextResponse.json({ error: "token/url required" }, { status: 400 });

    const supabase = getSupabase();
    const { data: invite, error: invErr } = await supabase
      .from("review_invites")
      .select("id, project_id, credits, used, expires_at")
      .eq("token", token)
      .maybeSingle();
    if (invErr || !invite) return NextResponse.json({ error: "invalid token" }, { status: 400 });

    // load guide
    const { data: pack } = await supabase
      .from("review_packs")
      .select("rules_json")
      .eq("project_id", invite.project_id)
      .order("created_at", { ascending: false })
      .maybeSingle();
    const guide: any = pack?.rules_json ?? {};

    // fetch html
    const resp = await fetch(url, { headers: { "User-Agent": "AIMAX-ReviewBot" } });
    if (!resp.ok) return NextResponse.json({ error: "fetch failed" }, { status: 400 });
    const html = await resp.text();
    const text = extractText(html);

    // run checks
    const details: string[] = [];
    const required = guide?.common?.requiredKeywords ?? [];
    const links = guide?.common?.linkTargets ?? [];
    const hasKw = required.every((k: string) => text.includes(k));
    if (!hasKw) details.push("필수 키워드를 모두 포함하지 않았습니다");
    const hasLinks = links.every((l: string) => html.includes(l));
    if (!hasLinks) details.push("필수 링크가 누락되었습니다");
    const minLen = channel === "blog" ? (guide?.blog?.paragraphLength?.min ?? 60) : (guide?.social?.sentenceLength?.min ?? 12);
    const okLen = text.length > minLen * 2;
    if (!okLen) details.push("길이가 너무 짧습니다");

    const checks = { ok: details.length === 0, details };

    // save checks regardless (history)
    await supabase
      .from("review_submissions")
      .insert({ invite_id: invite.id, channel: channel ?? "blog", url, checks });

    if (!checks.ok) {
      return NextResponse.json({ ok: false, checks, suggest: details.join("\n") });
    }

    // decrement usage if available
    if ((invite.used ?? 0) < (invite.credits ?? 0)) {
      await supabase
        .from("review_invites")
        .update({ used: (invite.used ?? 0) + 1 })
        .eq("id", invite.id);
    }

    return NextResponse.json({ ok: true, checks });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


