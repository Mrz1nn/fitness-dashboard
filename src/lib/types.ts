export type Goal = "hypertrophy" | "weight-loss" | "conditioning" | "mobility";

export type StudentStatus = "active" | "paused" | "inactive";

export interface Measurement {
  date: string;
  weightKg: number;
  bodyFatPct?: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
}

export interface Student {
  id: string;
  name: string;
  goal: Goal;
  status: StudentStatus;
  heightCm: number;
  joinedAt: string;
  lastActivityAt: string;
  notes?: string;
  measurements: Measurement[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  loadKg: number;
  notes?: string;
}

export interface Workout {
  id: string;
  studentId: string;
  title: string;
  date: string;
  exercises: Exercise[];
  completed: boolean;
  completedAt?: string;
}

export interface Preferences {
  theme: "light" | "dark";
}

export const GOALS: Goal[] = ["hypertrophy", "weight-loss", "conditioning", "mobility"];

export const STATUSES: StudentStatus[] = ["active", "paused", "inactive"];

export const GOAL_LABEL: Record<Goal, string> = {
  hypertrophy: "Hypertrophy",
  "weight-loss": "Weight Loss",
  conditioning: "Conditioning",
  mobility: "Mobility",
};

export const STATUS_LABEL: Record<StudentStatus, string> = {
  active: "Active",
  paused: "Paused",
  inactive: "Inactive",
};

export const MIN_HEIGHT_CM = 100;
export const MAX_HEIGHT_CM = 250;
