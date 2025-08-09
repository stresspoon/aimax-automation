"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type Row = {
  invite_id: string;
  applicant: string | null;
  channel: string;
  credits: number;
  used: number;
  expires_at: string | null;
  url: string | null;
  passed: boolean | null;
};

export default function ReviewStatus({ projectId }: { projectId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/review/status?projectId=${projectId}`);
      const json = await res.json();
      setRows(json.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function reissue(inviteId: string) {
    try {
      const res = await fetch("/api/review/invite/reissue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, addCredits: 1 }),
      });
      if (!res.ok) throw new Error();
      toast.success("재요청 처리되었습니다");
      load();
    } catch {
      toast.error("재요청 실패");
    }
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <div className="text-sm font-medium mb-2">리뷰 현황</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--fg)]/60">
                <th className="py-2 pr-4">신청자</th>
                <th className="py-2 pr-4">채널</th>
                <th className="py-2 pr-4">잔여/만료</th>
                <th className="py-2 pr-4">제출 URL</th>
                <th className="py-2 pr-4">검증</th>
                <th className="py-2 pr-4">액션</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.invite_id}-${r.channel}`} className="border-t">
                  <td className="py-2 pr-4">{r.applicant || "-"}</td>
                  <td className="py-2 pr-4">{r.channel}</td>
                  <td className="py-2 pr-4">{Math.max(0, (r.credits ?? 0) - (r.used ?? 0))} / {r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "-"}</td>
                  <td className="py-2 pr-4 truncate max-w-[320px]"><a className="underline" href={r.url ?? "#"} target="_blank" rel="noreferrer">{r.url ?? "-"}</a></td>
                  <td className="py-2 pr-4">{r.passed ? "통과" : r.passed === false ? "미통과" : "-"}</td>
                  <td className="py-2 pr-4"><Button variant="secondary" onClick={() => reissue(r.invite_id)}>재요청</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}


