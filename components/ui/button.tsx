"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-[var(--accent)] text-[var(--bg)] hover:brightness-110 shadow-sm",
  secondary: "bg-transparent border-2 border-[var(--border)] text-[var(--fg)] hover:border-[var(--fg)]/30",
  outline: "border-2 border-[var(--border)] bg-transparent text-[var(--fg)] hover:bg-[var(--fg)]/5",
  ghost: "hover:bg-[var(--fg)]/5",
  destructive: "bg-transparent text-[var(--err)] border-2 border-[var(--err)] hover:bg-[var(--err)] hover:text-[var(--bg)]",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-[var(--row-height)] px-6",
  lg: "h-12 px-8 text-base",
  icon: "h-[var(--row-height)] w-[var(--row-height)]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";


