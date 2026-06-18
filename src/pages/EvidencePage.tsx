import { useMemo, useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel, ScoreMeter } from "@/components/common/Field";
import { titleCase, fmtDate, isOverdue } from "@/lib/format";
import type { Tone } from "@/lib/labels";
import type { Evidence } from "@/types";

const CHIPS = [
  { value: "all", label: "All" },
  { value: "verified", label: "Verified" },
  { value: "needs", label: "Needs update" },
  { value: "weak", label: "Weak / draft" },
  { value: "expired", label: "Expired" },
];

const RESULT_TONE: Record<Evidence["reviewResult"], Tone> = {
  verified: "success",
  needs_update: "warning",
  rejected: "danger",
  not_reviewed: "neutral",
};

// Per-evidence confidence indicator (relevance + recency + reviewer + independence).
function confidence(e: Evidence): number {
  let s = 40;
  if (e.reviewResult === "verified") s += 25;
  else if (e.reviewResult === "needs_update") s += 5;
  else if (e.reviewResult === "rejected") s -= 20;
  if (e.independent) s += 15;
  if (e.validUntil && !isOverdue(e.validUntil)) s += 15;
  else if (e.validUntil) s -= 10;
  if (e.version === 0) s -= 15;
  return Math.max(0, Math.min(100, s));
}

export function EvidencePage() {
  const { evidence, controls } = useGovernanceStore();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("all");
  const [selected, setSelected] = useState<Evidence | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return evidence.filter((e) => {
      if (chip === "verified" && e.reviewResult !== "verified") return false;
      if (chip === "needs" && e.reviewResult !== "needs_update") return false;
      if (chip === "weak" && !(e.version === 0 || e.reviewResult === "rejected" || e.reviewResult === "not_reviewed")) return false;
      if (chip === "expired" && !(e.validUntil && isOverdue(e.validUntil))) return false;
      if (term && !e.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [evidence, search, chip]);

  const verified = evidence.filter((e) => e.reviewResult === "verified").length;
  const avgConfidence = Math.round(evidence.reduce((a, e) => a + confidence(e), 0) / evidence.length);

  const columns: Column<Evidence>[] = [
    { key: "title", header: "Evidence", render: (e) => (
      <div>
        <p className="font-medium">{e.title}</p>
        <p className="text-xs text-muted-foreground">{titleCase(e.type)} · v{e.version}</p>
      </div>
    ) },
    { key: "controls", header: "Linked controls", render: (e) => <span className="text-xs">{e.linkedControlIds.join(", ") || "—"}</span> },
    { key: "result", header: "Review", render: (e) => <Badge tone={RESULT_TONE[e.reviewResult]}>{titleCase(e.reviewResult)}</Badge> },
    { key: "valid", header: "Valid until", render: (e) => <span className={e.validUntil && isOverdue(e.validUntil) ? "text-xs font-medium text-destructive" : "text-xs"}>{fmtDate(e.validUntil)}</span> },
    { key: "conf", header: "Confidence", render: (e) => <span className="text-xs tabular-nums">{confidence(e)}%</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Evidence Register"
        description="Evidence supporting controls. Evidence confidence is calculated from relevance, recency, reviewer status and independence — separate from control implementation."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Evidence records" value={evidence.length} />
        <StatCard label="Independently verified" value={verified} tone="success" />
        <StatCard label="Average confidence" value={`${avgConfidence}%`} tone={avgConfidence < 50 ? "warning" : "accent"} />
      </div>

      <FilterBar search={search} onSearch={setSearch} placeholder="Search evidence…" chips={CHIPS} active={chip} onChipSelect={setChip} />

      <DataTable columns={columns} rows={filtered} rowKey={(e) => e.id} onRowClick={setSelected} />

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.title} description={`${titleCase(selected.type)} · ${selected.id}`}>
            <div className="mb-3">
              <ScoreMeter label="Evidence confidence" value={confidence(selected)} tone="accent" hint="Relevance · recency · reviewer · independence" />
            </div>
            <SectionLabel>Details</SectionLabel>
            <FieldGrid>
              <Field label="Owner">{selected.owner ?? "—"}</Field>
              <Field label="Reviewer">{selected.reviewer ?? "Not reviewed"}</Field>
              <Field label="Review result">{titleCase(selected.reviewResult)}</Field>
              <Field label="Independent">{selected.independent ? "Yes" : "No"}</Field>
              <Field label="Collected">{fmtDate(selected.collectionDate)}</Field>
              <Field label="Valid until">{fmtDate(selected.validUntil)}</Field>
              <Field label="Confidentiality">{titleCase(selected.confidentiality)}</Field>
              <Field label="Version">v{selected.version}</Field>
              <Field label="Source">{selected.source}</Field>
            </FieldGrid>
            <SectionLabel>Linked items</SectionLabel>
            <FieldGrid>
              <Field label="Controls">{selected.linkedControlIds.map((id) => controls.find((c) => c.id === id)?.title ?? id).join("; ") || "—"}</Field>
              <Field label="Data asset">{selected.linkedAssetId ?? "—"}</Field>
              <Field label="AI system">{selected.linkedAiSystemId ?? "—"}</Field>
            </FieldGrid>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
