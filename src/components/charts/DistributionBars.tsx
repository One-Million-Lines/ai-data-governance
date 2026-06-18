import { cn } from "@/lib/utils";

export interface BarDatum {
  label: string;
  value: number;
  tone?: "primary" | "accent" | "success" | "warning" | "danger" | "neutral" | "info";
}

const TONE: Record<NonNullable<BarDatum["tone"]>, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  neutral: "bg-muted-foreground/50",
  info: "bg-info",
};

/** Lightweight horizontal distribution bars (no chart lib dependency). */
export function DistributionBars({ data, suffix = "" }: { data: BarDatum[]; suffix?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2">
          <span className="w-36 shrink-0 truncate text-xs text-muted-foreground">{d.label}</span>
          <div className="h-4 flex-1 overflow-hidden rounded bg-secondary">
            <div
              className={cn("h-full rounded", TONE[d.tone ?? "accent"])}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums">
            {d.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}
