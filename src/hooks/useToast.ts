"use client";

import { useCallback, useRef, useState } from "react";

export interface ToastState {
  id: number;
  message: string;
  tone: "success" | "error";
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string, tone: ToastState["tone"] = "success") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    counterRef.current += 1;
    setToast({ id: counterRef.current, message, tone });
    timeoutRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}
