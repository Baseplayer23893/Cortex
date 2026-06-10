-- ============================================================
-- AURA — Full Database Schema (idempotent)
-- Run this in Supabase SQL Editor (all at once)
-- Safe to run multiple times.
-- ============================================================

-- 1. TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT 'Traveler',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  mode             TEXT NOT NULL CHECK (mode IN ('pomodoro', 'free', 'break')),
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_date ON focus_sessions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  colour      TEXT NOT NULL DEFAULT '#A78BFA',
  frequency   TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);

CREATE TABLE IF NOT EXISTS habit_logs (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id  UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date      DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON habit_logs(user_id, date DESC);

CREATE TABLE IF NOT EXISTS tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  scheduled_date  DATE NOT NULL,
  scheduled_time  TIME,
  is_completed    BOOLEAN DEFAULT FALSE,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, scheduled_date DESC);

CREATE TABLE IF NOT EXISTS journey_templates (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  goal_type   TEXT NOT NULL CHECK (goal_type IN ('days', 'sessions', 'hours')),
  goal_count  INT NOT NULL,
  icon        TEXT DEFAULT '✦',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey_enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  TEXT NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress     INT DEFAULT 0,
  UNIQUE(template_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON journey_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_template ON journey_enrollments(template_id);

CREATE TABLE IF NOT EXISTS journey_steps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  UUID NOT NULL REFERENCES journey_enrollments(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  session_id     UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, date)
);

CREATE INDEX IF NOT EXISTS idx_steps_enrollment ON journey_steps(enrollment_id);

CREATE TABLE IF NOT EXISTS finisher_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  TEXT NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note         TEXT NOT NULL CHECK (char_length(note) <= 500),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finisher_notes_template ON finisher_notes(template_id, created_at DESC);

CREATE TABLE IF NOT EXISTS session_stories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES journey_enrollments(id) ON DELETE SET NULL,
  session_id    UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
  content       TEXT NOT NULL CHECK (char_length(content) <= 280),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stories_enrollment ON session_stories(enrollment_id);

-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Traveler'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- 3. RLS POLICIES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own focus sessions" ON focus_sessions;
CREATE POLICY "Users own focus sessions"
  ON focus_sessions FOR ALL USING (auth.uid() = user_id);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own habits" ON habits;
CREATE POLICY "Users own habits"
  ON habits FOR ALL USING (auth.uid() = user_id);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own habit logs" ON habit_logs;
CREATE POLICY "Users own habit logs"
  ON habit_logs FOR ALL USING (auth.uid() = user_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own tasks" ON tasks;
CREATE POLICY "Users own tasks"
  ON tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE journey_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Journey templates are readable by all authenticated users" ON journey_templates;
CREATE POLICY "Journey templates are readable by all authenticated users"
  ON journey_templates FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE journey_enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own enrollment" ON journey_enrollments;
CREATE POLICY "Users read own enrollment"
  ON journey_enrollments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert own enrollment" ON journey_enrollments;
CREATE POLICY "Users insert own enrollment"
  ON journey_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own enrollment" ON journey_enrollments;
CREATE POLICY "Users update own enrollment"
  ON journey_enrollments FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "All users can read other enrollments" ON journey_enrollments;
CREATE POLICY "All users can read other enrollments"
  ON journey_enrollments FOR SELECT USING (true);

ALTER TABLE journey_steps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own steps" ON journey_steps;
CREATE POLICY "Users own steps"
  ON journey_steps FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "All users can read other steps" ON journey_steps;
CREATE POLICY "All users can read other steps"
  ON journey_steps FOR SELECT USING (true);

ALTER TABLE finisher_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can read finisher notes" ON finisher_notes;
CREATE POLICY "All users can read finisher notes"
  ON finisher_notes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users insert own finisher notes" ON finisher_notes;
CREATE POLICY "Users insert own finisher notes"
  ON finisher_notes FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE session_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can read stories" ON session_stories;
CREATE POLICY "All users can read stories"
  ON session_stories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users insert own stories" ON session_stories;
CREATE POLICY "Users insert own stories"
  ON session_stories FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. SEED JOURNEY TEMPLATES
-- ============================================================

INSERT INTO journey_templates (id, title, description, goal_type, goal_count, icon)
SELECT * FROM (VALUES
  ('first-steps',    'First Steps',        'A gentle beginning. One week of daily focus.',           'days',     7,  '✦'),
  ('two-weeks',      'Two Weeks of Focus', 'Building momentum. Two consistent weeks.',                'days',     14, '✦'),
  ('monthly-path',   'The Monthly Path',   'The classic. 30 days of focused presence.',               'days',     30, '✦'),
  ('quarter-mile',   'Quarter Mile',       'For the dedicated. 50 focused sessions.',                 'sessions', 50, '✦'),
  ('century',        'Century',            'The long haul. 100 hours of deep work.',                  'hours',    100, '✦'),
  ('marathon',       'The Marathon',       'Two-month commitment. You emerge different.',             'days',     60, '✦')
) AS src
WHERE NOT EXISTS (SELECT 1 FROM journey_templates);
