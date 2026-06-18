import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Database,
  Bot,
  TriangleAlert,
  FileText,
  FolderCheck,
  Info,
} from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HealthRadar } from "@/components/charts/HealthRadar";
import { RiskHeatmap } from "@/components/charts/RiskHeatmap";
import { DistributionBars } from "@/components/charts/DistributionBars";
import { ScoreMeter } from "@/components/common/Field";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { residualRiskScore, riskBand, SCORE_EXPLANATIONS, AI_RISK_TIER_ORDER } from "@/lib/scoring";
import { SEVERITY, RISK_TIER, CONTROL_STATUS } from "@/lib/labels";
import { isOverdue, fmtDate } from "@/lib/format";
import type { ControlStatus } from "@/types";

export function OverviewPage() {
  const store = useGovernanceStore();
  const scores = store.getScores();

  const highRisks = store.risks
    .map((r) => ({ r, score: residualRiskScore(r) }))
    .filter((x) => x.score >= 9)
    .sort((a, b) => b.score - a.score);
  const overdueActions = store.actions.filter((a) => a.status !== "done" && isOverdue(a.targetDate));
  const policiesToReview = store.policies.filter((p) => isOverdue(p.nextReview));
  const aiToReassess = store.aiSystems.filter((a) => !a.retired && isOverdue(a.nextReview));
  const vendorsToReview = store.vendors.filter((v) => isOverdue(v.nextReview));
  const openIncidents = store.incidents.filter((i) => i.status === "open" || i.status === "contained");
  const openFindings = store.auditFindings.filter((f) => f.status !== "closed");

  const controlDist = (["operating", "implemented", "in_progress", "needs_review", "planned", "not_implemented"] as ControlStatus[]).map(
    (st) => ({
      label: CONTROL_STATUS[st].label,
      value: store.controls.filter((c) => c.active && c.status === st).length,
      tone:
        st === "operating" || st === "implemented"
          ? ("success" as const)
          : st === "in_progress" || st === "needs_review"
            ? ("warning" as const)
            : st === "not_implemented"
              ? ("danger" as const)
              : ("neutral" as const),
    }),
  );

  const aiTierDist = AI_RISK_TIER_ORDER.map((tier) => ({
    label: RISK_TIER[tier].label,
    value: store.aiSystems.filter((a) => a.riskTier === tier).length,
    tone:
      tier === "high" || tier === "unacceptable"
        ? ("danger" as const)
        : tier === "elevated"
          ? ("warning" as const)
          : ("info" as const),
  })).filter((d) => d.value > 0);

  return (
    <div>
      <PageHeader
        title="Governance Overview"
        description={`${store.profile.name} · Integrated Data & AI Governance · ${store.frameworkVersions.find((v) => v.id === store.activeVersionId)?.label.split(" — ")[0]}`}
      />

      {/* Separate indicators — never one merged score (spec §7) */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Capability maturity" value={`${scores.maturityIndex.toFixed(1)}/5`} hint={`Data ${scores.dataMaturity.toFixed(1)} · AI ${scores.aiMaturity.toFixed(1)}`} tone="accent" />
        <StatCard label="Control implementation" value={`${scores.controlImplementation}%`} hint="implemented or operating" />
        <StatCard label="Evidence confidence" value={`${scores.evidenceConfidence}%`} hint="kept separate from controls" tone={scores.evidenceConfidence < 50 ? "warning" : "default"} />
        <StatCard label="Residual risk" value={`${scores.residualRisk}/100`} hint="domain-weighted" tone={scores.residualRisk >= 50 ? "danger" : "warning"} />
        <StatCard label="Assessment complete" value={`${scores.assessmentCompleteness}%`} hint="of applicable questions" />
      </div>

      <div className="mb-3 flex items-start gap-2 rounded-md border border-info/30 bg-info/5 px-3 py-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
        <span>
          These five indicators are deliberately separate — there is no single "compliance score".
          Capability maturity, control implementation, evidence confidence, residual risk and
          assessment completeness each measure a different thing. See the Metrics page for how each is
          calculated.
        </span>
      </div>

      {/* Attention summary */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="High residual risks" value={highRisks.length} tone={highRisks.length ? "danger" : "success"} icon={<TriangleAlert className="h-4 w-4" />} />
        <StatCard label="Overdue actions" value={overdueActions.length} tone={overdueActions.length ? "warning" : "success"} />
        <StatCard label="Open incidents" value={openIncidents.length} tone={openIncidents.length ? "warning" : "success"} />
        <StatCard label="Open audit findings" value={openFindings.length} tone={openFindings.length ? "warning" : "success"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Governance maturity radar</CardTitle>
              <CardDescription>Evidence-supported maturity across all 14 domains</CardDescription>
            </div>
            <Link to="/health-map" className="text-xs font-medium text-accent hover:underline">
              Open Health Map →
            </Link>
          </CardHeader>
          <CardContent>
            <HealthRadar scores={scores.byDomain} metric="maturity" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data vs AI governance</CardTitle>
            <CardDescription>Maturity comparison by layer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <ScoreMeter label="Data governance maturity" value={Math.round((scores.dataMaturity / 5) * 100)} tone="primary" hint={`${scores.dataMaturity.toFixed(1)} of 5`} />
            <ScoreMeter label="AI governance maturity" value={Math.round((scores.aiMaturity / 5) * 100)} tone="accent" hint={`${scores.aiMaturity.toFixed(1)} of 5`} />
            <div className="rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
              AI governance is newer and references existing data controls rather than duplicating them.
              The gap reflects Northstar's early-stage AI programme.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controls by implementation status</CardTitle>
            <CardDescription>{store.controls.filter((c) => c.active).length} active controls</CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars data={controlDist} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk heatmap</CardTitle>
            <CardDescription>Residual risk by likelihood and impact</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskHeatmap risks={store.risks} mode="residual" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI systems by risk tier</CardTitle>
            <CardDescription>{store.aiSystems.length} systems in inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars data={aiTierDist} />
          </CardContent>
        </Card>
      </div>

      {/* Attention lists */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Top residual risks</CardTitle>
            <Link to="/risks" className="text-xs font-medium text-accent hover:underline">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {highRisks.slice(0, 6).map(({ r, score }) => (
              <div key={r.id} className="flex items-center gap-2 text-sm">
                <span className="text-[11px] font-medium text-muted-foreground">{r.id}</span>
                <span className="flex-1 truncate">{r.title}</span>
                <StatusBadge def={SEVERITY[riskBand(score)]} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming &amp; overdue reviews</CardTitle>
            <CardDescription>Reviews requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ReviewRow icon={<FileText className="h-4 w-4" />} label="Policies requiring review" count={policiesToReview.length} to="/policies" />
            <ReviewRow icon={<Bot className="h-4 w-4" />} label="AI systems requiring reassessment" count={aiToReassess.length} to="/ai" />
            <ReviewRow icon={<ShieldCheck className="h-4 w-4" />} label="Vendors requiring review" count={vendorsToReview.length} to="/vendors" />
            <ReviewRow icon={<FolderCheck className="h-4 w-4" />} label="Overdue roadmap actions" count={overdueActions.length} to="/roadmap" />
          </CardContent>
        </Card>
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
        Disclaimer: Governance Studio supports governance work but does not guarantee legal or
        regulatory compliance. Maturity, control implementation, evidence and risk are reported
        separately. Regulatory classifications are assumptions requiring qualified legal review.
      </p>
    </div>
  );
}

function ReviewRow({ icon, label, count, to }: { icon: React.ReactNode; label: string; count: number; to: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-secondary/50">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
      <Badge tone={count > 0 ? "warning" : "success"}>{count}</Badge>
    </Link>
  );
}
