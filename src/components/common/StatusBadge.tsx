import { Badge } from "@/components/ui/badge";
import type { Tone } from "@/lib/labels";

interface LabelDef {
  label: string;
  tone: Tone;
}

/** Renders a coloured badge from one of the label maps in lib/labels. */
export function StatusBadge({ def, className }: { def: LabelDef; className?: string }) {
  return (
    <Badge tone={def.tone} className={className}>
      {def.label}
    </Badge>
  );
}
