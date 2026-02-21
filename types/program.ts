/**
 * Types for Program Creator and Workout Tracker
 */

export type ProgramExercise = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  restSeconds: number;
};

export type Program = {
  id?: string;
  name: string;
  exercises: ProgramExercise[];
  createdAt?: string;
};

export type SetCompletion = {
  workoutSessionId: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  targetReps: number;
  targetWeight: number;
  actualReps?: number;
  actualWeight?: number;
  restSeconds: number;
  completedAt: string; // ISO string
};
