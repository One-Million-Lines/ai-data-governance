import { DOMAINS, DOMAIN_MAP } from "@/data/domains";

// Curated dependency narratives (spec §8) explaining cross-domain influence.
const EDGE_NOTES: Record<string, string> = {
  "d3->d9": "Missing inventory weakens privacy, security and audit.",
  "d3->d7": "AI cannot be governed without knowing the data and systems it uses.",
  "d5->d7": "Weak data quality increases AI risk and unreliable models.",
  "d2->d13": "Unclear ownership blocks remediation and operations.",
  "d12->d10": "Missing vendor controls affect AI, security and privacy.",
  "d13->d14": "Weak evidence and operations lower assurance confidence.",
  "d4->d5": "Without lineage and metadata, quality issues are hard to trace.",
  "d7->d8": "Lifecycle governance is the foundation for responsible AI.",
  "d7->d11": "GenAI and agents extend the AI lifecycle with extra controls.",
  "d10->d11": "Agent safety depends on strong security controls.",
};

export function DependencyView({ onSelect }: { onSelect?: (domainId: string) => void }) {
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Domains influence each other. Weakness upstream cascades into higher risk downstream. Click a
        domain to inspect its current state.
      </p>
      <div className="space-y-2">
        {DOMAINS.filter((d) => d.dependsOn.length > 0).map((d) =>
          d.dependsOn.map((depId) => {
            const dep = DOMAIN_MAP[depId];
            const note = EDGE_NOTES[`${depId}->${d.id}`];
            return (
              <div
                key={`${depId}-${d.id}`}
                className="flex flex-wrap items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
              >
                <button
                  onClick={() => onSelect?.(depId)}
                  className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  {dep.shortName}
                </button>
                <span className="text-muted-foreground">influences</span>
                <button
                  onClick={() => onSelect?.(d.id)}
                  className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent hover:bg-accent/20"
                >
                  {d.shortName}
                </button>
                {note && <span className="w-full text-[11px] text-muted-foreground sm:w-auto sm:flex-1">— {note}</span>}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
