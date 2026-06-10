import { create } from 'zustand';
import { themes, type ThemeName } from '../themes';

interface ThemeStore {
  active: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  active: 'dark-terminal',
  setTheme: (theme) => set({ active: theme }),
}));

export const useTheme = () => {
  const active = useThemeStore((s) => s.active);
  return themes[active];
};
