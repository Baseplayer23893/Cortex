import { create } from 'zustand';

interface UiStore {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
