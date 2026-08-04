import type { Measurement } from "@/lib/types";
import { formatDate } from "@/lib/date-utils";

export function WeightChart({ measurements }: { measurements: Measurement[] }) {
  if (measurements.length < 2) {
    return <p className="text-sm text-[var(--muted)]">Not enough data yet to plot evolution.</p>;
  }

  const width = 560;
  const height = 160;
  const padding = 12;
  const weights = measurements.map((m) => m.weightKg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const points = measurements.map((m, i) => {
    const x = padding + (i / (measurements.length - 1)) * (width - padding * 2);
    const y = height - padding - ((m.weightKg - min) / range) * (height - padding * 2);
    return { x, y, m };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding} L${points[0].x},${height - padding} Z`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-40 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Weight evolution from ${points[0].m.weightKg}kg to ${points[points.length - 1].m.weightKg}kg across ${measurements.length} entries`}
      >
        <path d={areaPath} fill="var(--accent-soft)" />
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="var(--surface)" stroke="var(--accent)" strokeWidth={2} />
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{formatDate(points[0].m.date)}</span>
        <span className="font-medium text-[var(--foreground)]">
          {min.toFixed(1)}-{max.toFixed(1)} kg
        </span>
        <span>{formatDate(points[points.length - 1].m.date)}</span>
      </div>
    </div>
  );
}
