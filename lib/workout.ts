/**
 * Workout service: creates sessions and upserts set completions.
 * Ensures no data is lost if the app closes mid-workout.
 */

import { supabase } from './supabase';
import type { Program, ProgramExercise } from '@/types/program';

export type WorkoutSession = {
  id: string;
  userId: string;
  programId: string | null;
  startedAt: string | null;
};

/**
 * Create a new workout session when the user starts a workout.
 *
 * NOTE: `userId` must be the authenticated Supabase user (auth.uid()).
 * `programId` should reference `public.programs.id` when using saved templates.
 */
export async function createWorkoutSession(
  _program: Program,
  userId: string,
  programId?: string
): Promise<WorkoutSession | null> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: userId,
      program_id: programId ?? null,
    })
    .select('id, user_id, program_id, started_at')
    .single();

  if (error) {
    console.error('[workout] createWorkoutSession error:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    programId: data.program_id,
    startedAt: data.started_at,
  };
}

/**
 * UPSERT a single set log immediately - called on each "Check".
 *
 * Relies on a unique constraint on (session_id, exercise_id, set_number)
 * in `public.set_logs` to avoid duplicate rows.
 */
export async function onCompleteSet(
  workoutSessionId: string,
  exercise: ProgramExercise,
  setNumber: number,
  actualReps?: number,
  actualWeight?: number
): Promise<boolean> {
  const completedAt = new Date().toISOString();

  const { error } = await supabase.from('set_logs').upsert(
    {
      session_id: workoutSessionId,
      exercise_id: exercise.exerciseId,
      set_number: setNumber,
      weight: actualWeight ?? exercise.weight,
      reps: actualReps ?? exercise.reps,
      rest_time_seconds: exercise.restSeconds,
      completed_at: completedAt,
    },
    {
      onConflict: 'session_id,exercise_id,set_number',
    }
  );

  if (error) {
    console.error('[workout] onCompleteSet error:', error);
    return false;
  }

  return true;
}

/** Mark workout session as completed */
export async function completeWorkoutSession(workoutSessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('workout_sessions')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', workoutSessionId);

  if (error) {
    console.error('[workout] completeWorkoutSession error:', error);
    return false;
  }

  return true;
}
