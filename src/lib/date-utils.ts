const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: string | Date, b: string | Date): boolean {
  const da = startOfDay(new Date(a));
  const db = startOfDay(new Date(b));
  return da.getTime() === db.getTime();
}

export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

export function getWeekDays(reference: Date = new Date()): Date[] {
  const start = startOfWeek(reference);
  return Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * DAY_MS));
}

export function formatDate(value: string | Date, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }): string {
  return new Intl.DateTimeFormat("en-US", opts).format(new Date(value));
}

export function formatWeekday(value: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(value);
}

export function daysBetween(a: string | Date, b: string | Date): number {
  const da = startOfDay(new Date(a)).getTime();
  const db = startOfDay(new Date(b)).getTime();
  return Math.round((db - da) / DAY_MS);
}

export function relativeActivity(lastActivityAt: string): string {
  const diff = daysBetween(lastActivityAt, new Date());
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}
