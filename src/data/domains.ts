import type { GovernanceDomain, MaturityDefinition, FrameworkReference } from "@/types";

// ---------------------------------------------------------------------------
// 14 governance domains (spec §4) with capabilities and dependencies.
// ---------------------------------------------------------------------------

export const DOMAINS: GovernanceDomain[] = [
  {
    id: "d1",
    index: 1,
    name: "Strategy, Mandate & Business Alignment",
    shortName: "Strategy & Mandate",
    icon: "Compass",
    summary:
      "Establish the governance purpose, executive mandate, scope, risk appetite and value measurement that everything else depends on.",
    layers: ["enterprise"],
    outputs: [
      "Governance Charter",
      "Scope Statement",
      "Governance Principles",
      "Executive Mandate",
      "Risk Appetite Statement",
      "Business Case",
      "Success Metrics",
    ],
    dependsOn: [],
    capabilities: [
      { id: "c1.1", domainId: "d1", name: "Mandate & sponsorship", description: "Executive mandate, board oversight and accountable sponsorship.", layers: ["enterprise"] },
      { id: "c1.2", domainId: "d1", name: "Scope & principles", description: "Programme scope, governance principles and strategic alignment.", layers: ["enterprise"] },
      { id: "c1.3", domainId: "d1", name: "Risk appetite", description: "Defined and approved risk appetite for data and AI.", layers: ["enterprise"] },
      { id: "c1.4", domainId: "d1", name: "Value & funding", description: "Business case, funding, staffing and value measurement.", layers: ["enterprise"] },
    ],
  },
  {
    id: "d2",
    index: 2,
    name: "Organisation, Roles & Decision Rights",
    shortName: "Roles & Decisions",
    icon: "Users",
    summary:
      "Define who governs what: councils, offices, owners, stewards and the decision rights, RACI and escalation paths that make accountability real.",
    layers: ["enterprise"],
    outputs: [
      "Governance Operating Model",
      "Organisation Chart",
      "RACI Matrix",
      "Committee Terms of Reference",
      "Decision Rights Matrix",
      "Escalation Process",
    ],
    dependsOn: ["d1"],
    capabilities: [
      { id: "c2.1", domainId: "d2", name: "Governance bodies", description: "Council, data office, AI office and committee terms of reference.", layers: ["enterprise"] },
      { id: "c2.2", domainId: "d2", name: "Roles & ownership", description: "Owners, stewards, custodians, model owners and validators.", layers: ["enterprise", "data", "ai"] },
      { id: "c2.3", domainId: "d2", name: "Decision rights & RACI", description: "Decision rights matrix, RACI and delegated authority.", layers: ["enterprise"] },
      { id: "c2.4", domainId: "d2", name: "Escalation & segregation", description: "Escalation paths, segregation of duties and conflict resolution.", layers: ["enterprise"] },
    ],
  },
  {
    id: "d3",
    index: 3,
    name: "Inventory, Discovery & Classification",
    shortName: "Inventory",
    icon: "Boxes",
    summary:
      "Maintain connected registers of data, systems, AI, models, vendors and processing, with classification by sensitivity, criticality and impact.",
    layers: ["enterprise", "data", "ai"],
    outputs: ["Data Inventory", "AI System Inventory", "Processing Register", "Classification Scheme"],
    dependsOn: ["d2"],
    capabilities: [
      { id: "c3.1", domainId: "d3", name: "Asset discovery", description: "Discovery of data, systems, AI use-cases, models and shadow AI.", layers: ["data", "ai"] },
      { id: "c3.2", domainId: "d3", name: "Connected inventories", description: "Separate but linked records for assets, systems and vendors.", layers: ["data", "ai"] },
      { id: "c3.3", domainId: "d3", name: "Classification schemes", description: "Sensitivity, criticality, AI impact and regulatory classification.", layers: ["data", "ai"] },
    ],
  },
  {
    id: "d4",
    index: 4,
    name: "Data Architecture, Metadata & Lineage",
    shortName: "Architecture & Lineage",
    icon: "Network",
    summary:
      "Provide the business glossary, metadata, lineage and data products that make data understandable, traceable and interoperable.",
    layers: ["data"],
    outputs: ["Business Glossary", "Data Domain Map", "Data Lineage Register", "Data Product Register", "Metadata Standards"],
    dependsOn: ["d3"],
    capabilities: [
      { id: "c4.1", domainId: "d4", name: "Glossary & metadata", description: "Business glossary, technical and operational metadata.", layers: ["data"] },
      { id: "c4.2", domainId: "d4", name: "Lineage & traceability", description: "Source-to-report and model-to-data lineage.", layers: ["data", "ai"] },
      { id: "c4.3", domainId: "d4", name: "Domains & data products", description: "Data domains, products, contracts and residency.", layers: ["data"] },
    ],
  },
  {
    id: "d5",
    index: 5,
    name: "Data Quality & Reliability",
    shortName: "Data Quality",
    icon: "BadgeCheck",
    summary:
      "Measure and improve completeness, accuracy, validity, timeliness and the suitability of data for analytics and AI training.",
    layers: ["data"],
    outputs: ["Data Quality Standard", "Critical Data Element Register", "Quality Rule Library", "Issue Register", "Quality Dashboard"],
    dependsOn: ["d4"],
    capabilities: [
      { id: "c5.1", domainId: "d5", name: "Quality dimensions & rules", description: "Dimensions, thresholds and quality rules for critical data.", layers: ["data"] },
      { id: "c5.2", domainId: "d5", name: "Issue management", description: "Detection, root-cause analysis, remediation and SLAs.", layers: ["data"] },
      { id: "c5.3", domainId: "d5", name: "Training-data suitability", description: "Representative, sufficiently accurate and well-labelled training data.", layers: ["data", "ai"] },
    ],
  },
  {
    id: "d6",
    index: 6,
    name: "Data Lifecycle, Records & Information Management",
    shortName: "Data Lifecycle",
    icon: "Recycle",
    summary:
      "Govern data from creation to deletion: minimisation, retention, archiving, legal holds, secure disposal and records management.",
    layers: ["data"],
    outputs: ["Data Lifecycle Standard", "Retention Schedule", "Deletion Procedure", "Records Register", "Legal Hold Procedure"],
    dependsOn: ["d3"],
    capabilities: [
      { id: "c6.1", domainId: "d6", name: "Minimisation & retention", description: "Data minimisation, purpose limitation and retention schedules.", layers: ["data"] },
      { id: "c6.2", domainId: "d6", name: "Deletion & legal holds", description: "Deletion, legal holds, archiving and secure disposal.", layers: ["data"] },
      { id: "c6.3", domainId: "d6", name: "Records & migration", description: "Records management, backups, restoration and decommissioning.", layers: ["data"] },
    ],
  },
  {
    id: "d7",
    index: 7,
    name: "AI Portfolio & Lifecycle Governance",
    shortName: "AI Lifecycle",
    icon: "Workflow",
    summary:
      "Govern every AI system from intake to retirement with risk tiers, impact assessments, validation, approval gates and ongoing monitoring.",
    layers: ["ai"],
    outputs: ["AI Risk Classification", "Model Cards", "Lifecycle Gate Records", "Validation Reports", "Monitoring Plans"],
    dependsOn: ["d3", "d5"],
    capabilities: [
      { id: "c7.1", domainId: "d7", name: "Intake & screening", description: "Use-case intake, business justification and initial screening.", layers: ["ai"] },
      { id: "c7.2", domainId: "d7", name: "Risk & regulatory classification", description: "Separate enterprise risk tier and regulatory classification.", layers: ["ai"] },
      { id: "c7.3", domainId: "d7", name: "Validation & approval gates", description: "Testing, independent validation and deployment approval.", layers: ["ai"] },
      { id: "c7.4", domainId: "d7", name: "Monitoring & change control", description: "Production monitoring, material-change and reassessment.", layers: ["ai"] },
      { id: "c7.5", domainId: "d7", name: "Retirement", description: "Controlled retirement and rollback of AI systems.", layers: ["ai"] },
    ],
  },
  {
    id: "d8",
    index: 8,
    name: "Responsible AI, Ethics & Human Impact",
    shortName: "Responsible AI",
    icon: "Scale",
    summary:
      "Address fairness, transparency, human oversight, contestability and the impact of AI on individuals, employees and society.",
    layers: ["ai"],
    outputs: ["Responsible AI Principles", "AI Impact Assessment", "Fairness Assessment", "Human Oversight Plan", "Appeals Process"],
    dependsOn: ["d7"],
    capabilities: [
      { id: "c8.1", domainId: "d8", name: "Fairness & non-discrimination", description: "Fairness testing, accessibility and protection of vulnerable groups.", layers: ["ai"] },
      { id: "c8.2", domainId: "d8", name: "Transparency & explainability", description: "Disclosure, explainability and transparency notices.", layers: ["ai"] },
      { id: "c8.3", domainId: "d8", name: "Human oversight & contestability", description: "Human oversight, appeals and grievance mechanisms.", layers: ["ai"] },
    ],
  },
  {
    id: "d9",
    index: 9,
    name: "Privacy & Individual Rights",
    shortName: "Privacy",
    icon: "UserCheck",
    summary:
      "Ensure lawful, minimised and transparent processing of personal data, with rights handling, DPIAs and cross-border transfer controls.",
    layers: ["enterprise", "data", "ai"],
    outputs: ["Privacy Screening", "DPIA", "Records of Processing", "Privacy Notice", "Transfer Assessment", "Rights Procedure"],
    dependsOn: ["d3", "d6"],
    capabilities: [
      { id: "c9.1", domainId: "d9", name: "Lawful basis & minimisation", description: "Lawful basis, purpose limitation and minimisation.", layers: ["data"] },
      { id: "c9.2", domainId: "d9", name: "Rights & transparency", description: "Data-subject rights, notices and consent.", layers: ["data"] },
      { id: "c9.3", domainId: "d9", name: "DPIA & AI privacy", description: "Privacy impact assessments, profiling and re-identification risk.", layers: ["data", "ai"] },
      { id: "c9.4", domainId: "d9", name: "Transfers", description: "Cross-border transfers and controller/processor roles.", layers: ["data"] },
    ],
  },
  {
    id: "d10",
    index: 10,
    name: "Security, Resilience & Technical Controls",
    shortName: "Security & Resilience",
    icon: "ShieldCheck",
    summary:
      "Protect data and AI through identity, encryption, secure development, monitoring, AI-specific threats and resilient recovery.",
    layers: ["enterprise", "data", "ai"],
    outputs: ["Security Control Baseline", "AI Security Assessment", "Threat Model", "Incident Playbook", "Resilience Plan", "Access Review Record"],
    dependsOn: ["d3"],
    capabilities: [
      { id: "c10.1", domainId: "d10", name: "Identity & access", description: "IAM, role-based and privileged access, access reviews.", layers: ["enterprise", "data"] },
      { id: "c10.2", domainId: "d10", name: "Protection & secure development", description: "Encryption, secrets, DevSecOps and MLOps security.", layers: ["enterprise", "data", "ai"] },
      { id: "c10.3", domainId: "d10", name: "AI threats", description: "Prompt injection, data poisoning, model theft and leakage.", layers: ["ai"] },
      { id: "c10.4", domainId: "d10", name: "Resilience & recovery", description: "Backup, recovery, continuity and incident response.", layers: ["enterprise"] },
    ],
  },
  {
    id: "d11",
    index: 11,
    name: "Generative AI & Autonomous-Agent Governance",
    shortName: "GenAI & Agents",
    icon: "Bot",
    summary:
      "Govern approved GenAI tools, prompt-data handling, output verification and the permissions, limits and kill-switches for autonomous agents.",
    layers: ["ai"],
    outputs: ["GenAI Acceptable Use Policy", "Agent Permission Matrix", "GenAI Evaluation Plan", "Prompt & Output Standard", "Human Approval Rules"],
    dependsOn: ["d7", "d10"],
    capabilities: [
      { id: "c11.1", domainId: "d11", name: "Approved tools & prompt data", description: "Approved tools, confidential-data leakage and shadow AI.", layers: ["ai"] },
      { id: "c11.2", domainId: "d11", name: "Output quality & IP", description: "Hallucinations, grounding, copyright and disclosure.", layers: ["ai"] },
      { id: "c11.3", domainId: "d11", name: "Agent permissions & limits", description: "Tools, data, action limits, approval thresholds and kill-switch.", layers: ["ai"] },
      { id: "c11.4", domainId: "d11", name: "Evaluation & red teaming", description: "Evaluation datasets, red teaming and emergency shutdown.", layers: ["ai"] },
    ],
  },
  {
    id: "d12",
    index: 12,
    name: "Third-Party, Procurement & Supply-Chain Governance",
    shortName: "Third-Party",
    icon: "Handshake",
    summary:
      "Assess and monitor model providers, cloud, data and open-source suppliers across security, privacy, AI use, exit and concentration risk.",
    layers: ["enterprise", "data", "ai"],
    outputs: ["Vendor Assessment", "AI Procurement Questionnaire", "Contract Clause Checklist", "Approved Vendor Register", "Exit Plan"],
    dependsOn: ["d3"],
    capabilities: [
      { id: "c12.1", domainId: "d12", name: "Intake & due diligence", description: "Vendor intake, classification and due diligence.", layers: ["enterprise"] },
      { id: "c12.2", domainId: "d12", name: "Contractual safeguards", description: "Data usage, IP, audit rights and incident notification.", layers: ["enterprise"] },
      { id: "c12.3", domainId: "d12", name: "Monitoring & exit", description: "Concentration risk, exit planning and ongoing monitoring.", layers: ["enterprise"] },
    ],
  },
  {
    id: "d13",
    index: 13,
    name: "Policies, Controls & Governance Operations",
    shortName: "Policies & Operations",
    icon: "FileText",
    summary:
      "Run governance day to day: the policy hierarchy, control library, exceptions, decision logs, training and AI/data literacy.",
    layers: ["enterprise"],
    outputs: ["Policy Library", "Control Library", "Exception Register", "Decision Log", "Training Programme"],
    dependsOn: ["d2"],
    capabilities: [
      { id: "c13.1", domainId: "d13", name: "Policy hierarchy", description: "Policies, standards, procedures, approvals and review cycles.", layers: ["enterprise"] },
      { id: "c13.2", domainId: "d13", name: "Control library & exceptions", description: "Control library, exceptions, waivers and compensating controls.", layers: ["enterprise"] },
      { id: "c13.3", domainId: "d13", name: "Operations & literacy", description: "Decision logs, change management, training and literacy.", layers: ["enterprise"] },
    ],
  },
  {
    id: "d14",
    index: 14,
    name: "Assurance, Audit, Metrics & Continuous Improvement",
    shortName: "Assurance & Audit",
    icon: "ClipboardCheck",
    summary:
      "Provide independent assurance through control testing, audit, metrics, management review and continuous framework improvement.",
    layers: ["enterprise"],
    outputs: ["Audit Plan", "Control Testing Plan", "Evidence Register", "Findings Register", "Management Review Pack", "Metrics Dashboard"],
    dependsOn: ["d13"],
    capabilities: [
      { id: "c14.1", domainId: "d14", name: "Control testing & assurance", description: "Self-assessment, control testing and independent validation.", layers: ["enterprise"] },
      { id: "c14.2", domainId: "d14", name: "Audit & findings", description: "Internal/external audit, findings and remediation.", layers: ["enterprise"] },
      { id: "c14.3", domainId: "d14", name: "Metrics & improvement", description: "Metrics, maturity reassessment, lessons learned and updates.", layers: ["enterprise"] },
    ],
  },
];

export const DOMAIN_MAP: Record<string, GovernanceDomain> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
);

export const CAPABILITIES = DOMAINS.flatMap((d) => d.capabilities);
export const CAPABILITY_MAP = Object.fromEntries(CAPABILITIES.map((c) => [c.id, c]));

// ---------------------------------------------------------------------------
// Six-level maturity model (spec §10)
// ---------------------------------------------------------------------------

export const MATURITY_MODEL: MaturityDefinition[] = [
  { level: 0, name: "Absent", description: "No recognised process, owner or control." },
  { level: 1, name: "Ad hoc", description: "Activities happen inconsistently and depend on individuals." },
  { level: 2, name: "Repeatable", description: "Some repeatable practices exist but are not consistently documented or governed." },
  { level: 3, name: "Defined", description: "Policies, roles, processes and controls are documented and approved." },
  { level: 4, name: "Managed", description: "Controls are implemented, monitored and supported by evidence and metrics." },
  { level: 5, name: "Optimised", description: "Governance is continuously improved using automation, testing, lessons learned and performance data." },
];

// Self-reported maturity above this level requires verified evidence (spec §10).
export const EVIDENCE_REQUIRED_FROM_LEVEL = 4;

// ---------------------------------------------------------------------------
// Framework reference packs (spec §20) — original summaries, no verbatim text.
// ---------------------------------------------------------------------------

export const FRAMEWORKS: FrameworkReference[] = [
  { id: "iso42001", name: "ISO/IEC 42001", source: "ISO/IEC", version: "2023", effectiveDate: "2023-12-18", lastReviewed: "2026-04-10", jurisdiction: "International", kind: "voluntary_framework", status: "active", summary: "AI management system requirements for governing AI responsibly across its lifecycle." },
  { id: "iso23894", name: "ISO/IEC 23894", source: "ISO/IEC", version: "2023", effectiveDate: "2023-02-06", lastReviewed: "2026-04-10", jurisdiction: "International", kind: "voluntary_framework", status: "active", summary: "Guidance on managing risk specific to organisations developing or using AI." },
  { id: "iso42005", name: "ISO/IEC 42005", source: "ISO/IEC", version: "2025", effectiveDate: "2025-05-01", lastReviewed: "2026-04-10", jurisdiction: "International", kind: "voluntary_framework", status: "monitoring", summary: "Guidance for conducting AI system impact assessments." },
  { id: "iso27001", name: "ISO/IEC 27001", source: "ISO/IEC", version: "2022", effectiveDate: "2022-10-25", lastReviewed: "2026-04-10", jurisdiction: "International", kind: "voluntary_framework", status: "active", summary: "Information security management system requirements." },
  { id: "iso27701", name: "ISO/IEC 27701", source: "ISO/IEC", version: "2019", effectiveDate: "2019-08-06", lastReviewed: "2026-04-10", jurisdiction: "International", kind: "voluntary_framework", status: "active", summary: "Privacy information management extension to ISO/IEC 27001." },
  { id: "nistairmf", name: "NIST AI RMF", source: "NIST", version: "1.0", effectiveDate: "2023-01-26", lastReviewed: "2026-04-10", jurisdiction: "United States", kind: "voluntary_framework", status: "active", summary: "Voluntary framework to map, measure, manage and govern AI risk." },
  { id: "nistgenai", name: "NIST Generative AI Profile", source: "NIST", version: "1.0", effectiveDate: "2024-07-26", lastReviewed: "2026-04-10", jurisdiction: "United States", kind: "regulatory_guidance", status: "active", summary: "Companion profile addressing risks unique to generative AI." },
  { id: "nistcsf", name: "NIST Cybersecurity Framework", source: "NIST", version: "2.0", effectiveDate: "2024-02-26", lastReviewed: "2026-04-10", jurisdiction: "United States", kind: "voluntary_framework", status: "active", summary: "Outcome-based framework to govern, identify, protect, detect, respond and recover." },
  { id: "nistprivacy", name: "NIST Privacy Framework", source: "NIST", version: "1.0", effectiveDate: "2020-01-16", lastReviewed: "2026-04-10", jurisdiction: "United States", kind: "voluntary_framework", status: "active", summary: "Framework to manage privacy risk and build trustworthy data processing." },
  { id: "oecd", name: "OECD AI Principles", source: "OECD", version: "2024", effectiveDate: "2019-05-22", lastReviewed: "2026-04-10", jurisdiction: "International", kind: "recommended_practice", status: "active", summary: "Intergovernmental principles for trustworthy and human-centred AI." },
  { id: "euaiact", name: "EU AI Act", source: "European Union", version: "Regulation 2024/1689", effectiveDate: "2024-08-01", lastReviewed: "2026-04-10", jurisdiction: "European Union", kind: "legal_requirement", status: "active", summary: "Risk-based legal framework regulating AI systems placed on the EU market." },
  { id: "gdpr", name: "GDPR", source: "European Union", version: "Regulation 2016/679", effectiveDate: "2018-05-25", lastReviewed: "2026-04-10", jurisdiction: "European Union / EEA", kind: "legal_requirement", status: "active", summary: "Regulation governing the processing of personal data of individuals in the EEA." },
  { id: "dcam", name: "DCAM concepts", source: "EDM Council", version: "2.2", effectiveDate: "2020-01-01", lastReviewed: "2026-04-10", jurisdiction: "International", kind: "voluntary_framework", status: "active", summary: "Data management capability concepts for assessing data governance maturity." },
];

export const FRAMEWORK_MAP = Object.fromEntries(FRAMEWORKS.map((f) => [f.id, f]));
