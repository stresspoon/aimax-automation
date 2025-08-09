"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export function ProjectSync({ projectId }: { projectId: string }) {
  const [csvUrl, setCsvUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function syncBatch(start: number) {
    const res = await fetch("/api/sheets/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, csvUrl, offset: start, limit: 1000 }),
    });
    if (!res.ok) throw new Error("sync failed");
    const json = await res.json();
    return json as { processed: number; nextOffset: number | null; total: number };
  }

  async function startSync() {
    if (!csvUrl) {
      toast.error("CSV 링크를 입력하세요");
      return;
    }
    setLoading(true);
    try {
      let offset = 0;
      let total = 0;
      while (true) {
        const { processed, nextOffset, total: t } = await syncBatch(offset);
        total = t;
        offset = nextOffset ?? 0;
        toast.success(`${processed}건 처리 (${Math.min(offset, total)}/${total})`);
        if (nextOffset == null) break;
        // 살짝 양보
        await new Promise((r) => setTimeout(r, 150));
      }
      toast.success("동기화 완료");
    } catch {
      toast.error("동기화 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <Input
        placeholder="구글 시트 웹게시 CSV 링크"
        value={csvUrl}
        onChange={(e) => setCsvUrl(e.target.value)}
        className="max-w-xl"
      />
      <Button onClick={startSync} disabled={loading} className="bg-[var(--accent)] text-[var(--bg)]">
        {loading ? "동기화 중..." : "시트 동기화"}
      </Button>
    </div>
  );
}


