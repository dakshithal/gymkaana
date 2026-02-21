# Gymkaana – Project Tracker & Changelog

> Updated as the project evolves. Move items from **To Do** → **Changelog** when done.

---

## Changelog

### Done

- **Program Creator fetches from Supabase** – `body_parts` + `exercises` loaded from DB; uses real UUIDs for `set_logs`
- **Supabase schema alignment** – `workout_sessions`, `set_logs`, `body_parts`, `exercises` wired to existing tables
- **onCompleteSet UPSERT** – Per-set save into `set_logs` with `(session_id, exercise_id, set_number)`; migration added for unique constraint
- **WorkoutTracker** – Live workout UI; one exercise at a time; Check button per set; `createWorkoutSession` + `completeWorkoutSession`
- **ProgramCreator** – SectionList with grouped exercises; Sets/Reps/Weight/Rest inputs per exercise; Start Workout / Save Program
- **Types & Supabase client** – `program.ts`, `supabase.ts`, `workout.ts`; AsyncStorage + URL polyfill for RN
- **Exercise constants** – `Exercises.ts` with body-part groupings (kept as fallback; ProgramCreator now uses Supabase)

---

## To Do

- [ ] **Wire Supabase auth** – Replace `userId` placeholder with `auth.uid()` in `app/workout.tsx`
- [ ] **Save/load programs** – Persist to `public.programs` from ProgramCreator; load templates for Start Workout
- [ ] **RLS for workout_sessions** – Policy so users only manage their own workout sessions
- [ ] **Seed body_parts & exercises** – Migration or script to populate Supabase if empty

---

*Last updated: Feb 2025*
