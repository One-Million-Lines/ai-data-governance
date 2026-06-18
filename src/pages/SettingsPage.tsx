import { useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fmtDate, titleCase } from "@/lib/format";

const ROLES = [
  "Workspace Owner", "Framework Administrator", "Governance Lead", "Data Owner", "Data Steward",
  "AI System Owner", "Model Validator", "DPO / Privacy Reviewer", "Security Reviewer", "Legal Reviewer",
  "Risk Reviewer", "Auditor", "Contributor", "Read-only Viewer",
];

const PERMISSIONS = [
  "Organisation-level access", "Business-unit access", "Domain-level access", "Record ownership",
  "Confidential evidence access", "Audit read-only mode",
];

export function SettingsPage() {
  const { frameworkVersions, activeVersionId, createFrameworkVersion, resetDemo } = useGovernanceStore();
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");

  const handleCreate = () => {
    if (!label.trim()) return;
    createFrameworkVersion(label.trim(), note.trim() || "New framework version snapshot.");
    setLabel("");
    setNote("");
  };

  return (
    <div>
      <PageHeader title="Settings" description="Roles and permissions, framework versioning and workspace controls." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Framework versions</CardTitle>
            <CardDescription>Create a new version without overwriting previous ones — history is preserved.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {frameworkVersions.map((v) => (
                <div key={v.id} className="rounded-md border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{v.label}</p>
                    <Badge tone={v.id === activeVersionId ? "success" : "neutral"}>{titleCase(v.status)}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Created {fmtDate(v.createdAt)} — {v.note}</p>
                  {v.snapshot && (
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                      <Badge tone="neutral">Maturity {v.snapshot.maturityIndex.toFixed(1)}</Badge>
                      <Badge tone="neutral">Coverage {v.snapshot.controlCoverage}%</Badge>
                      <Badge tone="neutral">Evidence {v.snapshot.evidenceConfidence}%</Badge>
                      <Badge tone="neutral">{v.snapshot.openRisks} risks</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 rounded-md border border-dashed p-3">
              <p className="text-xs font-medium">Create new version</p>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. v2.1 — Q3 reassessment" />
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" />
              <Button size="sm" onClick={handleCreate} disabled={!label.trim()}>Create version</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles &amp; permissions</CardTitle>
              <CardDescription>14 governance roles with scoped access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r) => <Badge key={r} tone="neutral">{r}</Badge>)}
              </div>
              <p className="mt-3 text-xs font-medium text-muted-foreground">Permission scopes</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PERMISSIONS.map((p) => <Badge key={p} tone="info">{p}</Badge>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Demo data &amp; local state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                This demo runs entirely in your browser with seeded Northstar Group data. No Supabase
                credentials are required. Resetting restores the original seeded state and clears local edits.
              </p>
              <Button size="sm" variant="outline" onClick={() => { if (confirm("Reset the demo to seeded data? Local edits will be lost.")) resetDemo(); }}>
                Reset demo data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
