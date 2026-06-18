export interface LearnItem {
  id: string;
  title: string;
  category: "Concept" | "Data Governance" | "AI Governance" | "Responsible AI" | "Privacy" | "Security";
  meaning: string;
  whyItMatters: string;
  minimum: string;
  mature: string;
  mistakes: string;
  evidence: string;
  owner: string;
  reviewFrequency: string;
}

// Educational content (spec §2 Learn). Each item carries the required fields.
export const LEARN_ITEMS: LearnItem[] = [
  {
    id: "data-vs-ai",
    title: "Data Governance vs AI Governance",
    category: "Concept",
    meaning:
      "Data Governance ensures data is known, owned, classified, protected and lawfully used. AI Governance controls how AI systems are proposed, built, approved, monitored and retired. AI Governance sits on top of Data Governance and reuses its controls.",
    whyItMatters:
      "AI cannot be trusted if the data beneath it is ungoverned. Treating AI Governance as a replacement for Data Governance leaves gaps in quality, privacy and security that surface as model failures.",
    minimum: "Both disciplines have an owner and a basic policy; AI references existing data assets.",
    mature: "Integrated framework where AI risk assessments reference data-quality, privacy and vendor controls rather than duplicating them.",
    mistakes: "Building an AI policy with no data inventory; duplicating data controls inside the AI module.",
    evidence: "Integrated framework charter; AI systems linked to data assets and controls.",
    owner: "Chief Data Officer / Chief AI Officer",
    reviewFrequency: "Per framework version",
  },
  {
    id: "maturity",
    title: "The six-level maturity model",
    category: "Concept",
    meaning:
      "Capability maturity runs from 0 Absent, 1 Ad hoc, 2 Repeatable, 3 Defined, 4 Managed, to 5 Optimised. Each capability is scored separately.",
    whyItMatters:
      "A single average hides weak spots. Scoring per capability shows exactly where to invest, and evidence prevents over-claiming.",
    minimum: "Capabilities are self-assessed against the levels.",
    mature: "Maturity is evidence-supported and re-assessed periodically with trends.",
    mistakes: "Claiming Managed or Optimised without evidence; averaging everything into one number.",
    evidence: "Assessment records; evidence linked to high ratings.",
    owner: "Governance Lead",
    reviewFrequency: "Annual",
  },
  {
    id: "risk-tiers",
    title: "Enterprise risk tier vs regulatory classification",
    category: "AI Governance",
    meaning:
      "An internal risk tier prioritises governance effort. A regulatory classification is a legal determination. They are maintained separately.",
    whyItMatters:
      "Assuming an internal tier equals a legal classification leads to non-compliance. Legal classification needs qualified review and records its assumptions.",
    minimum: "Each AI system has an internal tier and a recorded regulatory classification with assumptions.",
    mature: "Legal-reviewed classifications maintained as regulation evolves, with re-classification on change.",
    mistakes: "Labelling a system 'high-risk' internally and assuming it is therefore legally high-risk (or vice versa).",
    evidence: "Risk-tier records; regulatory classification with legal sign-off.",
    owner: "AI Governance Office / Legal",
    reviewFrequency: "Per change",
  },
  {
    id: "human-oversight",
    title: "Human oversight of AI",
    category: "Responsible AI",
    meaning:
      "Meaningful human control over AI decisions, with the authority and ability to override or halt outputs proportionate to risk.",
    whyItMatters:
      "Oversight mitigates automation harms and is a core safeguard for decisions affecting people.",
    minimum: "Oversight defined for high-risk systems with a named reviewer.",
    mature: "Reviewers are trained, oversight is tested, and overrides are logged and analysed.",
    mistakes: "'Human-in-the-loop' on paper but reviewers cannot realistically override outputs.",
    evidence: "Human oversight plan; override records.",
    owner: "AI System Owner",
    reviewFrequency: "Per system / annual",
  },
  {
    id: "dpia",
    title: "Privacy impact assessment (DPIA)",
    category: "Privacy",
    meaning:
      "A structured assessment of privacy risk for processing likely to result in high risk to individuals, identifying and mitigating harms before processing.",
    whyItMatters:
      "DPIAs are often legally required and prevent privacy harms from reaching production.",
    minimum: "Screening for new processing; DPIA when high risk is indicated.",
    mature: "Integrated DPIA workflow linked to assets and AI impact assessments, reviewed on change.",
    mistakes: "Completing a DPIA as a tick-box after launch; ignoring AI-specific privacy risks.",
    evidence: "Privacy screening; completed DPIA with mitigations.",
    owner: "DPO",
    reviewFrequency: "Per change",
  },
  {
    id: "evidence-confidence",
    title: "Evidence confidence",
    category: "Concept",
    meaning:
      "A measure of how trustworthy the evidence behind a control is — based on relevance, recency, reviewer status and independence — kept separate from whether the control is implemented.",
    whyItMatters:
      "A control can be implemented but unevidenced, or evidenced with stale, unreviewed artefacts. Separating the two prevents false assurance.",
    minimum: "Evidence is recorded and linked to controls.",
    mature: "Evidence confidence is scored and stale or unreviewed evidence is refreshed proactively.",
    mistakes: "Treating any uploaded file as proof; merging evidence into the control status.",
    evidence: "Evidence register with reviewer and validity dates.",
    owner: "Governance Lead",
    reviewFrequency: "Quarterly",
  },
  {
    id: "genai-use",
    title: "Governing generative AI use",
    category: "AI Governance",
    meaning:
      "Controlling which GenAI tools are approved, what data may be entered, and how outputs are verified before use.",
    whyItMatters:
      "Unapproved tools leak confidential data; unverified outputs mislead and create liability.",
    minimum: "Approved tool list and guidance on prompt data; human verification of material outputs.",
    mature: "Technical enforcement (DLP), grounding with attribution, and ongoing evaluation and red teaming.",
    mistakes: "Banning tools without offering approved alternatives, which drives shadow AI.",
    evidence: "Approved tool list; DLP policy; verification records.",
    owner: "AI Governance Office",
    reviewFrequency: "Quarterly",
  },
  {
    id: "agents",
    title: "Autonomous-agent guardrails",
    category: "AI Governance",
    meaning:
      "Constraints on what an autonomous agent can access and do: permitted tools, data, action limits, approval thresholds, rate limits and a kill-switch.",
    whyItMatters:
      "Agents can take irreversible, high-impact actions. Without enforced limits and an emergency stop, errors or manipulation cause real harm.",
    minimum: "Documented permission matrix; human approval for high-impact actions.",
    mature: "Enforced permissions, threshold-based approvals, tested kill-switch and monitored action logs.",
    mistakes: "Deploying an agent before guardrails and a kill-switch exist.",
    evidence: "Agent permission matrix; kill-switch test record; action logs.",
    owner: "AI Engineering / AI Governance Office",
    reviewFrequency: "Per agent / per change",
  },
];
