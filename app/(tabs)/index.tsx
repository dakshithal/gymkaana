import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgramCreator from '@/components/ProgramCreator';
import { setCurrentProgram } from '@/lib/programStore';
import type { Program } from '@/types/program';

const defaultProgram: Program = {
  name: 'My Workout',
  exercises: [],
};

export default function TabOneScreen() {
  const router = useRouter();
  const [program, setProgram] = useState<Program>(defaultProgram);

  const handleStartWorkout = () => {
    setCurrentProgram(program);
    router.push('/workout');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgramCreator
        program={program}
        onProgramChange={setProgram}
        onStartWorkout={handleStartWorkout}
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
