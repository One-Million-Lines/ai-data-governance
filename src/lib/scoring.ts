import type {
  AssessmentAnswer,
  AssessmentResponse,
  Control,
  Evidence,
  Risk,
  Action,
  DomainScore,
  GovernanceScores,
  ImpactDimension,
  AiRiskTier,
  Severity,
  Priority,
} from "@/types";
import { DOMAINS } from "@/data/domains";
import { QUESTIONS } from "@/data/questions";

// ---------------------------------------------------------------------------
// Scoring engine. Produces SEPARATE indicators (spec §7): never one merged
// "compliance score". Each indicator is explained in SCORE_EXPLANATIONS.
// ---------------------------------------------------------------------------

// Maturity (0-5) implied by an assessment answer.
const ANSWER_MATURITY: Record<AssessmentAnswer, number | null> = {
  not_assessed: null,
  not_applicable: null,
  not_implemented: 0,
  informal: 1,
  partially_defined: 2,
  defined: 3,
  implemented: 4,
  measured: 4.5,
  optimised: 5,
};

// Self-reported maturity at or above this level requires evidence (spec §10).
const EVIDENCE_GATE = 4;

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

export interface ScoreInputs {
  responses: Record<string, AssessmentResponse>;
  controls: Control[];
  evidence: Evidence[];
  risks: Risk[];
  targetMaturity?: number; // default target per capability
}

function controlCoverageForDomain(controls: Control[], domainId: string): number {
  const set = controls.filter((c) => c.active && c.domainId === domainId);
  if (set.length === 0) return 0;
  const implemented = set.filter((c) => c.status === "implemented" || c.status === "operating").length;
  const partial = set.filter((c) => c.status === "in_progress" || c.status === "needs_review").length;
  return clamp(((implemented + partial * 0.5) / set.length) * 100);
}

function evidenceConfidenceForDomain(
  controls: Control[],
  evidence: Evidence[],
  domainId: string,
): number {
  const domainControls = controls.filter((c) => c.active && c.domainId === domainId);
  if (domainControls.length === 0) return 0;
  const controlIds = new Set(domainControls.map((c) => c.id));
  const relevant = evidence.filter((e) => e.linkedControlIds.some((id) => controlIds.has(id)));
  if (relevant.length === 0) return 0;

  // Per-evidence confidence: relevance + recency + reviewer + independence.
  const today = new Date("2026-06-18").getTime();
  const scoreOne = (e: Evidence): number => {
    let s = 0.4; // base relevance (it is linked to a control)
    if (e.reviewResult === "verified") s += 0.25;
    else if (e.reviewResult === "needs_update") s += 0.05;
    else if (e.reviewResult === "rejected") s -= 0.2;
    if (e.independent) s += 0.15;
    // recency: valid and recent collection
    if (e.validUntil) {
      const valid = new Date(e.validUntil).getTime() >= today;
      s += valid ? 0.15 : -0.1;
    }
    if (e.version === 0) s -= 0.15; // draft
    return clamp(s, 0, 1);
  };

  // Coverage: how many domain controls have any linked evidence.
  const covered = domainControls.filter((c) =>
    relevant.some((e) => e.linkedControlIds.includes(c.id)),
  ).length;
  const coverage = covered / domainControls.length;
  const avgQuality = relevant.reduce((a, e) => a + scoreOne(e), 0) / relevant.length;
  return clamp(coverage * avgQuality * 100);
}

function residualRiskForDomain(risks: Risk[], domainId: string): number {
  const set = risks.filter((r) => r.domainId === domainId);
  if (set.length === 0) return 0;
  const worst = set.reduce((max, r) => Math.max(max, residualRiskScore(r)), 0);
  // Scale 1-25 residual to 0-100, weighted toward the worst risk in the domain.
  return clamp((worst / 25) * 100);
}

export function inherentRiskScore(r: Risk): number {
  const impactVals = Object.values(r.impacts) as number[];
  const maxImpact = impactVals.length ? Math.max(...impactVals) : 1;
  return r.likelihood * maxImpact; // 1-25
}

export function residualRiskScore(r: Risk): number {
  const inherent = inherentRiskScore(r);
  const factor =
    r.controlEffectiveness === "effective"
      ? 0.4
      : r.controlEffectiveness === "partial"
        ? 0.7
        : r.controlEffectiveness === "not_tested"
          ? 0.85
          : 1; // ineffective
  if (r.treatment === "accept") return inherent; // accepted = residual stays at inherent
  return Math.round(inherent * factor * 10) / 10; // 1-25
}

export function riskBand(score: number): Severity {
  if (score >= 15) return "critical";
  if (score >= 9) return "high";
  if (score >= 4) return "moderate";
  return "low";
}

export function computeDomainScore(domainId: string, inputs: ScoreInputs): DomainScore {
  const domainQuestions = QUESTIONS.filter((q) => q.domainId === domainId);
  const answered = domainQuestions
    .map((q) => inputs.responses[q.id])
    .filter((r): r is AssessmentResponse => !!r && !!r.answer);

  const scored = answered
    .map((r) => ANSWER_MATURITY[r.answer!])
    .filter((m): m is number => m !== null);

  const selfMaturity = scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : 0;

  const evidenceConfidence = evidenceConfidenceForDomain(inputs.controls, inputs.evidence, domainId);

  // Evidence-supported maturity caps high self-ratings without strong evidence.
  let evidenceMaturity = selfMaturity;
  if (selfMaturity >= EVIDENCE_GATE && evidenceConfidence < 50) {
    evidenceMaturity = Math.min(selfMaturity, EVIDENCE_GATE - 0.5);
  }

  const applicable = domainQuestions.filter((q) => {
    const r = inputs.responses[q.id];
    return r && r.answer && r.answer !== "not_assessed";
  });
  const completeness = domainQuestions.length
    ? (applicable.length / domainQuestions.length) * 100
    : 0;

  return {
    domainId,
    maturity: Math.round(selfMaturity * 10) / 10,
    evidenceMaturity: Math.round(evidenceMaturity * 10) / 10,
    targetMaturity: inputs.targetMaturity ?? 4,
    controlCoverage: Math.round(controlCoverageForDomain(inputs.controls, domainId)),
    evidenceConfidence: Math.round(evidenceConfidence),
    residualRisk: Math.round(residualRiskForDomain(inputs.risks, domainId)),
    assessmentCompleteness: Math.round(completeness),
  };
}

export function computeScores(inputs: ScoreInputs): GovernanceScores {
  const byDomain: Record<string, DomainScore> = {};
  for (const d of DOMAINS) byDomain[d.id] = computeDomainScore(d.id, inputs);

  const dims = DOMAINS.map((d) => byDomain[d.id]);
  const avg = (sel: (s: DomainScore) => number) =>
    dims.reduce((a, s) => a + sel(s), 0) / dims.length;

  const dataDomains = DOMAINS.filter((d) => d.layers.includes("data")).map((d) => byDomain[d.id]);
  const aiDomains = DOMAINS.filter((d) => d.layers.includes("ai")).map((d) => byDomain[d.id]);
  const avgOf = (arr: DomainScore[], sel: (s: DomainScore) => number) =>
    arr.length ? arr.reduce((a, s) => a + sel(s), 0) / arr.length : 0;

  return {
    byDomain,
    maturityIndex: Math.round(avg((s) => s.evidenceMaturity) * 10) / 10,
    dataMaturity: Math.round(avgOf(dataDomains, (s) => s.evidenceMaturity) * 10) / 10,
    aiMaturity: Math.round(avgOf(aiDomains, (s) => s.evidenceMaturity) * 10) / 10,
    controlImplementation: Math.round(avg((s) => s.controlCoverage)),
    evidenceConfidence: Math.round(avg((s) => s.evidenceConfidence)),
    residualRisk: Math.round(avg((s) => s.residualRisk)),
    assessmentCompleteness: Math.round(avg((s) => s.assessmentCompleteness)),
  };
}

// ---------------------------------------------------------------------------
// Transparent roadmap prioritisation (spec §17).
// ---------------------------------------------------------------------------

export const PRIORITISATION_WEIGHTS = {
  residualRisk: 0.3,
  gapSeverity: 0.2,
  regulatoryUrgency: 0.2,
  dependencyValue: 0.1,
  strategicValue: 0.1,
  effortScore: 0.1,
};

export function priorityScore(a: Action): number {
  const s = a.scoring;
  const w = PRIORITISATION_WEIGHTS;
  const raw =
    s.residualRisk * w.residualRisk +
    s.gapSeverity * w.gapSeverity +
    s.regulatoryUrgency * w.regulatoryUrgency +
    s.dependencyValue * w.dependencyValue +
    s.strategicValue * w.strategicValue +
    s.effortScore * w.effortScore;
  return Math.round((raw / 5) * 100); // 0-100
}

export function priorityFromScore(score: number): Priority {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "medium";
  return "low";
}

// ---------------------------------------------------------------------------
// Explanations of how each indicator is calculated (spec §7 requirement).
// ---------------------------------------------------------------------------

export const SCORE_EXPLANATIONS: Record<string, string> = {
  maturity:
    "Capability maturity (0–5) is the average evidence-supported maturity of assessed capabilities. Self-ratings of Managed or Optimised are capped where evidence confidence is below 50%.",
  controlImplementation:
    "Control implementation is the share of active controls that are implemented or operating, with in-progress controls counted at half weight.",
  evidenceConfidence:
    "Evidence confidence combines how many controls have linked evidence with the quality of that evidence: relevance, recency, reviewer status and independence. It is kept separate from control implementation.",
  residualRisk:
    "Residual risk reflects the most severe residual risk per domain. Residual risk = likelihood × highest impact, reduced by assessed control effectiveness. Accepted risks retain their inherent score.",
  assessmentCompleteness:
    "Assessment completeness is the share of applicable questions that have been answered (anything other than Not assessed).",
};

export const AI_RISK_TIER_ORDER: AiRiskTier[] = [
  "minimal",
  "limited",
  "elevated",
  "high",
  "unacceptable",
];
