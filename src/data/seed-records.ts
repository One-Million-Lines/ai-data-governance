import type {
  Action,
  Evidence,
  Exception,
  Incident,
  Decision,
  AuditFinding,
  FrameworkVersion,
  AssessmentResponse,
  AssessmentAnswer,
  AuditLogEntry,
} from "@/types";
import { QUESTIONS } from "./questions";

// ---------------------------------------------------------------------------
// Roadmap actions (30) — generated from assessment gaps and risks (spec §17).
// ---------------------------------------------------------------------------

type ActSeed = Omit<Action, "contributors" | "evidenceRequired" | "estimatedCost"> &
  Partial<Pick<Action, "contributors" | "evidenceRequired" | "estimatedCost">>;

function act(a: ActSeed): Action {
  return {
    contributors: [],
    evidenceRequired: "",
    estimatedCost: "—",
    ...a,
  };
}

const score = (rr: number, gs: number, ru: number, dv: number, sv: number, es: number) => ({
  residualRisk: rr,
  gapSeverity: gs,
  regulatoryUrgency: ru,
  dependencyValue: dv,
  strategicValue: sv,
  effortScore: es,
});

export const ACTIONS: Action[] = [
  act({ id: "ACT-001", title: "Stand up the AI Governance Council", description: "Establish council with terms of reference, membership and cadence.", domainId: "d2", controlId: "ORG-001", owner: "Governance Lead", effort: "M", estimatedCost: "Internal", targetDate: "2026-07-15", dependencyIds: [], phase: "foundation", priority: "high", status: "in_progress", evidenceRequired: "Terms of reference; first minutes", successCriteria: "Council meets and records decisions", scoring: score(3, 4, 4, 5, 5, 3) }),
  act({ id: "ACT-002", title: "Complete AI inventory including embedded AI", description: "Run discovery across procurement and SaaS to close shadow-AI gaps.", domainId: "d3", controlId: "INV-002", riskReduced: "R-017", owner: "AI Governance Office", effort: "M", targetDate: "2026-07-05", dependencyIds: ["ACT-001"], phase: "foundation", priority: "high", status: "in_progress", evidenceRequired: "Updated AI inventory", successCriteria: "All known AI systems inventoried with owners", scoring: score(4, 4, 4, 5, 4, 3) }),
  act({ id: "ACT-003", title: "Build CV screening fairness assessment", description: "Assess the CV screening model for disparate impact before approval.", domainId: "d8", controlId: "RAI-002", riskReduced: "R-003", owner: "Responsible AI Reviewer", effort: "L", targetDate: "2026-06-15", dependencyIds: [], phase: "foundation", priority: "critical", status: "in_progress", evidenceRequired: "Fairness assessment report", successCriteria: "Disparate impact within agreed threshold or system not deployed", scoring: score(4, 5, 5, 4, 4, 2) }),
  act({ id: "ACT-004", title: "Implement agent guardrails and kill-switch", description: "Complete permission matrix, approval thresholds and kill-switch for the procurement agent.", domainId: "d11", controlId: "GAI-006", riskReduced: "R-015", owner: "AI Engineering", effort: "L", targetDate: "2026-06-25", dependencyIds: [], phase: "foundation", priority: "critical", status: "not_started", evidenceRequired: "Permission matrix; kill-switch test record", successCriteria: "Agent cannot exceed limits and can be halted", scoring: score(5, 5, 4, 4, 3, 2) }),
  act({ id: "ACT-005", title: "Restrict and enforce approved GenAI tools", description: "Publish approved tool list and deploy DLP controls for prompt data.", domainId: "d11", controlId: "GAI-001", riskReduced: "R-001", owner: "AI Governance Office", contributors: ["CISO"], effort: "M", targetDate: "2026-07-01", dependencyIds: [], phase: "foundation", priority: "high", status: "in_progress", evidenceRequired: "Approved list; DLP policy", successCriteria: "Confidential data blocked from unapproved tools", scoring: score(4, 4, 3, 3, 3, 3) }),
  act({ id: "ACT-006", title: "Establish independent model validation function", description: "Define and resource independent validation for AI before deployment.", domainId: "d7", controlId: "AIL-005", owner: "Model Validator", effort: "L", targetDate: "2026-08-15", dependencyIds: ["ACT-001"], phase: "foundation", priority: "high", status: "not_started", evidenceRequired: "Validation procedure; first validation report", successCriteria: "High-risk AI independently validated before approval", scoring: score(4, 4, 4, 4, 4, 2) }),
  act({ id: "ACT-007", title: "Run TalentAI vendor due diligence and contract uplift", description: "Complete AI vendor questionnaire and add data, audit and exit clauses.", domainId: "d12", controlId: "TPR-002", riskReduced: "R-010", owner: "Procurement", contributors: ["Legal"], effort: "M", targetDate: "2026-06-20", dependencyIds: [], phase: "foundation", priority: "high", status: "in_progress", evidenceRequired: "Completed questionnaire; revised contract", successCriteria: "Vendor meets governance bar or is replaced", scoring: score(4, 4, 4, 3, 3, 3) }),
  act({ id: "ACT-008", title: "Document cross-border transfer assessment for US marketing data", description: "Assess and document transfer mechanism for marketing data in the US.", domainId: "d9", controlId: "PRV-005", riskReduced: "R-008", owner: "DPO", effort: "S", targetDate: "2026-07-30", dependencyIds: [], phase: "foundation", priority: "medium", status: "not_started", evidenceRequired: "Transfer assessment", successCriteria: "Approved transfer mechanism in place", scoring: score(3, 4, 4, 2, 2, 4) }),
  act({ id: "ACT-009", title: "Assign owners and stewards to unowned assets", description: "Assign accountable owners to marketing, forecast and agent-log assets.", domainId: "d2", controlId: "ORG-002", riskReduced: "R-006", owner: "Data Governance Office", effort: "S", targetDate: "2026-06-30", dependencyIds: [], phase: "foundation", priority: "high", status: "in_progress", evidenceRequired: "Updated inventory with owners", successCriteria: "No critical asset without an owner", scoring: score(3, 4, 2, 4, 3, 4) }),
  act({ id: "ACT-010", title: "Enforce retention schedule across CRM and billing", description: "Implement governed deletion to reduce over-retention.", domainId: "d6", controlId: "DLC-001", riskReduced: "R-007", owner: "Records Manager", effort: "M", targetDate: "2026-09-01", dependencyIds: [], phase: "operationalise", priority: "medium", status: "not_started", evidenceRequired: "Deletion logs", successCriteria: "Retention enforced for key categories", scoring: score(3, 3, 3, 2, 2, 3) }),
  act({ id: "ACT-011", title: "Improve marketing data quality and consent capture", description: "Remediate marketing contact quality and rebuild consent capture.", domainId: "d5", controlId: "DQ-002", riskReduced: "R-006", owner: "Sales & Marketing", effort: "M", targetDate: "2026-08-20", dependencyIds: ["ACT-009"], phase: "operationalise", priority: "medium", status: "not_started", evidenceRequired: "Quality results; consent records", successCriteria: "Consent state valid and quality above threshold", scoring: score(3, 4, 3, 2, 2, 3) }),
  act({ id: "ACT-012", title: "Deploy AI production monitoring", description: "Add automated monitoring for drift and anomalies on key AI systems.", domainId: "d7", controlId: "AIL-007", riskReduced: "R-005", owner: "AI Engineering", effort: "L", targetDate: "2026-09-10", dependencyIds: ["ACT-006"], phase: "operationalise", priority: "medium", status: "not_started", evidenceRequired: "Monitoring dashboards", successCriteria: "High-risk AI monitored with alerts", scoring: score(3, 3, 3, 3, 3, 2) }),
  act({ id: "ACT-013", title: "Roll out AI literacy training", description: "Deliver role-based data and AI literacy training with tracking.", domainId: "d13", controlId: "POL-002", riskReduced: "R-019", owner: "HR", effort: "M", targetDate: "2026-09-15", dependencyIds: ["ACT-001"], phase: "operationalise", priority: "medium", status: "not_started", evidenceRequired: "Completion records", successCriteria: "Target completion rate achieved", scoring: score(3, 3, 3, 2, 3, 3) }),
  act({ id: "ACT-014", title: "Stand up exception register with expiry enforcement", description: "Implement exception workflow requiring expiry and compensating controls.", domainId: "d13", controlId: "POL-003", riskReduced: "R-018", owner: "Governance Lead", effort: "S", targetDate: "2026-08-01", dependencyIds: ["ACT-001"], phase: "operationalise", priority: "medium", status: "not_started", evidenceRequired: "Exception register", successCriteria: "No open exception without expiry", scoring: score(2, 3, 2, 3, 2, 4) }),
  act({ id: "ACT-015", title: "Add prompt-injection defences for the agent", description: "Sanitise and constrain untrusted document inputs to the procurement agent.", domainId: "d10", controlId: "SEC-005", riskReduced: "R-016", owner: "Security Architecture", effort: "M", targetDate: "2026-06-28", dependencyIds: ["ACT-004"], phase: "foundation", priority: "high", status: "not_started", evidenceRequired: "Threat model; test results", successCriteria: "Injection attempts blocked in testing", scoring: score(4, 4, 3, 3, 3, 3) }),
  act({ id: "ACT-016", title: "Implement model-to-data lineage for training sets", description: "Capture versioned lineage linking models to training data.", domainId: "d4", controlId: "ARC-004", riskReduced: "R-011", owner: "Data Architecture", effort: "L", targetDate: "2026-09-30", dependencyIds: [], phase: "operationalise", priority: "low", status: "not_started", evidenceRequired: "Lineage records", successCriteria: "Models traceable to dataset versions", scoring: score(3, 3, 2, 3, 2, 2) }),
  act({ id: "ACT-017", title: "Complete EU AI Act applicability review", description: "Legal review of regulatory classification for all AI systems.", domainId: "d7", controlId: "AIL-003", owner: "Legal", contributors: ["AI Governance Office"], effort: "M", targetDate: "2026-07-31", dependencyIds: ["ACT-002"], phase: "foundation", priority: "high", status: "not_started", evidenceRequired: "Classification with legal sign-off", successCriteria: "Each AI system has a reviewed classification", scoring: score(3, 4, 5, 4, 3, 3) }),
  act({ id: "ACT-018", title: "Define enterprise risk appetite for data and AI", description: "Draft and approve the risk appetite statement.", domainId: "d1", controlId: "EGV-003", owner: "Enterprise Risk Lead", effort: "S", targetDate: "2026-07-10", dependencyIds: [], phase: "foundation", priority: "medium", status: "in_progress", evidenceRequired: "Approved appetite statement", successCriteria: "Appetite approved and applied to acceptances", scoring: score(2, 3, 3, 4, 4, 4) }),
  act({ id: "ACT-019", title: "Implement evidence register and confidence scoring", description: "Stand up the evidence register and link evidence to controls.", domainId: "d14", controlId: "ASR-007", riskReduced: "R-020", owner: "Governance Lead", effort: "M", targetDate: "2026-08-30", dependencyIds: ["ACT-001"], phase: "operationalise", priority: "medium", status: "not_started", evidenceRequired: "Evidence register", successCriteria: "Key controls have linked, current evidence", scoring: score(3, 3, 3, 3, 3, 3) }),
  act({ id: "ACT-020", title: "Privileged access management uplift", description: "Move privileged access to just-in-time with approval and logging.", domainId: "d10", controlId: "SEC-002", riskReduced: "R-013", owner: "CISO", effort: "L", targetDate: "2026-09-20", dependencyIds: [], phase: "operationalise", priority: "medium", status: "not_started", evidenceRequired: "PAM configuration; access reviews", successCriteria: "No standing privileged access to critical systems", scoring: score(3, 3, 2, 2, 3, 2) }),
  act({ id: "ACT-021", title: "Establish RACI and decision-rights matrix", description: "Document governance RACI and decision rights.", domainId: "d2", controlId: "ORG-004", owner: "Governance Lead", effort: "S", targetDate: "2026-07-20", dependencyIds: ["ACT-001"], phase: "foundation", priority: "medium", status: "not_started", evidenceRequired: "RACI; decision-rights matrix", successCriteria: "Roles mapped without conflicts", scoring: score(2, 3, 2, 4, 4, 4) }),
  act({ id: "ACT-022", title: "Implement DPIA workflow for high-risk processing", description: "Embed DPIA triggers and workflow linked to AI impact assessments.", domainId: "d9", controlId: "PRV-002", owner: "DPO", effort: "M", targetDate: "2026-08-10", dependencyIds: [], phase: "operationalise", priority: "medium", status: "not_started", evidenceRequired: "DPIA records", successCriteria: "High-risk processing covered by DPIAs", scoring: score(3, 3, 4, 3, 3, 3) }),
  act({ id: "ACT-023", title: "Adopt Responsible AI principles", description: "Approve and publish Responsible AI principles and embed in gates.", domainId: "d8", controlId: "RAI-001", owner: "Responsible AI Reviewer", effort: "S", targetDate: "2026-07-25", dependencyIds: ["ACT-001"], phase: "foundation", priority: "medium", status: "not_started", evidenceRequired: "Approved principles", successCriteria: "Principles published and referenced in gates", scoring: score(2, 3, 3, 3, 4, 4) }),
  act({ id: "ACT-024", title: "Define control testing plan", description: "Create a risk-based independent control testing plan.", domainId: "d14", controlId: "ASR-002", owner: "Internal Audit", effort: "M", targetDate: "2026-09-05", dependencyIds: ["ACT-019"], phase: "operationalise", priority: "low", status: "not_started", evidenceRequired: "Testing plan; first results", successCriteria: "Priority controls tested with evidence", scoring: score(3, 3, 3, 3, 3, 3) }),
  act({ id: "ACT-025", title: "Human oversight design for high-risk AI", description: "Document and test human oversight for CV screening and the agent.", domainId: "d8", controlId: "RAI-003", owner: "AI System Owner", effort: "M", targetDate: "2026-08-05", dependencyIds: ["ACT-003"], phase: "foundation", priority: "high", status: "not_started", evidenceRequired: "Human oversight plan", successCriteria: "Reviewers can override high-risk AI", scoring: score(4, 4, 4, 3, 3, 3) }),
  act({ id: "ACT-026", title: "Establish ISO 42001 mapping baseline", description: "Map internal controls to ISO/IEC 42001 to prepare for certification.", domainId: "d1", controlId: "POL-005", owner: "Governance Lead", effort: "L", targetDate: "2026-10-15", dependencyIds: ["ACT-019"], phase: "optimise", priority: "low", status: "not_started", evidenceRequired: "Mapping matrix", successCriteria: "Controls mapped with gaps identified", scoring: score(2, 3, 3, 3, 4, 2) }),
  act({ id: "ACT-027", title: "Automate data quality monitoring", description: "Deploy automated quality rules and dashboards for critical data.", domainId: "d5", controlId: "DQ-005", owner: "Data Quality Lead", effort: "L", targetDate: "2026-10-01", dependencyIds: ["ACT-011"], phase: "optimise", priority: "low", status: "not_started", evidenceRequired: "Quality dashboard", successCriteria: "Critical data quality monitored continuously", scoring: score(2, 3, 2, 2, 3, 2) }),
  act({ id: "ACT-028", title: "Implement GenAI evaluation and red teaming", description: "Stand up evaluation datasets and red-teaming for high-risk GenAI.", domainId: "d11", controlId: "GAI-007", riskReduced: "R-004", owner: "AI Engineering", effort: "L", targetDate: "2026-10-20", dependencyIds: ["ACT-012"], phase: "optimise", priority: "low", status: "not_started", evidenceRequired: "Evaluation results", successCriteria: "High-risk GenAI evaluated and red-teamed", scoring: score(3, 3, 3, 2, 3, 2) }),
  act({ id: "ACT-029", title: "Board governance reporting pack", description: "Create a quarterly board report with separate indicators and trends.", domainId: "d14", controlId: "ASR-008", owner: "Chief Data Officer", effort: "S", targetDate: "2026-09-25", dependencyIds: ["ACT-019"], phase: "operationalise", priority: "low", status: "not_started", evidenceRequired: "Board report", successCriteria: "Leadership receives regular governance reporting", scoring: score(2, 2, 2, 3, 4, 4) }),
  act({ id: "ACT-030", title: "Continuous regulatory horizon scanning", description: "Set up tracking of data and AI regulatory change with impact review.", domainId: "d14", controlId: "ASR-006", owner: "Legal", effort: "S", targetDate: "2026-10-30", dependencyIds: [], phase: "optimise", priority: "low", status: "not_started", evidenceRequired: "Horizon scan log", successCriteria: "Regulatory changes assessed for impact", scoring: score(2, 2, 4, 2, 3, 4) }),
];

// ---------------------------------------------------------------------------
// Evidence (25)
// ---------------------------------------------------------------------------

export const EVIDENCE: Evidence[] = [
  { id: "EV-001", title: "Governance Charter v2 (signed)", type: "policy", owner: "Chief Data Officer", linkedControlIds: ["EGV-001", "EGV-002"], collectionDate: "2026-02-01", validUntil: "2027-02-01", reviewer: "Internal Audit", reviewResult: "verified", source: "Governance repository", confidentiality: "internal", independent: true, version: 2 },
  { id: "EV-002", title: "Governance Council minutes — Q1 2026", type: "meeting_minutes", owner: "Governance Lead", linkedControlIds: ["ORG-001"], collectionDate: "2026-03-28", validUntil: "2026-09-28", reviewer: "Governance Lead", reviewResult: "verified", source: "Council records", confidentiality: "internal", independent: false, version: 1 },
  { id: "EV-003", title: "Access review report — critical systems", type: "access_review", owner: "CISO", linkedControlIds: ["SEC-001", "SEC-002"], collectionDate: "2026-04-05", validUntil: "2026-10-05", reviewer: "Internal Audit", reviewResult: "verified", source: "IAM tooling", confidentiality: "confidential", independent: true, version: 1 },
  { id: "EV-004", title: "Encryption configuration baseline", type: "system_config", owner: "Security Architecture", linkedControlIds: ["SEC-003"], collectionDate: "2026-01-20", validUntil: "2027-01-20", reviewer: "CISO", reviewResult: "verified", source: "Cloud config export", confidentiality: "confidential", independent: false, version: 1 },
  { id: "EV-005", title: "Data inventory export — April 2026", type: "dashboard", owner: "Data Governance Office", linkedControlIds: ["INV-001"], collectionDate: "2026-04-12", validUntil: "2026-07-12", reviewer: "Data Governance Office", reviewResult: "verified", source: "Data catalogue", confidentiality: "internal", independent: false, version: 1 },
  { id: "EV-006", title: "Churn model card v3", type: "model_card", owner: "Product & Engineering", linkedControlIds: ["AIL-005", "ARC-004"], collectionDate: "2026-01-15", validUntil: "2026-07-15", reviewer: "Model Validator", reviewResult: "verified", source: "Model registry", confidentiality: "internal", independent: true, version: 3 },
  { id: "EV-007", title: "Support assistant validation report", type: "test_result", owner: "AI Governance Office", linkedControlIds: ["AIL-005"], collectionDate: "2026-03-18", validUntil: "2026-09-18", reviewer: "Model Validator", reviewResult: "verified", source: "Validation records", confidentiality: "internal", independent: true, version: 1 },
  { id: "EV-008", title: "DPIA — Support Assistant", type: "assessment", owner: "DPO", linkedControlIds: ["PRV-002"], collectionDate: "2026-03-10", validUntil: "2027-03-10", reviewer: "Legal", reviewResult: "verified", source: "Privacy records", confidentiality: "confidential", independent: true, version: 1 },
  { id: "EV-009", title: "GenAI acceptable use acknowledgements", type: "training_record", owner: "HR", linkedControlIds: ["GAI-001", "POL-002"], collectionDate: "2026-04-01", validUntil: "2027-04-01", reviewer: "Governance Lead", reviewResult: "needs_update", source: "LMS", confidentiality: "internal", independent: false, version: 1 },
  { id: "EV-010", title: "Snowflake SOC 2 report", type: "audit_report", owner: "Vendor Risk", linkedControlIds: ["TPR-001"], collectionDate: "2025-12-01", validUntil: "2026-12-01", reviewer: "Vendor Risk", reviewResult: "verified", source: "Vendor portal", confidentiality: "confidential", independent: true, version: 1 },
  { id: "EV-011", title: "Retention schedule v1", type: "policy", owner: "Records Manager", linkedControlIds: ["DLC-001"], collectionDate: "2026-02-10", validUntil: "2027-02-10", reviewer: "DPO", reviewResult: "verified", source: "Records repository", confidentiality: "internal", independent: false, version: 1 },
  { id: "EV-012", title: "Incident playbook (tested)", type: "procedure", owner: "CISO", linkedControlIds: ["SEC-007"], collectionDate: "2025-11-15", validUntil: "2026-11-15", reviewer: "Internal Audit", reviewResult: "verified", source: "Security repository", confidentiality: "internal", independent: true, version: 2 },
  { id: "EV-013", title: "Data quality rule execution — Q1", type: "monitoring_output", owner: "Data Quality Lead", linkedControlIds: ["DQ-002"], collectionDate: "2026-03-31", validUntil: "2026-06-30", reviewer: "Data Governance Office", reviewResult: "needs_update", source: "Quality tooling", confidentiality: "internal", independent: false, version: 1 },
  { id: "EV-014", title: "CV screening fairness draft (incomplete)", type: "assessment", owner: "Responsible AI Reviewer", linkedControlIds: ["RAI-002"], collectionDate: "2026-04-20", reviewer: undefined, reviewResult: "not_reviewed", source: "Working draft", confidentiality: "confidential", independent: false, version: 0 },
  { id: "EV-015", title: "Vendor register snapshot", type: "dashboard", owner: "Procurement", linkedControlIds: ["TPR-004"], collectionDate: "2026-02-12", validUntil: "2026-08-12", reviewer: "Vendor Risk", reviewResult: "verified", source: "GRC tool", confidentiality: "confidential", independent: false, version: 1 },
  { id: "EV-016", title: "Penetration test report 2025", type: "test_result", owner: "CISO", linkedControlIds: ["SEC-009"], collectionDate: "2025-10-05", validUntil: "2026-10-05", reviewer: "External tester", reviewResult: "verified", source: "Security vendor", confidentiality: "confidential", independent: true, version: 1 },
  { id: "EV-017", title: "Backup recovery test results", type: "test_result", owner: "IT Operations", linkedControlIds: ["SEC-008"], collectionDate: "2026-01-25", validUntil: "2026-07-25", reviewer: "CISO", reviewResult: "verified", source: "Operations records", confidentiality: "internal", independent: false, version: 1 },
  { id: "EV-018", title: "Records of processing extract", type: "data_sheet", owner: "DPO", linkedControlIds: ["INV-003", "PRV-001"], collectionDate: "2026-02-18", validUntil: "2026-08-18", reviewer: "Legal", reviewResult: "verified", source: "Privacy records", confidentiality: "confidential", independent: false, version: 1 },
  { id: "EV-019", title: "Classification scheme approval", type: "approval", owner: "Data Governance Office", linkedControlIds: ["INV-005"], collectionDate: "2026-01-15", validUntil: "2027-01-15", reviewer: "CISO", reviewResult: "verified", source: "Governance repository", confidentiality: "internal", independent: false, version: 2 },
  { id: "EV-020", title: "Agent design review notes", type: "assessment", owner: "AI Engineering", linkedControlIds: ["GAI-005"], collectionDate: "2026-04-15", reviewer: undefined, reviewResult: "not_reviewed", source: "Working draft", confidentiality: "confidential", independent: false, version: 0 },
  { id: "EV-021", title: "Code assistant policy acknowledgements", type: "training_record", owner: "Product & Engineering", linkedControlIds: ["TPR-006"], collectionDate: "2026-02-10", validUntil: "2027-02-10", reviewer: "Governance Lead", reviewResult: "verified", source: "LMS", confidentiality: "internal", independent: false, version: 1 },
  { id: "EV-022", title: "Lead scoring screenshot (ungoverned)", type: "screenshot", owner: undefined, linkedControlIds: ["AIL-001"], collectionDate: "2025-09-01", reviewer: undefined, reviewResult: "rejected", source: "Ad hoc", confidentiality: "internal", independent: false, version: 0 },
  { id: "EV-023", title: "Management review pack — Q1 2026", type: "dashboard", owner: "Governance Lead", linkedControlIds: ["ASR-004"], collectionDate: "2026-04-10", validUntil: "2026-07-10", reviewer: "Governance Council", reviewResult: "verified", source: "Governance repository", confidentiality: "internal", independent: false, version: 1 },
  { id: "EV-024", title: "Privacy notice (customer) v4", type: "policy", owner: "DPO", linkedControlIds: ["PRV-004"], collectionDate: "2026-01-12", validUntil: "2027-01-12", reviewer: "Legal", reviewResult: "verified", source: "Website CMS", confidentiality: "public", independent: false, version: 4 },
  { id: "EV-025", title: "Control testing results — security baseline", type: "test_result", owner: "Internal Audit", linkedControlIds: ["ASR-002", "SEC-001"], collectionDate: "2026-03-22", validUntil: "2026-09-22", reviewer: "Audit Committee", reviewResult: "verified", source: "Audit workpapers", confidentiality: "confidential", independent: true, version: 1 },
];

// ---------------------------------------------------------------------------
// Exceptions (5)
// ---------------------------------------------------------------------------

export const EXCEPTIONS: Exception[] = [
  { id: "EX-001", title: "US storage of marketing contacts", subject: "PRV-005 Cross-border transfer controls", reason: "HubSpot region migration not yet complete.", affectedScope: "Marketing Contacts (DA-006)", riskId: "R-008", compensatingControls: "Access restricted; SCCs requested; no special-category data.", approver: "DPO", startDate: "2026-03-01", expiry: "2026-08-15", renewalStatus: "active" },
  { id: "EX-002", title: "Standing admin access for HRIS team", subject: "SEC-002 Periodic access reviews", reason: "JIT access tooling not yet deployed for Workday.", affectedScope: "Employee HR Master (DA-003)", riskId: "R-013", compensatingControls: "Quarterly manual reviews; enhanced logging.", approver: "CISO", startDate: "2026-02-15", expiry: "2026-07-15", renewalStatus: "expiring" },
  { id: "EX-003", title: "Code assistant in production pending validation", subject: "AIL-005 Independent model validation", reason: "Validation function still being established.", affectedScope: "AI Code Assistant (AI-003)", riskId: "R-009", compensatingControls: "Mandatory human code review; dependency scanning.", approver: "AI Governance Office", startDate: "2026-02-10", expiry: "2026-08-10", renewalStatus: "active" },
  { id: "EX-004", title: "Manual deletion for legacy billing archive", subject: "DLC-002 Secure deletion procedure", reason: "Automated deletion not supported by legacy archive.", affectedScope: "Billing & Invoices (DA-004)", riskId: "R-007", compensatingControls: "Documented manual deletion with sign-off.", approver: "Records Manager", startDate: "2025-12-01", expiry: "2026-06-01", renewalStatus: "expired" },
  { id: "EX-005", title: "Lead scoring live without full approval", subject: "AIL-006 AI deployment approval gate", reason: "Pre-dates the AI lifecycle process; remediation in progress.", affectedScope: "Lead Scoring Model (AI-005)", riskId: "R-006", compensatingControls: "Advisory use only; flagged for fast-track review.", approver: "AI Governance Office", startDate: "2026-04-01", expiry: "2026-07-01", renewalStatus: "active" },
];

// ---------------------------------------------------------------------------
// Incidents (3)
// ---------------------------------------------------------------------------

export const INCIDENTS: Incident[] = [
  { id: "INC-001", title: "Confidential roadmap pasted into public chatbot", category: "data", severity: "high", status: "resolved", affectedSystemIds: [], affectedIndividuals: "None directly; confidential business data exposed", detectedDate: "2026-02-22", containment: "Tool access blocked; provider deletion requested.", rootCause: "No technical control preventing use of unapproved tools.", correctiveActions: "Accelerated DLP rollout (ACT-005); reminder training.", notifications: "Internal only; no personal-data breach.", lessonsLearned: "Policy alone is insufficient without enforcement." },
  { id: "INC-002", title: "Support assistant produced inaccurate refund guidance", category: "harmful_output", severity: "moderate", status: "closed", affectedSystemIds: ["AI-001"], affectedIndividuals: "3 customers received incorrect guidance", detectedDate: "2026-03-15", containment: "Responses corrected; affected customers contacted.", rootCause: "Outdated knowledge-base article used for grounding.", correctiveActions: "KB review cadence added; grounding source check.", notifications: "Affected customers; internal incident log.", lessonsLearned: "Grounding quality directly affects output safety." },
  { id: "INC-003", title: "Procurement agent attempted duplicate purchase order", category: "agent_action", severity: "moderate", status: "contained", affectedSystemIds: ["AI-006"], affectedIndividuals: "None; internal financial process", detectedDate: "2026-04-18", containment: "Agent paused in design environment; action blocked by approval gate.", rootCause: "Missing idempotency check and incomplete guardrails.", correctiveActions: "Guardrails and kill-switch work prioritised (ACT-004).", notifications: "Finance and AI Governance Office.", lessonsLearned: "Agents require strict action limits before any production use." },
];

// ---------------------------------------------------------------------------
// Decisions (4)
// ---------------------------------------------------------------------------

export const DECISIONS: Decision[] = [
  { id: "DEC-001", title: "Adopt integrated Data and AI governance framework", context: "Separate data and AI efforts were duplicating controls.", optionsConsidered: ["Separate frameworks", "AI-only programme", "Integrated framework"], decisionMaker: "Governance Council", meeting: "Council — 2026-02-28", rationale: "Integration reduces duplication and reuses enterprise controls.", affectedControlIds: ["EGV-002", "POL-005"], affectedSystemIds: [], effectiveDate: "2026-03-01", reviewDate: "2027-03-01" },
  { id: "DEC-002", title: "Treat CV screening as high-risk pending legal review", context: "Employment-related AI may be high-risk under emerging regulation.", optionsConsidered: ["Limited risk", "High-risk (precautionary)"], decisionMaker: "AI Governance Office", meeting: "AI Review — 2026-03-12", rationale: "Precautionary classification until legal review confirms.", affectedControlIds: ["AIL-003", "RAI-002"], affectedSystemIds: ["AI-004"], effectiveDate: "2026-03-12", reviewDate: "2026-07-31" },
  { id: "DEC-003", title: "Accept hyperscaler concentration risk to year-end", context: "Multi-cloud would be costly relative to current benefit.", optionsConsidered: ["Multi-cloud now", "Accept and revisit at renewal"], decisionMaker: "Enterprise Risk", meeting: "Risk Committee — 2026-04-02", rationale: "Compensating controls adequate; revisit at contract renewal.", affectedControlIds: ["TPR-005"], affectedSystemIds: [], effectiveDate: "2026-04-02", reviewDate: "2026-12-01" },
  { id: "DEC-004", title: "Pause procurement agent in design until guardrails complete", context: "Agent attempted a duplicate PO during testing.", optionsConsidered: ["Continue build", "Pause until guardrails and kill-switch ready"], decisionMaker: "Governance Council", meeting: "Council — 2026-04-19", rationale: "No production progression without enforceable limits and kill-switch.", affectedControlIds: ["GAI-005", "GAI-006"], affectedSystemIds: ["AI-006"], effectiveDate: "2026-04-19", reviewDate: "2026-06-25" },
];

// ---------------------------------------------------------------------------
// Audit findings (6)
// ---------------------------------------------------------------------------

export const AUDIT_FINDINGS: AuditFinding[] = [
  { id: "AF-001", title: "AI inventory incomplete for embedded AI", domainId: "d3", severity: "high", status: "remediating", source: "internal_audit", description: "Embedded and SaaS AI features are not consistently captured in the inventory.", recommendation: "Run discovery and integrate procurement intake with the inventory.", owner: "AI Governance Office", dueDate: "2026-07-05", linkedControlIds: ["INV-002", "INV-004"] },
  { id: "AF-002", title: "Fairness testing missing for high-risk AI", domainId: "d8", severity: "critical", status: "open", source: "internal_audit", description: "CV screening lacks completed fairness testing before deployment.", recommendation: "Complete fairness assessment and block deployment until passed.", owner: "Responsible AI Reviewer", dueDate: "2026-06-15", linkedControlIds: ["RAI-002"] },
  { id: "AF-003", title: "Exceptions without expiry dates", domainId: "d13", severity: "moderate", status: "remediating", source: "self_assessment", description: "Some control exceptions lack expiry and renewal review.", recommendation: "Implement exception workflow enforcing expiry and compensating controls.", owner: "Governance Lead", dueDate: "2026-08-01", linkedControlIds: ["POL-003"] },
  { id: "AF-004", title: "Vendor governance gaps for AI suppliers", domainId: "d12", severity: "high", status: "open", source: "control_test", description: "AI suppliers lack AI-specific due diligence and contract clauses.", recommendation: "Apply AI procurement questionnaire and uplift contracts.", owner: "Procurement", dueDate: "2026-06-20", linkedControlIds: ["TPR-002", "TPR-003"] },
  { id: "AF-005", title: "Evidence currency for AI controls", domainId: "d14", severity: "moderate", status: "open", source: "internal_audit", description: "Several AI controls rely on outdated or unreviewed evidence.", recommendation: "Stand up evidence register and refresh stale evidence.", owner: "Governance Lead", dueDate: "2026-08-30", linkedControlIds: ["ASR-007"] },
  { id: "AF-006", title: "Cross-border transfer documentation missing", domainId: "d9", severity: "moderate", status: "remediating", source: "self_assessment", description: "US-hosted marketing data lacks a documented transfer assessment.", recommendation: "Complete transfer assessment and apply an approved mechanism.", owner: "DPO", dueDate: "2026-07-30", linkedControlIds: ["PRV-005"] },
];

// ---------------------------------------------------------------------------
// Framework versions (spec §26.20)
// ---------------------------------------------------------------------------

export const FRAMEWORK_VERSIONS: FrameworkVersion[] = [
  { id: "FV-1", label: "v1.0 — Baseline (Data Governance)", createdAt: "2025-09-15", status: "archived", note: "Initial data governance baseline before AI integration.", snapshot: { maturityIndex: 1.9, controlCoverage: 41, evidenceConfidence: 38, openRisks: 12 } },
  { id: "FV-2", label: "v2.0 — Integrated Data & AI (active)", createdAt: "2026-03-01", status: "active", note: "Integrated framework adding the AI governance overlay and GenAI/agent controls.", snapshot: { maturityIndex: 2.6, controlCoverage: 58, evidenceConfidence: 52, openRisks: 20 } },
];

// ---------------------------------------------------------------------------
// Seeded assessment responses — realistic spread (data more mature than AI).
// ---------------------------------------------------------------------------

const DOMAIN_PATTERN: Record<string, AssessmentAnswer[]> = {
  d1: ["defined", "informal", "partially_defined"],
  d2: ["defined", "implemented", "partially_defined"],
  d3: ["implemented", "defined", "implemented"],
  d4: ["partially_defined", "informal"],
  d5: ["defined", "partially_defined"],
  d6: ["defined", "partially_defined"],
  d7: ["informal", "partially_defined", "partially_defined", "informal"],
  d8: ["not_implemented", "informal", "not_implemented"],
  d9: ["implemented", "defined", "partially_defined"],
  d10: ["measured", "implemented", "informal", "implemented"],
  d11: ["informal", "informal", "not_implemented"],
  d12: ["partially_defined", "defined", "informal"],
  d13: ["defined", "partially_defined", "informal"],
  d14: ["partially_defined", "informal", "partially_defined"],
};

function buildResponses(): Record<string, AssessmentResponse> {
  const out: Record<string, AssessmentResponse> = {};
  const counters: Record<string, number> = {};
  for (const q of QUESTIONS) {
    const pattern = DOMAIN_PATTERN[q.domainId] ?? ["informal"];
    const idx = counters[q.domainId] ?? 0;
    counters[q.domainId] = idx + 1;
    const answer = pattern[idx % pattern.length];
    // Link a couple of evidence items where relevant for confidence demo.
    const evidenceIds = EVIDENCE.filter((e) =>
      e.linkedControlIds.some((c) => c.startsWith(q.domainId === "d10" ? "SEC" : "")),
    )
      .slice(0, 0)
      .map((e) => e.id);
    out[q.id] = {
      questionId: q.id,
      answer,
      evidenceIds,
      flaggedForReview: q.domainId === "d8" || q.id === "Q-D7-3",
      updatedAt: "2026-04-15T10:00:00.000Z",
      comment:
        q.id === "Q-D8-1"
          ? "Fairness testing for CV screening is incomplete — flagged for specialist review."
          : undefined,
    };
  }
  return out;
}

export const ASSESSMENT_RESPONSES: Record<string, AssessmentResponse> = buildResponses();

// ---------------------------------------------------------------------------
// Seed audit log (immutable trail demo, spec §21)
// ---------------------------------------------------------------------------

export const AUDIT_LOG: AuditLogEntry[] = [
  { id: "L-001", timestamp: "2026-04-19T14:05:00.000Z", actor: "Governance Council", action: "decision.record", entity: "Decision", entityId: "DEC-004", detail: "Paused procurement agent pending guardrails." },
  { id: "L-002", timestamp: "2026-04-18T09:12:00.000Z", actor: "Finance Ops", action: "incident.create", entity: "Incident", entityId: "INC-003", detail: "Agent attempted duplicate PO." },
  { id: "L-003", timestamp: "2026-04-15T10:00:00.000Z", actor: "Governance Lead", action: "assessment.update", entity: "Assessment", entityId: "v2.0", detail: "Updated maturity responses across 14 domains." },
  { id: "L-004", timestamp: "2026-04-12T16:30:00.000Z", actor: "Data Governance Office", action: "inventory.update", entity: "DataAsset", entityId: "DA-001", detail: "Reviewed customer account records." },
  { id: "L-005", timestamp: "2026-04-10T11:00:00.000Z", actor: "Governance Council", action: "review.complete", entity: "Evidence", entityId: "EV-023", detail: "Approved Q1 management review pack." },
  { id: "L-006", timestamp: "2026-03-12T13:20:00.000Z", actor: "AI Governance Office", action: "classification.change", entity: "AiSystem", entityId: "AI-004", detail: "Classified CV screening as high-risk (precautionary)." },
];
