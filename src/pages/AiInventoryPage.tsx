import { useMemo, useState } from "react";
import { Plus, ShieldAlert, Check, X } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { RISK_TIER, REG_CLASS, GATE_STATUS } from "@/lib/labels";
import { titleCase, fmtDate } from "@/lib/format";
import type { AiSystem, GateStatus } from "@/types";

const CHIPS = [
  { value: "all", label: "All" },
  { value: "high", label: "High risk" },
  { value: "genai", label: "GenAI" },
  { value: "agent", label: "Agents" },
  { value: "noowner", label: "Missing owner" },
];

const GATE_FLOW: GateStatus[] = [
  "not_started",
  "in_review",
  "changes_requested",
  "approved_with_conditions",
  "approved",
];

/** Operational-readiness checks for high-risk AI (spec §27). */
function readiness(a: AiSystem) {
  return [
    { label: "Accountable owner assigned", ok: !!a.owner },
    { label: "Assessed / validated", ok: a.validationStatus === "validated" },
    { label: "Approved for deployment", ok: a.approvalGate === "approved" || a.approvalGate === "approved_with_conditions" },
    { label: "Monitoring in place", ok: a.monitoringStatus !== "none" },
  ];
}

export function AiInventoryPage() {
  const { aiSystems, vendors, updateAiSystem, addAiSystem, log } = useGovernanceStore();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("all");
  const [selected, setSelected] = useState<AiSystem | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return aiSystems.filter((a) => {
      if (chip === "high" && a.riskTier !== "high" && a.riskTier !== "unacceptable") return false;
      if (chip === "genai" && !a.genAi) return false;
      if (chip === "agent" && !a.isAgent) return false;
      if (chip === "noowner" && a.owner) return false;
      if (term && !`${a.name} ${a.provider} ${a.model}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [aiSystems, search, chip]);

  const highRisk = aiSystems.filter((a) => a.riskTier === "high" || a.riskTier === "unacceptable");
  const notReady = highRisk.filter((a) => readiness(a).some((r) => !r.ok) && a.lifecycleStage === "production");

  const columns: Column<AiSystem>[] = [
    { key: "name", header: "AI system", render: (a) => (
      <div>
        <p className="font-medium">{a.name}</p>
        <p className="text-xs text-muted-foreground">{a.provider} · {a.model}</p>
      </div>
    ) },
    { key: "tier", header: "Risk tier", render: (a) => <StatusBadge def={RISK_TIER[a.riskTier]} /> },
    { key: "reg", header: "Regulatory", render: (a) => <StatusBadge def={REG_CLASS[a.regulatoryClass]} /> },
    { key: "stage", header: "Lifecycle", render: (a) => <span className="text-xs">{titleCase(a.lifecycleStage)}</span> },
    { key: "gate", header: "Gate", render: (a) => <StatusBadge def={GATE_STATUS[a.approvalGate]} /> },
    { key: "owner", header: "Owner", render: (a) => (a.owner ? <span className="text-xs">{a.owner}</span> : <Badge tone="danger">Unassigned</Badge>) },
  ];

  const addUseCase = () => {
    const id = `AI-${String(aiSystems.length + 1).padStart(3, "0")}`;
    const sys: AiSystem = {
      id, name: "New AI Use-Case", description: "Submitted via intake; pending screening and classification.",
      owner: undefined, provider: "TBD", deployer: "Northstar", model: "TBD", intendedPurpose: "Pending intake details.",
      users: "TBD", affectedPeople: "TBD", lifecycleStage: "intake", riskTier: "limited", regulatoryClass: "unclassified",
      regulatoryAssumptions: "Not yet assessed — requires screening and legal review.", datasetIds: [], integrations: [],
      autonomy: "assistive", humanOversight: "TBD", validationStatus: "not_started", monitoringStatus: "none",
      incidentIds: [], approvalGate: "not_started", limitations: "TBD", retired: false, genAi: false, isAgent: false,
    };
    addAiSystem(sys);
    log({ actor: "You", action: "ai.intake", entity: "AiSystem", entityId: id, detail: "Submitted AI use-case intake" });
    setSelected(sys);
  };

  return (
    <div>
      <PageHeader
        title="AI Inventory"
        description="Every AI system from intake to retirement. AI references existing data assets and vendors rather than duplicating data controls."
        actions={<Button size="sm" onClick={addUseCase}><Plus className="h-4 w-4" />Submit use-case</Button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="AI systems" value={aiSystems.length} />
        <StatCard label="High-risk" value={highRisk.length} tone="danger" />
        <StatCard label="GenAI / agents" value={aiSystems.filter((a) => a.genAi || a.isAgent).length} tone="warning" />
        <StatCard label="High-risk not ready" value={notReady.length} tone={notReady.length ? "danger" : "success"} />
      </div>

      {notReady.length > 0 && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {notReady.length} high-risk AI system(s) are in production without complete ownership,
            validation, approval or monitoring. High-risk AI must not operate until these are in place.
          </span>
        </div>
      )}

      <FilterBar search={search} onSearch={setSearch} placeholder="Search AI systems…" chips={CHIPS} active={chip} onChipSelect={setChip} />

      <DataTable columns={columns} rows={filtered} rowKey={(a) => a.id} onRowClick={setSelected} emptyTitle="No AI systems match" />

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.name} description={`${selected.id} · ${titleCase(selected.lifecycleStage)}`}>
            <p className="text-sm text-muted-foreground">{selected.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge def={RISK_TIER[selected.riskTier]} />
              <StatusBadge def={REG_CLASS[selected.regulatoryClass]} />
              {selected.genAi && <Badge tone="warning">GenAI</Badge>}
              {selected.isAgent && <Badge tone="danger">Autonomous agent</Badge>}
            </div>

            <SectionLabel>Operational readiness</SectionLabel>
            <ul className="space-y-1.5">
              {readiness(selected).map((r) => (
                <li key={r.label} className="flex items-center gap-2 text-sm">
                  {r.ok ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
                  <span className={r.ok ? "" : "text-destructive"}>{r.label}</span>
                </li>
              ))}
            </ul>

            <SectionLabel>Classification</SectionLabel>
            <FieldGrid>
              <Field label="Enterprise risk tier"><StatusBadge def={RISK_TIER[selected.riskTier]} /></Field>
              <Field label="Regulatory class"><StatusBadge def={REG_CLASS[selected.regulatoryClass]} /></Field>
            </FieldGrid>
            <div className="mt-1 rounded-md border border-warning/30 bg-warning/5 p-2.5 text-xs text-muted-foreground">
              <span className="font-medium text-warning-foreground">Assumptions: </span>
              {selected.regulatoryAssumptions}
            </div>

            <SectionLabel>Ownership &amp; oversight</SectionLabel>
            <FieldGrid>
              <Field label="Owner">{selected.owner ?? <Badge tone="danger">Unassigned</Badge>}</Field>
              <Field label="Provider">{selected.provider}</Field>
              <Field label="Deployer">{selected.deployer}</Field>
              <Field label="Model">{selected.model}</Field>
              <Field label="Autonomy">{titleCase(selected.autonomy)}</Field>
              <Field label="Human oversight">{selected.humanOversight}</Field>
              <Field label="Validation">{titleCase(selected.validationStatus)}</Field>
              <Field label="Monitoring">{titleCase(selected.monitoringStatus)}</Field>
              <Field label="Vendor">{selected.vendorId ? vendors.find((v) => v.id === selected.vendorId)?.name : "—"}</Field>
              <Field label="Next review">{fmtDate(selected.nextReview)}</Field>
            </FieldGrid>

            <SectionLabel>Purpose &amp; impact</SectionLabel>
            <FieldGrid>
              <Field label="Intended purpose">{selected.intendedPurpose}</Field>
              <Field label="Users">{selected.users}</Field>
              <Field label="Affected people">{selected.affectedPeople}</Field>
              <Field label="Datasets">{selected.datasetIds.join(", ") || "—"}</Field>
              <Field label="Limitations">{selected.limitations}</Field>
            </FieldGrid>

            {selected.agentGuardrails && (
              <>
                <SectionLabel>Agent guardrails</SectionLabel>
                <FieldGrid>
                  <Field label="Tools">{selected.agentGuardrails.tools.join(", ")}</Field>
                  <Field label="Data access">{selected.agentGuardrails.dataAccess.join(", ")}</Field>
                  <Field label="Reversible actions">{selected.agentGuardrails.reversibleActions ? "Yes" : "No"}</Field>
                  <Field label="Max impact">{selected.agentGuardrails.maxImpact}</Field>
                  <Field label="Approval threshold">{selected.agentGuardrails.approvalThreshold}</Field>
                  <Field label="Rate limits">{selected.agentGuardrails.rateLimits}</Field>
                  <Field label="Kill-switch">{selected.agentGuardrails.killSwitch ? <Badge tone="success">In place</Badge> : <Badge tone="danger">Missing</Badge>}</Field>
                </FieldGrid>
              </>
            )}

            <SectionLabel>Approval gate</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {GATE_FLOW.map((g) => (
                <Button
                  key={g}
                  size="sm"
                  variant={selected.approvalGate === g ? "default" : "outline"}
                  onClick={() => {
                    updateAiSystem(selected.id, { approvalGate: g });
                    log({ actor: "You", action: "ai.gate.change", entity: "AiSystem", entityId: selected.id, detail: `Gate → ${GATE_STATUS[g].label}` });
                    setSelected({ ...selected, approvalGate: g });
                  }}
                >
                  {GATE_STATUS[g].label}
                </Button>
              ))}
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
