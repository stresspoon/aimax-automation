"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

type ChannelRule = { min: number };
type Rules = { blog: ChannelRule; instagram: ChannelRule; threads: ChannelRule } & Record<string, ChannelRule>;

export function ProjectTabs({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [tab, setTab] = useState<"rules" | "templates" | "review">("rules");
  const [rules, setRules] = useState<Rules>({ blog: { min: 300 }, instagram: { min: 1000 }, threads: { min: 500 } });
  const [template, setTemplate] = useState<string>(
    "{{name}}님, {{project}} 모집 관련 안내드립니다.\n\n참여 여부 회신 부탁드립니다."
  );
  const preview = useMemo(() => template.replaceAll("{{name}}", "홍길동").replaceAll("{{project}}", projectName), [template, projectName]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/projects/rules?projectId=${projectId}`);
        const json = await res.json();
        if (json?.rules) setRules(json.rules);
      } catch {}
      try {
        const r = await fetch(`/api/reviews/packs?projectId=${projectId}`);
        const j = await r.json();
        if (j?.guide) setGuide(j.guide);
      } catch {}
    })();
  }, [projectId]);

  async function saveRules() {
    const res = await fetch("/api/projects/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, rules }),
    });
    if (res.ok) toast.success("기준이 저장되었습니다");
    else toast.error("저장 실패");
  }

  async function saveTemplate() {
    const res = await fetch("/api/projects/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, template }),
    });
    if (res.ok) toast.success("템플릿이 저장되었습니다");
    else toast.error("저장 실패");
  }

  async function sendTest() {
    const res = await fetch("/api/emails/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, to: "test@example.com", template }),
    });
    if (res.ok) toast.success("테스트 발송이 큐에 등록되었습니다");
    else toast.error("테스트 발송 실패");
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2 border-b border-[color:oklch(0.85_0.01_0)]">
        <button className={`px-3 py-2 text-sm ${tab === "rules" ? "border-b-2 border-[var(--accent)]" : "text-[var(--fg)]/70"}`} onClick={() => setTab("rules")}>기준</button>
        <button className={`px-3 py-2 text-sm ${tab === "templates" ? "border-b-2 border-[var(--accent)]" : "text-[var(--fg)]/70"}`} onClick={() => setTab("templates")}>메일 템플릿</button>
        <button className={`px-3 py-2 text-sm ${tab === "review" ? "border-b-2 border-[var(--accent)]" : "text-[var(--fg)]/70"}`} onClick={() => setTab("review")}>리뷰 가이드</button>
      </div>

      {tab === "rules" ? (
        <Card className="mt-4">
          <CardContent className="p-4 space-y-3">
            {(["blog", "instagram", "threads"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-3">
                <span className="w-28 text-sm text-[var(--fg)]/80">{ch}</span>
                <Input
                  type="number"
                  value={rules[ch]?.min ?? 0}
                  onChange={(e) => setRules((r) => ({ ...r, [ch]: { min: Number(e.target.value || 0) } }))}
                  className="w-40"
                />
                <span className="text-sm text-[var(--fg)]/70">이상</span>
              </div>
            ))}
            <div className="flex justify-end">
              <Button className="bg-[var(--accent)] text-[var(--bg)]" onClick={saveRules}>저장</Button>
            </div>
          </CardContent>
        </Card>
      ) : tab === "templates" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <textarea
                className="w-full h-64 rounded-md border border-[color:oklch(0.85_0.01_0)] p-3 text-sm"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={saveTemplate}>저장</Button>
                <Button className="bg-[var(--accent)] text-[var(--bg)]" onClick={sendTest}>테스트 발송</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm whitespace-pre-wrap">{preview}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <ReviewGuideSection projectId={projectId} />
      )}
    </div>
  );
}


type ReviewGuide = {
  common: { tone: "정보형" | "친근" | "전문"; forbiddenWords: string[]; requiredKeywords: string[]; linkTargets: string[]; cta: string };
  blog: { subheadingCount: number; keywordInsertions: number; anchorLinks: boolean; paragraphLength: { min: number; max: number } };
  social: { hashtags: string[]; sentenceLength: { min: number; max: number }; allowEmoji: boolean };
};

function ReviewGuideSection({ projectId }: { projectId: string }) {
  const [guide, setGuide] = useState<ReviewGuide | null>(null);
  const [sample, setSample] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/reviews/packs?projectId=${projectId}`);
        const j = await r.json();
        if (j?.guide) setGuide(j.guide);
      } catch {}
    })();
  }, [projectId]);

  async function saveGuide() {
    const res = await fetch("/api/reviews/packs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, guide }),
    });
    if (res.ok) toast.success("리뷰 가이드가 저장되었습니다");
    else toast.error("저장 실패");
  }

  function toArray(val: string) {
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }

  function previewSample() {
    if (!guide) return;
    const tone = guide.common.tone;
    const keywords = guide.common.requiredKeywords.join(", ");
    const cta = guide.common.cta;
    const hash = guide.social.hashtags.join(" ");
    const blogHint = `소제목 ${guide.blog.subheadingCount}개, 키워드 ${guide.blog.keywordInsertions}회, 문단 ${guide.blog.paragraphLength.min}-${guide.blog.paragraphLength.max}자`;
    const text = `톤: ${tone}\n필수 키워드: ${keywords}\nCTA: ${cta}\n블로그 가이드: ${blogHint}\n해시태그: ${hash}`;
    setSample(text);
  }

  if (!guide) return <div className="mt-4 text-sm text-[var(--fg)]/70">불러오는 중…</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">공통</div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">톤</span>
              <select className="border rounded px-2 py-1 text-sm" value={guide.common.tone} onChange={(e) => setGuide({ ...guide, common: { ...guide.common, tone: e.target.value as any } })}>
                <option value="정보형">정보형</option>
                <option value="친근">친근</option>
                <option value="전문">전문</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">금지어</span>
              <Input className="flex-1" value={guide.common.forbiddenWords.join(", ")} onChange={(e) => setGuide({ ...guide, common: { ...guide.common, forbiddenWords: toArray(e.target.value) } })} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">필수 키워드</span>
              <Input className="flex-1" value={guide.common.requiredKeywords.join(", ")} onChange={(e) => setGuide({ ...guide, common: { ...guide.common, requiredKeywords: toArray(e.target.value) } })} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">링크 타겟</span>
              <Input className="flex-1" value={guide.common.linkTargets.join(", ")} onChange={(e) => setGuide({ ...guide, common: { ...guide.common, linkTargets: toArray(e.target.value) } })} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">CTA 문구</span>
              <Input className="flex-1" value={guide.common.cta} onChange={(e) => setGuide({ ...guide, common: { ...guide.common, cta: e.target.value } })} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">블로그</div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">소제목 개수</span>
              <Input type="number" className="w-32" value={guide.blog.subheadingCount} onChange={(e) => setGuide({ ...guide, blog: { ...guide.blog, subheadingCount: Number(e.target.value || 0) } })} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">키워드 삽입</span>
              <Input type="number" className="w-32" value={guide.blog.keywordInsertions} onChange={(e) => setGuide({ ...guide, blog: { ...guide.blog, keywordInsertions: Number(e.target.value || 0) } })} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">앵커 링크</span>
              <input type="checkbox" checked={guide.blog.anchorLinks} onChange={(e) => setGuide({ ...guide, blog: { ...guide.blog, anchorLinks: e.target.checked } })} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">문단 길이</span>
              <Input type="number" className="w-24" value={guide.blog.paragraphLength.min} onChange={(e) => setGuide({ ...guide, blog: { ...guide.blog, paragraphLength: { ...guide.blog.paragraphLength, min: Number(e.target.value || 0) } } })} />
              <span className="text-sm">-</span>
              <Input type="number" className="w-24" value={guide.blog.paragraphLength.max} onChange={(e) => setGuide({ ...guide, blog: { ...guide.blog, paragraphLength: { ...guide.blog.paragraphLength, max: Number(e.target.value || 0) } } })} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">스레드/인스타</div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">해시태그</span>
              <Input className="flex-1" value={guide.social.hashtags.join(", ")} onChange={(e) => setGuide({ ...guide, social: { ...guide.social, hashtags: toArray(e.target.value) } })} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">문장 길이</span>
              <Input type="number" className="w-24" value={guide.social.sentenceLength.min} onChange={(e) => setGuide({ ...guide, social: { ...guide.social, sentenceLength: { ...guide.social.sentenceLength, min: Number(e.target.value || 0) } } })} />
              <span className="text-sm">-</span>
              <Input type="number" className="w-24" value={guide.social.sentenceLength.max} onChange={(e) => setGuide({ ...guide, social: { ...guide.social, sentenceLength: { ...guide.social.sentenceLength, max: Number(e.target.value || 0) } } })} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-[var(--fg)]/80">이모지</span>
              <input type="checkbox" checked={guide.social.allowEmoji} onChange={(e) => setGuide({ ...guide, social: { ...guide.social, allowEmoji: e.target.checked } })} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={previewSample}>미리보기</Button>
            <Button className="bg-[var(--accent)] text-[var(--bg)]" onClick={saveGuide}>저장</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm whitespace-pre-wrap min-h-40">{sample}</div>
        </CardContent>
      </Card>
    </div>
  );
}


