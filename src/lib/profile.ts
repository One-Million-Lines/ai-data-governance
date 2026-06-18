import type { OrganisationProfile, ApplicabilityRule, AssessmentResponse } from "@/types";

// ---------------------------------------------------------------------------
// Derive boolean applicability flags from the organisation profile.
// Used by the assessment engine to drive conditional questions (spec §9).
// ---------------------------------------------------------------------------

export type ProfileFlags = Record<string, boolean>;

const has = (arr: string[] | undefined, ...needles: string[]) =>
  !!arr && needles.some((n) => arr.some((v) => v.toLowerCase().includes(n.toLowerCase())));

export function computeProfileFlags(profile: OrganisationProfile): ProfileFlags {
  const ai = profile.aiProfile;
  const data = profile.dataProfile;
  return {
    personalData: has(data, "personal data", "customer data", "employee data", "health", "biometric"),
    specialCategory: has(data, "sensitive", "special-category", "health", "biometric", "children"),
    employeeData: has(data, "employee data"),
    usesAi:
      (ai && ai.length > 0) ||
      has(ai, "ai") ||
      profile.scope.some((s) => s.toLowerCase().includes("ai")),
    developsAi: has(ai, "develops its own", "fine-tunes", "trains models"),
    buysAi: has(ai, "buys ai", "embeds third-party", "general-purpose"),
    usesGenAi: has(ai, "generative ai"),
    usesAgents: has(ai, "autonomous agents"),
    externalModels: has(ai, "third-party ai apis", "general-purpose", "buys ai software"),
    crossBorder: !!profile.countries && profile.countries.length > 1,
    aiInHr: has(ai, "employment decisions") || profile.businessUnits.some((b) => /hr|people/i.test(b)),
    aiAffectsIndividuals: has(
      ai,
      "customer-facing",
      "employment decisions",
      "credit",
      "pricing",
      "insurance",
      "healthcare",
      "profiling",
      "automated decisions",
    ),
  };
}

/**
 * Evaluate whether a question applies, given profile flags and existing answers.
 * A question with no rules always applies. Rules are OR-combined: any satisfied
 * rule makes the question applicable.
 */
export function isApplicable(
  rules: ApplicabilityRule[] | undefined,
  flags: ProfileFlags,
  responses: Record<string, AssessmentResponse>,
): boolean {
  if (!rules || rules.length === 0) return true;
  return rules.some((rule) => {
    if (rule.profileFlag) return !!flags[rule.profileFlag];
    if (rule.questionId) {
      const r = responses[rule.questionId];
      if (!r) return false;
      if (rule.equals !== undefined) return r.answer === rule.equals || r.value === rule.equals;
      if (rule.includes !== undefined && Array.isArray(r.value)) return r.value.includes(rule.includes);
    }
    return true;
  });
}
