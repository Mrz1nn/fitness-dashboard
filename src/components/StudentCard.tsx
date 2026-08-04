"use client";

import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { StatusBadge } from "./StatusBadge";
import { GOAL_LABEL } from "@/lib/types";
import type { Student } from "@/lib/types";
import { relativeActivity } from "@/lib/date-utils";

export function StudentCard({
  student,
  onSelect,
  onEdit,
  onDelete,
}: {
  student: Student;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="card relative flex items-center gap-3 p-4 transition-colors hover:border-accent">
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-3 rounded text-left">
        <Avatar name={student.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{student.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--muted)]">
            <span className="truncate">{GOAL_LABEL[student.goal]}</span>
            <span aria-hidden="true">·</span>
            <StatusBadge status={student.status} />
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="hidden sm:inline">{relativeActivity(student.lastActivityAt)}</span>
          </div>
        </div>
      </button>

      <div className="relative shrink-0">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={`Actions for ${student.name}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div role="menu" className="card absolute right-0 top-9 z-20 w-32 overflow-hidden py-1 text-sm shadow-lg">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="block w-full px-3 py-1.5 text-left hover:bg-surface-alt"
              >
                Edit
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="block w-full px-3 py-1.5 text-left text-danger hover:bg-danger-soft"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
