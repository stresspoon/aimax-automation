import Link from "next/link";

export default function RecruitingAutomationPage() {
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
        <h1 className="text-2xl font-semibold">모집 글쓰기 자동화</h1>
      </div>
    </main>
  );
}


