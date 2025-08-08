import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-[var(--muted)]/20 text-[var(--fg)]",
    secondary: "bg-[var(--muted)]/30 text-[var(--fg)]",
    success: "bg-[var(--ok)]/15 text-[var(--ok)]",
    warning: "bg-[var(--warn)]/15 text-[var(--warn)]",
    destructive: "bg-[var(--err)]/15 text-[var(--err)]",
  };
  return (
    <div className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium", styles[variant], className)} {...props} />
  );
}


