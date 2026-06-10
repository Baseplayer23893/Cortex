import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  name: string;
  colour: string;
  frequency: "daily" | "weekly";
  isArchived: boolean;
  createdAt: number;
  logs: Record<string, boolean>;
}

interface HabitState {
  habits: Habit[];
  addHabit: (name: string, colour?: string) => void;
  removeHabit: (id: string) => void;
  toggleLog: (habitId: string, date: string) => void;
  getStreak: (habitId: string) => number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function genId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function computeStreak(logs: Record<string, boolean>): number {
  const dates = Object.entries(logs)
    .filter(([, v]) => v)
    .map(([d]) => d)
    .sort()
    .reverse();

  if (dates.length === 0) return 0;

  let streak = 0;
  const todayDate = new Date();
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(todayDate);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (dates[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],

      addHabit: (name, colour = "#A78BFA") => {
        set((s) => ({
          habits: [
            ...s.habits,
            {
              id: genId(),
              name,
              colour,
              frequency: "daily",
              isArchived: false,
              createdAt: Date.now(),
              logs: {},
            },
          ],
        }));
      },

      removeHabit: (id) => {
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
        }));
      },

      toggleLog: (habitId, date) => {
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const current = h.logs[date] ?? false;
            return { ...h, logs: { ...h.logs, [date]: !current } };
          }),
        }));
      },

      getStreak: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return 0;
        return computeStreak(habit.logs);
      },
    }),
    { name: "aura-habits" },
  ),
);
