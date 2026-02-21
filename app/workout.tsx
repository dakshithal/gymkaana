import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import WorkoutTracker from '@/components/WorkoutTracker';
import { getCurrentProgram } from '@/lib/programStore';

export default function WorkoutScreen() {
  const router = useRouter();
  const program = getCurrentProgram();
  // TODO: Replace with real auth user id from Supabase (auth.uid()).
  const userId = 'REPLACE_WITH_AUTH_USER_ID';
  const programId: string | undefined = undefined;

  if (!program || program.exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <WorkoutTracker
          program={{ name: 'No Program', exercises: [] }}
          userId={userId}
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
        userId={userId}
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
});
