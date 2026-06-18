import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FilterChip {
  value: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  chips?: FilterChip[];
  active?: string;
  onChipSelect?: (value: string) => void;
  children?: React.ReactNode;
}

/** Filter bar with search and quick chips, used on register/inventory screens. */
export function FilterBar({
  search,
  onSearch,
  placeholder = "Search…",
  chips,
  active,
  onChipSelect,
  children,
}: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-8"
        />
      </div>
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => onChipSelect?.(chip.value)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                active === chip.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary",
              )}
            >
              {chip.label}
              {chip.count !== undefined && <span className="ml-1 opacity-70">{chip.count}</span>}
            </button>
          ))}
        </div>
      )}
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </div>
  );
}
