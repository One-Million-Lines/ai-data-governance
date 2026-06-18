import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { OrganisationProfile } from "@/types";

type FieldKey = keyof OrganisationProfile;

interface StepDef {
  key: FieldKey;
  title: string;
  why: string;
  type: "text" | "single" | "multi";
  options?: string[];
}

const STEPS: StepDef[] = [
  { key: "name", title: "What is your organisation called?", why: "The name personalises your workspace and every report.", type: "text" },
  { key: "industry", title: "What industry are you in?", why: "Industry shapes which controls and regulations apply.", type: "text" },
  { key: "ownership", title: "Public, private or nonprofit?", why: "Ownership influences oversight and reporting expectations.", type: "single", options: ["public", "private", "nonprofit"] },
  { key: "countries", title: "Where do you operate?", why: "Jurisdictions determine cross-border, privacy and AI-law obligations.", type: "multi", options: ["European Union", "Switzerland", "United Kingdom", "United States", "Canada", "Rest of world"] },
  { key: "objectives", title: "What are your governance objectives?", why: "Objectives prioritise which domains and modules to activate first.", type: "multi", options: ["Build Data Governance from scratch", "Improve an existing Data Governance programme", "Build AI Governance", "Prepare for AI regulation", "Prepare for ISO 42001", "Improve privacy compliance", "Govern generative AI usage", "Govern AI vendors", "Prepare for an audit"] },
  { key: "scope", title: "What is the governance scope?", why: "Scope sets which layer (Data, AI or integrated) and breadth applies.", type: "multi", options: ["Data Governance only", "AI Governance only", "Integrated Data and AI Governance", "Specific department", "Enterprise-wide programme"] },
  { key: "dataProfile", title: "What data do you process?", why: "Data types trigger privacy, retention and classification questions.", type: "multi", options: ["personal data", "special-category data", "employee data", "customer data", "financial data", "health data", "biometric data", "children's data", "intellectual property", "confidential business data", "licensed third-party data"] },
  { key: "aiProfile", title: "How do you use AI?", why: "AI usage drives the lifecycle, GenAI and agent questions that apply.", type: "multi", options: ["develops its own AI systems", "fine-tunes existing models", "buys AI software", "embeds third-party AI APIs", "uses generative AI", "uses autonomous agents", "uses AI in customer-facing products", "uses AI for employment decisions", "trains models using organisational data", "allows employees to use public AI tools"] },
  { key: "currentMaturity", title: "What do you already have in place?", why: "Existing capabilities set your starting maturity and avoid duplicate work.", type: "multi", options: ["a governance council", "a Data Governance policy", "an AI policy", "a data catalogue", "an AI inventory", "assigned data owners", "data classification", "information security controls", "privacy impact assessments", "audit processes"] },
  { key: "standards", title: "Which standards do you want to map against?", why: "We map original controls to these references without reproducing them.", type: "multi", options: ["ISO/IEC 42001", "ISO/IEC 27001", "ISO/IEC 27701", "NIST AI RMF", "NIST Cybersecurity Framework", "OECD AI Principles", "EU AI Act", "GDPR", "DCAM concepts"] },
];

export function OnboardingPage() {
  const { profile, setProfile, setOnboarded } = useGovernanceStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OrganisationProfile>({ ...profile });

  const current = STEPS[step];
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  const value = draft[current.key];

  const toggleMulti = (opt: string) => {
    const arr = Array.isArray(value) ? [...value] : [];
    const idx = arr.indexOf(opt);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(opt);
    setDraft({ ...draft, [current.key]: arr });
  };

  const finish = () => {
    setProfile(draft);
    setOnboarded(true);
    navigate("/organisation");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Adaptive Onboarding" description="One question per screen. Each answer tailors which domains, questions and controls apply." />

      <div className="mb-4">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} tone="accent" />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">{current.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{current.why}</p>

          <div className="mt-5">
            {current.type === "text" && (
              <Input
                value={typeof value === "string" ? value : ""}
                onChange={(e) => setDraft({ ...draft, [current.key]: e.target.value })}
                placeholder="Type your answer…"
                autoFocus
              />
            )}
            {current.type === "single" && (
              <div className="flex flex-wrap gap-2">
                {current.options!.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDraft({ ...draft, [current.key]: opt })}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm capitalize transition-colors",
                      value === opt ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:bg-secondary",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {current.type === "multi" && (
              <div className="flex flex-wrap gap-2">
                {current.options!.map((opt) => {
                  const active = Array.isArray(value) && value.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleMulti(opt)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button size="sm" onClick={() => setStep((s) => s + 1)}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={finish}>
                Generate recommendations <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        You can edit every recommendation afterwards. Onboarding never overwrites your existing framework version.
      </p>
    </div>
  );
}
