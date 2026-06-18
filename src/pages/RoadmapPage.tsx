import { useMemo, useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel, ScoreMeter } from "@/components/common/Field";
import { priorityScore, priorityFromScore, PRIORITISATION_WEIGHTS } from "@/lib/scoring";
import { ACTION_STATUS, PRIORITY } from "@/lib/labels";
import { DOMAIN_MAP } from "@/data/domains";
import { fmtDate, isOverdue, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Action, ActionPhase, ActionStatus } from "@/types";

const PHASES: { id: ActionPhase; label: string }[] = [
  { id: "foundation", label: "Foundation" },
  { id: "operationalise", label: "Operationalise" },
  { id: "optimise", label: "Optimise" },
];

const STATUS_FLOW: ActionStatus[] = ["not_started", "in_progress", "in_review", "done", "blocked"];

const CHIPS = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "overdue", label: "Overdue" },
  { value: "open", label: "Open" },
];

export function RoadmapPage() {
  const { actions, updateAction, log } = useGovernanceStore();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("all");
  const [selected, setSelected] = useState<Action | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return actions.filter((a) => {
      const p = priorityFromScore(priorityScore(a));
      if (chip === "critical" && p !== "critical") return false;
      if (chip === "high" && p !== "high") return false;
      if (chip === "overdue" && !(a.status !== "done" && isOverdue(a.targetDate))) return false;
      if (chip === "open" && a.status === "done") return false;
      if (term && !`${a.title} ${a.description}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [actions, search, chip]);

  const byPhase = (phase: ActionPhase) =>
    filtered.filter((a) => a.phase === phase).sort((x, y) => priorityScore(y) - priorityScore(x));

  const columns: Column<Action>[] = [
    { key: "title", header: "Action", render: (a) => (
      <div>
        <p className="font-medium">{a.title}</p>
        <p className="text-xs text-muted-foreground">{DOMAIN_MAP[a.domainId].shortName} · {a.id}</p>
      </div>
    ) },
    { key: "priority", header: "Priority", render: (a) => <StatusBadge def={PRIORITY[priorityFromScore(priorityScore(a))]} />, width: "90px" },
    { key: "score", header: "Score", render: (a) => <span className="text-xs tabular-nums">{priorityScore(a)}</span>, width: "60px" },
    { key: "phase", header: "Phase", render: (a) => <Badge tone="neutral">{titleCase(a.phase)}</Badge> },
    { key: "status", header: "Status", render: (a) => <StatusBadge def={ACTION_STATUS[a.status]} /> },
    { key: "owner", header: "Owner", render: (a) => <span className="text-xs">{a.owner ?? "—"}</span> },
    { key: "due", header: "Due", render: (a) => <span className={cn("text-xs", a.status !== "done" && isOverdue(a.targetDate) && "font-medium text-destructive")}>{fmtDate(a.targetDate)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Implementation Roadmap"
        description="Actions generated from assessment gaps and risks, prioritised transparently. Every action shows why it received its priority."
      />

      <FilterBar search={search} onSearch={setSearch} placeholder="Search actions…" chips={CHIPS} active={chip} onChipSelect={setChip} />

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid gap-3 lg:grid-cols-3">
            {PHASES.map((phase) => {
              const items = byPhase(phase.id);
              return (
                <div key={phase.id}>
                  <div className="mb-2 flex items-center justify-between px-1">
                    <h3 className="text-sm font-semibold">{phase.label}</h3>
                    <Badge tone="neutral">{items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className="w-full rounded-lg border bg-card p-3 text-left shadow-sm transition-colors hover:border-accent/50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">{a.title}</p>
                          <StatusBadge def={PRIORITY[priorityFromScore(priorityScore(a))]} />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{DOMAIN_MAP[a.domainId].shortName}</span>
                          <StatusBadge def={ACTION_STATUS[a.status]} />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{a.owner ?? "Unassigned"}</span>
                          <span className={cn(a.status !== "done" && isOverdue(a.targetDate) && "font-medium text-destructive")}>{fmtDate(a.targetDate)}</span>
                        </div>
                      </button>
                    ))}
                    {items.length === 0 && <p className="px-1 text-xs text-muted-foreground">No actions.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <DataTable columns={columns} rows={[...filtered].sort((a, b) => priorityScore(b) - priorityScore(a))} rowKey={(a) => a.id} onRowClick={setSelected} />
        </TabsContent>
      </Tabs>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.title} description={`${selected.id} · ${DOMAIN_MAP[selected.domainId].name}`}>
            <p className="text-sm text-muted-foreground">{selected.description}</p>

            <SectionLabel>Why this priority</SectionLabel>
            <div className="rounded-md border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Priority score</span>
                <Badge tone={PRIORITY[priorityFromScore(priorityScore(selected))].tone}>
                  {priorityScore(selected)} / 100 · {PRIORITY[priorityFromScore(priorityScore(selected))].label}
                </Badge>
              </div>
              <div className="space-y-2">
                <Factor label={`Residual risk (×${PRIORITISATION_WEIGHTS.residualRisk})`} value={selected.scoring.residualRisk} />
                <Factor label={`Gap severity (×${PRIORITISATION_WEIGHTS.gapSeverity})`} value={selected.scoring.gapSeverity} />
                <Factor label={`Regulatory urgency (×${PRIORITISATION_WEIGHTS.regulatoryUrgency})`} value={selected.scoring.regulatoryUrgency} />
                <Factor label={`Dependency value (×${PRIORITISATION_WEIGHTS.dependencyValue})`} value={selected.scoring.dependencyValue} />
                <Factor label={`Strategic value (×${PRIORITISATION_WEIGHTS.strategicValue})`} value={selected.scoring.strategicValue} />
                <Factor label={`Effort (lower = better) (×${PRIORITISATION_WEIGHTS.effortScore})`} value={selected.scoring.effortScore} />
              </div>
            </div>

            <SectionLabel>Details</SectionLabel>
            <FieldGrid>
              <Field label="Phase">{titleCase(selected.phase)}</Field>
              <Field label="Owner">{selected.owner ?? "Unassigned"}</Field>
              <Field label="Effort">{selected.effort}</Field>
              <Field label="Estimated cost">{selected.estimatedCost}</Field>
              <Field label="Target date">{fmtDate(selected.targetDate)}</Field>
              <Field label="Dependencies">{selected.dependencyIds.join(", ") || "None"}</Field>
              <Field label="Risk reduced">{selected.riskReduced ?? "—"}</Field>
              <Field label="Linked control">{selected.controlId ?? "—"}</Field>
              <Field label="Evidence required">{selected.evidenceRequired || "—"}</Field>
              <Field label="Success criteria">{selected.successCriteria}</Field>
            </FieldGrid>

            <SectionLabel>Update status</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FLOW.map((st) => (
                <Button
                  key={st}
                  size="sm"
                  variant={selected.status === st ? "default" : "outline"}
                  onClick={() => {
                    updateAction(selected.id, { status: st });
                    log({ actor: "You", action: "action.status.change", entity: "Action", entityId: selected.id, detail: `Status → ${ACTION_STATUS[st].label}` });
                    setSelected({ ...selected, status: st });
                  }}
                >
                  {ACTION_STATUS[st].label}
                </Button>
              ))}
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}

function Factor({ label, value }: { label: string; value: number }) {
  return <ScoreMeter label={label} value={(value / 5) * 100} suffix={`  ${value}/5`} tone="accent" />;
}
