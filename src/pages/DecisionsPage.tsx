import { useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { fmtDate, isOverdue, titleCase } from "@/lib/format";
import type { Tone } from "@/lib/labels";
import type { Decision, Exception } from "@/types";

const RENEWAL_TONE: Record<Exception["renewalStatus"], Tone> = {
  active: "info",
  expiring: "warning",
  expired: "danger",
  renewed: "success",
};

export function DecisionsPage() {
  const { decisions, exceptions } = useGovernanceStore();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [exception, setException] = useState<Exception | null>(null);

  const expiredOrExpiring = exceptions.filter((e) => e.renewalStatus === "expired" || e.renewalStatus === "expiring").length;

  const decisionCols: Column<Decision>[] = [
    { key: "title", header: "Decision", render: (d) => <p className="font-medium">{d.title}</p> },
    { key: "maker", header: "Decision maker", render: (d) => <span className="text-xs">{d.decisionMaker}</span> },
    { key: "date", header: "Effective", render: (d) => <span className="text-xs">{fmtDate(d.effectiveDate)}</span> },
    { key: "review", header: "Review", render: (d) => <span className="text-xs">{fmtDate(d.reviewDate)}</span> },
  ];

  const exceptionCols: Column<Exception>[] = [
    { key: "title", header: "Exception", render: (e) => (
      <div>
        <p className="font-medium">{e.title}</p>
        <p className="text-xs text-muted-foreground">{e.subject}</p>
      </div>
    ) },
    { key: "approver", header: "Approver", render: (e) => <span className="text-xs">{e.approver}</span> },
    { key: "expiry", header: "Expiry", render: (e) => <span className={isOverdue(e.expiry) ? "text-xs font-medium text-destructive" : "text-xs"}>{fmtDate(e.expiry)}</span> },
    { key: "status", header: "Status", render: (e) => <Badge tone={RENEWAL_TONE[e.renewalStatus]}>{titleCase(e.renewalStatus)}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Decisions & Exceptions"
        description="Traceable governance decisions and time-bound control/policy exceptions. No exception is permanent — every one has an expiry."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Logged decisions" value={decisions.length} />
        <StatCard label="Active exceptions" value={exceptions.filter((e) => e.renewalStatus === "active").length} />
        <StatCard label="Expired / expiring" value={expiredOrExpiring} tone={expiredOrExpiring ? "danger" : "success"} />
      </div>

      <Tabs defaultValue="decisions">
        <TabsList>
          <TabsTrigger value="decisions">Decision log</TabsTrigger>
          <TabsTrigger value="exceptions">Exception register</TabsTrigger>
        </TabsList>
        <TabsContent value="decisions">
          <DataTable columns={decisionCols} rows={decisions} rowKey={(d) => d.id} onRowClick={setDecision} />
        </TabsContent>
        <TabsContent value="exceptions">
          <DataTable columns={exceptionCols} rows={exceptions} rowKey={(e) => e.id} onRowClick={setException} />
        </TabsContent>
      </Tabs>

      <Drawer open={!!decision} onOpenChange={(o) => !o && setDecision(null)}>
        {decision && (
          <DrawerContent title={decision.title} description={decision.meeting}>
            <p className="text-sm text-muted-foreground">{decision.context}</p>
            <SectionLabel>Decision</SectionLabel>
            <FieldGrid>
              <Field label="Decision maker">{decision.decisionMaker}</Field>
              <Field label="Effective">{fmtDate(decision.effectiveDate)}</Field>
              <Field label="Review">{fmtDate(decision.reviewDate)}</Field>
              <Field label="Options considered">{decision.optionsConsidered.join(", ")}</Field>
              <Field label="Rationale">{decision.rationale}</Field>
              <Field label="Affected controls">{decision.affectedControlIds.join(", ") || "—"}</Field>
              <Field label="Affected systems">{decision.affectedSystemIds.join(", ") || "—"}</Field>
            </FieldGrid>
          </DrawerContent>
        )}
      </Drawer>

      <Drawer open={!!exception} onOpenChange={(o) => !o && setException(null)}>
        {exception && (
          <DrawerContent title={exception.title} description={exception.subject}>
            <div className="mb-3">
              <Badge tone={RENEWAL_TONE[exception.renewalStatus]}>{titleCase(exception.renewalStatus)}</Badge>
            </div>
            <FieldGrid>
              <Field label="Reason">{exception.reason}</Field>
              <Field label="Affected scope">{exception.affectedScope}</Field>
              <Field label="Compensating controls">{exception.compensatingControls}</Field>
              <Field label="Approver">{exception.approver}</Field>
              <Field label="Start">{fmtDate(exception.startDate)}</Field>
              <Field label="Expiry">{fmtDate(exception.expiry)}</Field>
              <Field label="Linked risk">{exception.riskId ?? "—"}</Field>
            </FieldGrid>
            {isOverdue(exception.expiry) && (
              <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                This exception has passed its expiry date and must be renewed or closed.
              </p>
            )}
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
