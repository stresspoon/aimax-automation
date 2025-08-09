"use client";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

type Invite = { id: string; project_id: string; credits: number; used: number; expires_at: string };
type Guide = any;

export default function ReviewClient({ token, invite, guide }: { token: string; invite: Invite; guide: Guide }) {
  const [channel, setChannel] = useState<"blog" | "instagram" | "threads">("blog");
  const [outline, setOutline] = useState<string>("");
  const [draft, setDraft] = useState<string>("");
  const [checks, setChecks] = useState<{ ok: boolean; details: string[] }>({ ok: false, details: [] });
  const remaining = Math.max(0, (invite.credits ?? 0) - (invite.used ?? 0));

  function generateOutline() {
    const tone = guide?.common?.tone ?? "정보형";
    const kw = (guide?.common?.requiredKeywords ?? []).slice(0, 5).join(", ");
    const heads = guide?.blog?.subheadingCount ?? 3;
    const outlineText = `톤: ${tone}\n키워드: ${kw}\n소제목 ${heads}개 권장\n- 서론\n- 본문(소제목 x${heads})\n- 결론(CTA 포함)`;
    setOutline(outlineText);
  }

  function generateDraft() {
    if (remaining <= 0) {
      toast.error("잔여 횟수가 없습니다");
      return;
    }
    const blogHint = guide?.blog ? `문단 ${guide.blog.paragraphLength?.min ?? 60}-${guide.blog.paragraphLength?.max ?? 140}자` : "";
    const hash = guide?.social?.hashtags?.join(" ") ?? "";
    const body = `채널: ${channel}\n\n[서론]\n제품/캠페인 소개\n\n[본문]\n특징 정리 + 키워드 반영\n\n[결론]\n${guide?.common?.cta ?? "지금 참여해 주세요"}\n\n${hash}\n${blogHint}`;
    setDraft(body);
  }

  function runChecks() {
    const details: string[] = [];
    const required = guide?.common?.requiredKeywords ?? [];
    const links = guide?.common?.linkTargets ?? [];
    const hasKw = required.every((k: string) => draft.includes(k));
    if (!hasKw) details.push("필수 키워드를 모두 포함하지 않았습니다");
    const hasLinks = links.every((l: string) => draft.includes(l));
    if (!hasLinks) details.push("필수 링크가 누락되었습니다");
    const minLen = channel === "blog" ? (guide?.blog?.paragraphLength?.min ?? 60) : (guide?.social?.sentenceLength?.min ?? 12);
    const okLen = draft.length > minLen * 2; // 매우 단순 체크
    if (!okLen) details.push("길이가 너무 짧습니다");
    setChecks({ ok: details.length === 0, details });
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      toast.success("복사되었습니다");
    } catch {
      toast.error("복사 실패");
    }
  }

  const disabled = remaining <= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--fg)]/80">잔여 횟수: <b>{remaining}</b> / 만료일: {new Date(invite.expires_at).toLocaleString()}</div>
        <div className="flex items-center gap-2 text-sm">
          {(["blog", "instagram", "threads"] as const).map((c) => (
            <button key={c} onClick={() => setChannel(c)} className={`px-2 py-1 rounded ${channel === c ? "border border-[var(--accent)]" : "border border-transparent text-[var(--fg)]/70"}`}>{c}</button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">아웃라인 제안</div>
            <Button variant="secondary" onClick={generateOutline}>아웃라인 생성</Button>
          </div>
          <textarea className="w-full h-40 rounded-md border p-2 text-sm" value={outline} onChange={(e) => setOutline(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">초안 생성</div>
            <Button className="bg-[var(--accent)] text-[var(--bg)]" onClick={generateDraft} disabled={disabled}>초안 생성</Button>
          </div>
          <textarea className="w-full h-56 rounded-md border p-2 text-sm" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="text-right text-xs text-[var(--fg)]/60">초안 생성 버튼 클릭 시 1회 차감(사용 구현은 후속 작업)</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">체크리스트</div>
            <Button variant="secondary" onClick={runChecks}>자동 검사</Button>
          </div>
          {checks.details.length > 0 && (
            <ul className="list-disc pl-6 text-sm text-[var(--err)]">
              {checks.details.map((d, i) => (<li key={i}>{d}</li>))}
            </ul>
          )}
          <div className="flex justify-end">
            <Button onClick={copyDraft} disabled={!checks.ok}>복사하기</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


