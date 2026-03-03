import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import WorkoutTracker from '@/components/WorkoutTracker';
import { getCurrentProgram } from '@/lib/programStore';
import { useSupabaseUser } from '@/lib/auth';

export default function WorkoutScreen() {
  const router = useRouter();
  const program = getCurrentProgram();
  const { user, loading, error } = useSupabaseUser();
  const programId: string | undefined = undefined;

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color="#22c55e" />
          <Text style={styles.textMuted}>Loading your session…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.textError}>
            {error ?? 'You must be logged in to start a workout.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!program || program.exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <WorkoutTracker
          program={{ name: 'No Program', exercises: [] }}
          userId={user.id}
          programId={programId}
          onWorkoutComplete={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <WorkoutTracker
        program={program}
        userId={user.id}
        programId={programId}
        onWorkoutComplete={() => router.back()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  textMuted: {
    marginTop: 12,
    color: '#a3a3a3',
  },
  textError: {
    color: '#ef4444',
    textAlign: 'center',
  },
});
