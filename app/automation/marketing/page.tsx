"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Project = {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  stats: { total: number; selected: number; rejected: number; pending: number };
};

const projects: Project[] = [
  {
    id: "p-001",
    name: "마케팅 프로젝트 1",
    createdAt: "2025-07-01",
    stats: { total: 120, selected: 35, rejected: 70, pending: 15 },
  },
  {
    id: "p-002",
    name: "마케팅 프로젝트 2",
    createdAt: "2025-07-05",
    stats: { total: 80, selected: 24, rejected: 46, pending: 10 },
  },
  {
    id: "p-003",
    name: "마케팅 프로젝트 3",
    createdAt: "2025-07-10",
    stats: { total: 210, selected: 62, rejected: 128, pending: 20 },
  },
  {
    id: "p-004",
    name: "마케팅 프로젝트 4",
    createdAt: "2025-07-12",
    stats: { total: 56, selected: 12, rejected: 34, pending: 10 },
  },
  {
    id: "p-005",
    name: "마케팅 프로젝트 5",
    createdAt: "2025-07-18",
    stats: { total: 132, selected: 40, rejected: 76, pending: 16 },
  },
  {
    id: "p-006",
    name: "마케팅 프로젝트 6",
    createdAt: "2025-07-20",
    stats: { total: 44, selected: 9, rejected: 28, pending: 7 },
  },
];

export default function MarketingAutomationPage() {
  const [csvUrl, setCsvUrl] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const systemFields = [
    "timestamp",
    "name",
    "phone",
    "email",
    "source",
    "url_threads",
    "url_instagram",
    "url_blog",
    "video_agree",
    "privacy_consent",
  ];
  const suggested: Record<string, string> = {
    timestamp: "타임스탬프",
    name: "성함",
    phone: "연락처",
    email: "메일주소",
    source: "어디에서 신청주셨나요?",
    url_threads: "후기 작성할 스레드 URL",
    url_instagram: "후기 작성할 인스타그램 URL",
    url_blog: "후기 작성할 블로그 URL",
    video_agree: "영상 촬영은 필수입니다. 가능하시죠?",
    privacy_consent: "개인정보 활용 동의",
  };
  const [mapping, setMapping] = useState<Record<string, string>>(() => ({ ...suggested }));

  async function fetchHeaders() {
    const res = await fetch("/api/sheets/columns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvUrl }),
    });
    const json = await res.json();
    if (json?.headers) setHeaders(json.headers as string[]);
  }

  async function saveProject() {
    const name = new URL(csvUrl).hostname || "신규 프로젝트";
    await fetch("/api/projects/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mapping }),
    });
  }

  return (
    <main className="py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm px-2.5 py-1.5 rounded-md border border-[color:oklch(0.85_0.01_0)] bg-white/80 hover:bg-white"
          aria-label="대시보드로 이동"
        >
          <span aria-hidden>←</span>
          <span className="hidden sm:inline">대시보드</span>
        </Link>
        <h1 className="text-2xl font-semibold">Marketing Automation</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Input
          placeholder="구글 시트 웹게시 CSV 링크"
          className="sm:flex-1"
          aria-label="구글 시트 웹게시 CSV 링크"
          value={csvUrl}
          onChange={(e) => setCsvUrl(e.target.value)}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--accent)] text-[var(--bg)] hover:brightness-95">새 프로젝트 +</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 프로젝트</DialogTitle>
              <DialogDescription>CSV 헤더를 불러와 시스템 필드와 매핑하세요.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="구글 시트 웹게시 CSV 링크"
                  aria-label="구글 시트 웹게시 CSV 링크"
                  value={csvUrl}
                  onChange={(e) => setCsvUrl(e.target.value)}
                />
                <Button onClick={fetchHeaders}>헤더 불러오기</Button>
              </div>
              {headers.length > 0 && (
                <div className="space-y-2">
                  {systemFields.map((sf) => (
                    <div key={sf} className="flex items-center gap-3">
                      <label className="w-44 text-sm text-[var(--fg)]/80">{sf}</label>
                      <select
                        className="h-10 px-3 rounded-md border border-[color:oklch(0.85_0.01_0)] bg-white/80 text-sm"
                        value={mapping[sf] ?? ""}
                        onChange={(e) => setMapping((m) => ({ ...m, [sf]: e.target.value }))}
                      >
                        <option value="">선택</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={fetchHeaders}>다시 불러오기</Button>
                <Button className="bg-[var(--accent)] text-[var(--bg)]" onClick={saveProject}>저장</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p.id} href={`/automation/marketing/${p.id}`} className="group">
            <Card className="transition-colors group-hover:bg-white">
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>생성일: {p.createdAt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-baseline justify-between border-b border-[color:oklch(0.85_0.01_0)] pb-2">
                    <span className="text-[var(--fg)]/80">총 신청</span>
                    <span className="font-medium text-[var(--fg)]">{p.stats.total}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-[color:oklch(0.85_0.01_0)] pb-2">
                    <span className="text-[var(--fg)]/80">선정</span>
                    <span className="font-medium text-[var(--fg)]">{p.stats.selected}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-[color:oklch(0.85_0.01_0)] pb-2">
                    <span className="text-[var(--fg)]/80">미선정</span>
                    <span className="font-medium text-[var(--fg)]">{p.stats.rejected}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-[color:oklch(0.85_0.01_0)] pb-2">
                    <span className="text-[var(--fg)]/80">검수대기</span>
                    <span className="font-medium text-[var(--fg)]">{p.stats.pending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}


