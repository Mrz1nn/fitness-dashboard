import type { StudentStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";

const DOT_COLOR: Record<StudentStatus, string> = {
  active: "bg-accent",
  paused: "bg-amber-500",
  inactive: "bg-[var(--muted)]",
};

export function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
