import { DOMAINS, DOMAIN_MAP } from "@/data/domains";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { residualRiskScore, riskBand } from "@/lib/scoring";
import { ScoreMeter, SectionLabel } from "@/components/common/Field";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SEVERITY } from "@/lib/labels";
import { isOverdue, fmtDate } from "@/lib/format";
import { ArrowRight, AlertTriangle, FileWarning, Clock } from "lucide-react";

export function DomainDetail({ domainId }: { domainId: string }) {
  const domain = DOMAIN_MAP[domainId];
  const store = useGovernanceStore();
  const scores = store.getScores();
  const s = scores.byDomain[domainId];

  const controls = store.controls.filter((c) => c.active && c.domainId === domainId);
  const weakControls = controls.filter((c) => c.status === "not_implemented" || c.status === "needs_review");
  const risks = store.risks
    .filter((r) => r.domainId === domainId)
    .sort((a, b) => residualRiskScore(b) - residualRiskScore(a));
  const controlIds = new Set(controls.map((c) => c.id));
  const evidence = store.evidence.filter((e) => e.linkedControlIds.some((id) => controlIds.has(id)));
  const controlsWithEvidence = controls.filter((c) => evidence.some((e) => e.linkedControlIds.includes(c.id)));
  const missingEvidence = controls.length - controlsWithEvidence.length;
  const overdueActions = store.actions.filter(
    (a) => a.domainId === domainId && a.status !== "done" && isOverdue(a.targetDate),
  );
  const openActions = store.actions.filter((a) => a.domainId === domainId && a.status !== "done");

  const gap = Math.max(0, s.targetMaturity - s.evidenceMaturity);

  return (
    <div>
      <p className="text-sm text-muted-foreground">{domain.summary}</p>

      <SectionLabel>Scores</SectionLabel>
      <div className="grid grid-cols-2 gap-4">
        <ScoreMeter label="Maturity (evidence-supported)" value={Math.round((s.evidenceMaturity / 5) * 100)} tone="primary" hint={`${s.evidenceMaturity.toFixed(1)} of 5 · target ${s.targetMaturity}`} />
        <ScoreMeter label="Control coverage" value={s.controlCoverage} tone="accent" />
        <ScoreMeter label="Evidence confidence" value={s.evidenceConfidence} tone="success" />
        <ScoreMeter label="Residual risk" value={s.residualRisk} tone="danger" />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Badge tone={gap > 1.5 ? "danger" : gap > 0.5 ? "warning" : "success"}>
          Maturity gap to target: {gap.toFixed(1)}
        </Badge>
        <Badge tone="neutral">{s.assessmentCompleteness}% assessed</Badge>
      </div>

      <SectionLabel>Highest risks</SectionLabel>
      {risks.length === 0 ? (
        <p className="text-xs text-muted-foreground">No risks recorded in this domain.</p>
      ) : (
        <ul className="space-y-1.5">
          {risks.slice(0, 4).map((r) => (
            <li key={r.id} className="flex items-start gap-2 text-sm">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
              <span className="flex-1">{r.title}</span>
              <StatusBadge def={SEVERITY[riskBand(residualRiskScore(r))]} />
            </li>
          ))}
        </ul>
      )}

      <SectionLabel>Major gaps</SectionLabel>
      {weakControls.length === 0 ? (
        <p className="text-xs text-muted-foreground">All controls in this domain are implemented or in progress.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {weakControls.slice(0, 5).map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">{c.id}</span>
              <span className="flex-1">{c.title}</span>
            </li>
          ))}
        </ul>
      )}

      <SectionLabel>Missing evidence &amp; overdue work</SectionLabel>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-md border bg-card p-2.5">
          <FileWarning className="h-4 w-4 text-warning" />
          <div>
            <p className="font-semibold tabular-nums">{missingEvidence}</p>
            <p className="text-[11px] text-muted-foreground">controls without evidence</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md border bg-card p-2.5">
          <Clock className="h-4 w-4 text-destructive" />
          <div>
            <p className="font-semibold tabular-nums">{overdueActions.length}</p>
            <p className="text-[11px] text-muted-foreground">overdue actions</p>
          </div>
        </div>
      </div>

      <SectionLabel>Recommended next steps</SectionLabel>
      {openActions.length === 0 ? (
        <p className="text-xs text-muted-foreground">No open roadmap actions for this domain.</p>
      ) : (
        <ul className="space-y-1.5">
          {openActions.slice(0, 4).map((a) => (
            <li key={a.id} className="flex items-start gap-2 text-sm">
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="flex-1">{a.title}</span>
              <span className="text-[11px] text-muted-foreground">{fmtDate(a.targetDate)}</span>
            </li>
          ))}
        </ul>
      )}

      <SectionLabel>Key outputs</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {domain.outputs.map((o) => (
          <Badge key={o} tone="neutral">
            {o}
          </Badge>
        ))}
      </div>
    </div>
  );
}
