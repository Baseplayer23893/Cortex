import { create } from "zustand";

export type TimerMode = "pomodoro" | "free";
export type TimerStatus = "idle" | "focus" | "break" | "paused" | "completed";

interface FocusState {
  mode: TimerMode;
  status: TimerStatus;
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  elapsed: number;
  remaining: number;
  currentBreak: number;
  sessionStart: number | null;
  sessionCount: number;

  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: () => void;
  stop: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  setWorkDuration: (min: number) => void;
  setBreakDuration: (min: number) => void;
}

export const useFocusStore = create<FocusState>()((set, get) => ({
  mode: "pomodoro",
  status: "idle",
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
  elapsed: 0,
  remaining: 25 * 60,
  currentBreak: 0,
  sessionStart: null,
  sessionCount: 0,

  start: () => {
    const { mode } = get();
    set({
      status: "focus",
      elapsed: 0,
      remaining: mode === "pomodoro" ? get().workDuration : 0,
      sessionStart: Date.now(),
    });
  },

  pause: () => {
    set({ status: "paused" });
  },

  resume: () => {
    const { status } = get();
    if (status === "paused") {
      set({ status: get().elapsed === 0 || get().remaining > 0 ? "focus" : "break" });
    }
  },

  complete: () => {
    const { mode, currentBreak, longBreakInterval, sessionCount } = get();
    const elapsed = get().elapsed;

    if (mode === "pomodoro") {
      const isLongBreak = (currentBreak + 1) % longBreakInterval === 0;
      set({
        status: "completed",
        sessionCount: sessionCount + 1,
        elapsed,
      });
    } else {
      set({ status: "completed", sessionCount: sessionCount + 1, elapsed });
    }
  },

  stop: () => {
    set({
      status: "idle",
      elapsed: 0,
      remaining: get().workDuration,
      sessionStart: null,
    });
  },

  tick: () => {
    const { status, mode } = get();
    if (status === "idle" || status === "completed" || status === "paused") return;

    set((s) => {
      if (mode === "pomodoro") {
        const newRemaining = s.remaining - 1;
        const newElapsed = s.elapsed + 1;
        if (newRemaining <= 0) {
          return { remaining: 0, elapsed: newElapsed };
        }
        return { remaining: newRemaining, elapsed: newElapsed };
      }
      return { elapsed: s.elapsed + 1 };
    });
  },

  setMode: (mode) => {
    set({
      mode,
      status: "idle",
      elapsed: 0,
      remaining: mode === "pomodoro" ? get().workDuration : 0,
    });
  },

  setWorkDuration: (min) => {
    set({ workDuration: min * 60, remaining: get().mode === "pomodoro" ? min * 60 : get().remaining });
  },

  setBreakDuration: (min) => {
    set({ breakDuration: min * 60, longBreakDuration: min * 3 * 60 });
  },
}));
