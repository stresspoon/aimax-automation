"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  destructive?: boolean;
  requireDoubleConfirm?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  destructive = false,
  requireDoubleConfirm = false,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [firstConfirmDone, setFirstConfirmDone] = React.useState(false);

  const handleConfirm = async () => {
    if (requireDoubleConfirm && !firstConfirmDone) {
      setFirstConfirmDone(true);
      return;
    }

    setIsConfirming(true);
    try {
      await onConfirm();
      onOpenChange(false);
      setFirstConfirmDone(false);
    } catch (error) {
      console.error("Confirm action failed:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    setFirstConfirmDone(false);
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) {
      setFirstConfirmDone(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="confirm-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription id="confirm-dialog-description">
            {firstConfirmDone ? "정말로 실행하시겠습니까? 이 작업은 되돌릴 수 없습니다." : description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isConfirming}
            aria-label={cancelText}
          >
            {cancelText}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isConfirming}
            aria-label={firstConfirmDone ? "최종 확인" : confirmText}
          >
            {isConfirming ? "처리 중..." : firstConfirmDone ? "최종 확인" : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}