import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

/** Sticky page header used across every screen (spec §24). */
export function PageHeader({ title, description, actions, children }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-30 -mx-6 mb-5 border-b bg-background/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
