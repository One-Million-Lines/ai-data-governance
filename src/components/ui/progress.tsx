import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  tone?: "primary" | "accent" | "success" | "warning" | "danger";
}

const TONE: Record<NonNullable<ProgressProps["tone"]>, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};

export function Progress({ value = 0, tone = "accent", className, ...props }: ProgressProps) {
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)} {...props}>
      <div
        className={cn("h-full rounded-full transition-all", TONE[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
