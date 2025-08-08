"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function ProjectActions({ projectId, initialRunning = false }: { projectId: string; initialRunning?: boolean }) {
  const [running, setRunning] = useState<boolean>(initialRunning);
  const [sending, setSending] = useState<boolean>(false);

  async function toggleRunning() {
    const next = !running;
    setRunning(next);
    try {
      const res = await fetch("/api/projects/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, running: next }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success(next ? "자동화 시작됨" : "자동화 일시정지됨");
    } catch {
      setRunning(!next);
      toast.error("상태 변경 실패");
    }
  }

  async function sendRejectBulk() {
    setSending(true);
    try {
      const res = await fetch("/api/emails/reject-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success("미선정자 메일 발송 큐에 등록됨");
    } catch {
      toast.error("메일 발송 큐 등록 실패");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <Button onClick={toggleRunning} className="bg-[var(--accent)] text-[var(--bg)]">
        {running ? "일시정지" : "자동화 시작"}
      </Button>
      <Button variant="secondary" onClick={sendRejectBulk} disabled={sending}>
        미선정자 메일 발송
      </Button>
    </div>
  );
}


