import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeId = "dawn" | "dusk" | "forest" | "ocean" | "aurora" | "cabin" | "midnight" | "bloom";
export type ColorMode = "light" | "dark";
export type AnimationIntensity = "off" | "subtle" | "full";

interface ThemeState {
  themeId: ThemeId;
  colorMode: ColorMode;
  intensity: AnimationIntensity;
  setTheme: (id: ThemeId) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  setIntensity: (i: AnimationIntensity) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: "dawn",
      colorMode: "dark",
      intensity: "full",
      setTheme: (themeId) => set({ themeId }),
      setColorMode: (colorMode) => set({ colorMode }),
      toggleColorMode: () =>
        set((s) => ({ colorMode: s.colorMode === "dark" ? "light" : "dark" })),
      setIntensity: (intensity) => set({ intensity }),
    }),
    { name: "aura-theme" },
  ),
);
