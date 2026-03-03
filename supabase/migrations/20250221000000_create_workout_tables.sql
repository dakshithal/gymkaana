-- 1. Create a table for muscle groups (for your dropdown categories)
CREATE TABLE public.body_parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 2. Create the exercise library
CREATE TABLE public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  body_part_id UUID REFERENCES public.body_parts(id) ON DELETE CASCADE,
  instructions TEXT,
  is_custom BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) -- Optional: for users to add their own
);

-- 3. Create workout programs (the templates)
CREATE TABLE public.programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Assign programs to specific days (The Week View)
CREATE TABLE public.program_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
  UNIQUE(user_id, day_of_week)
);

-- 5. Individual workout sessions (When a user hits "Start Workout")
CREATE TABLE public.workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  program_id UUID REFERENCES public.programs(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 6. THE CORE: The individual sets (rounds)
-- This allows "Save Per Round" functionality
CREATE TABLE public.set_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) NOT NULL,
  set_number INT NOT NULL,
  weight NUMERIC,
  reps INT,
  rest_time_seconds INT,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Enable Row Level Security (RLS) - Vital for App Store Approval
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;

-- Simple Policy: Users can only see/edit their own data
CREATE POLICY "Users can manage their own programs" ON public.programs 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sets" ON public.set_logs 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions 
      WHERE id = set_logs.session_id AND user_id = auth.uid()
    )
  );
