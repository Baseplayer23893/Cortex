import { create } from 'zustand';

const MILESTONES = [5, 10, 25, 50, 100, 200, 365];

interface CelebrationStore {
  visible: boolean;
  streakCount: number;
  habitName: string;
  isMilestone: (count: number) => boolean;
  show: (count: number, name: string) => void;
  hide: () => void;
}

export const useCelebrationStore = create<CelebrationStore>((set, get) => ({
  visible: false,
  streakCount: 0,
  habitName: '',
  isMilestone: (count) => MILESTONES.includes(count),
  show: (count, name) => set({ visible: true, streakCount: count, habitName: name }),
  hide: () => set({ visible: false }),
}));
