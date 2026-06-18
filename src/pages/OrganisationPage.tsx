import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGrid, SectionLabel } from "@/components/common/Field";
import { computeProfileFlags } from "@/lib/profile";
import { DOMAINS } from "@/data/domains";

export function OrganisationPage() {
  const { profile } = useGovernanceStore();
  const flags = useMemo(() => computeProfileFlags(profile), [profile]);

  // Derived recommendations (onboarding result, spec §3)
  const applicableDomains = DOMAINS.filter((d) => {
    if (d.layers.includes("ai") && !flags.usesAi) return false;
    return true;
  });

  const riskFlags: string[] = [];
  if (flags.usesAgents) riskFlags.push("Autonomous agents in use — strict action limits and kill-switch required.");
  if (flags.usesGenAi) riskFlags.push("Generative AI in use — acceptable-use and data-leakage controls required.");
  if (flags.aiInHr) riskFlags.push("AI in HR — likely high-risk employment use requiring fairness and oversight.");
  if (flags.crossBorder) riskFlags.push("Multi-jurisdiction operations — cross-border transfer controls required.");
  if (flags.specialCategory) riskFlags.push("Special-category data — enhanced privacy safeguards required.");

  const suggestedTeam = [
    "Executive sponsor (CDO/CAIO)",
    "Governance Lead",
    "Data Governance Office",
    "AI Governance Office",
    "DPO / Privacy",
    "CISO / Security",
    "Legal & Compliance",
    "Enterprise Risk",
    "Internal Audit",
  ];

  const priorities90 = [
    "Stand up the governance council and confirm the executive mandate",
    "Complete the AI inventory including embedded and shadow AI",
    "Classify high-risk AI and confirm regulatory classification with legal",
    "Close the highest residual risks (CV screening fairness, agent guardrails)",
    "Restrict and enforce approved generative-AI tools",
  ];

  return (
    <div>
      <PageHeader
        title="Organisation Profile"
        description="The profile drives which governance domains, questions and controls apply. Editing it re-tailors the framework."
        actions={
          <Link to="/onboarding">
            <Button size="sm" variant="outline">Re-run onboarding</Button>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{profile.name}</CardTitle>
            <CardDescription>{profile.industry} · {profile.ownership} · {profile.employees} employees · {profile.scale}</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGrid>
              <Field label="Countries">{profile.countries.join(", ")}</Field>
              <Field label="Business units">{profile.businessUnits.join(", ")}</Field>
              <Field label="Customer groups">{profile.customerGroups.join(", ")}</Field>
              <Field label="Existing GRC functions">{profile.existingGrcFunctions.join(", ")}</Field>
              <Field label="Regulated industry">{profile.regulatedIndustry ? "Yes" : "No"}</Field>
              <Field label="Serves children / vulnerable">{profile.servesChildren ? "Yes" : "No"}</Field>
            </FieldGrid>

            <SectionLabel>Objectives &amp; scope</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {profile.objectives.map((o) => <Badge key={o} tone="teal">{o}</Badge>)}
              {profile.scope.map((s) => <Badge key={s} tone="info">{s}</Badge>)}
            </div>

            <SectionLabel>Data profile</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {profile.dataProfile.map((d) => <Badge key={d} tone="neutral">{d}</Badge>)}
            </div>

            <SectionLabel>AI profile</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {profile.aiProfile.map((a) => <Badge key={a} tone="neutral">{a}</Badge>)}
            </div>

            <SectionLabel>Standards to map against</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {profile.standards.map((s) => <Badge key={s} tone="warning">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended scope</CardTitle>
              <CardDescription>Derived from the profile (editable)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{applicableDomains.length} of {DOMAINS.length} domains apply.</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {applicableDomains.map((d) => <Badge key={d.id} tone="neutral">{d.shortName}</Badge>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Initial risk profile</CardTitle>
              <CardDescription>Flags requiring specialist attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm">
                {riskFlags.map((r) => <li key={r} className="text-muted-foreground">• {r}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested governance team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTeam.map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>First 90-day priorities</CardTitle>
          <CardDescription>Generated from the profile and current gaps — fully editable</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {priorities90.map((p) => <li key={p}>{p}</li>)}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
