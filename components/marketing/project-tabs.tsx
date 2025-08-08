"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

type Rules = { blog: { min: number }; instagram: { min: number }; threads: { min: number } } & Record<string, any>;

export function ProjectTabs({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [tab, setTab] = useState<"rules" | "templates">("rules");
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
      ) : (
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
      )}
    </div>
  );
}


