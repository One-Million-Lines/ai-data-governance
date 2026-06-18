import { format, parseISO, isValid, differenceInCalendarDays } from "date-fns";

export function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const d = parseISO(iso);
  return isValid(d) ? format(d, "d MMM yyyy") : "—";
}

export function fmtDateTime(iso?: string): string {
  if (!iso) return "—";
  const d = parseISO(iso);
  return isValid(d) ? format(d, "d MMM yyyy, HH:mm") : "—";
}

/** Days until a date (negative = overdue). */
export function daysUntil(iso?: string, from: Date = new Date("2026-06-18")): number | null {
  if (!iso) return null;
  const d = parseISO(iso);
  if (!isValid(d)) return null;
  return differenceInCalendarDays(d, from);
}

export function isOverdue(iso?: string): boolean {
  const d = daysUntil(iso);
  return d !== null && d < 0;
}

export function titleCase(s: string): string {
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function pct(n: number): string {
  return `${Math.round(n)}%`;
}
