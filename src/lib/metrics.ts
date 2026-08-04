import { isSameDay } from "./date-utils";
import type { Student, Workout } from "./types";

export interface DashboardMetrics {
  activeStudents: number;
  workoutsToday: number;
  weeklyAttendancePct: number;
  averageEvolutionPct: number;
}

export function computeMetrics(students: Student[], workouts: Workout[]): DashboardMetrics {
  const activeStudents = students.filter((s) => s.status === "active").length;

  const today = new Date();
  const todaysWorkouts = workouts.filter((w) => isSameDay(w.date, today));
  const workoutsToday = todaysWorkouts.length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekWorkouts = workouts.filter((w) => new Date(w.date) >= weekAgo && new Date(w.date) <= today);
  const weeklyAttendancePct = weekWorkouts.length
    ? Math.round((weekWorkouts.filter((w) => w.completed).length / weekWorkouts.length) * 100)
    : 0;

  const evolutions = students
    .map((s) => evolutionPct(s))
    .filter((v): v is number => v !== null);
  const averageEvolutionPct = evolutions.length
    ? Math.round((evolutions.reduce((a, b) => a + b, 0) / evolutions.length) * 10) / 10
    : 0;

  return { activeStudents, workoutsToday, weeklyAttendancePct, averageEvolutionPct };
}

export function evolutionPct(student: Student): number | null {
  if (student.measurements.length < 2) return null;
  const first = student.measurements[0];
  const last = student.measurements[student.measurements.length - 1];
  if (first.weightKg === 0) return null;
  return ((last.weightKg - first.weightKg) / first.weightKg) * 100;
}
