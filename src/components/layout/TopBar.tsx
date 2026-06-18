import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell, CircleHelp, Menu, X } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { GlobalSearch } from "./GlobalSearch";
import { NAV_GROUPS } from "./nav";
import { Icon } from "@/components/common/Icon";
import { isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TopBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, frameworkVersions, activeVersionId, actions, incidents } = useGovernanceStore();
  const [bu, setBu] = useState("all");

  const activeVersion = frameworkVersions.find((v) => v.id === activeVersionId);
  const overdue = actions.filter((a) => a.status !== "done" && isOverdue(a.targetDate)).length;
  const openIncidents = incidents.filter((i) => i.status === "open" || i.status === "contained").length;
  const notifications = overdue + openIncidents;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Organisation + BU + version selectors */}
        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex h-8 items-center rounded-md border bg-card px-3 text-xs font-medium">
            {profile.name}
          </div>
          <Select value={bu} onValueChange={setBu}>
            <SelectTrigger className="h-8 w-[170px] text-xs">
              <SelectValue placeholder="Business unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All business units</SelectItem>
              {profile.businessUnits.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex h-8 items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 text-xs font-medium text-accent">
            <span className="hidden xl:inline text-accent/70">Framework</span>
            {activeVersion?.label.split(" — ")[0] ?? "v2.0"}
          </div>
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:flex-none">
          <div className="hidden flex-1 sm:block md:w-80 md:flex-none">
            <GlobalSearch />
          </div>

          <button
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title={`${notifications} items need attention`}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
                {notifications}
              </span>
            )}
          </button>

          <NavLink
            to="/learn"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Help & learn"
          >
            <CircleHelp className="h-4 w-4" />
          </NavLink>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground" title="Governance Lead">
            GL
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-primary/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-sidebar p-4 text-sidebar-foreground">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Governance Studio</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </button>
            </div>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm",
                        isActive ? "bg-sidebar-accent/15 text-white" : "text-sidebar-foreground/80",
                      )
                    }
                  >
                    <Icon name={item.icon} className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
