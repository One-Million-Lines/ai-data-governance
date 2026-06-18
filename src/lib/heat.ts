// Map a 0-100 "goodness" value to a background/text class (higher = healthier).
export function heatGood(value: number): string {
  if (value >= 80) return "bg-success/85 text-white";
  if (value >= 60) return "bg-success/55 text-white";
  if (value >= 40) return "bg-warning/70 text-warning-foreground";
  if (value >= 20) return "bg-destructive/55 text-white";
  return "bg-destructive/85 text-white";
}

// Map a 0-100 "risk" value to a class (higher = worse).
export function heatRisk(value: number): string {
  if (value >= 70) return "bg-destructive/85 text-white";
  if (value >= 50) return "bg-destructive/55 text-white";
  if (value >= 30) return "bg-warning/70 text-warning-foreground";
  if (value >= 15) return "bg-success/55 text-white";
  return "bg-success/85 text-white";
}

// 5x5 risk grid cell colour by likelihood*impact (1-25).
export function heatScore25(score: number): string {
  if (score >= 15) return "bg-destructive/85 text-white";
  if (score >= 9) return "bg-destructive/45 text-white";
  if (score >= 4) return "bg-warning/70 text-warning-foreground";
  return "bg-success/60 text-white";
}
