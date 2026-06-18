import { useMemo, useState } from "react";
import { ChevronDown, Flag, MessageSquare } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/common/StatCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { DOMAINS } from "@/data/domains";
import { QUESTIONS } from "@/data/questions";
import { computeProfileFlags, isApplicable } from "@/lib/profile";
import { ANSWER_LABELS, ANSWER_OPTIONS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { AssessmentAnswer } from "@/types";

const ANSWER_TONE = (a: AssessmentAnswer): string => {
  switch (a) {
    case "optimised":
    case "measured":
    case "implemented":
      return "border-success bg-success text-white";
    case "defined":
    case "partially_defined":
      return "border-info bg-info text-white";
    case "informal":
      return "border-warning bg-warning text-warning-foreground";
    case "not_implemented":
      return "border-destructive bg-destructive text-white";
    default:
      return "border-border bg-secondary text-secondary-foreground";
  }
};

export function AssessmentsPage() {
  const { profile, responses, setAnswer, setResponse } = useGovernanceStore();
  const flags = useMemo(() => computeProfileFlags(profile), [profile]);
  const [open, setOpen] = useState<string | null>("d1");

  const applicableQuestions = QUESTIONS.filter((q) => isApplicable(q.applicability, flags, responses));
  const answered = applicableQuestions.filter((q) => responses[q.id]?.answer && responses[q.id]?.answer !== "not_assessed");
  const flagged = applicableQuestions.filter((q) => responses[q.id]?.flaggedForReview);
  const completeness = applicableQuestions.length
    ? Math.round((answered.length / applicableQuestions.length) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title="Assessments"
        description="Adaptive maturity assessment. Questions appear only when they apply to your data and AI profile. High ratings require evidence."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Applicable questions" value={applicableQuestions.length} hint={`${QUESTIONS.length - applicableQuestions.length} not applicable to profile`} />
        <StatCard label="Answered" value={answered.length} tone="success" />
        <StatCard label="Flagged for review" value={flagged.length} tone={flagged.length ? "warning" : "default"} />
        <StatCard label="Completeness" value={`${completeness}%`} tone="accent" />
      </div>

      <div className="mb-5">
        <Progress value={completeness} tone="accent" />
      </div>

      <div className="space-y-3">
        {DOMAINS.map((domain) => {
          const qs = applicableQuestions.filter((q) => q.domainId === domain.id);
          if (qs.length === 0) return null;
          const domAnswered = qs.filter((q) => responses[q.id]?.answer && responses[q.id]?.answer !== "not_assessed").length;
          const isOpen = open === domain.id;
          return (
            <Card key={domain.id}>
              <CardHeader
                className="flex cursor-pointer select-none flex-row items-center justify-between space-y-0"
                onClick={() => setOpen(isOpen ? null : domain.id)}
              >
                <div>
                  <CardTitle>{domain.index}. {domain.name}</CardTitle>
                  <CardDescription>{domAnswered} of {qs.length} answered</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={domAnswered === qs.length ? "success" : "neutral"}>{Math.round((domAnswered / qs.length) * 100)}%</Badge>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </div>
              </CardHeader>
              {isOpen && (
                <CardContent className="space-y-4 border-t pt-4">
                  {qs.map((q) => {
                    const r = responses[q.id];
                    return (
                      <div key={q.id} className="rounded-md border bg-card/60 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{q.text}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{q.explanation}</p>
                          </div>
                          <button
                            onClick={() => setResponse(q.id, { flaggedForReview: !r?.flaggedForReview })}
                            className={cn(
                              "shrink-0 rounded-md p-1.5 transition-colors",
                              r?.flaggedForReview ? "bg-warning/15 text-warning-foreground" : "text-muted-foreground hover:bg-secondary",
                            )}
                            title="Flag for specialist review"
                          >
                            <Flag className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {ANSWER_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setAnswer(q.id, opt, opt === "not_applicable" ? "Not applicable to current scope" : undefined)}
                              className={cn(
                                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                                r?.answer === opt
                                  ? ANSWER_TONE(opt)
                                  : "border-border bg-card text-muted-foreground hover:bg-secondary",
                              )}
                            >
                              {ANSWER_LABELS[opt]}
                            </button>
                          ))}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span>Expected evidence: {q.expectedEvidence}</span>
                          <span>·</span>
                          <span>Owner: {q.suggestedOwner}</span>
                          {q.relatedFrameworks.length > 0 && (
                            <>
                              <span>·</span>
                              <span>Maps to {q.relatedFrameworks.join(", ").toUpperCase()}</span>
                            </>
                          )}
                        </div>

                        {(r?.answer === "implemented" || r?.answer === "measured" || r?.answer === "optimised") && (
                          <p className="mt-2 rounded bg-warning/10 px-2 py-1 text-[11px] text-warning-foreground">
                            High maturity claimed — attach evidence on the Evidence page to support this rating.
                          </p>
                        )}

                        {r?.comment !== undefined || r?.flaggedForReview ? (
                          <div className="mt-2 flex items-start gap-2">
                            <MessageSquare className="mt-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <Textarea
                              value={r?.comment ?? ""}
                              onChange={(e) => setResponse(q.id, { comment: e.target.value })}
                              placeholder="Add a comment or context…"
                              className="min-h-[44px] text-xs"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => setResponse(q.id, { comment: "" })}
                            className="mt-2 text-[11px] font-medium text-accent hover:underline"
                          >
                            + Add comment
                          </button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
