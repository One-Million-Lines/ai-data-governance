import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DOMAINS } from "@/data/domains";
import type { DomainScore, HealthMetric } from "@/types";

interface HealthRadarProps {
  scores: Record<string, DomainScore>;
  metric: HealthMetric;
  height?: number;
}

const metricValue = (s: DomainScore, metric: HealthMetric): number => {
  switch (metric) {
    case "maturity":
      return (s.evidenceMaturity / 5) * 100;
    case "controlCoverage":
      return s.controlCoverage;
    case "evidenceConfidence":
      return s.evidenceConfidence;
    case "residualRisk":
      return 100 - s.residualRisk; // invert so larger = healthier
    case "targetVsCurrent":
      return (s.evidenceMaturity / 5) * 100;
  }
};

export function HealthRadar({ scores, metric, height = 340 }: HealthRadarProps) {
  const data = DOMAINS.map((d) => {
    const s = scores[d.id];
    const row: Record<string, number | string> = {
      domain: d.shortName,
      current: Math.round(metricValue(s, metric)),
    };
    if (metric === "targetVsCurrent") {
      row.target = Math.round((s.targetMaturity / 5) * 100);
    }
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
        {metric === "targetVsCurrent" && (
          <Radar name="Target" dataKey="target" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.08} strokeWidth={1} strokeDasharray="4 3" />
        )}
        <Radar
          name={metric === "residualRisk" ? "Risk-adjusted health" : "Current"}
          dataKey="current"
          stroke="hsl(var(--accent))"
          fill="hsl(var(--accent))"
          fillOpacity={0.22}
          strokeWidth={2}
        />
        {metric === "targetVsCurrent" && <Legend wrapperStyle={{ fontSize: 11 }} />}
      </RadarChart>
    </ResponsiveContainer>
  );
}
