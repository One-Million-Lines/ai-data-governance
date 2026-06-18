import type {
  ControlStatus,
  GateStatus,
  PolicyStatus,
  ActionStatus,
  AiRiskTier,
  RegulatoryClass,
  Severity,
  Priority,
  AssessmentAnswer,
  AssuranceStatus,
  Classification,
} from "@/types";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "teal";

interface LabelDef {
  label: string;
  tone: Tone;
}

function def(label: string, tone: Tone): LabelDef {
  return { label, tone };
}

export const CONTROL_STATUS: Record<ControlStatus, LabelDef> = {
  not_implemented: def("Not implemented", "danger"),
  planned: def("Planned", "neutral"),
  in_progress: def("In progress", "warning"),
  implemented: def("Implemented", "info"),
  operating: def("Operating", "success"),
  needs_review: def("Needs review", "warning"),
};

export const GATE_STATUS: Record<GateStatus, LabelDef> = {
  not_started: def("Not started", "neutral"),
  in_review: def("In review", "info"),
  changes_requested: def("Changes requested", "warning"),
  approved_with_conditions: def("Approved w/ conditions", "teal"),
  approved: def("Approved", "success"),
  rejected: def("Rejected", "danger"),
  suspended: def("Suspended", "warning"),
  retired: def("Retired", "neutral"),
};

export const POLICY_STATUS: Record<PolicyStatus, LabelDef> = {
  draft: def("Draft", "neutral"),
  in_review: def("In review", "info"),
  approved: def("Approved", "teal"),
  published: def("Published", "success"),
  superseded: def("Superseded", "neutral"),
  retired: def("Retired", "neutral"),
};

export const ACTION_STATUS: Record<ActionStatus, LabelDef> = {
  not_started: def("Not started", "neutral"),
  in_progress: def("In progress", "info"),
  blocked: def("Blocked", "danger"),
  in_review: def("In review", "teal"),
  done: def("Done", "success"),
};

export const RISK_TIER: Record<AiRiskTier, LabelDef> = {
  minimal: def("Minimal", "success"),
  limited: def("Limited", "info"),
  elevated: def("Elevated", "warning"),
  high: def("High", "danger"),
  unacceptable: def("Unacceptable", "danger"),
};

export const REG_CLASS: Record<RegulatoryClass, LabelDef> = {
  unclassified: def("Unclassified", "neutral"),
  out_of_scope: def("Out of scope", "neutral"),
  minimal_risk: def("Minimal risk", "success"),
  transparency_obligations: def("Transparency obligations", "info"),
  high_risk: def("High risk", "danger"),
  prohibited: def("Prohibited", "danger"),
};

export const SEVERITY: Record<Severity, LabelDef> = {
  low: def("Low", "success"),
  moderate: def("Moderate", "warning"),
  high: def("High", "danger"),
  critical: def("Critical", "danger"),
};

export const PRIORITY: Record<Priority, LabelDef> = {
  low: def("Low", "neutral"),
  medium: def("Medium", "info"),
  high: def("High", "warning"),
  critical: def("Critical", "danger"),
};

export const ASSURANCE: Record<AssuranceStatus, LabelDef> = {
  verified: def("Verified", "success"),
  in_progress: def("In progress", "warning"),
  gap: def("Gap", "danger"),
  not_assessed: def("Not assessed", "neutral"),
};

export const CLASSIFICATION: Record<Classification, LabelDef> = {
  public: def("Public", "neutral"),
  internal: def("Internal", "info"),
  confidential: def("Confidential", "warning"),
  restricted: def("Restricted", "danger"),
};

export const ANSWER_LABELS: Record<AssessmentAnswer, string> = {
  not_assessed: "Not assessed",
  not_implemented: "Not implemented",
  informal: "Informal",
  partially_defined: "Partially defined",
  defined: "Defined",
  implemented: "Implemented",
  measured: "Measured",
  optimised: "Optimised",
  not_applicable: "Not applicable",
};

export const ANSWER_OPTIONS: AssessmentAnswer[] = [
  "not_implemented",
  "informal",
  "partially_defined",
  "defined",
  "implemented",
  "measured",
  "optimised",
  "not_applicable",
];

export const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-secondary text-secondary-foreground border-border",
  info: "bg-info/10 text-info border-info/30",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/40",
  danger: "bg-destructive/10 text-destructive border-destructive/30",
  teal: "bg-accent/10 text-accent border-accent/30",
};
