"use client";

import { useMemo, useState } from "react";
import { Activity, CalendarCheck, Plus, TrendingUp, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { SearchBar } from "@/components/SearchBar";
import { GoalFilter } from "@/components/GoalFilter";
import { StudentCard } from "@/components/StudentCard";
import { StudentDetail } from "@/components/StudentDetail";
import { StudentModal } from "@/components/StudentModal";
import { WorkoutModal } from "@/components/WorkoutModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { EmptyState } from "@/components/EmptyState";
import { Toast } from "@/components/Toast";
import { useStudents } from "@/hooks/useStudents";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { createId } from "@/lib/id";
import { computeMetrics } from "@/lib/metrics";
import type { Goal, Student, Workout } from "@/lib/types";

export default function DashboardPage() {
  const { students, isLoaded: studentsLoaded, addStudent, updateStudent, removeStudent } = useStudents();
  const {
    workouts,
    addWorkout,
    updateWorkout,
    removeWorkout,
    removeWorkoutsByStudent,
    toggleCompleted,
  } = useWorkouts(students, studentsLoaded);
  const { theme, toggleTheme, isReady: themeReady } = useTheme();
  const { toast, showToast, dismissToast } = useToast();

  const [search, setSearch] = useState("");
  const [goalFilter, setGoalFilter] = useState<Goal | "all">("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [studentModal, setStudentModal] = useState<{ open: boolean; student: Student | null }>({
    open: false,
    student: null,
  });
  const [workoutModal, setWorkoutModal] = useState<{ open: boolean; workout: Workout | null; forStudentId?: string } | null>(
    null,
  );
  const [deleteStudentTarget, setDeleteStudentTarget] = useState<Student | null>(null);
  const [deleteWorkoutTarget, setDeleteWorkoutTarget] = useState<Workout | null>(null);

  const metrics = useMemo(() => computeMetrics(students, workouts), [students, workouts]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchesSearch = query === "" || s.name.toLowerCase().includes(query);
      const matchesGoal = goalFilter === "all" || s.goal === goalFilter;
      return matchesSearch && matchesGoal;
    });
  }, [students, search, goalFilter]);

  const selectedStudent = selectedStudentId ? students.find((s) => s.id === selectedStudentId) ?? null : null;

  if (!studentsLoaded || !themeReady) {
    return null;
  }

  function handleSaveStudent(data: Omit<Student, "id" | "measurements" | "joinedAt" | "lastActivityAt"> & { id?: string }) {
    if (data.id) {
      updateStudent(data.id, data);
      showToast(`${data.name} updated.`);
    } else {
      const now = new Date().toISOString();
      addStudent({ ...data, id: createId("student"), joinedAt: now, lastActivityAt: now, measurements: [] });
      showToast(`${data.name} added.`);
    }
  }

  function handleDeleteStudentConfirmed() {
    if (!deleteStudentTarget) return;
    removeStudentsCascade(deleteStudentTarget);
    setDeleteStudentTarget(null);
  }

  function removeStudentsCascade(target: Student) {
    removeStudent(target.id);
    removeWorkoutsByStudent(target.id);
    if (selectedStudentId === target.id) setSelectedStudentId(null);
    showToast(`${target.name} removed.`);
  }

  function handleSaveWorkout(data: Omit<Workout, "id" | "completed" | "completedAt"> & { id?: string }) {
    if (data.id) {
      updateWorkout(data.id, data);
      showToast(`${data.title} updated.`);
    } else {
      addWorkout({ ...data, id: createId("workout"), completed: false });
      showToast(`${data.title} scheduled.`);
    }
  }

  function handleDeleteWorkoutConfirmed() {
    if (!deleteWorkoutTarget) return;
    removeWorkout(deleteWorkoutTarget.id);
    showToast(`${deleteWorkoutTarget.title} removed.`);
    setDeleteWorkoutTarget(null);
  }

  if (selectedStudent) {
    return (
      <>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <StudentDetail
          student={selectedStudent}
          workouts={workouts.filter((w) => w.studentId === selectedStudent.id)}
          onBack={() => setSelectedStudentId(null)}
          onToggleCompleted={toggleCompleted}
          onNewWorkout={() => setWorkoutModal({ open: true, workout: null, forStudentId: selectedStudent.id })}
          onEditWorkout={(workout) => setWorkoutModal({ open: true, workout })}
          onDeleteWorkout={(workout) => setDeleteWorkoutTarget(workout)}
        />
        {workoutModal?.open && (
          <WorkoutModal
            workout={workoutModal.workout}
            students={students}
            defaultStudentId={workoutModal.forStudentId ?? selectedStudent.id}
            onSave={handleSaveWorkout}
            onClose={() => setWorkoutModal(null)}
          />
        )}
        {deleteWorkoutTarget && (
          <ConfirmDialog
            title={`Delete ${deleteWorkoutTarget.title}?`}
            description="This will permanently remove the workout and cannot be undone."
            onConfirm={handleDeleteWorkoutConfirmed}
            onCancel={() => setDeleteWorkoutTarget(null)}
          />
        )}
        <Toast toast={toast} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Active Students" value={String(metrics.activeStudents)} icon={Users} />
          <MetricCard label="Workouts Today" value={String(metrics.workoutsToday)} icon={CalendarCheck} />
          <MetricCard label="Weekly Attendance" value={`${metrics.weeklyAttendancePct}%`} icon={Activity} />
          <MetricCard
            label="Avg. Evolution"
            value={`${metrics.averageEvolutionPct > 0 ? "+" : ""}${metrics.averageEvolutionPct}%`}
            icon={TrendingUp}
          />
        </div>

        <div className="mt-6">
          <p className="mb-3 font-medium">This Week</p>
          <WeeklyCalendar workouts={workouts} students={students} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar value={search} onChange={setSearch} />
            <GoalFilter value={goalFilter} onChange={setGoalFilter} />
          </div>
          <button
            type="button"
            onClick={() => setStudentModal({ open: true, student: null })}
            className="btn-accent flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> New Student
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {filteredStudents.length === 0 ? (
            <EmptyState
              icon={Users}
              title={students.length === 0 ? "No students yet" : "No students found"}
              description={
                students.length === 0
                  ? "Add your first student to start building their training history."
                  : "Try adjusting your search or goal filter."
              }
              action={
                students.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setStudentModal({ open: true, student: null })}
                    className="btn-accent rounded-lg px-3 py-1.5 text-sm font-medium"
                  >
                    Add Student
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setGoalFilter("all");
                    }}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-surface-alt"
                  >
                    Clear filters
                  </button>
                )
              }
            />
          ) : (
            filteredStudents.map((s) => (
              <StudentCard
                key={s.id}
                student={s}
                onSelect={() => setSelectedStudentId(s.id)}
                onEdit={() => setStudentModal({ open: true, student: s })}
                onDelete={() => setDeleteStudentTarget(s)}
              />
            ))
          )}
        </div>
      </main>

      {studentModal.open && (
        <StudentModal
          student={studentModal.student}
          onSave={handleSaveStudent}
          onClose={() => setStudentModal({ open: false, student: null })}
        />
      )}

      {workoutModal?.open && (
        <WorkoutModal
          workout={workoutModal.workout}
          students={students}
          defaultStudentId={workoutModal.forStudentId}
          onSave={handleSaveWorkout}
          onClose={() => setWorkoutModal(null)}
        />
      )}

      {deleteStudentTarget && (
        <ConfirmDialog
          title={`Delete ${deleteStudentTarget.name}?`}
          description="This will permanently remove the student and all of their workouts. This cannot be undone."
          onConfirm={handleDeleteStudentConfirmed}
          onCancel={() => setDeleteStudentTarget(null)}
        />
      )}

      {deleteWorkoutTarget && (
        <ConfirmDialog
          title={`Delete ${deleteWorkoutTarget.title}?`}
          description="This will permanently remove the workout and cannot be undone."
          onConfirm={handleDeleteWorkoutConfirmed}
          onCancel={() => setDeleteWorkoutTarget(null)}
        />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
