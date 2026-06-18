import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, FieldGrid } from "@/components/common/Field";
import { LEARN_ITEMS, type LearnItem } from "@/data/learn";
import { MATURITY_MODEL, DOMAINS } from "@/data/domains";
import { cn } from "@/lib/utils";

const CAT_TONE: Record<LearnItem["category"], "neutral" | "info" | "teal" | "warning" | "success"> = {
  Concept: "neutral",
  "Data Governance": "info",
  "AI Governance": "teal",
  "Responsible AI": "teal",
  Privacy: "warning",
  Security: "success",
};

export function LearnPage() {
  const [open, setOpen] = useState<string | null>(LEARN_ITEMS[0].id);
  const [cat, setCat] = useState<string>("all");

  const cats = ["all", ...Array.from(new Set(LEARN_ITEMS.map((i) => i.category)))];
  const items = cat === "all" ? LEARN_ITEMS : LEARN_ITEMS.filter((i) => i.category === cat);

  return (
    <div>
      <PageHeader
        title="Learn"
        description="Understand the difference between Data and AI Governance, key terminology and what good practice looks like. Every topic explains the minimum and the mature practice."
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              cat === c ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground hover:bg-secondary",
            )}
          >
            {c === "all" ? "All topics" : c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => {
            const isOpen = open === item.id;
            return (
              <Card key={item.id}>
                <CardHeader className="flex cursor-pointer select-none flex-row items-center justify-between space-y-0" onClick={() => setOpen(isOpen ? null : item.id)}>
                  <div className="flex items-center gap-2">
                    <CardTitle>{item.title}</CardTitle>
                    <Badge tone={CAT_TONE[item.category]}>{item.category}</Badge>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </CardHeader>
                {isOpen && (
                  <CardContent className="border-t pt-4">
                    <p className="text-sm">{item.meaning}</p>
                    <div className="mt-3 rounded-md bg-secondary/50 p-3 text-sm">
                      <span className="font-medium">Why it matters: </span>
                      {item.whyItMatters}
                    </div>
                    <FieldGrid>
                      <Field label="Minimum acceptable practice">{item.minimum}</Field>
                      <Field label="More mature practice">{item.mature}</Field>
                      <Field label="Common mistakes">{item.mistakes}</Field>
                      <Field label="Example evidence">{item.evidence}</Field>
                      <Field label="Typical owner">{item.owner}</Field>
                      <Field label="Suggested review frequency">{item.reviewFrequency}</Field>
                    </FieldGrid>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maturity model</CardTitle>
              <CardDescription>Six levels, scored per capability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {MATURITY_MODEL.map((m) => (
                <div key={m.level} className="flex gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-semibold text-primary">{m.level}</span>
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The 14 governance domains</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {DOMAINS.map((d) => (
                <div key={d.id} className="flex items-center gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary text-[11px] font-semibold">{d.index}</span>
                  <span className="truncate">{d.shortName}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
