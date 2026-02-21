import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  SectionList,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import type { Program, ProgramExercise } from '@/types/program';

const DARK_BG = '#0f0f0f';
const CARD_BG = '#1a1a1a';
const ACCENT = '#22c55e';
const ACCENT_PRESSED = '#16a34a';
const TEXT = '#f5f5f5';
const TEXT_MUTED = '#a3a3a3';
const BORDER = '#2a2a2a';
const INPUT_BG = '#262626';

type Props = {
  program: Program;
  onProgramChange: (program: Program) => void;
  onStartWorkout?: () => void;
  onSaveProgram?: () => void;
};

type ExerciseItem = {
  id: string; // exercises.id (UUID)
  name: string;
  bodyPartId: string | null;
  bodyPartName: string;
};

type ExerciseSection = {
  bodyPartId: string | null;
  bodyPartName: string;
  data: ExerciseItem[];
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ProgramCreator({
  program,
  onProgramChange,
  onStartWorkout,
  onSaveProgram,
}: Props) {
  const [programName, setProgramName] = useState(program.name || 'My Workout');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sections, setSections] = useState<ExerciseSection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load body parts + exercises from Supabase
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setLoadError(null);

      const [{ data: bodyParts, error: bpError }, { data: exercises, error: exError }] =
        await Promise.all([
          supabase.from('body_parts').select('id, name').order('name'),
          supabase.from('exercises').select('id, name, body_part_id').order('name'),
        ]);

      if (!mounted) return;

      if (bpError || exError) {
        console.error('[ProgramCreator] Failed to load exercises', bpError, exError);
        setLoadError('Could not load exercises from Supabase.');
        setLoading(false);
        return;
      }

      const partsById = new Map<string, string>();
      bodyParts?.forEach((bp) => {
        partsById.set(bp.id, bp.name);
      });

      const grouped = new Map<string | null, ExerciseItem[]>();
      exercises?.forEach((ex) => {
        const bodyPartId = ex.body_part_id ?? null;
        const bodyPartName = (bodyPartId && partsById.get(bodyPartId)) || 'Other';
        const existing = grouped.get(bodyPartId) ?? [];
        existing.push({
          id: ex.id,
          name: ex.name,
          bodyPartId,
          bodyPartName,
        });
        grouped.set(bodyPartId, existing);
      });

      const result: ExerciseSection[] = Array.from(grouped.entries())
        .map(([bodyPartId, data]) => ({
          bodyPartId,
          bodyPartName: data[0]?.bodyPartName ?? 'Other',
          data: data.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.bodyPartName.localeCompare(b.bodyPartName));

      setSections(result);
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const addExercise = useCallback(
    (exercise: ExerciseItem) => {
      const existing = program.exercises.find((e) => e.exerciseId === exercise.id);
      if (existing) {
        Alert.alert('Already added', `${exercise.name} is already in your program.`);
        return;
      }

      const newEntry: ProgramExercise = {
        id: generateId(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: 3,
        reps: 10,
        weight: 0,
        restSeconds: 90,
      };

      onProgramChange({
        ...program,
        name: programName,
        exercises: [...program.exercises, newEntry],
      });
    },
    [program, programName, onProgramChange]
  );

  const updateExercise = useCallback(
    (id: string, updates: Partial<ProgramExercise>) => {
      onProgramChange({
        ...program,
        name: programName,
        exercises: program.exercises.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      });
    },
    [program, programName, onProgramChange]
  );

  const removeExercise = useCallback(
    (id: string) => {
      onProgramChange({
        ...program,
        name: programName,
        exercises: program.exercises.filter((e) => e.id !== id),
      });
    },
    [program, programName, onProgramChange]
  );

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseItem }) => (
      <Pressable
        style={({ pressed }) => [
          styles.exerciseItem,
          pressed && styles.exerciseItemPressed,
        ]}
        onPress={() => addExercise(item)}
      >
        <Text style={styles.exerciseItemText}>{item.name}</Text>
      </Pressable>
    ),
    [addExercise]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: ExerciseSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.bodyPartName}</Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TextInput
            style={styles.programNameInput}
            value={programName}
            onChangeText={(t) => {
              setProgramName(t);
              onProgramChange({ ...program, name: t });
            }}
            placeholder="Program name"
            placeholderTextColor={TEXT_MUTED}
          />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Add Exercises</Text>
        </View>

        {loadError ? (
          <View style={styles.sectionListContent}>
            <Text style={styles.errorText}>{loadError}</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderExerciseItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled
            contentContainerStyle={styles.sectionListContent}
            style={styles.sectionList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !loading ? (
                <Text style={styles.emptyText}>
                  No exercises found. Add exercises in Supabase to see them here.
                </Text>
              ) : null
            }
          />
        )}

        <View style={styles.divider} />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your Program ({program.exercises.length})</Text>
        </View>

        <View style={styles.programList}>
          {program.exercises.length === 0 ? (
            <Text style={styles.emptyText}>Tap exercises above to add them</Text>
          ) : (
            program.exercises.map((entry) => (
              <View key={entry.id} style={styles.programCard}>
                <View style={styles.programCardHeader}>
                  <Text style={styles.programCardTitle}>{entry.exerciseName}</Text>
                  <Pressable
                    style={({ pressed }) => [styles.removeBtn, pressed && styles.removeBtnPressed]}
                    onPress={() => removeExercise(entry.id)}
                  >
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </Pressable>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Sets</Text>
                    <TextInput
                      style={[styles.input, editingId === entry.id && styles.inputFocused]}
                      value={String(entry.sets)}
                      onChangeText={(t) =>
                        updateExercise(entry.id, { sets: parseInt(t, 10) || 0 })
                      }
                      keyboardType="number-pad"
                      onFocus={() => setEditingId(entry.id)}
                      onBlur={() => setEditingId(null)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Reps</Text>
                    <TextInput
                      style={[styles.input, editingId === entry.id && styles.inputFocused]}
                      value={String(entry.reps)}
                      onChangeText={(t) =>
                        updateExercise(entry.id, { reps: parseInt(t, 10) || 0 })
                      }
                      keyboardType="number-pad"
                      onFocus={() => setEditingId(entry.id)}
                      onBlur={() => setEditingId(null)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Weight (kg)</Text>
                    <TextInput
                      style={[styles.input, editingId === entry.id && styles.inputFocused]}
                      value={String(entry.weight)}
                      onChangeText={(t) =>
                        updateExercise(entry.id, { weight: parseFloat(t) || 0 })
                      }
                      keyboardType="decimal-pad"
                      onFocus={() => setEditingId(entry.id)}
                      onBlur={() => setEditingId(null)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Rest (s)</Text>
                    <TextInput
                      style={[styles.input, editingId === entry.id && styles.inputFocused]}
                      value={String(entry.restSeconds)}
                      onChangeText={(t) =>
                        updateExercise(entry.id, { restSeconds: parseInt(t, 10) || 0 })
                      }
                      keyboardType="number-pad"
                      onFocus={() => setEditingId(entry.id)}
                      onBlur={() => setEditingId(null)}
                    />
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {program.exercises.length > 0 && (
          <View style={styles.footer}>
            {onSaveProgram && (
              <Pressable
                style={({ pressed }) => [styles.footerBtn, pressed && styles.footerBtnPressed]}
                onPress={onSaveProgram}
              >
                <Text style={styles.footerBtnText}>Save Program</Text>
              </Pressable>
            )}
            {onStartWorkout && (
              <Pressable
                style={({ pressed }) => [
                  styles.footerBtn,
                  styles.footerBtnPrimary,
                  pressed && styles.footerBtnPrimaryPressed,
                ]}
                onPress={onStartWorkout}
              >
                <Text style={styles.footerBtnPrimaryText}>Start Workout</Text>
              </Pressable>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  flex: { flex: 1 },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  programNameInput: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: INPUT_BG,
    borderRadius: 12,
  },
  sectionRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  sectionList: {
    flex: 1,
  },
  sectionListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionHeader: {
    backgroundColor: DARK_BG,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: ACCENT,
    textTransform: 'uppercase',
  },
  exerciseItem: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  exerciseItemPressed: {
    opacity: 0.7,
  },
  exerciseItemText: {
    fontSize: 16,
    color: TEXT,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 16,
  },
  programList: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
  },
  programCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  programCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  programCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },
  removeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  removeBtnPressed: {
    opacity: 0.7,
  },
  removeBtnText: {
    color: '#ef4444',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginBottom: 4,
  },
  input: {
    backgroundColor: INPUT_BG,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: TEXT,
    fontSize: 14,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: ACCENT,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  footerBtnPressed: {
    opacity: 0.8,
  },
  footerBtnText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  footerBtnPrimary: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  footerBtnPrimaryPressed: {
    backgroundColor: ACCENT_PRESSED,
  },
  footerBtnPrimaryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
