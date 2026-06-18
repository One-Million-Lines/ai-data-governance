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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOMAIN_MAP, FRAMEWORK_MAP } from "@/data/domains";
import { CONTROL_STATUS } from "@/lib/labels";
import { fmtDate } from "@/lib/format";
import type { Control, ControlStatus } from "@/types";

const LAYER_CHIPS = [
  { value: "all", label: "All" },
  { value: "data", label: "Data Governance" },
  { value: "ai", label: "AI Governance" },
  { value: "genai", label: "GenAI" },
  { value: "required", label: "Required" },
];

const STATUS_OPTIONS: ControlStatus[] = [
  "operating",
  "implemented",
  "in_progress",
  "needs_review",
  "planned",
  "not_implemented",
];

export function ControlsPage() {
  const { controls, updateControl, log } = useGovernanceStore();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [selected, setSelected] = useState<Control | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return controls.filter((c) => {
      if (!c.active && chip !== "all") return false;
      if (chip === "data" && !c.dataGovernance) return false;
      if (chip === "ai" && !c.aiGovernance) return false;
      if (chip === "genai" && !c.genAi) return false;
      if (chip === "required" && !c.required) return false;
      if (domainFilter !== "all" && c.domainId !== domainFilter) return false;
      if (term && !(`${c.id} ${c.title} ${c.objective}`.toLowerCase().includes(term))) return false;
      return true;
    });
  }, [controls, search, chip, domainFilter]);

  const columns: Column<Control>[] = [
    { key: "id", header: "ID", render: (c) => <span className="font-mono text-xs text-muted-foreground">{c.id}</span>, width: "84px" },
    { key: "title", header: "Control", render: (c) => (
      <div>
        <p className="font-medium text-foreground">{c.title}</p>
        <p className="text-xs text-muted-foreground">{DOMAIN_MAP[c.domainId].shortName}</p>
      </div>
    ) },
    { key: "tags", header: "Scope", render: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.dataGovernance && <Badge tone="info">Data</Badge>}
        {c.aiGovernance && <Badge tone="teal">AI</Badge>}
        {c.genAi && <Badge tone="warning">GenAI</Badge>}
        {!c.required && <Badge tone="neutral">Recommended</Badge>}
      </div>
    ) },
    { key: "status", header: "Status", render: (c) => <StatusBadge def={CONTROL_STATUS[c.status]} />, width: "130px" },
    { key: "owner", header: "Owner", render: (c) => <span className="text-xs">{c.owner}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Control Library"
        description={`${controls.filter((c) => c.active).length} original controls mapped to public frameworks. Edit status, ownership and frequency; controls version on change.`}
      />

      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search controls…"
        chips={LAYER_CHIPS}
        active={chip}
        onChipSelect={setChip}
      >
        <Select value={domainFilter} onValueChange={setDomainFilter}>
          <SelectTrigger className="h-9 w-[200px] text-xs">
            <SelectValue placeholder="All domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All domains</SelectItem>
            {Object.values(DOMAIN_MAP).map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.index}. {d.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      <p className="mb-2 text-xs text-muted-foreground">{filtered.length} controls</p>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(c) => c.id}
        onRowClick={setSelected}
        emptyTitle="No controls match"
        emptyDescription="Adjust your filters or search."
      />

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.title} description={`${selected.id} · ${DOMAIN_MAP[selected.domainId].name}`}>
            <ControlDetail
              control={selected}
              onStatus={(status) => {
                updateControl(selected.id, { status, lastReview: "2026-06-18" });
                log({ actor: "You", action: "control.status.change", entity: "Control", entityId: selected.id, detail: `Status → ${CONTROL_STATUS[status].label}` });
                setSelected({ ...selected, status, version: selected.version + 1 });
              }}
            />
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}

function ControlDetail({ control, onStatus }: { control: Control; onStatus: (s: ControlStatus) => void }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge def={CONTROL_STATUS[control.status]} />
        <Badge tone="neutral">v{control.version}</Badge>
        {control.dataGovernance && <Badge tone="info">Data</Badge>}
        {control.aiGovernance && <Badge tone="teal">AI</Badge>}
        {control.genAi && <Badge tone="warning">GenAI</Badge>}
        <Badge tone={control.required ? "danger" : "neutral"}>{control.required ? "Required" : "Recommended"}</Badge>
      </div>

      <SectionLabel>Objective</SectionLabel>
      <p className="text-sm">{control.objective}</p>

      <SectionLabel>Control statement</SectionLabel>
      <p className="text-sm">{control.statement}</p>

      <SectionLabel>Rationale</SectionLabel>
      <p className="text-sm text-muted-foreground">{control.rationale}</p>

      <SectionLabel>Implementation</SectionLabel>
      <FieldGrid>
        <Field label="Minimum">{control.minimumImplementation}</Field>
        <Field label="Advanced">{control.advancedImplementation}</Field>
        <Field label="Owner">{control.owner}</Field>
        <Field label="Reviewer">{control.reviewer}</Field>
        <Field label="Frequency">{control.frequency}</Field>
        <Field label="Applicability">{control.applicability.join(", ")}</Field>
      </FieldGrid>

      <SectionLabel>Evidence &amp; testing</SectionLabel>
      <Field label="Evidence examples">
        <ul className="list-disc pl-4">
          {control.evidenceExamples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Field>
      <Field label="Testing procedure">{control.testingProcedure}</Field>

      <SectionLabel>Framework mappings</SectionLabel>
      {control.frameworkMappings.length === 0 ? (
        <p className="text-xs text-muted-foreground">No external mappings.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {control.frameworkMappings.map((m) => (
            <Badge key={m.frameworkId + m.reference} tone="neutral">
              {FRAMEWORK_MAP[m.frameworkId]?.name ?? m.frameworkId}: {m.reference}
            </Badge>
          ))}
        </div>
      )}

      <SectionLabel>Update status</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((st) => (
          <Button
            key={st}
            size="sm"
            variant={control.status === st ? "default" : "outline"}
            onClick={() => onStatus(st)}
          >
            {CONTROL_STATUS[st].label}
          </Button>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Last reviewed {fmtDate(control.lastReview)}. Status changes are recorded in the audit trail and increment the control version.
      </p>
    </div>
  );
}
