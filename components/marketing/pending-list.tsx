"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

type Applicant = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  url_threads: string | null;
  url_instagram: string | null;
  url_blog: string | null;
  created_at: string;
  status: string;
};

export function PendingList({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [channel, setChannel] = useState<"all" | "threads" | "instagram" | "blog">("all");

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ projectId, status: "pending", page: String(page), pageSize: "12" });
      if (channel !== "all") params.set("channel", channel);
      const res = await fetch(`/api/applicants/list?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      setItems(json.items ?? []);
      setTotal(json.total ?? 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, page, channel]);

  function removeLocal(id: string) {
    setItems((arr) => arr.filter((a) => a.id !== id));
  }

  async function requeue(applicantId: string) {
    try {
      removeLocal(applicantId);
      const res = await fetch("/api/jobs/requeue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId }),
      });
      if (!res.ok) throw new Error();
      toast.success("재큐잉 및 대기로 변경");
    } catch {
      toast.error("재큐잉 실패");
      load();
    }
  }

  async function setStatus(applicantId: string, status: "selected" | "rejected") {
    try {
      removeLocal(applicantId);
      const res = await fetch("/api/applicants/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, status }),
      });
      if (!res.ok) throw new Error();
      toast.success(status === "selected" ? "수동 통과" : "수동 탈락");
    } catch {
      toast.error("상태 변경 실패");
      load();
    }
  }

  const pages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--fg)]/70">채널:</span>
        {(["all", "threads", "instagram", "blog"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setChannel(c)}
            className={`text-sm px-2 py-1 rounded ${channel === c ? "border border-[var(--accent)]" : "border border-transparent text-[var(--fg)]/70"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4 space-y-2">
              <div className="text-sm"><span className="text-[var(--fg)]/70">이름</span>: {a.name || "-"}</div>
              <div className="text-sm"><span className="text-[var(--fg)]/70">메일</span>: {a.email || "-"}</div>
              <div className="text-sm"><span className="text-[var(--fg)]/70">연락처</span>: {a.phone || "-"}</div>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" onClick={() => requeue(a.id)}>다시 B로 보내기</Button>
                <Button className="bg-[var(--ok)] text-white" onClick={() => setStatus(a.id, "selected")}>수동통과</Button>
                <Button className="bg-[var(--err)] text-white" onClick={() => setStatus(a.id, "rejected")}>수동탈락</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}>이전</Button>
        <span className="text-sm">{page}/{pages}</span>
        <Button variant="secondary" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages || loading}>다음</Button>
      </div>
    </div>
  );
}


