export interface NavItem {
  to: string;
  label: string;
  icon: string; // lucide icon name
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Persistent left-sidebar navigation (spec §6), grouped by the four modes.
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Overview", icon: "LayoutDashboard" },
      { to: "/health-map", label: "Governance Health Map", icon: "Radar" },
      { to: "/learn", label: "Learn", icon: "GraduationCap" },
    ],
  },
  {
    label: "Design",
    items: [
      { to: "/organisation", label: "Organisation Profile", icon: "Building2" },
      { to: "/builder", label: "Framework Builder", icon: "Hammer" },
      { to: "/assessments", label: "Assessments", icon: "ListChecks" },
    ],
  },
  {
    label: "Operate",
    items: [
      { to: "/data", label: "Data Inventory", icon: "Database" },
      { to: "/ai", label: "AI Inventory", icon: "Bot" },
      { to: "/risks", label: "Risks", icon: "TriangleAlert" },
      { to: "/controls", label: "Controls", icon: "ShieldCheck" },
      { to: "/policies", label: "Policies", icon: "FileText" },
      { to: "/evidence", label: "Evidence", icon: "FolderCheck" },
      { to: "/roadmap", label: "Roadmap", icon: "Map" },
      { to: "/decisions", label: "Decisions & Exceptions", icon: "Gavel" },
      { to: "/incidents", label: "Incidents", icon: "Siren" },
      { to: "/vendors", label: "Vendors", icon: "Handshake" },
    ],
  },
  {
    label: "Assure",
    items: [
      { to: "/metrics", label: "Metrics & Reporting", icon: "BarChart3" },
      { to: "/audit", label: "Audit", icon: "ClipboardCheck" },
      { to: "/library", label: "Framework Library", icon: "Library" },
      { to: "/settings", label: "Settings", icon: "Settings" },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
