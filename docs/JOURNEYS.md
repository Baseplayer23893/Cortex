# Aura — Journeys System

## 1. Philosophy

> Staying consistent shouldn't feel like something you do completely alone.

Journeys are curated focus paths that users walk at their own pace. Each qualifying focus day (a completed session of 25+ minutes) becomes one step forward. Users can see others walking the same path, read notes left by people ahead of them, and leave messages for those who come after.

There is no failure. Miss a day? The path is still there tomorrow.

## 2. Journey Templates

Curated journeys, created and managed by us (the Aura team).

| Template ID | Title | Goal Type | Goal Count | Description |
|---|---|---|---|---|
| `first-steps` | First Steps | days | 7 | A gentle beginning. One week of daily focus. |
| `two-weeks` | Two Weeks of Focus | days | 14 | Building momentum. Two consistent weeks. |
| `monthly-path` | The Monthly Path | days | 30 | The classic. 30 days of focused presence. |
| `quarter-mile` | Quarter Mile | sessions | 50 | For the dedicated. 50 focused sessions. |
| `century` | Century | hours | 100 | The long haul. 100 hours of deep work. |
| `marathon` | The Marathon | days | 60 | Two-month commitment. You emerge different. |

## 3. Progression Logic

```
Trigger: User completes a focus session
         │
         ▼
Duration >= 25 min?
  │         │
  No      Yes
  │         │
  └──> ignore    └──> User has active journey enrollment?
                          │
                      No  │  Yes
                          │    │
                      ignore  └──> Step already logged for today?
                                       │
                                   No  │  Yes
                                       │    │
                                   └──> create step  ignore
                                        increment progress
                                             │
                                     progress == goal?
                                        │        │
                                      No        Yes
                                        │        │
                                      wait   ──> 🎉 COMPLETED
                                                  │
                                                  ▼
                                          Show finisher note modal
```

## 4. Database Schema

```sql
-- Journey templates (seeded by us)
CREATE TABLE journey_templates (
  id          TEXT PRIMARY KEY,  -- e.g. 'first-steps', 'monthly-path'
  title       TEXT NOT NULL,
  description TEXT,
  goal_type   TEXT NOT NULL CHECK (goal_type IN ('days', 'sessions', 'hours')),
  goal_count  INT NOT NULL,
  icon        TEXT DEFAULT '✦',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- User enrollment (one active at a time per template)
CREATE TABLE journey_enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  TEXT NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress     INT DEFAULT 0,   -- denormalized for fast reads
  UNIQUE(template_id, user_id)  -- one enrollment per user per journey
);

-- Individual steps
CREATE TABLE journey_steps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  UUID NOT NULL REFERENCES journey_enrollments(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  session_id     UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, date)   -- one step per day per enrollment
);

-- Finisher notes
CREATE TABLE finisher_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  TEXT NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note         TEXT NOT NULL CHECK (char_length(note) <= 500),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Session stories (post-focus notes)
CREATE TABLE session_stories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES journey_enrollments(id) ON DELETE SET NULL,
  session_id    UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
  content       TEXT NOT NULL CHECK (char_length(content) <= 280),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: all tables scoped to user_id = auth.uid() for user-owned rows
-- journey_templates: read-only for all authenticated users
-- finisher_notes: read for all, insert only own
```

## 5. Pages

### `/journeys` — Browse

Grid of glass cards, one per active journey template. Each card shows:
- Journey icon + title + description
- Traveler count ("248 travelers")
- Finisher count ("42 completed")
- Your status badge ("Enrolled · Day 13" or "Start Journey")

### `/journey/[id]` — Journey Detail

#### Header Section
- Journey name + description
- Large circular progress ring (SVG) with step count ("Day 13 of 30")
- "17 more to go ✦" subtitle

#### Travelers Section
- Grid of avatar circles + name + current step count
- "Sarah · Day 21", "Marco · Day 4"
- Shows max 12, "+N more" overflow

#### Live Pulse Section
- Recent activity feed from travelers on this path
- Items: "[Name] completed a session · Xm ago"
- "[Name] started focusing · Xm ago"
- Refreshed on page load (no real-time)

#### Stories Section
- Small notes left by travelers after sessions
- "[Name], Day 21: The 25-min mark is always the hardest..."
- Scrollable feed, max 280 chars per story

#### Finisher Notes Wall
- The heart of the feature
- Messages from people who completed the journey
- Sorted by most recent first
- Each: note text, from [Name], completed X days ago
- Beautifully presented — like a wall of handwritten letters

## 6. Journeys on the Dashboard

The dashboard shows:
- **Journey Progress Card**: Small glass card showing enrolled journey + progress ring
- **Live Pulse Mini**: 3-5 recent sessions from the community
- **Random Finisher Note**: Cycling every page load, one random note as inspiration

## 7. Completion Flow

1. User's progress reaches goal
2. Journey enrollment marked `completed_at = NOW()`
3. Celebration animation plays (canvas particle burst)
4. Finisher note modal appears:
   - "You completed The Monthly Path ✦"
   - "Leave a note for the next traveler on this path..."
   - Text input (max 500 chars) + submit
5. Note saved to `finisher_notes`
6. User can browse to other journeys and start a new one
