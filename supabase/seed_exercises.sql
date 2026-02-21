-- Gymkaana: Seed body parts and exercises
-- Run this once in Supabase SQL Editor to get the full exercise library.
-- If you already have body parts (e.g. "Arms"), this will ADD new ones.

-- 1. Insert body parts (skip if name exists)
INSERT INTO public.body_parts (name)
VALUES
  ('Chest'),
  ('Back'),
  ('Legs'),
  ('Shoulders'),
  ('Biceps'),
  ('Triceps'),
  ('Core')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert exercises (only if not already present)
INSERT INTO public.exercises (name, body_part_id)
SELECT v.ex_name, bp.id
FROM (VALUES
  ('Bench Press', 'Chest'),
  ('Incline Bench Press', 'Chest'),
  ('Decline Bench Press', 'Chest'),
  ('Dumbbell Fly', 'Chest'),
  ('Cable Crossover', 'Chest'),
  ('Push Up', 'Chest'),
  ('Chest Dip', 'Chest'),
  ('Pec Deck Machine', 'Chest'),
  ('Deadlift', 'Back'),
  ('Barbell Row', 'Back'),
  ('Pull Up', 'Back'),
  ('Lat Pulldown', 'Back'),
  ('Seated Cable Row', 'Back'),
  ('T-Bar Row', 'Back'),
  ('Single-Arm Dumbbell Row', 'Back'),
  ('Face Pull', 'Back'),
  ('Straight Arm Pulldown', 'Back'),
  ('Squat', 'Legs'),
  ('Front Squat', 'Legs'),
  ('Leg Press', 'Legs'),
  ('Leg Extension', 'Legs'),
  ('Leg Curl', 'Legs'),
  ('Romanian Deadlift', 'Legs'),
  ('Lunges', 'Legs'),
  ('Bulgarian Split Squat', 'Legs'),
  ('Calf Raise', 'Legs'),
  ('Hack Squat', 'Legs'),
  ('Overhead Press', 'Shoulders'),
  ('Dumbbell Shoulder Press', 'Shoulders'),
  ('Lateral Raise', 'Shoulders'),
  ('Front Raise', 'Shoulders'),
  ('Rear Delt Fly', 'Shoulders'),
  ('Arnold Press', 'Shoulders'),
  ('Face Pull (Shoulders)', 'Shoulders'),
  ('Barbell Curl', 'Biceps'),
  ('Dumbbell Curl', 'Biceps'),
  ('Hammer Curl', 'Biceps'),
  ('Preacher Curl', 'Biceps'),
  ('Cable Curl', 'Biceps'),
  ('Concentration Curl', 'Biceps'),
  ('Tricep Pushdown', 'Triceps'),
  ('Skull Crusher', 'Triceps'),
  ('Overhead Tricep Extension', 'Triceps'),
  ('Close Grip Bench Press', 'Triceps'),
  ('Tricep Dip', 'Triceps'),
  ('Diamond Push Up', 'Triceps'),
  ('Plank', 'Core'),
  ('Crunch', 'Core'),
  ('Leg Raise', 'Core'),
  ('Cable Woodchop', 'Core'),
  ('Russian Twist', 'Core'),
  ('Ab Wheel Rollout', 'Core')
) AS v(ex_name, part_name)
JOIN public.body_parts bp ON bp.name = v.part_name
WHERE NOT EXISTS (
  SELECT 1 FROM public.exercises e
  JOIN public.body_parts bpi ON e.body_part_id = bpi.id
  WHERE e.name = v.ex_name AND bpi.name = v.part_name
);
