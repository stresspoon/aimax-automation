"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function ProjectActions({ projectId, initialRunning = false }: { projectId: string; initialRunning?: boolean }) {
  const [running, setRunning] = useState<boolean>(initialRunning);
  const [sending, setSending] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: "stop" | "bulk" | null }>({
    open: false,
    action: null,
  });

  async function toggleRunning() {
    if (running) {
      // 중지할 때만 확인 필요
      setConfirmDialog({ open: true, action: "stop" });
      return;
    }
    
    const next = !running;
    setRunning(next);
    try {
      const res = await fetch("/api/projects/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, running: next }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success("자동화 시작됨");
    } catch {
      setRunning(!next);
      toast.error("상태 변경 실패");
    }
  }

  async function confirmStop() {
    setRunning(false);
    try {
      const res = await fetch("/api/projects/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, running: false }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success("자동화가 중지되었습니다");
    } catch {
      setRunning(true);
      toast.error("상태 변경 실패");
    }
  }

  async function sendRejectBulk() {
    setConfirmDialog({ open: true, action: "bulk" });
  }

  async function confirmBulkSend() {
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
    <>
      <div className="flex flex-wrap gap-2 mt-3">
        <Button 
          onClick={toggleRunning} 
          variant={running ? "destructive" : "default"}
          aria-label={running ? "자동화 중지" : "자동화 시작"}
        >
          {running ? "일시정지" : "자동화 시작"}
        </Button>
        <Button 
          variant="secondary" 
          onClick={sendRejectBulk} 
          disabled={sending}
          aria-label="미선정자에게 이메일 발송"
        >
          미선정자 메일 발송
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDialog.open && confirmDialog.action === "stop"}
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, action: null })}
        title="자동화 중지"
        description="진행 중인 자동화를 중지하시겠습니까?"
        confirmText="중지"
        cancelText="취소"
        onConfirm={confirmStop}
        destructive
        requireDoubleConfirm
      />

      <ConfirmDialog
        open={confirmDialog.open && confirmDialog.action === "bulk"}
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, action: null })}
        title="미선정자 메일 발송"
        description="모든 미선정자에게 안내 메일을 발송하시겠습니까?"
        confirmText="발송"
        cancelText="취소"
        onConfirm={confirmBulkSend}
        requireDoubleConfirm
      />
    </>
  );
}


