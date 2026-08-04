"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Exercise, Student, Workout } from "@/lib/types";
import { createId } from "@/lib/id";
import { useModalA11y } from "@/hooks/useModalA11y";

function newExercise(): Exercise {
  return { id: createId("ex"), name: "", sets: 3, reps: 10, loadKg: 0 };
}

function clampNumber(value: string, min: number, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.round(parsed));
}

interface FormErrors {
  student?: string;
  title?: string;
  date?: string;
  exercises?: string;
}

export function WorkoutModal({
  workout,
  students,
  defaultStudentId,
  onSave,
  onClose,
}: {
  workout: Workout | null;
  students: Student[];
  defaultStudentId?: string;
  onSave: (data: Omit<Workout, "id" | "completed" | "completedAt"> & { id?: string }) => void;
  onClose: () => void;
}) {
  const containerRef = useModalA11y<HTMLDivElement>(onClose);
  const [studentId, setStudentId] = useState(workout?.studentId ?? defaultStudentId ?? students[0]?.id ?? "");
  const [title, setTitle] = useState(workout?.title ?? "");
  const [date, setDate] = useState(() => (workout ? workout.date.slice(0, 10) : new Date().toISOString().slice(0, 10)));
  const [exercises, setExercises] = useState<Exercise[]>(workout?.exercises ?? [newExercise()]);
  const [errors, setErrors] = useState<FormErrors>({});

  function updateExercise(id: string, patch: Partial<Exercise>) {
    setExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, ...patch } : ex)));
  }

  function removeExercise(id: string) {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!studentId) nextErrors.student = "Select a student.";
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!date) nextErrors.date = "Date is required.";
    if (!exercises.some((ex) => ex.name.trim())) {
      nextErrors.exercises = "Add at least one exercise with a name.";
    }
    return nextErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      id: workout?.id,
      studentId,
      title: title.trim(),
      date: new Date(date).toISOString(),
      exercises: exercises
        .filter((ex) => ex.name.trim())
        .map((ex) => ({
          ...ex,
          name: ex.name.trim(),
          sets: clampNumber(String(ex.sets), 1, 1),
          reps: clampNumber(String(ex.reps), 1, 1),
          loadKg: clampNumber(String(ex.loadKg), 0, 0),
        })),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workout-modal-title"
        className="card flex max-h-[90vh] w-full max-w-lg flex-col p-5 animate-scale-in"
      >
        <div className="mb-4 flex items-center justify-between">
          <p id="workout-modal-title" className="font-medium">
            {workout ? "Edit Workout" : "New Workout"}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="workout-student" className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Student
              </label>
              <select
                id="workout-student"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="input"
                aria-invalid={Boolean(errors.student)}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.student && (
                <p role="alert" className="mt-1 text-xs text-danger">
                  {errors.student}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="workout-date" className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Date
              </label>
              <input
                id="workout-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
                aria-invalid={Boolean(errors.date)}
              />
              {errors.date && (
                <p role="alert" className="mt-1 text-xs text-danger">
                  {errors.date}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="workout-title" className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Title
            </label>
            <input
              id="workout-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Upper Body Push"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p role="alert" className="mt-1 text-xs text-danger">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Exercises</span>
              <button
                type="button"
                onClick={() => setExercises((prev) => [...prev, newExercise()])}
                className="flex items-center gap-1 rounded text-xs font-medium text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Add exercise
              </button>
            </div>

            {errors.exercises && (
              <p role="alert" className="mb-2 text-xs text-danger">
                {errors.exercises}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {exercises.map((ex, index) => (
                <div key={ex.id} className="rounded-lg border border-[var(--border)] p-2.5">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`exercise-name-${ex.id}`} className="sr-only">
                      Exercise {index + 1} name
                    </label>
                    <input
                      id={`exercise-name-${ex.id}`}
                      value={ex.name}
                      onChange={(e) => updateExercise(ex.id, { name: e.target.value })}
                      placeholder="Exercise name"
                      className="input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeExercise(ex.id)}
                      aria-label={`Remove exercise ${index + 1}`}
                      className="shrink-0 rounded text-[var(--muted)] hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div>
                      <label htmlFor={`exercise-sets-${ex.id}`} className="mb-1 block text-[11px] text-[var(--muted)]">
                        Sets
                      </label>
                      <input
                        id={`exercise-sets-${ex.id}`}
                        type="number"
                        inputMode="numeric"
                        value={ex.sets}
                        onChange={(e) => updateExercise(ex.id, { sets: clampNumber(e.target.value, 1, ex.sets) })}
                        className="input"
                        min={1}
                      />
                    </div>
                    <div>
                      <label htmlFor={`exercise-reps-${ex.id}`} className="mb-1 block text-[11px] text-[var(--muted)]">
                        Reps
                      </label>
                      <input
                        id={`exercise-reps-${ex.id}`}
                        type="number"
                        inputMode="numeric"
                        value={ex.reps}
                        onChange={(e) => updateExercise(ex.id, { reps: clampNumber(e.target.value, 1, ex.reps) })}
                        className="input"
                        min={1}
                      />
                    </div>
                    <div>
                      <label htmlFor={`exercise-load-${ex.id}`} className="mb-1 block text-[11px] text-[var(--muted)]">
                        Load (kg)
                      </label>
                      <input
                        id={`exercise-load-${ex.id}`}
                        type="number"
                        inputMode="numeric"
                        value={ex.loadKg}
                        onChange={(e) => updateExercise(ex.id, { loadKg: clampNumber(e.target.value, 0, ex.loadKg) })}
                        className="input"
                        min={0}
                      />
                    </div>
                  </div>
                  <label htmlFor={`exercise-notes-${ex.id}`} className="sr-only">
                    Exercise {index + 1} notes
                  </label>
                  <input
                    id={`exercise-notes-${ex.id}`}
                    value={ex.notes ?? ""}
                    onChange={(e) => updateExercise(ex.id, { notes: e.target.value || undefined })}
                    placeholder="Notes (optional)"
                    className="input mt-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-surface-alt"
            >
              Cancel
            </button>
            <button type="submit" className="btn-accent rounded-lg px-3 py-1.5 text-sm font-medium">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
