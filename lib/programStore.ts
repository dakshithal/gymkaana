/**
 * Simple in-memory store for the current program when starting a workout.
 * WorkoutTracker reads from here when mounted.
 */

import type { Program } from '@/types/program';

let currentProgram: Program | null = null;

export function setCurrentProgram(program: Program): void {
  currentProgram = program;
}

export function getCurrentProgram(): Program | null {
  return currentProgram;
}
