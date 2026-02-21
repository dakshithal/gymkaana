/**
 * Exercise catalog grouped by body part for the Gymkaana app.
 * Used by Program Creator for selection and categorization.
 */

export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
};

export type ExerciseGroup = {
  bodyPart: string;
  data: Exercise[];
};

/** Exercises grouped by body part for SectionList */
export const EXERCISES_BY_BODY_PART: Record<string, Exercise[]> = {
  Chest: [
    { id: 'bench-press', name: 'Bench Press', bodyPart: 'Chest' },
    { id: 'incline-bench-press', name: 'Incline Bench Press', bodyPart: 'Chest' },
    { id: 'decline-bench-press', name: 'Decline Bench Press', bodyPart: 'Chest' },
    { id: 'dumbbell-fly', name: 'Dumbbell Fly', bodyPart: 'Chest' },
    { id: 'cable-crossover', name: 'Cable Crossover', bodyPart: 'Chest' },
    { id: 'push-up', name: 'Push Up', bodyPart: 'Chest' },
    { id: 'chest-dip', name: 'Chest Dip', bodyPart: 'Chest' },
    { id: 'pec-deck', name: 'Pec Deck Machine', bodyPart: 'Chest' },
  ],
  Back: [
    { id: 'deadlift', name: 'Deadlift', bodyPart: 'Back' },
    { id: 'barbell-row', name: 'Barbell Row', bodyPart: 'Back' },
    { id: 'pull-up', name: 'Pull Up', bodyPart: 'Back' },
    { id: 'lat-pulldown', name: 'Lat Pulldown', bodyPart: 'Back' },
    { id: 'seated-cable-row', name: 'Seated Cable Row', bodyPart: 'Back' },
    { id: 't-bar-row', name: 'T-Bar Row', bodyPart: 'Back' },
    { id: 'single-arm-dumbbell-row', name: 'Single-Arm Dumbbell Row', bodyPart: 'Back' },
    { id: 'face-pull', name: 'Face Pull', bodyPart: 'Back' },
    { id: 'straight-arm-pulldown', name: 'Straight Arm Pulldown', bodyPart: 'Back' },
  ],
  Legs: [
    { id: 'squat', name: 'Squat', bodyPart: 'Legs' },
    { id: 'front-squat', name: 'Front Squat', bodyPart: 'Legs' },
    { id: 'leg-press', name: 'Leg Press', bodyPart: 'Legs' },
    { id: 'leg-extension', name: 'Leg Extension', bodyPart: 'Legs' },
    { id: 'leg-curl', name: 'Leg Curl', bodyPart: 'Legs' },
    { id: 'romanian-deadlift', name: 'Romanian Deadlift', bodyPart: 'Legs' },
    { id: 'lunges', name: 'Lunges', bodyPart: 'Legs' },
    { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', bodyPart: 'Legs' },
    { id: 'calf-raise', name: 'Calf Raise', bodyPart: 'Legs' },
    { id: 'hack-squat', name: 'Hack Squat', bodyPart: 'Legs' },
  ],
  Shoulders: [
    { id: 'overhead-press', name: 'Overhead Press', bodyPart: 'Shoulders' },
    { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', bodyPart: 'Shoulders' },
    { id: 'lateral-raise', name: 'Lateral Raise', bodyPart: 'Shoulders' },
    { id: 'front-raise', name: 'Front Raise', bodyPart: 'Shoulders' },
    { id: 'rear-delt-fly', name: 'Rear Delt Fly', bodyPart: 'Shoulders' },
    { id: 'arnold-press', name: 'Arnold Press', bodyPart: 'Shoulders' },
    { id: 'face-pull-shoulders', name: 'Face Pull (Shoulders)', bodyPart: 'Shoulders' },
  ],
  Biceps: [
    { id: 'barbell-curl', name: 'Barbell Curl', bodyPart: 'Biceps' },
    { id: 'dumbbell-curl', name: 'Dumbbell Curl', bodyPart: 'Biceps' },
    { id: 'hammer-curl', name: 'Hammer Curl', bodyPart: 'Biceps' },
    { id: 'preacher-curl', name: 'Preacher Curl', bodyPart: 'Biceps' },
    { id: 'cable-curl', name: 'Cable Curl', bodyPart: 'Biceps' },
    { id: 'concentration-curl', name: 'Concentration Curl', bodyPart: 'Biceps' },
  ],
  Triceps: [
    { id: 'tricep-pushdown', name: 'Tricep Pushdown', bodyPart: 'Triceps' },
    { id: 'skull-crusher', name: 'Skull Crusher', bodyPart: 'Triceps' },
    { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', bodyPart: 'Triceps' },
    { id: 'close-grip-bench', name: 'Close Grip Bench Press', bodyPart: 'Triceps' },
    { id: 'tricep-dip', name: 'Tricep Dip', bodyPart: 'Triceps' },
    { id: 'diamond-push-up', name: 'Diamond Push Up', bodyPart: 'Triceps' },
  ],
  Core: [
    { id: 'plank', name: 'Plank', bodyPart: 'Core' },
    { id: 'crunch', name: 'Crunch', bodyPart: 'Core' },
    { id: 'leg-raise', name: 'Leg Raise', bodyPart: 'Core' },
    { id: 'cable-woodchop', name: 'Cable Woodchop', bodyPart: 'Core' },
    { id: 'russian-twist', name: 'Russian Twist', bodyPart: 'Core' },
    { id: 'ab-wheel', name: 'Ab Wheel Rollout', bodyPart: 'Core' },
  ],
};

/** SectionList-compatible format: [{ title, data }] */
export function getExerciseSections(): ExerciseGroup[] {
  return Object.entries(EXERCISES_BY_BODY_PART).map(([bodyPart, data]) => ({
    bodyPart,
    data,
  }));
}

/** Get exercise by id */
export function getExerciseById(id: string): Exercise | undefined {
  for (const exercises of Object.values(EXERCISES_BY_BODY_PART)) {
    const found = exercises.find((e) => e.id === id);
    if (found) return found;
  }
  return undefined;
}
