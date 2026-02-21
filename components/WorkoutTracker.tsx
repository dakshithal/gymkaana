import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import type { Program, ProgramExercise } from '@/types/program';
import { createWorkoutSession, onCompleteSet, completeWorkoutSession } from '@/lib/workout';

const DARK_BG = '#0f0f0f';
const CARD_BG = '#1a1a1a';
const ACCENT = '#22c55e';
const ACCENT_PRESSED = '#16a34a';
const TEXT = '#f5f5f5';
const TEXT_MUTED = '#a3a3a3';
const BORDER = '#2a2a2a';
const COMPLETED = '#22c55e';
const PENDING = '#525252';

type Props = {
  program: Program;
  /** Supabase auth user id (auth.uid()) */
  userId: string;
  /** Optional reference to saved program template (public.programs.id) */
  programId?: string;
  onWorkoutComplete?: () => void;
};

/** Per-set completion state */
type SetState = 'pending' | 'completing' | 'done';

export default function WorkoutTracker({ program, userId, programId, onWorkoutComplete }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setStates, setSetStates] = useState<Record<string, SetState>>({});
  const [error, setError] = useState<string | null>(null);

  const exercises = program.exercises;
  const currentExercise = exercises[exerciseIndex];
  const isLastExercise = exerciseIndex >= exercises.length - 1;

  // Create session when component mounts (only if program has exercises)
  useEffect(() => {
    if (program.exercises.length === 0) return;

    let mounted = true;

    (async () => {
      const session = await createWorkoutSession(program, userId, programId);
      if (mounted && session) {
        setSessionId(session.id);
      } else {
        setError('Could not start workout session. Check Supabase config/auth.');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [program.exercises.length, userId, programId]);

  const getSetKey = useCallback((exId: string, setNum: number) => {
    return `${exId}-${setNum}`;
  }, []);

  const handleCompleteSet = useCallback(
    async (exercise: ProgramExercise, setNumber: number) => {
      if (!sessionId) return;

      const key = getSetKey(exercise.id, setNumber);
      setSetStates((prev) => ({ ...prev, [key]: 'completing' }));

      const success = await onCompleteSet(
        sessionId,
        exercise,
        setNumber,
        exercise.reps,
        exercise.weight
      );

      if (success) {
        setSetStates((prev) => ({ ...prev, [key]: 'done' }));
      } else {
        setSetStates((prev) => ({ ...prev, [key]: 'pending' }));
        setError('Failed to save set. Check your connection.');
      }
    },
    [sessionId, getSetKey]
  );

  const goNext = useCallback(async () => {
    if (isLastExercise) {
      if (sessionId) {
        await completeWorkoutSession(sessionId);
      }
      onWorkoutComplete?.();
      return;
    }
    setExerciseIndex((i) => i + 1);
  }, [isLastExercise, sessionId, onWorkoutComplete]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!currentExercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No exercises in this program</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Text style={styles.progressText}>
          Exercise {exerciseIndex + 1} of {exercises.length}
        </Text>
      </View>

      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseName}>{currentExercise.exerciseName}</Text>
        <View style={styles.targets}>
          <Text style={styles.targetText}>
            {currentExercise.sets} × {currentExercise.reps} reps @ {currentExercise.weight} kg
          </Text>
          <Text style={styles.restText}>Rest: {currentExercise.restSeconds}s</Text>
        </View>

        <View style={styles.setsContainer}>
          <Text style={styles.setsLabel}>Sets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.setsRow}>
              {Array.from({ length: currentExercise.sets }, (_, i) => {
                const setNum = i + 1;
                const key = getSetKey(currentExercise.id, setNum);
                const state = setStates[key] ?? 'pending';

                return (
                  <Pressable
                    key={key}
                    style={({ pressed }) => [
                      styles.setButton,
                      state === 'done' && styles.setButtonDone,
                      state === 'completing' && styles.setButtonCompleting,
                      pressed && state === 'pending' && styles.setButtonPressed,
                    ]}
                    onPress={() => handleCompleteSet(currentExercise, setNum)}
                    disabled={state !== 'pending'}
                  >
                    <Text
                      style={[
                        styles.setButtonText,
                        state === 'done' && styles.setButtonTextDone,
                      ]}
                    >
                      {state === 'done' ? '✓' : setNum}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.nextButtonPressed,
          ]}
          onPress={goNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastExercise ? 'Finish Workout' : 'Next Exercise'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  progressBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  progressText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  exerciseCard: {
    flex: 1,
    margin: 16,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 12,
  },
  targets: {
    marginBottom: 24,
  },
  targetText: {
    fontSize: 18,
    color: TEXT_MUTED,
    marginBottom: 4,
  },
  restText: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  setsContainer: {
    marginTop: 16,
  },
  setsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MUTED,
    marginBottom: 12,
  },
  setsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  setButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: PENDING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonPressed: {
    backgroundColor: '#737373',
  },
  setButtonCompleting: {
    backgroundColor: '#737373',
    opacity: 0.8,
  },
  setButtonDone: {
    backgroundColor: COMPLETED,
  },
  setButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
  },
  setButtonTextDone: {
    color: '#000',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  nextButton: {
    backgroundColor: ACCENT,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonPressed: {
    backgroundColor: ACCENT_PRESSED,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    padding: 24,
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: 16,
    padding: 24,
  },
});
