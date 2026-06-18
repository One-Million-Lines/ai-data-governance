import {
  LayoutDashboard,
  Radar,
  GraduationCap,
  Building2,
  Hammer,
  ListChecks,
  Database,
  Bot,
  TriangleAlert,
  ShieldCheck,
  FileText,
  FolderCheck,
  Map,
  Gavel,
  Siren,
  Handshake,
  BarChart3,
  ClipboardCheck,
  Library,
  Settings,
  Circle,
  type LucideProps,
} from "lucide-react";

// Explicit registry keeps the bundle small (no full lucide import).
const REGISTRY: Record<string, React.ComponentType<LucideProps>> = {
  LayoutDashboard,
  Radar,
  GraduationCap,
  Building2,
  Hammer,
  ListChecks,
  Database,
  Bot,
  TriangleAlert,
  ShieldCheck,
  FileText,
  FolderCheck,
  Map,
  Gavel,
  Siren,
  Handshake,
  BarChart3,
  ClipboardCheck,
  Library,
  Settings,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = REGISTRY[name] ?? Circle;
  return <Cmp {...props} />;
}
