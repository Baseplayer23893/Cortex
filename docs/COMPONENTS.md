# Core Application Components

## 1. Dual-Mode Focus Timer (`/components/Timer.tsx`)

**Visual State:** Massive, central monospace digital readout. Single toggle control underneath.

**Functional Logic:**
- **Pomodoro Mode:** Fixed countdown loop (25 min focus → 5 min break).
- **Free Mode:** Count-up chronograph tracking total continuous focus duration.
- Background execution with local notifications.

**Data Write:** On session completion or explicit save, insert into `study_sessions` with duration and mode.

## 2. Calendar Task Planner (`/components/TaskCalendar.tsx`)

**Visual State:** Split layout — horizontal calendar ribbon (7-day viewport) at top, inline vertical checklist of matching records below.

**Functional Logic:**
- Clicking dates updates `selectedDate` state.
- Inline creation input triggers INSERT with active date index.
- Subtasks collapse/expand within task details without cluttering the main view.

## 3. Habit Streak Grid (`/components/HabitGrid.tsx`)

**Visual State:** Low-profile horizontal grid of block indicators mapping daily consistency.

**Functional Logic:**
- Fetches rows from `habits` table.
- Computes temporal differences between system dates.
- If daily threshold passes without interaction, resets `streak_count` to zero.

## 4. Study Stats & Heatmaps (`/components/StudyStats.tsx`)

**Visual State:** GitHub-style contribution graph + analytics dashboard.

**Functional Logic:**
- Aggregates `study_sessions` by date.
- Renders a color-density heatmap of focus activity.
- Displays total hours, session count, current streak.

## 5. Study Session Widget

**Platform:** iOS and Android home screen widget.
**Display:** Live timer progress or daily stats summary.
**Implementation:** Expo's widget APIs or native module compilation via EAS.
