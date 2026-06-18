import type { Risk } from "@/types";
import { inherentRiskScore, residualRiskScore } from "@/lib/scoring";
import { heatScore25 } from "@/lib/heat";
import { cn } from "@/lib/utils";

interface RiskHeatmapProps {
  risks: Risk[];
  mode?: "inherent" | "residual";
  onSelectCell?: (likelihood: number, impact: number) => void;
}

const LIK_LABELS = ["Rare", "Unlikely", "Possible", "Likely", "Almost certain"];
const IMP_LABELS = ["Minimal", "Minor", "Moderate", "Major", "Severe"];

function maxImpact(r: Risk): number {
  const vals = Object.values(r.impacts) as number[];
  return vals.length ? Math.max(...vals) : 1;
}

export function RiskHeatmap({ risks, mode = "residual", onSelectCell }: RiskHeatmapProps) {
  // Build 5x5 grid counts. Rows = likelihood 5..1 (top=high), cols = impact 1..5.
  const grid: Risk[][][] = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => [] as Risk[]));
  for (const r of risks) {
    const lik = r.likelihood;
    const imp = mode === "residual" ? Math.max(1, Math.round(residualRiskScore(r) / lik)) : maxImpact(r);
    const li = Math.min(5, Math.max(1, lik)) - 1;
    const ii = Math.min(5, Math.max(1, imp)) - 1;
    grid[li][ii].push(r);
  }

  return (
    <div className="flex gap-2">
      <div className="flex flex-col items-center justify-center">
        <span className="rotate-180 text-[10px] font-medium uppercase tracking-wide text-muted-foreground [writing-mode:vertical-rl]">
          Likelihood
        </span>
      </div>
      <div className="flex-1">
        <table className="w-full border-separate border-spacing-1">
          <tbody>
            {[5, 4, 3, 2, 1].map((lik) => (
              <tr key={lik}>
                <td className="pr-1 text-right text-[10px] text-muted-foreground">{LIK_LABELS[lik - 1]}</td>
                {[1, 2, 3, 4, 5].map((imp) => {
                  const cell = grid[lik - 1][imp - 1];
                  const score = lik * imp;
                  return (
                    <td key={imp}>
                      <button
                        onClick={() => onSelectCell?.(lik, imp)}
                        className={cn(
                          "flex h-12 w-full min-w-[2.5rem] items-center justify-center rounded-md text-sm font-semibold transition-transform hover:scale-[1.04]",
                          heatScore25(score),
                          cell.length === 0 && "opacity-40",
                        )}
                        title={`${LIK_LABELS[lik - 1]} × ${IMP_LABELS[imp - 1]} — ${cell.length} risk(s)`}
                      >
                        {cell.length || ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td />
              {IMP_LABELS.map((l) => (
                <td key={l} className="pt-1 text-center text-[10px] text-muted-foreground">
                  {l}
                </td>
              ))}
            </tr>
            <tr>
              <td />
              <td colSpan={5} className="pt-0.5 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Impact
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
