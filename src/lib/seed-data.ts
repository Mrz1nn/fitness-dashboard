import type { Exercise, Goal, Measurement, Student, StudentStatus, Workout } from "./types";

function uid(prefix: string, n: number): string {
  return `${prefix}-${n.toString().padStart(3, "0")}`;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function isoDaysFromNow(days: number): string {
  return isoDaysAgo(-days);
}

function buildMeasurements(startWeight: number, weeks: number, trendPerWeek: number): Measurement[] {
  const out: Measurement[] = [];
  for (let i = weeks; i >= 0; i--) {
    const weight = startWeight + trendPerWeek * (weeks - i) + (i % 3 === 0 ? 0.3 : -0.2);
    out.push({
      date: isoDaysAgo(i * 7),
      weightKg: Math.round(weight * 10) / 10,
      bodyFatPct: Math.round((22 - (weeks - i) * 0.2) * 10) / 10,
      waistCm: Math.round(84 - (weeks - i) * 0.15),
      chestCm: Math.round(98 + (weeks - i) * 0.1),
      armCm: Math.round(33 + (weeks - i) * 0.08),
    });
  }
  return out;
}

const NAMES = [
  "Alana Reis", "Bruno Castilho", "Carla Menezes", "Diego Farias",
  "Elisa Nogueira", "Fábio Teixeira", "Giovana Prado", "Henrique Salgado",
  "Isabela Cunha", "João Vitor Aragão", "Karina Sette", "Leonardo Vaz",
  "Mariana Estrela", "Nicolas Bettega", "Olívia Marchetti", "Pedro Salviano",
];

const GOALS: Goal[] = ["hypertrophy", "weight-loss", "conditioning", "mobility"];
const STATUSES: StudentStatus[] = ["active", "active", "active", "paused", "inactive"];

export function buildSeedStudents(): Student[] {
  return NAMES.map((name, i) => {
    const goal = GOALS[i % GOALS.length];
    const status = STATUSES[i % STATUSES.length];
    const weeks = 10 + (i % 4) * 2;
    const trend = goal === "weight-loss" ? -0.35 : goal === "hypertrophy" ? 0.25 : 0.05;
    const lastActivityDaysAgo = status === "active" ? i % 4 : status === "paused" ? 12 + i : 40 + i;

    return {
      id: uid("student", i + 1),
      name,
      goal,
      status,
      heightCm: 158 + (i % 10) * 3,
      joinedAt: isoDaysAgo(120 + i * 6),
      lastActivityAt: isoDaysAgo(lastActivityDaysAgo),
      notes: undefined,
      measurements: buildMeasurements(60 + (i % 6) * 4, weeks, trend),
    };
  });
}

const EXERCISE_LIBRARY: Record<Goal, string[]> = {
  hypertrophy: ["Barbell Squat", "Bench Press", "Bent-Over Row", "Overhead Press", "Romanian Deadlift"],
  "weight-loss": ["Kettlebell Swing", "Rowing Sprint", "Jump Rope", "Battle Ropes", "Step-Up"],
  conditioning: ["Assault Bike", "Box Jump", "Burpee", "Sled Push", "Mountain Climber"],
  mobility: ["Hip Flexor Stretch", "Thoracic Rotation", "World's Greatest Stretch", "Ankle Circles", "Cat-Cow"],
};

function buildExercises(goal: Goal, seed: number): Exercise[] {
  const pool = EXERCISE_LIBRARY[goal];
  return pool.slice(0, 4).map((name, i) => ({
    id: uid(`ex-${seed}`, i + 1),
    name,
    sets: 3 + ((seed + i) % 2),
    reps: goal === "conditioning" ? 15 : goal === "mobility" ? 10 : 8 + (i % 3),
    loadKg: goal === "mobility" ? 0 : 10 + ((seed + i) % 6) * 5,
    notes: i === 0 ? "Warm up with 2 light sets before working weight." : undefined,
  }));
}

const WORKOUT_TITLES: Record<Goal, string[]> = {
  hypertrophy: ["Upper Body Push", "Lower Body Power", "Back & Arms"],
  "weight-loss": ["Metabolic Circuit", "Full Body Burn", "Cardio Strength Mix"],
  conditioning: ["Engine Builder", "Sprint Intervals", "Endurance Circuit"],
  mobility: ["Morning Flow", "Hip & Spine Reset", "Recovery Session"],
};

export function buildSeedWorkouts(students: Student[]): Workout[] {
  const workouts: Workout[] = [];
  let counter = 0;

  students.forEach((student, si) => {
    if (student.status === "inactive") return;
    const titles = WORKOUT_TITLES[student.goal];

    for (let offset = -4; offset <= 2; offset++) {
      if ((si + offset) % 3 !== 0 && offset !== 0) continue;
      counter++;
      const date = isoDaysFromNow(offset);
      const isPast = offset < 0;
      const isToday = offset === 0;
      workouts.push({
        id: uid("workout", counter),
        studentId: student.id,
        title: titles[counter % titles.length],
        date,
        exercises: buildExercises(student.goal, counter),
        completed: isPast || (isToday && si % 4 === 0),
        completedAt: isPast ? date : undefined,
      });
    }
  });

  return workouts;
}
