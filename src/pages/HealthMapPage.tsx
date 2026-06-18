import { useState } from "react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HealthRadar } from "@/components/charts/HealthRadar";
import { DomainHeatmap } from "@/components/charts/DomainHeatmap";
import { DependencyView } from "@/components/health/DependencyView";
import { DomainDetail } from "@/components/health/DomainDetail";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { DOMAIN_MAP } from "@/data/domains";
import { cn } from "@/lib/utils";
import type { HealthMetric } from "@/types";

const METRICS: { value: HealthMetric; label: string }[] = [
  { value: "maturity", label: "Maturity" },
  { value: "controlCoverage", label: "Control coverage" },
  { value: "evidenceConfidence", label: "Evidence quality" },
  { value: "residualRisk", label: "Residual risk" },
  { value: "targetVsCurrent", label: "Target vs current" },
];

export function HealthMapPage() {
  const scores = useGovernanceStore().getScores();
  const [metric, setMetric] = useState<HealthMetric>("maturity");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Governance Health Map"
        description="The signature view across all 14 domains. Switch metric, drill into a domain, and see how domains influence each other."
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {METRICS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMetric(m.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              metric === m.value
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-secondary",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">Matrix</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Domain matrix</CardTitle>
              <CardDescription>
                Colour reflects health (green is strong, red needs attention). Click any cell to open
                the domain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomainHeatmap scores={scores.byDomain} onSelect={setSelected} selected={selected ?? undefined} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{METRICS.find((m) => m.value === metric)?.label} radar</CardTitle>
                <CardDescription>All domains on one axis (higher is healthier)</CardDescription>
              </CardHeader>
              <CardContent>
                <HealthRadar scores={scores.byDomain} metric={metric} height={420} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Domains</CardTitle>
                <CardDescription>Click to inspect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {Object.values(DOMAIN_MAP).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelected(d.id)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-semibold text-primary">
                      {d.index}
                    </span>
                    <span className="truncate">{d.shortName}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dependencies">
          <Card>
            <CardHeader>
              <CardTitle>Domain dependency view</CardTitle>
              <CardDescription>How weakness in one domain cascades into others</CardDescription>
            </CardHeader>
            <CardContent>
              <DependencyView onSelect={setSelected} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DrawerContent
            title={`${DOMAIN_MAP[selected].index}. ${DOMAIN_MAP[selected].name}`}
            description={DOMAIN_MAP[selected].outputs.slice(0, 3).join(" · ")}
          >
            <DomainDetail domainId={selected} />
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
