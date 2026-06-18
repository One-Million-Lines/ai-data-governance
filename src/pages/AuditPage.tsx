import { useState } from "react";
import { Check, X } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { SEVERITY } from "@/lib/labels";
import { DOMAIN_MAP } from "@/data/domains";
import { fmtDate, fmtDateTime, titleCase } from "@/lib/format";
import type { Tone } from "@/lib/labels";
import type { AuditFinding } from "@/types";

const FINDING_STATUS: Record<AuditFinding["status"], Tone> = {
  open: "danger",
  remediating: "warning",
  closed: "success",
};

export function AuditPage() {
  const store = useGovernanceStore();
  const { auditFindings, auditLog, controls, evidence } = store;

  const open = auditFindings.filter((f) => f.status !== "closed");

  // Audit-readiness checks (spec §26.18)
  const checks = [
    { label: "Active framework version with snapshot", ok: !!store.frameworkVersions.find((v) => v.id === store.activeVersionId) },
    { label: "No critical findings open", ok: !auditFindings.some((f) => f.severity === "critical" && f.status !== "closed") },
    { label: "Priority controls have evidence", ok: controls.filter((c) => c.required).filter((c) => evidence.some((e) => e.linkedControlIds.includes(c.id))).length > 8 },
    { label: "No expired exceptions", ok: !store.exceptions.some((e) => e.renewalStatus === "expired") },
    { label: "High-risk AI owned & assessed", ok: !store.aiSystems.some((a) => (a.riskTier === "high") && a.lifecycleStage === "production" && (!a.owner || a.validationStatus !== "validated")) },
    { label: "Immutable audit trail maintained", ok: auditLog.length > 0 },
  ];
  const readiness = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  const findingCols: Column<AuditFinding>[] = [
    { key: "title", header: "Finding", render: (f) => (
      <div>
        <p className="font-medium">{f.title}</p>
        <p className="text-xs text-muted-foreground">{DOMAIN_MAP[f.domainId].shortName} · {titleCase(f.source)}</p>
      </div>
    ) },
    { key: "sev", header: "Severity", render: (f) => <StatusBadge def={SEVERITY[f.severity]} /> },
    { key: "status", header: "Status", render: (f) => <Badge tone={FINDING_STATUS[f.status]}>{titleCase(f.status)}</Badge> },
    { key: "owner", header: "Owner", render: (f) => <span className="text-xs">{f.owner ?? "—"}</span> },
    { key: "due", header: "Due", render: (f) => <span className="text-xs">{fmtDate(f.dueDate)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Audit & Assurance"
        description="Audit readiness, findings tracked to remediation, and the immutable audit trail of governance changes."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Audit readiness" value={`${readiness}%`} tone={readiness >= 70 ? "success" : "warning"} />
        <StatCard label="Open findings" value={open.length} tone={open.length ? "warning" : "success"} />
        <StatCard label="Critical findings" value={auditFindings.filter((f) => f.severity === "critical" && f.status !== "closed").length} tone="danger" />
        <StatCard label="Audit-log entries" value={auditLog.length} />
      </div>

      <Tabs defaultValue="readiness">
        <TabsList>
          <TabsTrigger value="readiness">Readiness</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="trail">Audit trail</TabsTrigger>
        </TabsList>

        <TabsContent value="readiness">
          <Card>
            <CardHeader>
              <CardTitle>Audit-readiness checks</CardTitle>
              <CardDescription>Pre-conditions for an internal or external audit</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-sm">
                    {c.ok ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
                    <span className={c.ok ? "" : "text-destructive"}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings">
          <DataTable
            columns={findingCols}
            rows={auditFindings}
            rowKey={(f) => f.id}
          />
        </TabsContent>

        <TabsContent value="trail">
          <Card>
            <CardHeader>
              <CardTitle>Immutable audit trail</CardTitle>
              <CardDescription>Changes, approvals, decisions and reviews are recorded and never deleted (spec §21)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {auditLog.map((l) => (
                  <li key={l.id} className="flex items-start gap-3 border-b pb-2 text-sm last:border-0">
                    <span className="w-36 shrink-0 text-xs text-muted-foreground">{fmtDateTime(l.timestamp)}</span>
                    <div className="flex-1">
                      <p>
                        <span className="font-medium">{l.actor}</span>{" "}
                        <span className="text-muted-foreground">· {l.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{l.entity} {l.entityId} — {l.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
