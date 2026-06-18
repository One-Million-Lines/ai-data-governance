import { useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { FRAMEWORKS } from "@/data/domains";
import { CONTROLS } from "@/data/controls";
import { fmtDate, titleCase } from "@/lib/format";
import type { Tone } from "@/lib/labels";
import type { FrameworkReference } from "@/types";

const KIND_TONE: Record<FrameworkReference["kind"], Tone> = {
  legal_requirement: "danger",
  regulatory_guidance: "warning",
  voluntary_framework: "info",
  internal_policy: "teal",
  recommended_practice: "neutral",
};

const KIND_LABEL: Record<FrameworkReference["kind"], string> = {
  legal_requirement: "Legal requirement",
  regulatory_guidance: "Regulatory guidance",
  voluntary_framework: "Voluntary framework",
  internal_policy: "Internal policy",
  recommended_practice: "Recommended practice",
};

export function FrameworkLibraryPage() {
  const [selected, setSelected] = useState<FrameworkReference | null>(null);

  const mappedCount = (id: string) => CONTROLS.filter((c) => c.frameworkMappings.some((m) => m.frameworkId === id)).length;

  return (
    <div>
      <PageHeader
        title="Framework Library"
        description="Reference packs mapped to internal controls. We clearly distinguish legal requirements, regulatory guidance, voluntary frameworks and recommended practice. Standards are not reproduced verbatim."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FRAMEWORKS.map((f) => (
          <Card key={f.id} className="cursor-pointer transition-colors hover:border-accent/50" onClick={() => setSelected(f)}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>{f.name}</CardTitle>
                <Badge tone={KIND_TONE[f.kind]}>{KIND_LABEL[f.kind]}</Badge>
              </div>
              <CardDescription>{f.source} · {f.version} · {f.jurisdiction}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{f.summary}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <Badge tone="neutral">{mappedCount(f.id)} mapped controls</Badge>
                <span className="text-muted-foreground">Reviewed {fmtDate(f.lastReviewed)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground">
        Updating a reference pack does not automatically change the active framework. Proposed mapping
        changes are surfaced for approval before adoption (spec §20).
      </p>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent title={selected.name} description={`${selected.source} · ${selected.version}`}>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge tone={KIND_TONE[selected.kind]}>{KIND_LABEL[selected.kind]}</Badge>
              <Badge tone="neutral">{titleCase(selected.status)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selected.summary}</p>
            <SectionLabel>Details</SectionLabel>
            <FieldGrid>
              <Field label="Jurisdiction">{selected.jurisdiction}</Field>
              <Field label="Effective / published">{fmtDate(selected.effectiveDate)}</Field>
              <Field label="Last reviewed">{fmtDate(selected.lastReviewed)}</Field>
              <Field label="Mapped controls">{mappedCount(selected.id)}</Field>
            </FieldGrid>
            <SectionLabel>Mapped internal controls</SectionLabel>
            <div className="space-y-1">
              {CONTROLS.filter((c) => c.frameworkMappings.some((m) => m.frameworkId === selected.id)).map((c) => {
                const ref = c.frameworkMappings.find((m) => m.frameworkId === selected.id)?.reference;
                return (
                  <div key={c.id} className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-sm">
                    <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                    <span className="flex-1 truncate">{c.title}</span>
                    <Badge tone="neutral">{ref}</Badge>
                  </div>
                );
              })}
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
