import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  description?: string;
  scheduledDate: string;
  scheduledTime?: string;
  isCompleted: boolean;
  priority: "High" | "Medium" | "Low";
  project?: string;
  sortOrder: number;
  createdAt: number;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "isCompleted" | "sortOrder">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, partial: Partial<Task>) => void;
}

function genId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (task) => {
        set((s) => ({
          tasks: [
            ...s.tasks,
            {
              ...task,
              id: genId(),
              createdAt: Date.now(),
              isCompleted: false,
              sortOrder: s.tasks.length,
            },
          ],
        }));
      },

      toggleTask: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
          ),
        }));
      },

      removeTask: (id) => {
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
        }));
      },

      updateTask: (id, partial) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...partial } : t)),
        }));
      },
    }),
    { name: "aura-tasks" },
  ),
);
