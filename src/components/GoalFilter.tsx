import type { Goal } from "@/lib/types";
import { GOAL_LABEL, GOALS } from "@/lib/types";

export function GoalFilter({
  value,
  onChange,
}: {
  value: Goal | "all";
  onChange: (v: Goal | "all") => void;
}) {
  const options: (Goal | "all")[] = ["all", ...GOALS];
  return (
    <div role="group" aria-label="Filter by goal" className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt
              ? "border-accent bg-accent-soft text-accent"
              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          {opt === "all" ? "All Goals" : GOAL_LABEL[opt]}
        </button>
      ))}
    </div>
  );
}
