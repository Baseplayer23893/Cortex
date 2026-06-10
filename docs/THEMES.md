# Aura — Theme System

## 1. Overview

Aura has 8 full visual themes. Each theme defines its own colour palette, background animation style, and mood. Themes are implemented via CSS custom properties on `<html>` and switched by changing the class name.

## 2. Theme Engine

```typescript
// lib/themes/index.ts

export type ThemeId = 'dawn' | 'dusk' | 'forest' | 'ocean'
                     | 'aurora' | 'cabin' | 'midnight' | 'bloom';

export type ColorMode = 'light' | 'dark';
export type AnimationIntensity = 'off' | 'subtle' | 'full';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    glass: string;
    glassBorder: string;
    primary: string;
    secondary: string;
    accent: string;
    accentAlt: string;
    text: string;
    textMuted: string;
    glow: string;
  };
  animation: {
    mode: 'fluid' | 'particles' | 'geometric' | 'waves' | 'aurora' | 'stars' | 'fireflies' | 'petals';
    speed: number;     // 0.5 - 2.0
    opacity: number;   // 0.0 - 1.0
  };
}
```

## 3. How Theme Switching Works

```typescript
// store/theme-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  themeId: ThemeId;
  colorMode: ColorMode;
  intensity: AnimationIntensity;
  setTheme: (id: ThemeId) => void;
  setColorMode: (mode: ColorMode) => void;
  setIntensity: (i: AnimationIntensity) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeId: 'dawn',
      colorMode: 'dark',
      intensity: 'full',
      setTheme: (id) => set({ themeId: id }),
      setColorMode: (mode) => set({ colorMode: mode }),
      setIntensity: (i) => set({ intensity: i }),
    }),
    { name: 'aura-theme' }
  )
);
```

The theme is applied via a React hook:

```typescript
// hooks/useTheme.ts
export function useTheme() {
  const { themeId, colorMode } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.className = `theme-${themeId} ${colorMode}`;
  }, [themeId, colorMode]);
}
```

## 4. CSS Custom Properties

```css
/* Generated per-theme in globals.css using @layer */
.theme-dawn.dark {
  --bg: #1C1824;
  --surface: #2D283E;
  --glass: rgba(45, 40, 62, 0.65);
  --glass-border: rgba(255, 255, 255, 0.08);
  --primary: #C4B5FD;
  --secondary: #FDA4CA;
  --accent: #86EFAC;
  --accent-alt: #FCD34D;
  --text: #FAFAF9;
  --text-muted: #A8A29E;
  --glow: rgba(196, 181, 253, 0.12);
}

.theme-dawn.light {
  --bg: #FFF8F5;
  --surface: #FFFFFF;
  --glass: rgba(255, 255, 255, 0.55);
  --glass-border: rgba(255, 255, 255, 0.3);
  --primary: #A78BFA;
  --secondary: #F9A8D4;
  --accent: #6EE7B7;
  --accent-alt: #FDBA74;
  --text: #292524;
  --text-muted: #78716C;
  --glow: rgba(167, 139, 250, 0.15);
}
```

All components use `var(--primary)`, `var(--glass)`, etc. — no hardcoded theme colours in components.

## 5. Theme Preview in Settings

The Settings page shows all 8 themes as small preview cards. Hover previews the theme. Click applies it. Each card shows:
- Theme name
- Mini colour palette (5 swatches)
- Animation mode label
- Light/Dark toggle per theme

## 6. Adding a New Theme

1. Add the theme ID to `ThemeId` type
2. Define light + dark colour palettes in `lib/themes/index.ts`
3. Add CSS custom properties in `app/globals.css`
4. Add animation mode config
5. Add to settings picker
