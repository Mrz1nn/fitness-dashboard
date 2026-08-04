"use client";

import { useEffect, useRef, useState } from "react";
import { loadWorkouts, saveWorkouts } from "@/lib/storage";
import type { Student, Workout } from "@/lib/types";

export function useWorkouts(students: Student[], studentsLoaded: boolean) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!studentsLoaded || hasHydrated.current) return;
    setWorkouts(loadWorkouts(students));
    setIsLoaded(true);
    hasHydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- students only needed for first-run seed
  }, [studentsLoaded]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    saveWorkouts(workouts);
  }, [workouts]);

  function addWorkout(workout: Workout) {
    setWorkouts((prev) => [workout, ...prev]);
  }

  function updateWorkout(id: string, patch: Partial<Workout>) {
    setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }

  function removeWorkout(id: string) {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }

  function removeWorkoutsByStudent(studentId: string) {
    setWorkouts((prev) => prev.filter((w) => w.studentId !== studentId));
  }

  function toggleCompleted(id: string) {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, completed: !w.completed, completedAt: !w.completed ? new Date().toISOString() : undefined }
          : w,
      ),
    );
  }

  return { workouts, isLoaded, addWorkout, updateWorkout, removeWorkout, removeWorkoutsByStudent, toggleCompleted };
}
