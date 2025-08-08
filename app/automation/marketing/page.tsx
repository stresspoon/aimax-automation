import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  return (
    <main className="py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Marketing Automation</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Input placeholder="구글 시트 링크 입력" className="sm:flex-1" aria-label="구글 시트 링크 입력" />
        <Button className="bg-[var(--accent)] text-[var(--bg)] hover:brightness-95">새 프로젝트 +</Button>
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


