import { create } from 'zustand';
import type { TimerMode, TimerStatus } from '../types';

const POMODORO_DURATION = 1500;

interface TimerStore {
  mode: TimerMode;
  status: TimerStatus;
  remaining: number;
  elapsed: number;
  pomodoroCount: number;
  setMode: (mode: TimerMode) => void;
  setStatus: (status: TimerStatus) => void;
  tick: () => void;
  reset: () => void;
  incrementPomodoro: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  mode: 'pomodoro',
  status: 'idle',
  remaining: POMODORO_DURATION,
  elapsed: 0,
  pomodoroCount: 0,
  setMode: (mode) =>
    set({
      mode,
      status: 'idle',
      remaining: mode === 'pomodoro' ? POMODORO_DURATION : 0,
      elapsed: 0,
    }),
  setStatus: (status) => set({ status }),
  tick: () => {
    const { mode, remaining, elapsed } = get();
    if (mode === 'pomodoro') {
      const next = remaining - 1;
      if (next <= 0) {
        set({ remaining: 0, status: 'completed' });
      } else {
        set({ remaining: next });
      }
    } else {
      set({ elapsed: elapsed + 1 });
    }
  },
  reset: () =>
    set({
      status: 'idle',
      remaining: get().mode === 'pomodoro' ? POMODORO_DURATION : 0,
      elapsed: 0,
    }),
  incrementPomodoro: () =>
    set((state) => ({ pomodoroCount: state.pomodoroCount + 1 })),
}));
