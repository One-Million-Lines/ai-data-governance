// ============================================================================
// Governance Studio — core domain types
// A single, fully-connected model shared by every screen.
// ============================================================================

export type ID = string;

// ---------------------------------------------------------------------------
// Reference / enums
// ---------------------------------------------------------------------------

export type GovernanceLayer = "enterprise" | "data" | "ai";

export type MaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;

/** Assessment response scale (spec §5 step 5). */
export type AssessmentAnswer =
  | "not_assessed"
  | "not_implemented"
  | "informal"
  | "partially_defined"
  | "defined"
  | "implemented"
  | "measured"
  | "optimised"
  | "not_applicable";

export type RiskTreatment = "avoid" | "reduce" | "transfer" | "accept" | "investigate";

export type AiRiskTier = "minimal" | "limited" | "elevated" | "high" | "unacceptable";

export type RegulatoryClass =
  | "unclassified"
  | "out_of_scope"
  | "minimal_risk"
  | "transparency_obligations"
  | "high_risk"
  | "prohibited";

export type LifecycleStage =
  | "intake"
  | "screening"
  | "design"
  | "build"
  | "validation"
  | "approval"
  | "production"
  | "monitoring"
  | "retired";

export type GateStatus =
  | "not_started"
  | "in_review"
  | "changes_requested"
  | "approved_with_conditions"
  | "approved"
  | "rejected"
  | "suspended"
  | "retired";

export type PolicyStatus = "draft" | "in_review" | "approved" | "published" | "superseded" | "retired";

export type ControlStatus =
  | "not_implemented"
  | "planned"
  | "in_progress"
  | "implemented"
  | "operating"
  | "needs_review";

export type ActionStatus = "not_started" | "in_progress" | "blocked" | "in_review" | "done";

export type ActionPhase = "foundation" | "operationalise" | "optimise";

export type Priority = "low" | "medium" | "high" | "critical";

export type Classification = "public" | "internal" | "confidential" | "restricted";

export type ReferenceKind =
  | "legal_requirement"
  | "regulatory_guidance"
  | "voluntary_framework"
  | "internal_policy"
  | "recommended_practice";

export type Severity = "low" | "moderate" | "high" | "critical";

// ---------------------------------------------------------------------------
// Domains & capabilities (spec §4 — 14 domains)
// ---------------------------------------------------------------------------

export interface Capability {
  id: ID;
  domainId: ID;
  name: string;
  description: string;
  layers: GovernanceLayer[];
}

export interface GovernanceDomain {
  id: ID;
  index: number;
  name: string;
  shortName: string;
  icon: string;
  summary: string;
  layers: GovernanceLayer[];
  outputs: string[];
  capabilities: Capability[];
  /** Domains this one materially depends on (dependency view). */
  dependsOn: ID[];
}

// ---------------------------------------------------------------------------
// Controls (spec §14 — 100+ original controls)
// ---------------------------------------------------------------------------

export interface FrameworkMapping {
  frameworkId: ID;
  reference: string;
}

export interface Control {
  id: ID;
  title: string;
  domainId: ID;
  capabilityId: ID;
  objective: string;
  statement: string;
  rationale: string;
  applicability: string[];
  minimumImplementation: string;
  advancedImplementation: string;
  owner: string;
  reviewer: string;
  frequency: string;
  evidenceExamples: string[];
  testingProcedure: string;
  dependencies: ID[];
  frameworkMappings: FrameworkMapping[];
  jurisdictionTags: string[];
  industryTags: string[];
  dataGovernance: boolean;
  aiGovernance: boolean;
  genAi: boolean;
  required: boolean;
  // Operational, tenant-specific state:
  status: ControlStatus;
  active: boolean;
  lastReview?: string;
  nextReview?: string;
  version: number;
}

// ---------------------------------------------------------------------------
// Assessment engine (spec §9)
// ---------------------------------------------------------------------------

export type QuestionType =
  | "single"
  | "multi"
  | "yesno"
  | "scale"
  | "number"
  | "date"
  | "text";

export interface QuestionOption {
  id: string;
  label: string;
  maturity?: MaturityLevel;
}

export interface ApplicabilityRule {
  /** profile flag key that must be truthy for this question to apply */
  profileFlag?: string;
  /** another question's id whose answer must match `equals` */
  questionId?: string;
  equals?: string | boolean;
  includes?: string;
}

export interface AssessmentQuestion {
  id: ID;
  domainId: ID;
  capabilityId: ID;
  text: string;
  explanation: string;
  type: QuestionType;
  options?: QuestionOption[];
  riskWeight: number;
  expectedEvidence: string;
  suggestedOwner: string;
  relatedFrameworks: string[];
  maturityMapped: boolean;
  applicability?: ApplicabilityRule[];
}

export interface AssessmentResponse {
  questionId: ID;
  answer?: AssessmentAnswer;
  value?: string | number | string[] | boolean;
  notApplicableReason?: string;
  comment?: string;
  ownerId?: ID;
  evidenceIds: ID[];
  flaggedForReview: boolean;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Maturity model (spec §10)
// ---------------------------------------------------------------------------

export interface MaturityDefinition {
  level: MaturityLevel;
  name: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Frameworks (spec §20)
// ---------------------------------------------------------------------------

export interface FrameworkReference {
  id: ID;
  name: string;
  source: string;
  version: string;
  effectiveDate: string;
  lastReviewed: string;
  jurisdiction: string;
  kind: ReferenceKind;
  status: "active" | "monitoring" | "draft";
  summary: string;
}

// ---------------------------------------------------------------------------
// Organisation & profile (spec §3)
// ---------------------------------------------------------------------------

export interface OrganisationProfile {
  name: string;
  industry: string;
  ownership: "public" | "private" | "nonprofit";
  employees: string;
  scale: string;
  countries: string[];
  legalEntities: string[];
  businessUnits: string[];
  customerGroups: string[];
  servesChildren: boolean;
  regulatedIndustry: boolean;
  existingGrcFunctions: string[];
  objectives: string[];
  scope: string[];
  dataProfile: string[];
  aiProfile: string[];
  currentMaturity: string[];
  standards: string[];
}

// ---------------------------------------------------------------------------
// Inventories (spec §13)
// ---------------------------------------------------------------------------

export interface DataAsset {
  id: ID;
  name: string;
  description: string;
  domainId: ID;
  owner?: string;
  steward?: string;
  custodian?: string;
  source: string;
  system: string;
  location: string;
  classification: Classification;
  personalData: boolean;
  specialCategory: boolean;
  criticality: Priority;
  qualityStatus: "good" | "fair" | "poor" | "unknown";
  retention: string;
  residency: string;
  lawfulPurpose?: string;
  consumers: string[];
  linkedAiSystemIds: ID[];
  linkedRiskIds: ID[];
  linkedControlIds: ID[];
  lastReview?: string;
}

export interface AiSystem {
  id: ID;
  name: string;
  description: string;
  owner?: string;
  provider: string;
  deployer: string;
  model: string;
  intendedPurpose: string;
  users: string;
  affectedPeople: string;
  lifecycleStage: LifecycleStage;
  riskTier: AiRiskTier;
  regulatoryClass: RegulatoryClass;
  regulatoryAssumptions: string;
  datasetIds: ID[];
  vendorId?: ID;
  integrations: string[];
  autonomy: "assistive" | "human_in_loop" | "human_on_loop" | "autonomous_agent";
  humanOversight: string;
  validationStatus: "not_started" | "in_progress" | "validated" | "failed";
  monitoringStatus: "none" | "manual" | "automated";
  incidentIds: ID[];
  approvalGate: GateStatus;
  limitations: string;
  lastMaterialChange?: string;
  nextReview?: string;
  retired: boolean;
  genAi: boolean;
  isAgent: boolean;
  /** agent guardrails (spec §11) */
  agentGuardrails?: AgentGuardrails;
}

export interface AgentGuardrails {
  tools: string[];
  dataAccess: string[];
  reversibleActions: boolean;
  maxImpact: string;
  approvalThreshold: string;
  rateLimits: string;
  killSwitch: boolean;
}

export interface Vendor {
  id: ID;
  name: string;
  service: string;
  criticality: Priority;
  systemsSupplied: string[];
  dataAccess: boolean;
  modelAccess: boolean;
  subprocessors: string[];
  countries: string[];
  contractStart?: string;
  contractEnd?: string;
  securityStatus: AssuranceStatus;
  privacyStatus: AssuranceStatus;
  aiGovernanceStatus: AssuranceStatus;
  auditRights: boolean;
  exitPlan: boolean;
  openRiskIds: ID[];
  nextReview?: string;
}

export type AssuranceStatus = "verified" | "in_progress" | "gap" | "not_assessed";

// ---------------------------------------------------------------------------
// Risk engine (spec §11/§17 impact dimensions)
// ---------------------------------------------------------------------------

export type ImpactDimension =
  | "legal"
  | "individual_rights"
  | "fairness"
  | "safety"
  | "privacy"
  | "security"
  | "operational"
  | "financial"
  | "reputational"
  | "strategic"
  | "customer"
  | "workforce"
  | "societal";

export interface Risk {
  id: ID;
  title: string;
  description: string;
  domainId: ID;
  category: string;
  affectedAssetIds: ID[];
  affectedStakeholders: string[];
  cause: string;
  event: string;
  consequence: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impacts: Partial<Record<ImpactDimension, 1 | 2 | 3 | 4 | 5>>;
  controlIds: ID[];
  controlEffectiveness: "ineffective" | "partial" | "effective" | "not_tested";
  owner?: string;
  treatment: RiskTreatment;
  acceptance?: RiskAcceptance;
  reviewDate?: string;
  escalationThreshold: string;
}

export interface RiskAcceptance {
  approver: string;
  rationale: string;
  expiry: string;
  compensatingControls: string;
  reviewDate: string;
}

// ---------------------------------------------------------------------------
// Policies (spec §15)
// ---------------------------------------------------------------------------

export interface PolicySection {
  id: ID;
  heading: string;
  guidance: string;
  body: string;
}

export interface Policy {
  id: ID;
  title: string;
  layer: GovernanceLayer;
  category: "policy" | "standard" | "procedure" | "guideline";
  status: PolicyStatus;
  owner?: string;
  approver?: string;
  effectiveDate?: string;
  nextReview?: string;
  version: number;
  summary: string;
  sections: PolicySection[];
  linkedControlIds: ID[];
  acknowledgement: number; // % of workforce that has acknowledged
}

// ---------------------------------------------------------------------------
// Evidence (spec §16)
// ---------------------------------------------------------------------------

export type EvidenceType =
  | "policy"
  | "procedure"
  | "meeting_minutes"
  | "approval"
  | "access_review"
  | "audit_report"
  | "test_result"
  | "system_config"
  | "screenshot"
  | "dashboard"
  | "training_record"
  | "contract"
  | "assessment"
  | "model_card"
  | "data_sheet"
  | "incident_record"
  | "monitoring_output";

export interface Evidence {
  id: ID;
  title: string;
  type: EvidenceType;
  owner?: string;
  linkedControlIds: ID[];
  linkedAssetId?: ID;
  linkedAiSystemId?: ID;
  collectionDate: string;
  validUntil?: string;
  reviewer?: string;
  reviewResult: "verified" | "needs_update" | "rejected" | "not_reviewed";
  source: string;
  confidentiality: Classification;
  independent: boolean;
  version: number;
}

// ---------------------------------------------------------------------------
// Roadmap actions (spec §17)
// ---------------------------------------------------------------------------

export interface Action {
  id: ID;
  title: string;
  description: string;
  domainId: ID;
  controlId?: ID;
  riskReduced?: ID;
  owner?: string;
  contributors: string[];
  effort: "S" | "M" | "L" | "XL";
  estimatedCost: string;
  targetDate?: string;
  dependencyIds: ID[];
  phase: ActionPhase;
  priority: Priority;
  status: ActionStatus;
  evidenceRequired: string;
  successCriteria: string;
  // transparent prioritisation inputs
  scoring: ActionScoring;
}

export interface ActionScoring {
  residualRisk: number; // 1-5
  gapSeverity: number; // 1-5
  regulatoryUrgency: number; // 1-5
  dependencyValue: number; // 1-5
  strategicValue: number; // 1-5
  effortScore: number; // 1-5 (lower effort = higher score)
}

// ---------------------------------------------------------------------------
// Decisions / exceptions / incidents (spec §18)
// ---------------------------------------------------------------------------

export interface Decision {
  id: ID;
  title: string;
  context: string;
  optionsConsidered: string[];
  decisionMaker: string;
  meeting: string;
  rationale: string;
  affectedControlIds: ID[];
  affectedSystemIds: ID[];
  effectiveDate: string;
  reviewDate?: string;
}

export interface Exception {
  id: ID;
  title: string;
  subject: string; // control or policy reference
  reason: string;
  affectedScope: string;
  riskId?: ID;
  compensatingControls: string;
  approver: string;
  startDate: string;
  expiry: string; // never permanent
  renewalStatus: "active" | "expiring" | "expired" | "renewed";
}

export type IncidentCategory =
  | "data"
  | "privacy"
  | "security"
  | "ai"
  | "model_failure"
  | "harmful_output"
  | "discrimination"
  | "vendor"
  | "agent_action";

export interface Incident {
  id: ID;
  title: string;
  category: IncidentCategory;
  severity: Severity;
  status: "open" | "contained" | "resolved" | "closed";
  affectedSystemIds: ID[];
  affectedIndividuals: string;
  detectedDate: string;
  containment: string;
  rootCause: string;
  correctiveActions: string;
  notifications: string;
  lessonsLearned: string;
}

// ---------------------------------------------------------------------------
// Assurance / audit (spec §14 d14)
// ---------------------------------------------------------------------------

export interface AuditFinding {
  id: ID;
  title: string;
  domainId: ID;
  severity: Severity;
  status: "open" | "remediating" | "closed";
  source: "internal_audit" | "external_audit" | "self_assessment" | "control_test";
  description: string;
  recommendation: string;
  owner?: string;
  dueDate?: string;
  linkedControlIds: ID[];
}

// ---------------------------------------------------------------------------
// Audit log (spec §21 immutable trail)
// ---------------------------------------------------------------------------

export interface AuditLogEntry {
  id: ID;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityId: ID;
  detail: string;
}

// ---------------------------------------------------------------------------
// Framework version (spec §22 / §26.20)
// ---------------------------------------------------------------------------

export interface FrameworkVersion {
  id: ID;
  label: string;
  createdAt: string;
  status: "active" | "archived" | "draft";
  note: string;
  snapshot?: {
    maturityIndex: number;
    controlCoverage: number;
    evidenceConfidence: number;
    openRisks: number;
  };
}

// ---------------------------------------------------------------------------
// Computed scores (spec §7 — never one merged score)
// ---------------------------------------------------------------------------

export interface DomainScore {
  domainId: ID;
  maturity: number; // 0-5 (self reported)
  evidenceMaturity: number; // 0-5 (capped by evidence)
  targetMaturity: number; // 0-5
  controlCoverage: number; // 0-100
  evidenceConfidence: number; // 0-100
  residualRisk: number; // 0-100 (higher = worse)
  assessmentCompleteness: number; // 0-100
}

export interface GovernanceScores {
  byDomain: Record<ID, DomainScore>;
  maturityIndex: number; // 0-5
  dataMaturity: number;
  aiMaturity: number;
  controlImplementation: number; // 0-100
  evidenceConfidence: number; // 0-100
  residualRisk: number; // 0-100
  assessmentCompleteness: number; // 0-100
}

export type HealthMetric =
  | "maturity"
  | "controlCoverage"
  | "evidenceConfidence"
  | "residualRisk"
  | "targetVsCurrent";
