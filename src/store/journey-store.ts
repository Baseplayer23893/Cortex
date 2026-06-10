import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface JourneyEnrollment {
  templateId: string;
  startedAt: number;
  completedAt: number | null;
  progress: number;
}

interface JourneyState {
  enrollments: JourneyEnrollment[];
  enroll: (templateId: string) => void;
  unenroll: (templateId: string) => void;
  tickProgress: (templateId: string, amount: number) => void;
  complete: (templateId: string) => void;
  isEnrolled: (templateId: string) => boolean;
  goalCount: (templateId: string) => number;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      enrollments: [],

      enroll: (templateId) => {
        const exists = get().enrollments.find((e) => e.templateId === templateId);
        if (exists) return;
        set((s) => ({
          enrollments: [
            ...s.enrollments,
            { templateId, startedAt: Date.now(), completedAt: null, progress: 0 },
          ],
        }));
      },

      unenroll: (templateId) => {
        set((s) => ({
          enrollments: s.enrollments.filter((e) => e.templateId !== templateId),
        }));
      },

      tickProgress: (templateId, amount) => {
        set((s) => ({
          enrollments: s.enrollments.map((e) =>
            e.templateId === templateId
              ? { ...e, progress: e.progress + amount }
              : e,
          ),
        }));
      },

      complete: (templateId) => {
        set((s) => ({
          enrollments: s.enrollments.map((e) =>
            e.templateId === templateId
              ? { ...e, completedAt: Date.now(), progress: get().goalCount(templateId) }
              : e,
          ),
        }));
      },

      isEnrolled: (templateId) => {
        return get().enrollments.some((e) => e.templateId === templateId);
      },

      goalCount: (templateId) => {
        const goals: Record<string, number> = {
          "first-steps": 7,
          "two-weeks": 14,
          "monthly-path": 30,
          "quarter-mile": 50,
          century: 100,
          marathon: 60,
        };
        return goals[templateId] ?? 1;
      },
    }),
    { name: "aura-journeys" },
  ),
);
