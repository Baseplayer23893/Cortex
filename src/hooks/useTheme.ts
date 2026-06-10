"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export function useTheme() {
  const { themeId, colorMode } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.className = `theme-${themeId} ${colorMode}`;
  }, [themeId, colorMode]);
}
