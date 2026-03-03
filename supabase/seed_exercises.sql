-- data:
-- 1. Insert Body Parts
INSERT INTO public.body_parts (name) VALUES 
('Chest'), ('Back'), ('Legs'), ('Shoulders'), ('Arms'), ('Core'), ('Full Body');

-- 2. Insert Common Exercises (Mapping to Body Parts)
-- We use a sub-query to find the correct ID so this script is "copy-paste friendly"
DO $$
BEGIN
    -- Chest
    INSERT INTO public.exercises (name, body_part_id) VALUES 
    ('Bench Press (Barbell)', (SELECT id FROM body_parts WHERE name = 'Chest')),
    ('Incline Dumbbell Press', (SELECT id FROM body_parts WHERE name = 'Chest')),
    ('Chest Fly (Cable/Dumbbell)', (SELECT id FROM body_parts WHERE name = 'Chest')),
    ('Push-ups', (SELECT id FROM body_parts WHERE name = 'Chest'));

    -- Back
    INSERT INTO public.exercises (name, body_part_id) VALUES 
    ('Lat Pulldown', (SELECT id FROM body_parts WHERE name = 'Back')),
    ('Bent Over Row (Barbell)', (SELECT id FROM body_parts WHERE name = 'Back')),
    ('Pull-ups', (SELECT id FROM body_parts WHERE name = 'Back')),
    ('Seated Cable Row', (SELECT id FROM body_parts WHERE name = 'Back')),
    ('Deadlift (Conventional)', (SELECT id FROM body_parts WHERE name = 'Back'));

    -- Legs
    INSERT INTO public.exercises (name, body_part_id) VALUES 
    ('Back Squat (Barbell)', (SELECT id FROM body_parts WHERE name = 'Legs')),
    ('Leg Press', (SELECT id FROM body_parts WHERE name = 'Legs')),
    ('Leg Extension', (SELECT id FROM body_parts WHERE name = 'Legs')),
    ('Lying Leg Curl', (SELECT id FROM body_parts WHERE name = 'Legs')),
    ('Romanian Deadlift', (SELECT id FROM body_parts WHERE name = 'Legs')),
    ('Bulgarian Split Squat', (SELECT id FROM body_parts WHERE name = 'Legs'));

    -- Shoulders
    INSERT INTO public.exercises (name, body_part_id) VALUES 
    ('Overhead Press (Barbell)', (SELECT id FROM body_parts WHERE name = 'Shoulders')),
    ('Lateral Raise (Dumbbell)', (SELECT id FROM body_parts WHERE name = 'Shoulders')),
    ('Face Pulls', (SELECT id FROM body_parts WHERE name = 'Shoulders')),
    ('Front Raise', (SELECT id FROM body_parts WHERE name = 'Shoulders'));

    -- Arms
    INSERT INTO public.exercises (name, body_part_id) VALUES 
    ('Bicep Curl (Dumbbell)', (SELECT id FROM body_parts WHERE name = 'Arms')),
    ('Hammer Curl', (SELECT id FROM body_parts WHERE name = 'Arms')),
    ('Tricep Pushdown (Cable)', (SELECT id FROM body_parts WHERE name = 'Arms')),
    ('Skull Crushers', (SELECT id FROM body_parts WHERE name = 'Arms'));

    -- Core
    INSERT INTO public.exercises (name, body_part_id) VALUES 
    ('Plank Hover', (SELECT id FROM body_parts WHERE name = 'Core')),
    ('Hanging Leg Raise', (SELECT id FROM body_parts WHERE name = 'Core')),
    ('Russian Twist', (SELECT id FROM body_parts WHERE name = 'Core')),
    ('Ab Wheel Rollout', (SELECT id FROM body_parts WHERE name = 'Core'));

    -- 2026 Trends (Hybrid/Functional)
    INSERT INTO public.exercises (name, body_part_id) VALUES 
    ('Burpee Broad Jump', (SELECT id FROM body_parts WHERE name = 'Full Body')),
    ('Sled Push/Pull', (SELECT id FROM body_parts WHERE name = 'Full Body')),
    ('Kettlebell Swing', (SELECT id FROM body_parts WHERE name = 'Full Body'));
END $$;
