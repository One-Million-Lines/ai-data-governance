import { useState } from "react";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";

const LINKS = [
  { label: "AI Orchestration", href: "/demo/ai-orchestration/" },
  { label: "AI Maturity", href: "/demo/ai-maturity/" },
  { label: "AI Business Map", href: "/demo/ai-business-roadmap/" },
  { label: "AI Data Governance", href: "/demo/ai-data-governance/" },
];

interface FloatingNavProps {
  position?: "bottom-left" | "bottom-right";
}

export function FloatingNav({ position = "bottom-right" }: FloatingNavProps) {
  const [open, setOpen] = useState(false);

  const posClass = position === "bottom-left" ? "left-4" : "right-4";

  return (
    <div className={`fixed bottom-4 ${posClass} z-50 flex flex-col items-${position === "bottom-left" ? "start" : "end"} gap-1`}>
      {open && (
        <div className="mb-1 flex flex-col gap-1 rounded-lg border border-white/10 bg-gray-900/95 p-2 shadow-xl backdrop-blur">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded px-3 py-1.5 text-sm text-gray-200 transition-colors hover:bg-black hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-gray-900/95 px-4 py-2 text-sm font-medium text-gray-200 shadow-lg backdrop-blur transition-colors hover:bg-black hover:text-white"
        aria-label="Toggle navigation"
      >
        <Menu size={15} />
        <span>More AI</span>
        {open ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
      </button>
    </div>
  );
}
