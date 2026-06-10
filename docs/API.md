# Aura — API & Database

## 1. Architecture

Aura uses Supabase as a direct database + auth layer. There are no custom API routes for CRUD — the browser client calls Supabase directly. The only Next.js API route is the OAuth callback handler.

## 2. Database Tables

### profiles

Stores user metadata. Created automatically via trigger on auth signup.

```sql
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT 'Traveler',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS**: `USING (auth.uid() = id)` — users can only read/write their own profile.

### focus_sessions

Records completed focus sessions.

```sql
CREATE TABLE focus_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  mode             TEXT NOT NULL CHECK (mode IN ('pomodoro', 'free', 'break')),
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_focus_sessions_user_date ON focus_sessions(user_id, created_at DESC);
```

**RLS**: `USING (auth.uid() = user_id)`

### habits

Habit definitions created by the user.

```sql
CREATE TABLE habits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  colour     TEXT NOT NULL DEFAULT '#A78BFA',
  frequency  TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_habits_user ON habits(user_id);
```

**RLS**: `USING (auth.uid() = user_id)`

### habit_logs

Daily habit completions.

```sql
CREATE TABLE habit_logs (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id  UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date      DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date DESC);
```

**RLS**: `USING (auth.uid() = user_id)`

### tasks

Calendar tasks.

```sql
CREATE TABLE tasks (
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

CREATE INDEX idx_tasks_user_date ON tasks(user_id, scheduled_date DESC);
```

**RLS**: `USING (auth.uid() = user_id)`

### journey_templates

Pre-seeded journey definitions.

```sql
CREATE TABLE journey_templates (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  goal_type   TEXT NOT NULL CHECK (goal_type IN ('days', 'sessions', 'hours')),
  goal_count  INT NOT NULL,
  icon        TEXT DEFAULT '✦',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS**: `ALL` for authenticated users (read-only).

### journey_enrollments

User enrollment in a journey path.

```sql
CREATE TABLE journey_enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  TEXT NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress     INT DEFAULT 0,
  UNIQUE(template_id, user_id)
);

CREATE INDEX idx_enrollments_user ON journey_enrollments(user_id);
CREATE INDEX idx_enrollments_template ON journey_enrollments(template_id);
```

**RLS**: `USING (auth.uid() = user_id)` for own enrollment; `SELECT` for all authenticated users on other enrollments (for Travelers list).

### journey_steps

Individual steps on a journey.

```sql
CREATE TABLE journey_steps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  UUID NOT NULL REFERENCES journey_enrollments(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  session_id     UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, date)
);

CREATE INDEX idx_steps_enrollment ON journey_steps(enrollment_id);
```

**RLS**: `USING (auth.uid() = user_id)` for own steps; `SELECT` for all authenticated users (for timeline display).

### finisher_notes

Messages left by journey completers.

```sql
CREATE TABLE finisher_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  TEXT NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note         TEXT NOT NULL CHECK (char_length(note) <= 500),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_finisher_notes_template ON finisher_notes(template_id, created_at DESC);
```

**RLS**: `SELECT` for all authenticated users; `INSERT` with own user_id.

### session_stories

Short notes left after focus sessions.

```sql
CREATE TABLE session_stories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES journey_enrollments(id) ON DELETE SET NULL,
  session_id    UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
  content       TEXT NOT NULL CHECK (char_length(content) <= 280),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stories_enrollment ON session_stories(enrollment_id);
```

**RLS**: `SELECT` for all authenticated users; `INSERT` with own user_id.

## 3. Supabase Client Setup

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey);
```

## 4. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
```

## 5. Common Queries

### Focus sessions (last 30 days)

```typescript
const { data } = await supabase
  .from('focus_sessions')
  .select('*')
  .gte('completed_at', thirtyDaysAgo.toISOString())
  .order('completed_at', { ascending: false });
```

### User's active journey

```typescript
const { data } = await supabase
  .from('journey_enrollments')
  .select('*, template:template_id(*)')
  .is('completed_at', null)
  .single();
```

### Travelers on a journey

```typescript
const { data } = await supabase
  .from('journey_enrollments')
  .select('id, progress, profile:user_id(name, avatar_url)')
  .eq('template_id', templateId)
  .order('progress', { ascending: false })
  .limit(20);
```

### Add step on session complete (server-side check)

This is done client-side after a session completes:

```typescript
// 1. Check if session qualifies
if (durationMinutes >= 25) {
  // 2. Get active enrollment
  const { data: enrollment } = await supabase
    .from('journey_enrollments')
    .select('*')
    .is('completed_at', null)
    .single();

  if (enrollment) {
    // 3. Check step not already logged for today
    const { data: existing } = await supabase
      .from('journey_steps')
      .select('id')
      .eq('enrollment_id', enrollment.id)
      .eq('date', today)
      .single();

    if (!existing) {
      // 4. Insert step
      await supabase.from('journey_steps').insert({
        enrollment_id: enrollment.id,
        user_id: userId,
        date: today,
        session_id: sessionId,
      });

      // 5. Increment progress
      const newProgress = enrollment.progress + 1;

      // 6. Check completion
      if (newProgress >= enrollment.template.goal_count) {
        await supabase
          .from('journey_enrollments')
          .update({ progress: newProgress, completed_at: new Date().toISOString() })
          .eq('id', enrollment.id);

        // Show celebration + finisher note modal
      } else {
        await supabase
          .from('journey_enrollments')
          .update({ progress: newProgress })
          .eq('id', enrollment.id);
      }
    }
  }
}
```
