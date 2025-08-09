import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToolsSection } from "@/components/dashboard/tools-section";

export default function DashboardPage() {
  return (
    <main className="py-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <h2 className="text-xl font-semibold mb-3">자동화 도구</h2>
      <section aria-label="자동화 기능" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/automation/marketing" className="group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-xl">
          <Card className="h-full transition-colors group-hover:bg-white">
            <CardHeader>
              <CardTitle>마케팅 자동화</CardTitle>
              <CardDescription>캠페인 · 스케줄링 · 추적</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted)]">클릭하여 이동</CardContent>
          </Card>
        </Link>

        <Link href="/automation/recruiting" className="group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-xl">
          <Card className="h-full transition-colors group-hover:bg-white">
            <CardHeader>
              <CardTitle>모집 글쓰기 자동화</CardTitle>
              <CardDescription>템플릿 · 배포 · 관리</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted)]">클릭하여 이동</CardContent>
          </Card>
        </Link>

        <div className="opacity-70 pointer-events-none">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>상세페이지 자동화</CardTitle>
                <Badge variant="secondary">비활성</Badge>
              </div>
              <CardDescription>곧 제공 예정</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted)]">준비 중</CardContent>
          </Card>
        </div>
      </section>

      {/* 개별 판매 도구 섹션 */}
      <ToolsSection />
    </main>
  );
}


