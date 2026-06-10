# Aura — Focus Timer

## 1. Overview

The timer is the core mechanic of Aura. It supports two modes, runs in a Zustand state machine, triggers sound via Howler.js, and drives journey progression on completion.

## 2. State Machine

```
                  ┌─────────────────────┐
                  │       IDLE          │
                  └─────────┬───────────┘
                            │ start
                            ▼
                  ┌─────────────────────┐
            ┌────>│    FOCUS_ACTIVE     │<────┐
            │     └─────────┬───────────┘     │
            │               │                 │
            │           ┌───┴───┐             │
            │           │       │             │
            │        pause   complete         │
            │           │       │             │
            │           ▼       ▼             │
            │     ┌────────┐ ┌────────┐       │
            │     │ PAUSED │ │COMPLETED│──────┘
            │     └───┬────┘ └────────┘
            │         │ resume
            │         └─────────┘
            │
            │  (when in break mode)
            │     FOCUS_ACTIVE ──complete──> BREAK_ACTIVE
            │                                      │
            │                                  pause│complete
            │                                      │   │
            │                                      ▼   ▼
            │                                 ┌────────┐
            │                                 │ PAUSED │
            │                                 └───┬────┘
            │                                     │ resume
            │                                     └──────┘
            │
            └──────────── stop ────────────── IDLE
```

## 3. Zustand Store

```typescript
interface FocusState {
  // Current state
  mode: 'pomodoro' | 'free';
  status: 'idle' | 'focus' | 'break' | 'paused' | 'completed';

  // Pomodoro settings
  workDuration: number;    // default 25 min
  breakDuration: number;   // default 5 min
  longBreakDuration: number; // default 15 min
  longBreakInterval: number; // default 4 (every 4th break is long)

  // Runtime
  elapsed: number;         // seconds elapsed in current session
  remaining: number;       // seconds remaining (pomodoro mode)
  currentBreak: number;    // which break number (for long break)
  sessionStart: number | null; // timestamp

  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: () => void;
  stop: () => void;
  tick: () => void;         // called every second
  setMode: (mode: 'pomodoro' | 'free') => void;
  setWorkDuration: (min: number) => void;
  setBreakDuration: (min: number) => void;
}
```

## 4. Timer Display Format

Use `Intl.DateTimeFormat` with `minute: '2-digit', second: '2-digit'` for zero-padded display.

- Pomodoro: countdown `25:00` → `00:00`
- Free: count-up `00:00` → `99:59+`
- Break: countdown `05:00` → `00:00`

## 5. Auto-Save Logic

On `complete` (or `stop` if session > 60s):
1. Calculate `duration_minutes = Math.floor(elapsed / 60)`
2. Insert record into `focus_sessions` table
3. Check journey progression (see JOURNEYS.md)

## 6. Sound System (Howler.js)

```typescript
const sounds = {
  'focus-start': new Howl({ src: ['/sounds/focus-start.mp3'], volume: 0.5 }),
  'focus-end': new Howl({ src: ['/sounds/focus-end.mp3'], volume: 0.5 }),
  'break-start': new Howl({ src: ['/sounds/break-start.mp3'], volume: 0.5 }),
  'break-end': new Howl({ src: ['/sounds/break-end.mp3'], volume: 0.5 }),
};
```

- Sounds play at state transitions (focus start, focus complete, break start, break complete)
- Muted by default; user enables in Settings
- Volume slider in Settings (0–100%)

## 7. Background Effects (Canvas Integration)

The canvas engine watches timer state and adjusts:

| State | Effect |
|---|---|
| idle | Default gentle animation per theme |
| focus | Warmer colour palette, faster particle drift, subtle glow pulse |
| break | Cooler palette, slower drift, relaxation feel |
| paused | Particles freeze or slow to near-stop |
| completed | Brief celebratory burst, then return to idle |

## 8. Session Persistence

- On page refresh/navigation while timer is running, the session is lost (tabs are ephemeral).
- A confirmation dialog (`"Timer is running — leave anyway?"`) prevents accidental navigation.
- Uses `beforeunload` browser event for tab close.

## 9. Keyboard Shortcuts

| Key | Action | State |
|---|---|---|
| `Space` | Start / Pause / Resume | All |
| `Esc` | Stop / Quit | focus, break, paused |
| `1` | Set Pomodoro mode | idle |
| `2` | Set Free mode | idle |
