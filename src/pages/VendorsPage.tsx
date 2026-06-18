import { useMemo, useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { ASSURANCE, PRIORITY } from "@/lib/labels";
import { fmtDate, isOverdue } from "@/lib/format";
import type { Vendor } from "@/types";

const CHIPS = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "ai", label: "AI / model access" },
  { value: "gaps", label: "Assurance gaps" },
  { value: "review", label: "Review overdue" },
];

export function VendorsPage() {
  const { vendors, aiSystems } = useGovernanceStore();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("all");
  const [selected, setSelected] = useState<Vendor | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return vendors.filter((v) => {
      const hasGap = [v.securityStatus, v.privacyStatus, v.aiGovernanceStatus].some((s) => s === "gap" || s === "not_assessed");
      if (chip === "critical" && v.criticality !== "critical") return false;
      if (chip === "ai" && !v.modelAccess) return false;
      if (chip === "gaps" && !hasGap) return false;
      if (chip === "review" && !isOverdue(v.nextReview)) return false;
      if (term && !`${v.name} ${v.service}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [vendors, search, chip]);

  const columns: Column<Vendor>[] = [
    { key: "name", header: "Vendor", render: (v) => (
      <div>
        <p className="font-medium">{v.name}</p>
        <p className="text-xs text-muted-foreground">{v.service}</p>
      </div>
    ) },
    { key: "crit", header: "Criticality", render: (v) => <StatusBadge def={PRIORITY[v.criticality]} /> },
    { key: "sec", header: "Security", render: (v) => <StatusBadge def={ASSURANCE[v.securityStatus]} /> },
    { key: "priv", header: "Privacy", render: (v) => <StatusBadge def={ASSURANCE[v.privacyStatus]} /> },
    { key: "ai", header: "AI gov.", render: (v) => <StatusBadge def={ASSURANCE[v.aiGovernanceStatus]} /> },
    { key: "review", header: "Next review", render: (v) => <span className={isOverdue(v.nextReview) ? "text-xs font-medium text-destructive" : "text-xs"}>{fmtDate(v.nextReview)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Vendor Register"
        description="Third-party suppliers with security, privacy and AI-governance assurance, contract dates and exit readiness."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Vendors" value={vendors.length} />
        <StatCard label="With model access" value={vendors.filter((v) => v.modelAccess).length} tone="warning" />
        <StatCard label="Assurance gaps" value={vendors.filter((v) => [v.securityStatus, v.privacyStatus, v.aiGovernanceStatus].some((s) => s === "gap" || s === "not_assessed")).length} tone="danger" />
      </div>

      <FilterBar search={search} onSearch={setSearch} placeholder="Search vendors…" chips={CHIPS} active={chip} onChipSelect={setChip} />

      <DataTable columns={columns} rows={filtered} rowKey={(v) => v.id} onRowClick={setSelected} />

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.name} description={selected.service}>
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge def={PRIORITY[selected.criticality]} />
              {selected.dataAccess && <Badge tone="warning">Data access</Badge>}
              {selected.modelAccess && <Badge tone="teal">Model access</Badge>}
            </div>
            <SectionLabel>Assurance</SectionLabel>
            <FieldGrid>
              <Field label="Security"><StatusBadge def={ASSURANCE[selected.securityStatus]} /></Field>
              <Field label="Privacy"><StatusBadge def={ASSURANCE[selected.privacyStatus]} /></Field>
              <Field label="AI governance"><StatusBadge def={ASSURANCE[selected.aiGovernanceStatus]} /></Field>
              <Field label="Audit rights">{selected.auditRights ? "Yes" : "No"}</Field>
              <Field label="Exit plan">{selected.exitPlan ? "Yes" : <Badge tone="danger">Missing</Badge>}</Field>
              <Field label="Next review">{fmtDate(selected.nextReview)}</Field>
            </FieldGrid>
            <SectionLabel>Supply chain</SectionLabel>
            <FieldGrid>
              <Field label="Systems supplied">{selected.systemsSupplied.join(", ") || "—"}</Field>
              <Field label="Subprocessors">{selected.subprocessors.join(", ") || "—"}</Field>
              <Field label="Countries">{selected.countries.join(", ")}</Field>
              <Field label="Contract">{fmtDate(selected.contractStart)} → {fmtDate(selected.contractEnd)}</Field>
              <Field label="Open risks">{selected.openRiskIds.join(", ") || "None"}</Field>
            </FieldGrid>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
