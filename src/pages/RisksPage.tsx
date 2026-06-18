import { useMemo, useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { RiskHeatmap } from "@/components/charts/RiskHeatmap";
import { inherentRiskScore, residualRiskScore, riskBand } from "@/lib/scoring";
import { SEVERITY } from "@/lib/labels";
import { DOMAIN_MAP } from "@/data/domains";
import { titleCase, fmtDate } from "@/lib/format";
import type { Risk, ImpactDimension } from "@/types";

const CHIPS = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "accepted", label: "Accepted" },
];

const IMPACT_LABELS: Record<ImpactDimension, string> = {
  legal: "Legal & regulatory",
  individual_rights: "Individual rights",
  fairness: "Fairness",
  safety: "Safety",
  privacy: "Privacy",
  security: "Security",
  operational: "Operational",
  financial: "Financial",
  reputational: "Reputational",
  strategic: "Strategic",
  customer: "Customer",
  workforce: "Workforce",
  societal: "Societal",
};

export function RisksPage() {
  const { risks, controls } = useGovernanceStore();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("all");
  const [selected, setSelected] = useState<Risk | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return risks
      .filter((r) => {
        const band = riskBand(residualRiskScore(r));
        if (chip === "critical" && band !== "critical") return false;
        if (chip === "high" && band !== "high") return false;
        if (chip === "accepted" && r.treatment !== "accept") return false;
        if (term && !`${r.title} ${r.category}`.toLowerCase().includes(term)) return false;
        return true;
      })
      .sort((a, b) => residualRiskScore(b) - residualRiskScore(a));
  }, [risks, search, chip]);

  const critical = risks.filter((r) => riskBand(residualRiskScore(r)) === "critical").length;
  const high = risks.filter((r) => riskBand(residualRiskScore(r)) === "high").length;
  const accepted = risks.filter((r) => r.treatment === "accept").length;

  const columns: Column<Risk>[] = [
    { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span>, width: "70px" },
    { key: "title", header: "Risk", render: (r) => (
      <div>
        <p className="font-medium">{r.title}</p>
        <p className="text-xs text-muted-foreground">{DOMAIN_MAP[r.domainId].shortName} · {r.category}</p>
      </div>
    ) },
    { key: "inh", header: "Inherent", render: (r) => <span className="text-xs tabular-nums text-muted-foreground">{inherentRiskScore(r)}</span>, width: "70px" },
    { key: "res", header: "Residual", render: (r) => <StatusBadge def={SEVERITY[riskBand(residualRiskScore(r))]} />, width: "100px" },
    { key: "treat", header: "Treatment", render: (r) => <span className="text-xs">{titleCase(r.treatment)}</span> },
    { key: "owner", header: "Owner", render: (r) => (r.owner ? <span className="text-xs">{r.owner}</span> : <Badge tone="danger">Unassigned</Badge>) },
  ];

  return (
    <div>
      <PageHeader
        title="Risk Register"
        description="Configurable risk scoring across 13 impact dimensions. Residual risk = likelihood × highest impact, reduced by control effectiveness."
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-3 lg:col-span-2 lg:grid-cols-3">
          <StatCard label="Total risks" value={risks.length} />
          <StatCard label="Critical" value={critical} tone="danger" />
          <StatCard label="High" value={high} tone="warning" />
          <StatCard label="Accepted" value={accepted} tone="warning" />
          <StatCard label="Avg residual" value={Math.round(risks.reduce((a, r) => a + residualRiskScore(r), 0) / risks.length)} hint="of 25" />
          <StatCard label="With owner" value={risks.filter((r) => r.owner).length} tone="success" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Residual risk heatmap</CardTitle>
            <CardDescription>Likelihood × impact</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskHeatmap risks={risks} mode="residual" />
          </CardContent>
        </Card>
      </div>

      <FilterBar search={search} onSearch={setSearch} placeholder="Search risks…" chips={CHIPS} active={chip} onChipSelect={setChip} />

      <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} onRowClick={setSelected} emptyTitle="No risks match" />

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.title} description={`${selected.id} · ${DOMAIN_MAP[selected.domainId].name}`}>
            <p className="text-sm text-muted-foreground">{selected.description}</p>

            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md border bg-card p-2.5">
                <p className="text-lg font-semibold tabular-nums">{inherentRiskScore(selected)}</p>
                <p className="text-[11px] text-muted-foreground">Inherent</p>
              </div>
              <div className="rounded-md border bg-card p-2.5">
                <p className="text-lg font-semibold tabular-nums">{residualRiskScore(selected)}</p>
                <p className="text-[11px] text-muted-foreground">Residual</p>
              </div>
              <div className="flex items-center justify-center rounded-md border bg-card p-2.5">
                <StatusBadge def={SEVERITY[riskBand(residualRiskScore(selected))]} />
              </div>
            </div>

            <SectionLabel>Cause → event → consequence</SectionLabel>
            <FieldGrid>
              <Field label="Cause">{selected.cause}</Field>
              <Field label="Event">{selected.event}</Field>
              <Field label="Consequence">{selected.consequence}</Field>
              <Field label="Likelihood">{selected.likelihood} / 5</Field>
            </FieldGrid>

            <SectionLabel>Impact by dimension</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(selected.impacts).map(([dim, val]) => (
                <Badge key={dim} tone={val >= 4 ? "danger" : val >= 3 ? "warning" : "neutral"}>
                  {IMPACT_LABELS[dim as ImpactDimension]}: {val}
                </Badge>
              ))}
            </div>

            <SectionLabel>Treatment &amp; controls</SectionLabel>
            <FieldGrid>
              <Field label="Treatment">{titleCase(selected.treatment)}</Field>
              <Field label="Control effectiveness">{titleCase(selected.controlEffectiveness)}</Field>
              <Field label="Owner">{selected.owner ?? <Badge tone="danger">Unassigned</Badge>}</Field>
              <Field label="Review date">{fmtDate(selected.reviewDate)}</Field>
              <Field label="Linked controls">{selected.controlIds.join(", ") || "None"}</Field>
              <Field label="Escalation threshold">{selected.escalationThreshold}</Field>
            </FieldGrid>

            {selected.acceptance && (
              <>
                <SectionLabel>Risk acceptance</SectionLabel>
                <div className="rounded-md border border-warning/30 bg-warning/5 p-3">
                  <FieldGrid>
                    <Field label="Approver">{selected.acceptance.approver}</Field>
                    <Field label="Expiry">{fmtDate(selected.acceptance.expiry)}</Field>
                    <Field label="Review date">{fmtDate(selected.acceptance.reviewDate)}</Field>
                    <Field label="Compensating controls">{selected.acceptance.compensatingControls}</Field>
                  </FieldGrid>
                  <p className="mt-1 text-xs text-muted-foreground">{selected.acceptance.rationale}</p>
                </div>
              </>
            )}
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
