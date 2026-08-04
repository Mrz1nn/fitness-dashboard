import { getWeekDays, formatWeekday, isSameDay } from "@/lib/date-utils";
import type { Student, Workout } from "@/lib/types";

export function WeeklyCalendar({ workouts, students }: { workouts: Workout[]; students: Student[] }) {
  const days = getWeekDays();
  const studentById = new Map(students.map((s) => [s.id, s]));
  const today = new Date();

  return (
    <div className="scroll-x -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="grid min-w-[640px] grid-cols-7 gap-2 sm:min-w-0">
        {days.map((day) => {
          const dayWorkouts = workouts.filter((w) => isSameDay(w.date, day));
          const isToday = isSameDay(day, today);
          return (
            <div
              key={day.toISOString()}
              className="card flex min-h-[7rem] flex-col gap-1.5 p-2.5"
              style={isToday ? { borderColor: "var(--accent)" } : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase text-[var(--muted)]">{formatWeekday(day)}</span>
                <span className={`text-xs font-semibold ${isToday ? "text-accent" : ""}`}>{day.getDate()}</span>
              </div>
              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                {dayWorkouts.slice(0, 3).map((w) => {
                  const student = studentById.get(w.studentId);
                  return (
                    <div
                      key={w.id}
                      title={`${student?.name ?? "Unknown"}: ${w.title}`}
                      className={`truncate rounded-md px-1.5 py-1 text-[11px] ${
                        w.completed ? "bg-accent-soft text-accent" : "bg-surface-alt text-[var(--muted)]"
                      }`}
                    >
                      {student?.name.split(" ")[0]} · {w.title}
                    </div>
                  );
                })}
                {dayWorkouts.length > 3 && (
                  <span className="text-[11px] text-[var(--muted)]">+{dayWorkouts.length - 3} more</span>
                )}
                {dayWorkouts.length === 0 && <span className="text-[11px] text-[var(--muted)]">No workouts</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
