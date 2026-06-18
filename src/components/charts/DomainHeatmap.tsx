import { DOMAINS } from "@/data/domains";
import type { DomainScore } from "@/types";
import { heatGood, heatRisk } from "@/lib/heat";
import { cn } from "@/lib/utils";

interface DomainHeatmapProps {
  scores: Record<string, DomainScore>;
  onSelect?: (domainId: string) => void;
  selected?: string;
}

const COLUMNS = [
  { key: "maturity", label: "Maturity", kind: "good" as const, get: (s: DomainScore) => Math.round((s.evidenceMaturity / 5) * 100), display: (s: DomainScore) => s.evidenceMaturity.toFixed(1) },
  { key: "controlCoverage", label: "Control", kind: "good" as const, get: (s: DomainScore) => s.controlCoverage, display: (s: DomainScore) => `${s.controlCoverage}%` },
  { key: "evidenceConfidence", label: "Evidence", kind: "good" as const, get: (s: DomainScore) => s.evidenceConfidence, display: (s: DomainScore) => `${s.evidenceConfidence}%` },
  { key: "residualRisk", label: "Risk", kind: "risk" as const, get: (s: DomainScore) => s.residualRisk, display: (s: DomainScore) => `${s.residualRisk}` },
  { key: "completeness", label: "Assessed", kind: "good" as const, get: (s: DomainScore) => s.assessmentCompleteness, display: (s: DomainScore) => `${s.assessmentCompleteness}%` },
];

export function DomainHeatmap({ scores, onSelect, selected }: DomainHeatmapProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-sm">
        <thead>
          <tr>
            <th className="w-1/3 px-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Domain
            </th>
            {COLUMNS.map((c) => (
              <th key={c.key} className="px-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DOMAINS.map((d) => {
            const s = scores[d.id];
            return (
              <tr key={d.id}>
                <td className="px-1">
                  <button
                    onClick={() => onSelect?.(d.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-secondary",
                      selected === d.id && "bg-secondary ring-1 ring-accent",
                    )}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-semibold text-primary">
                      {d.index}
                    </span>
                    <span className="truncate">{d.shortName}</span>
                  </button>
                </td>
                {COLUMNS.map((c) => {
                  const val = c.get(s);
                  const tone = c.kind === "good" ? heatGood(val) : heatRisk(val);
                  return (
                    <td key={c.key} className="px-0.5">
                      <button
                        onClick={() => onSelect?.(d.id)}
                        className={cn(
                          "flex h-9 w-full items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-transform hover:scale-[1.03]",
                          tone,
                        )}
                        title={`${d.shortName} · ${c.label}`}
                      >
                        {c.display(s)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
