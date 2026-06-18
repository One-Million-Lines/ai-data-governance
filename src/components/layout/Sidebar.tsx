import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ShieldHalf, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";
import { NAV_GROUPS } from "./nav";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex",
        collapsed ? "w-[64px]" : "w-60",
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sidebar-accent/20 text-sidebar-accent">
          <ShieldHalf className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Governance Studio</p>
            <p className="truncate text-[10px] text-sidebar-muted">Data &amp; AI Governance</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-3">
            {!collapsed && (
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    title={item.label}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                        collapsed && "justify-center",
                        isActive
                          ? "bg-sidebar-accent/15 text-white"
                          : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white",
                      )
                    }
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2 border-t border-sidebar-border px-4 py-2.5 text-xs text-sidebar-muted transition-colors hover:text-white"
      >
        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
