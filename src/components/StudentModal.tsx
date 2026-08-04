"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Goal, Student, StudentStatus } from "@/lib/types";
import { GOAL_LABEL, GOALS, MAX_HEIGHT_CM, MIN_HEIGHT_CM, STATUS_LABEL, STATUSES } from "@/lib/types";
import { useModalA11y } from "@/hooks/useModalA11y";

interface FormErrors {
  name?: string;
  heightCm?: string;
}

export function StudentModal({
  student,
  onSave,
  onClose,
}: {
  student: Student | null;
  onSave: (data: Omit<Student, "id" | "measurements" | "joinedAt" | "lastActivityAt"> & { id?: string }) => void;
  onClose: () => void;
}) {
  const containerRef = useModalA11y<HTMLDivElement>(onClose);
  const [name, setName] = useState(student?.name ?? "");
  const [goal, setGoal] = useState<Goal>(student?.goal ?? "hypertrophy");
  const [status, setStatus] = useState<StudentStatus>(student?.status ?? "active");
  const [heightCm, setHeightCm] = useState(String(student?.heightCm ?? 170));
  const [notes, setNotes] = useState(student?.notes ?? "");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    }
    const heightValue = Number(heightCm);
    if (heightCm.trim() === "" || !Number.isFinite(heightValue)) {
      nextErrors.heightCm = "Enter a valid height.";
    } else if (heightValue < MIN_HEIGHT_CM || heightValue > MAX_HEIGHT_CM) {
      nextErrors.heightCm = `Height must be between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm.`;
    }
    return nextErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      id: student?.id,
      name: name.trim(),
      goal,
      status,
      heightCm: Math.round(Number(heightCm)),
      notes: notes.trim() || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
        className="card flex max-h-[90vh] w-full max-w-md flex-col p-5 animate-scale-in"
      >
        <div className="mb-4 flex items-center justify-between">
          <p id="student-modal-title" className="font-medium">
            {student ? "Edit Student" : "New Student"}
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
          <div>
            <label htmlFor="student-name" className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Name
            </label>
            <input
              id="student-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "student-name-error" : undefined}
            />
            {errors.name && (
              <p id="student-name-error" role="alert" className="mt-1 text-xs text-danger">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="student-goal" className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Goal
              </label>
              <select id="student-goal" value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="input">
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {GOAL_LABEL[g]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="student-status" className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Status
              </label>
              <select
                id="student-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus)}
                className="input"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="student-height" className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Height (cm)
            </label>
            <input
              id="student-height"
              type="number"
              inputMode="numeric"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="input"
              min={MIN_HEIGHT_CM}
              max={MAX_HEIGHT_CM}
              aria-invalid={Boolean(errors.heightCm)}
              aria-describedby={errors.heightCm ? "student-height-error" : undefined}
            />
            {errors.heightCm && (
              <p id="student-height-error" role="alert" className="mt-1 text-xs text-danger">
                {errors.heightCm}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="student-notes" className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Notes
            </label>
            <textarea
              id="student-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input resize-none"
            />
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
