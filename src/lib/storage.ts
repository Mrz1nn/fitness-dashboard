import { buildSeedStudents, buildSeedWorkouts } from "./seed-data";
import type { Preferences, Student, Workout } from "./types";

const KEYS = {
  students: "fitness-dashboard:students",
  workouts: "fitness-dashboard:workouts",
  preferences: "fitness-dashboard:preferences",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable or full: fail silently, in-memory state still works for this session
  }
}

export function loadStudents(): Student[] {
  if (!isBrowser()) return [];
  const existing = readJSON<Student[]>(KEYS.students);
  if (existing && Array.isArray(existing)) return existing;
  const seeded = buildSeedStudents();
  writeJSON(KEYS.students, seeded);
  return seeded;
}

export function saveStudents(students: Student[]): void {
  if (!isBrowser()) return;
  writeJSON(KEYS.students, students);
}

export function loadWorkouts(students: Student[]): Workout[] {
  if (!isBrowser()) return [];
  const existing = readJSON<Workout[]>(KEYS.workouts);
  if (existing && Array.isArray(existing)) return existing;
  const seeded = buildSeedWorkouts(students);
  writeJSON(KEYS.workouts, seeded);
  return seeded;
}

export function saveWorkouts(workouts: Workout[]): void {
  if (!isBrowser()) return;
  writeJSON(KEYS.workouts, workouts);
}

export function loadPreferences(): Preferences {
  const fallback: Preferences = { theme: "light" };
  if (!isBrowser()) return fallback;
  const existing = readJSON<Partial<Preferences>>(KEYS.preferences);
  return existing ? { ...fallback, ...existing } : fallback;
}

export function savePreferences(prefs: Preferences): void {
  if (!isBrowser()) return;
  writeJSON(KEYS.preferences, prefs);
}

export function resetAllData(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEYS.students);
  window.localStorage.removeItem(KEYS.workouts);
}
