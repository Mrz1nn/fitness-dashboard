"use client";

import { ArrowLeft, CheckCircle2, Circle, Pencil, Plus, Ruler, Target, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { Avatar } from "./Avatar";
import { StatusBadge } from "./StatusBadge";
import { WeightChart } from "./WeightChart";
import { EmptyState } from "./EmptyState";
import { formatDate, relativeActivity } from "@/lib/date-utils";
import { evolutionPct } from "@/lib/metrics";
import { GOAL_LABEL } from "@/lib/types";
import type { Student, Workout } from "@/lib/types";

export function StudentDetail({
  student,
  workouts,
  onBack,
  onToggleCompleted,
  onNewWorkout,
  onEditWorkout,
  onDeleteWorkout,
}: {
  student: Student;
  workouts: Workout[];
  onBack: () => void;
  onToggleCompleted: (id: string) => void;
  onNewWorkout: () => void;
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (workout: Workout) => void;
}) {
  const latest = student.measurements[student.measurements.length - 1];
  const evolution = evolutionPct(student);
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 rounded text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to students
      </button>

      <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={student.name} size="lg" />
          <div>
            <p className="text-lg font-semibold">{student.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <Target className="h-3.5 w-3.5" /> {GOAL_LABEL[student.goal]}
              </span>
              <StatusBadge status={student.status} />
              <span>Active {relativeActivity(student.lastActivityAt)}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onNewWorkout}
          className="btn-accent flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> New Workout
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Current Weight</p>
          <p className="mt-1 text-xl font-semibold">{latest ? `${latest.weightKg} kg` : "-"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Height</p>
          <p className="mt-1 flex items-center gap-1.5 text-xl font-semibold">
            <Ruler className="h-4 w-4 text-[var(--muted)]" /> {student.heightCm} cm
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Evolution</p>
          <p className={`mt-1 flex items-center gap-1.5 text-xl font-semibold ${evolution && evolution < 0 ? "text-accent" : ""}`}>
            {evolution === null ? (
              "-"
            ) : (
              <>
                {evolution < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {evolution > 0 ? "+" : ""}
                {evolution.toFixed(1)}%
              </>
            )}
          </p>
        </div>
      </div>

      <div className="card mt-4 p-5">
        <p className="mb-3 font-medium">Weight Evolution</p>
        <WeightChart measurements={student.measurements} />
      </div>

      <div className="mt-4">
        <p className="mb-3 font-medium">Workout History</p>
        {sortedWorkouts.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No workouts yet"
            description="Create the first workout for this student to start tracking progress."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {sortedWorkouts.map((w) => (
              <div key={w.id} className="card flex items-center gap-2 p-3.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => onToggleCompleted(w.id)}
                  aria-label={w.completed ? `Mark ${w.title} as incomplete` : `Mark ${w.title} as complete`}
                  className={`shrink-0 rounded ${w.completed ? "text-accent" : "text-[var(--muted)]"}`}
                >
                  {w.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-medium ${w.completed ? "line-through text-[var(--muted)]" : ""}`}>{w.title}</p>
                  <p className="truncate text-xs text-[var(--muted)]">
                    {formatDate(w.date)} · {w.exercises.length} exercise{w.exercises.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditWorkout(w)}
                    aria-label={`Edit ${w.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteWorkout(w)}
                    aria-label={`Delete ${w.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
