import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

/** Key/value detail row used inside record drawers. */
export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("py-2", className)}>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{children ?? "—"}</dd>
    </div>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-2 gap-x-6 gap-y-1">{children}</dl>;
}

export function ScoreMeter({
  label,
  value,
  max = 100,
  suffix,
  tone = "accent",
  hint,
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  tone?: "primary" | "accent" | "success" | "warning" | "danger";
  hint?: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value}
          {suffix ?? (max === 100 ? "%" : `/${max}`)}
        </span>
      </div>
      <Progress value={pct} tone={tone} className="mt-1.5" />
      {hint && <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:mt-0">
      {children}
    </h3>
  );
}
