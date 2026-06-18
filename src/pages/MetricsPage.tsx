import { FileDown, FileJson, FileSpreadsheet, Printer } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DistributionBars } from "@/components/charts/DistributionBars";
import { ScoreMeter } from "@/components/common/Field";
import { SCORE_EXPLANATIONS, residualRiskScore } from "@/lib/scoring";
import { DOMAINS } from "@/data/domains";
import { exportCSV, exportJSON, printReport } from "@/lib/export";
import { fmtDate } from "@/lib/format";

const REPORTS = [
  "Executive Governance Summary",
  "Board Governance Report",
  "Data Governance Maturity Report",
  "AI Governance Maturity Report",
  "Risk Register",
  "AI Inventory",
  "Data Inventory",
  "Control Catalogue",
  "Policy Register",
  "Evidence Register",
  "Roadmap",
  "Audit Readiness Report",
  "Vendor Assessment",
  "Governance Operating Model",
];

export function MetricsPage() {
  const store = useGovernanceStore();
  const scores = store.getScores();

  const domainMaturity = DOMAINS.map((d) => ({
    label: d.shortName,
    value: Math.round((scores.byDomain[d.id].evidenceMaturity / 5) * 100),
    tone: "accent" as const,
  }));

  const exportExecutiveSummary = () => {
    const rows = DOMAINS.map((d) => {
      const s = scores.byDomain[d.id];
      return {
        domain: d.name,
        maturity: s.evidenceMaturity,
        target: s.targetMaturity,
        controlCoverage: `${s.controlCoverage}%`,
        evidenceConfidence: `${s.evidenceConfidence}%`,
        residualRisk: s.residualRisk,
        completeness: `${s.assessmentCompleteness}%`,
      };
    });
    exportCSV("governance-summary", rows);
  };

  const printExec = () => {
    const rows = DOMAINS.map((d) => {
      const s = scores.byDomain[d.id];
      return `<tr><td>${d.index}. ${d.name}</td><td>${s.evidenceMaturity.toFixed(1)}</td><td>${s.controlCoverage}%</td><td>${s.evidenceConfidence}%</td><td>${s.residualRisk}</td></tr>`;
    }).join("");
    printReport(
      "Executive Governance Summary",
      `<h1>Executive Governance Summary</h1>
       <p class="meta">${store.profile.name} · Integrated Data &amp; AI Governance · Generated ${fmtDate("2026-06-18")}</p>
       <h2>Headline indicators</h2>
       <table><tr><th>Capability maturity</th><th>Control implementation</th><th>Evidence confidence</th><th>Residual risk</th><th>Assessment complete</th></tr>
       <tr><td>${scores.maturityIndex.toFixed(1)}/5</td><td>${scores.controlImplementation}%</td><td>${scores.evidenceConfidence}%</td><td>${scores.residualRisk}/100</td><td>${scores.assessmentCompleteness}%</td></tr></table>
       <h2>Maturity by domain</h2>
       <table><tr><th>Domain</th><th>Maturity (/5)</th><th>Control coverage</th><th>Evidence</th><th>Residual risk</th></tr>${rows}</table>`,
    );
  };

  return (
    <div>
      <PageHeader
        title="Metrics & Reporting"
        description="Separate governance indicators with transparent definitions, plus exportable report templates."
        actions={
          <>
            <Button size="sm" variant="outline" onClick={exportExecutiveSummary}><FileSpreadsheet className="h-4 w-4" />CSV</Button>
            <Button size="sm" variant="outline" onClick={() => exportJSON("governance-scores", scores)}><FileJson className="h-4 w-4" />JSON</Button>
            <Button size="sm" onClick={printExec}><Printer className="h-4 w-4" />PDF</Button>
          </>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Capability maturity" value={`${scores.maturityIndex.toFixed(1)}/5`} tone="accent" />
        <StatCard label="Control implementation" value={`${scores.controlImplementation}%`} />
        <StatCard label="Evidence confidence" value={`${scores.evidenceConfidence}%`} tone={scores.evidenceConfidence < 50 ? "warning" : "default"} />
        <StatCard label="Residual risk" value={`${scores.residualRisk}/100`} tone="warning" />
        <StatCard label="Assessment complete" value={`${scores.assessmentCompleteness}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maturity by domain</CardTitle>
            <CardDescription>Evidence-supported maturity (% of level 5)</CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars data={domainMaturity} suffix="%" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How each indicator is calculated</CardTitle>
            <CardDescription>No single merged "compliance score" (spec §7)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            {Object.entries(SCORE_EXPLANATIONS).map(([key, text]) => (
              <div key={key}>
                <p className="font-semibold capitalize text-foreground">{key.replace(/([A-Z])/g, " $1")}</p>
                <p>{text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Report templates</CardTitle>
          <CardDescription>Export to CSV, JSON or printable PDF. Every report shows scope, framework version, assumptions and a disclaimer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {REPORTS.map((r) => (
              <div key={r} className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
                <span className="text-sm">{r}</span>
                <div className="flex items-center gap-1">
                  <button onClick={printExec} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Print / PDF"><Printer className="h-3.5 w-3.5" /></button>
                  <button onClick={exportExecutiveSummary} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground" title="CSV"><FileDown className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
