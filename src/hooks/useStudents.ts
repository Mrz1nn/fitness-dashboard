"use client";

import { useEffect, useRef, useState } from "react";
import { loadStudents, saveStudents } from "@/lib/storage";
import type { Student } from "@/lib/types";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount
    setStudents(loadStudents());
    setIsLoaded(true);
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    saveStudents(students);
  }, [students]);

  function addStudent(student: Student) {
    setStudents((prev) => [student, ...prev]);
  }

  function updateStudent(id: string, patch: Partial<Student>) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function removeStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  return { students, isLoaded, addStudent, updateStudent, removeStudent, setStudents };
}
