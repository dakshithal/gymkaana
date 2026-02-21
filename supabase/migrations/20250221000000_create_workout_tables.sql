-- Gymkaana: ensure per-set UPSERTs for set_logs
-- Run this once in Supabase if you want onCompleteSet() to be idempotent.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'set_logs_unique_set_per_session'
  ) THEN
    ALTER TABLE public.set_logs
      ADD CONSTRAINT set_logs_unique_set_per_session
      UNIQUE (session_id, exercise_id, set_number);
  END IF;
END $$;
