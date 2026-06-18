import { useMemo, useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { Progress } from "@/components/ui/progress";
import { POLICY_STATUS } from "@/lib/labels";
import { titleCase, fmtDate, isOverdue } from "@/lib/format";
import type { Policy, PolicyStatus } from "@/types";

const CHIPS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft / review" },
  { value: "review", label: "Review overdue" },
];

const STATUS_FLOW: PolicyStatus[] = ["draft", "in_review", "approved", "published", "superseded", "retired"];

export function PoliciesPage() {
  const { policies, updatePolicy, log } = useGovernanceStore();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("all");
  const [selected, setSelected] = useState<Policy | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return policies.filter((p) => {
      if (chip === "published" && p.status !== "published") return false;
      if (chip === "draft" && !(p.status === "draft" || p.status === "in_review")) return false;
      if (chip === "review" && !isOverdue(p.nextReview)) return false;
      if (term && !p.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [policies, search, chip]);

  const columns: Column<Policy>[] = [
    { key: "title", header: "Policy", render: (p) => (
      <div>
        <p className="font-medium">{p.title}</p>
        <p className="text-xs text-muted-foreground">{titleCase(p.category)} · v{p.version}</p>
      </div>
    ) },
    { key: "layer", header: "Layer", render: (p) => <Badge tone={p.layer === "ai" ? "teal" : p.layer === "data" ? "info" : "neutral"}>{titleCase(p.layer)}</Badge> },
    { key: "status", header: "Status", render: (p) => <StatusBadge def={POLICY_STATUS[p.status]} /> },
    { key: "owner", header: "Owner", render: (p) => <span className="text-xs">{p.owner ?? "—"}</span> },
    { key: "review", header: "Next review", render: (p) => <span className={isOverdue(p.nextReview) ? "text-xs font-medium text-destructive" : "text-xs"}>{fmtDate(p.nextReview)}</span> },
    { key: "ack", header: "Acknowledged", render: (p) => <span className="text-xs tabular-nums">{p.acknowledgement}%</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Policy Library"
        description="Policies, standards and procedures with structured sections, status workflow and control links. Generated policies are starting points, not legal advice."
      />

      <FilterBar search={search} onSearch={setSearch} placeholder="Search policies…" chips={CHIPS} active={chip} onChipSelect={setChip} />

      <DataTable columns={columns} rows={filtered} rowKey={(p) => p.id} onRowClick={setSelected} />

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.title} description={`${titleCase(selected.category)} · v${selected.version}`}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge def={POLICY_STATUS[selected.status]} />
              <Badge tone="neutral">{titleCase(selected.layer)} layer</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selected.summary}</p>

            <SectionLabel>Governance</SectionLabel>
            <FieldGrid>
              <Field label="Owner">{selected.owner ?? "—"}</Field>
              <Field label="Approver">{selected.approver ?? "—"}</Field>
              <Field label="Effective">{fmtDate(selected.effectiveDate)}</Field>
              <Field label="Next review">{fmtDate(selected.nextReview)}</Field>
            </FieldGrid>
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Workforce acknowledgement</span><span className="tabular-nums">{selected.acknowledgement}%</span></div>
              <Progress value={selected.acknowledgement} tone={selected.acknowledgement > 80 ? "success" : "warning"} />
            </div>

            <SectionLabel>Sections</SectionLabel>
            <div className="space-y-3">
              {selected.sections.map((sec) => (
                <div key={sec.id} className="rounded-md border bg-card p-3">
                  <p className="text-sm font-semibold">{sec.heading}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{sec.body}</p>
                  <p className="mt-1.5 text-[11px] italic text-muted-foreground">Guidance: {sec.guidance}</p>
                </div>
              ))}
            </div>

            <SectionLabel>Linked controls</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {selected.linkedControlIds.map((id) => <Badge key={id} tone="neutral">{id}</Badge>)}
            </div>

            <SectionLabel>Status</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FLOW.map((st) => (
                <Button key={st} size="sm" variant={selected.status === st ? "default" : "outline"} onClick={() => {
                  updatePolicy(selected.id, { status: st });
                  log({ actor: "You", action: "policy.status.change", entity: "Policy", entityId: selected.id, detail: `Status → ${POLICY_STATUS[st].label}` });
                  setSelected({ ...selected, status: st });
                }}>
                  {POLICY_STATUS[st].label}
                </Button>
              ))}
            </div>

            <p className="mt-3 rounded-md border border-warning/30 bg-warning/5 p-2.5 text-[11px] text-muted-foreground">
              This policy is a structured starting point. Legal and regulatory review may be required before
              publication. Completing it does not guarantee compliance.
            </p>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
