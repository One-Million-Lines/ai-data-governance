import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGovernanceStore } from "@/store/useGovernanceStore";

interface Result {
  label: string;
  sub: string;
  to: string;
}

/** Lightweight global search across controls, risks, AI systems, assets and policies. */
export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { controls, risks, aiSystems, dataAssets, policies, vendors } = useGovernanceStore();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const out: Result[] = [];
    const match = (s?: string) => !!s && s.toLowerCase().includes(term);
    for (const c of controls) if (match(c.title) || match(c.id)) out.push({ label: c.title, sub: `Control · ${c.id}`, to: "/controls" });
    for (const r of risks) if (match(r.title)) out.push({ label: r.title, sub: `Risk · ${r.id}`, to: "/risks" });
    for (const a of aiSystems) if (match(a.name)) out.push({ label: a.name, sub: `AI system · ${a.id}`, to: "/ai" });
    for (const d of dataAssets) if (match(d.name)) out.push({ label: d.name, sub: `Data asset · ${d.id}`, to: "/data" });
    for (const p of policies) if (match(p.title)) out.push({ label: p.title, sub: "Policy", to: "/policies" });
    for (const v of vendors) if (match(v.name)) out.push({ label: v.name, sub: "Vendor", to: "/vendors" });
    return out.slice(0, 8);
  }, [q, controls, risks, aiSystems, dataAssets, policies, vendors]);

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search controls, risks, AI systems, assets…"
        className="h-8 pl-8 text-xs"
        aria-label="Global search"
      />
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                navigate(r.to);
                setOpen(false);
                setQ("");
              }}
              className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-secondary"
            >
              <span className="text-sm text-foreground">{r.label}</span>
              <span className="text-[11px] text-muted-foreground">{r.sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
