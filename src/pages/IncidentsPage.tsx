import { useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { SEVERITY } from "@/lib/labels";
import { titleCase, fmtDate } from "@/lib/format";
import type { Tone } from "@/lib/labels";
import type { Incident } from "@/types";

const STATUS_TONE: Record<Incident["status"], Tone> = {
  open: "danger",
  contained: "warning",
  resolved: "info",
  closed: "success",
};

export function IncidentsPage() {
  const { incidents, aiSystems } = useGovernanceStore();
  const [selected, setSelected] = useState<Incident | null>(null);

  const open = incidents.filter((i) => i.status === "open" || i.status === "contained").length;

  const columns: Column<Incident>[] = [
    { key: "title", header: "Incident", render: (i) => (
      <div>
        <p className="font-medium">{i.title}</p>
        <p className="text-xs text-muted-foreground">{titleCase(i.category)} · {i.id}</p>
      </div>
    ) },
    { key: "sev", header: "Severity", render: (i) => <StatusBadge def={SEVERITY[i.severity]} /> },
    { key: "status", header: "Status", render: (i) => <Badge tone={STATUS_TONE[i.status]}>{titleCase(i.status)}</Badge> },
    { key: "detected", header: "Detected", render: (i) => <span className="text-xs">{fmtDate(i.detectedDate)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Incident Register"
        description="Data, privacy, security, AI, model-failure, harmful-output and agent-action incidents with containment, root cause and lessons learned."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total incidents" value={incidents.length} />
        <StatCard label="Open / contained" value={open} tone={open ? "warning" : "success"} />
        <StatCard label="AI-related" value={incidents.filter((i) => ["ai", "model_failure", "harmful_output", "agent_action"].includes(i.category)).length} tone="warning" />
      </div>

      <DataTable columns={columns} rows={incidents} rowKey={(i) => i.id} onRowClick={setSelected} />

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.title} description={`${titleCase(selected.category)} · ${selected.id}`}>
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge def={SEVERITY[selected.severity]} />
              <Badge tone={STATUS_TONE[selected.status]}>{titleCase(selected.status)}</Badge>
            </div>
            <SectionLabel>Impact</SectionLabel>
            <FieldGrid>
              <Field label="Detected">{fmtDate(selected.detectedDate)}</Field>
              <Field label="Affected systems">{selected.affectedSystemIds.map((id) => aiSystems.find((a) => a.id === id)?.name ?? id).join(", ") || "—"}</Field>
              <Field label="Affected individuals">{selected.affectedIndividuals}</Field>
            </FieldGrid>
            <SectionLabel>Response</SectionLabel>
            <FieldGrid>
              <Field label="Containment">{selected.containment}</Field>
              <Field label="Root cause">{selected.rootCause}</Field>
              <Field label="Corrective actions">{selected.correctiveActions}</Field>
              <Field label="Notifications">{selected.notifications}</Field>
              <Field label="Lessons learned">{selected.lessonsLearned}</Field>
            </FieldGrid>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
