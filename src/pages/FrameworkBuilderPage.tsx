import { Link } from "react-router-dom";
import { Check, Lock, ArrowRight } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Step {
  n: number;
  title: string;
  description: string;
  to: string;
  done: boolean;
  gate?: string;
}

export function FrameworkBuilderPage() {
  const store = useGovernanceStore();
  const scores = store.getScores();

  const hasSponsor = store.profile.existingGrcFunctions.length > 0; // mandate gate proxy
  const inventoried = store.dataAssets.length > 0 && store.aiSystems.length > 0;
  const classified = store.dataAssets.filter((a) => a.classification !== "internal").length > 0;
  const assessed = scores.assessmentCompleteness > 0;
  const controlsDesigned = store.controls.some((c) => c.status === "operating");
  const risksAssessed = store.risks.length > 0;
  const roadmapPrioritised = store.actions.length > 0;
  const evidenceCollected = store.evidence.length > 0;

  const steps: Step[] = [
    { n: 1, title: "Establish the mandate", description: "Executive sponsor, purpose, scope, principles and success measures.", to: "/organisation", done: hasSponsor, gate: "An accountable sponsor and framework owner are required before the framework can be operational." },
    { n: 2, title: "Understand the context", description: "Jurisdictions, data and AI profile, existing structures and risk appetite.", to: "/organisation", done: true },
    { n: 3, title: "Discover assets & use cases", description: "Inventory data, systems, AI, models, vendors and processing.", to: "/data", done: inventoried },
    { n: 4, title: "Classify assets & risks", description: "Sensitivity, criticality, privacy, security and AI impact.", to: "/ai", done: classified },
    { n: 5, title: "Assess the current state", description: "Assess every applicable capability for maturity and evidence.", to: "/assessments", done: assessed },
    { n: 6, title: "Define the operating model", description: "Centralised, federated or hybrid; committees, RACI and decision rights.", to: "/organisation", done: store.profile.scope.length > 0 },
    { n: 7, title: "Design policies & controls", description: "Recommend controls from risks, frameworks, industry and maturity.", to: "/controls", done: controlsDesigned },
    { n: 8, title: "Assess risks & impacts", description: "Governance, data, privacy, security, AI and vendor risk.", to: "/risks", done: risksAssessed },
    { n: 9, title: "Prioritise the roadmap", description: "Transparent prioritisation across Foundation, Operationalise, Optimise.", to: "/roadmap", done: roadmapPrioritised },
    { n: 10, title: "Implement & collect evidence", description: "Track owners, status, blockers, residual risk and evidence.", to: "/evidence", done: evidenceCollected },
    { n: 11, title: "Operate governance", description: "Recurring reviews, testing, monitoring and reporting.", to: "/metrics", done: false },
    { n: 12, title: "Audit & improve", description: "Control testing, findings, remediation and framework versions.", to: "/audit", done: store.auditFindings.length > 0 },
  ];

  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  return (
    <div>
      <PageHeader
        title="Framework Builder"
        description="A guided sequence that prevents important dependencies from being skipped. The framework cannot be marked operational without an accountable sponsor and owner."
      />

      <div className="mb-5 rounded-lg border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Build progress</span>
          <span className="tabular-nums text-muted-foreground">{completed} of {steps.length} steps</span>
        </div>
        <Progress value={pct} tone="accent" />
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => {
          const locked = i > 0 && !steps[i - 1].done && !step.done;
          return (
            <Card key={step.n} className={cn(step.done && "border-success/40")}>
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    step.done ? "bg-success text-white" : locked ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary",
                  )}
                >
                  {step.done ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : step.n}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{step.title}</p>
                    {step.done && <Badge tone="success">Done</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  {step.gate && (
                    <p className="mt-1 text-[11px] italic text-warning-foreground">Gate: {step.gate}</p>
                  )}
                </div>
                <Link to={step.to} className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
