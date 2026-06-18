import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { StatCard } from "@/components/common/StatCard";
import { CLASSIFICATION, PRIORITY } from "@/lib/labels";
import { DOMAIN_MAP } from "@/data/domains";
import { fmtDate } from "@/lib/format";
import type { DataAsset } from "@/types";

const CHIPS = [
  { value: "all", label: "All" },
  { value: "personal", label: "Personal data" },
  { value: "special", label: "Special category" },
  { value: "critical", label: "Business-critical" },
  { value: "noowner", label: "Missing owner" },
];

const QUALITY_TONE: Record<DataAsset["qualityStatus"], "success" | "warning" | "danger" | "neutral"> = {
  good: "success",
  fair: "warning",
  poor: "danger",
  unknown: "neutral",
};

export function DataInventoryPage() {
  const { dataAssets, aiSystems, addDataAsset, log } = useGovernanceStore();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("all");
  const [selected, setSelected] = useState<DataAsset | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return dataAssets.filter((a) => {
      if (chip === "personal" && !a.personalData) return false;
      if (chip === "special" && !a.specialCategory) return false;
      if (chip === "critical" && a.criticality !== "critical") return false;
      if (chip === "noowner" && a.owner) return false;
      if (term && !`${a.name} ${a.system} ${a.source}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [dataAssets, search, chip]);

  const personalCount = dataAssets.filter((a) => a.personalData).length;
  const missingOwner = dataAssets.filter((a) => !a.owner).length;

  const columns: Column<DataAsset>[] = [
    { key: "name", header: "Asset", render: (a) => (
      <div>
        <p className="font-medium">{a.name}</p>
        <p className="text-xs text-muted-foreground">{a.system} · {a.location}</p>
      </div>
    ) },
    { key: "class", header: "Classification", render: (a) => <StatusBadge def={CLASSIFICATION[a.classification]} /> },
    { key: "personal", header: "Personal", render: (a) => (a.personalData ? <Badge tone={a.specialCategory ? "danger" : "warning"}>{a.specialCategory ? "Special" : "Personal"}</Badge> : <span className="text-xs text-muted-foreground">No</span>) },
    { key: "crit", header: "Criticality", render: (a) => <StatusBadge def={PRIORITY[a.criticality]} /> },
    { key: "quality", header: "Quality", render: (a) => <Badge tone={QUALITY_TONE[a.qualityStatus]}>{a.qualityStatus}</Badge> },
    { key: "owner", header: "Owner", render: (a) => (a.owner ? <span className="text-xs">{a.owner}</span> : <Badge tone="danger">Unassigned</Badge>) },
  ];

  const addExample = () => {
    const id = `DA-${String(dataAssets.length + 1).padStart(3, "0")}`;
    const asset: DataAsset = {
      id, name: "New Data Asset", description: "Newly registered asset pending classification.", domainId: "d3",
      owner: undefined, source: "—", system: "—", location: "EU", classification: "internal", personalData: false,
      specialCategory: false, criticality: "medium", qualityStatus: "unknown", retention: "TBD", residency: "EU",
      consumers: [], linkedAiSystemIds: [], linkedRiskIds: [], linkedControlIds: [], lastReview: undefined,
    };
    addDataAsset(asset);
    log({ actor: "You", action: "asset.create", entity: "DataAsset", entityId: id, detail: "Created data asset" });
    setSelected(asset);
  };

  return (
    <div>
      <PageHeader
        title="Data Inventory"
        description="Connected register of data assets with owners, classification, quality and links to AI systems, risks and controls."
        actions={<Button size="sm" onClick={addExample}><Plus className="h-4 w-4" />Add asset</Button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Data assets" value={dataAssets.length} />
        <StatCard label="Hold personal data" value={personalCount} tone="warning" />
        <StatCard label="Missing owner" value={missingOwner} tone={missingOwner ? "danger" : "success"} />
      </div>

      <FilterBar search={search} onSearch={setSearch} placeholder="Search assets…" chips={CHIPS} active={chip} onChipSelect={setChip} />

      <DataTable columns={columns} rows={filtered} rowKey={(a) => a.id} onRowClick={setSelected} emptyTitle="No assets match" />

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.name} description={`${selected.id} · ${DOMAIN_MAP[selected.domainId].shortName}`}>
            <p className="text-sm text-muted-foreground">{selected.description}</p>
            <SectionLabel>Stewardship</SectionLabel>
            <FieldGrid>
              <Field label="Owner">{selected.owner ?? <Badge tone="danger">Unassigned</Badge>}</Field>
              <Field label="Steward">{selected.steward ?? "—"}</Field>
              <Field label="Custodian">{selected.custodian ?? "—"}</Field>
              <Field label="Source / system">{selected.source} · {selected.system}</Field>
            </FieldGrid>
            <SectionLabel>Classification &amp; protection</SectionLabel>
            <FieldGrid>
              <Field label="Classification"><StatusBadge def={CLASSIFICATION[selected.classification]} /></Field>
              <Field label="Criticality"><StatusBadge def={PRIORITY[selected.criticality]} /></Field>
              <Field label="Personal data">{selected.personalData ? (selected.specialCategory ? "Yes — special category" : "Yes") : "No"}</Field>
              <Field label="Lawful purpose">{selected.lawfulPurpose ?? "—"}</Field>
              <Field label="Residency">{selected.residency}</Field>
              <Field label="Retention">{selected.retention}</Field>
              <Field label="Quality">{selected.qualityStatus}</Field>
              <Field label="Last review">{fmtDate(selected.lastReview)}</Field>
            </FieldGrid>
            <SectionLabel>Connections</SectionLabel>
            <FieldGrid>
              <Field label="Linked AI systems">
                {selected.linkedAiSystemIds.length
                  ? selected.linkedAiSystemIds.map((id) => aiSystems.find((s) => s.id === id)?.name ?? id).join(", ")
                  : "None"}
              </Field>
              <Field label="Consumers">{selected.consumers.join(", ") || "—"}</Field>
              <Field label="Linked risks">{selected.linkedRiskIds.join(", ") || "None"}</Field>
              <Field label="Linked controls">{selected.linkedControlIds.join(", ") || "None"}</Field>
            </FieldGrid>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
