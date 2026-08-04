"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import type { ToastState } from "@/hooks/useToast";

export function Toast({ toast, onDismiss }: { toast: ToastState | null; onDismiss: () => void }) {
  if (!toast) return null;

  const isError = toast.tone === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:justify-end sm:right-4 sm:left-auto sm:px-0"
    >
      <div
        className="card flex max-w-sm items-center gap-2.5 px-4 py-3 shadow-lg animate-fade-in"
        style={{ borderColor: isError ? "var(--danger)" : "var(--accent)" }}
      >
        {isError ? (
          <XCircle className="h-[18px] w-[18px] shrink-0 text-danger" />
        ) : (
          <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-accent" />
        )}
        <p className="text-sm">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="ml-1 shrink-0 text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
