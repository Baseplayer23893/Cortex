# Aura — Design System

## 1. Core Philosophy

Pastel glassmorphism on warm, dark bases. Every surface is frosted glass with generous blur, soft rounded corners, and gentle coloured glows. Nothing feels sharp or harsh.

## 2. Glassmorphism Primitives

```css
/* Light glass */
.glass-light {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
}

/* Dark glass */
.glass-dark {
  background: rgba(45, 40, 62, 0.65);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

/* Elevated glass (modals, popovers) */
.glass-elevated {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(32px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
}
```

All radii use a consistent scale: `8px` (buttons/pills), `16px` (cards), `20px` (modals/sheets), `9999px` (badges/avatars).

## 3. The 8 Themes

Each theme has a light mode and a dark mode. CSS custom properties are set on `<html>` via class name (e.g. `<html class="theme-dawn light">`).

### Dawn — Warm & Gentle

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FFF8F5` | `#1C1824` |
| `--surface` | `#FFFFFF` | `#2D283E` |
| `--glass` | `rgba(255,255,255,0.55)` | `rgba(45,40,62,0.65)` |
| `--glass-border` | `rgba(255,255,255,0.3)` | `rgba(255,255,255,0.08)` |
| `--primary` | `#A78BFA` | `#C4B5FD` |
| `--secondary` | `#F9A8D4` | `#FDA4CA` |
| `--accent` | `#6EE7B7` | `#86EFAC` |
| `--accent-alt` | `#FDBA74` | `#FCD34D` |
| `--text` | `#292524` | `#FAFAF9` |
| `--text-muted` | `#78716C` | `#A8A29E` |
| `--glow` | `rgba(167,139,250,0.15)` | `rgba(196,181,253,0.12)` |

### Dusk — Deep & Amber

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FDF8F3` | `#1A1620` |
| `--surface` | `#FFFFFF` | `#2A2533` |
| `--glass` | `rgba(255,255,255,0.55)` | `rgba(42,37,51,0.65)` |
| `--glass-border` | `rgba(255,255,255,0.3)` | `rgba(255,255,255,0.08)` |
| `--primary` | `#FB923C` | `#FDBA74` |
| `--secondary` | `#A78BFA` | `#C4B5FD` |
| `--accent` | `#FBBF24` | `#FCD34D` |
| `--accent-alt` | `#F472B6` | `#FDA4CA` |
| `--text` | `#292524` | `#FAFAF9` |
| `--text-muted` | `#78716C` | `#A8A29E` |
| `--glow` | `rgba(251,146,60,0.15)` | `rgba(253,186,116,0.12)` |

### Forest — Sage & Calm

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F4F8F5` | `#141C18` |
| `--surface` | `#FFFFFF` | `#1F2C26` |
| `--glass` | `rgba(255,255,255,0.55)` | `rgba(31,44,38,0.65)` |
| `--glass-border` | `rgba(255,255,255,0.3)` | `rgba(255,255,255,0.08)` |
| `--primary` | `#6EE7B7` | `#86EFAC` |
| `--secondary` | `#FDE68A` | `#FEF08A` |
| `--accent` | `#5EEAD4` | `#67E8F9` |
| `--accent-alt` | `#A78BFA` | `#C4B5FD` |
| `--text` | `#1A2E26` | `#ECFDF5` |
| `--text-muted` | `#6B7280` | `#9CA3AF` |
| `--glow` | `rgba(110,231,183,0.15)` | `rgba(134,239,172,0.12)` |

### Ocean — Deep & Teal

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F0F9FF` | `#0F1B24` |
| `--surface` | `#FFFFFF` | `#1A2B38` |
| `--glass` | `rgba(255,255,255,0.55)` | `rgba(26,43,56,0.65)` |
| `--glass-border` | `rgba(255,255,255,0.3)` | `rgba(255,255,255,0.08)` |
| `--primary` | `#38BDF8` | `#7DD3FC` |
| `--secondary` | `#2DD4BF` | `#5EEAD4` |
| `--accent` | `#F472B6` | `#FDA4CA` |
| `--accent-alt` | `#A78BFA` | `#C4B5FD` |
| `--text` | `#1E293B` | `#F0F9FF` |
| `--text-muted` | `#64748B` | `#94A3B8` |
| `--glow` | `rgba(56,189,248,0.15)` | `rgba(125,211,252,0.12)` |

### Aurora — Ethereal & Iridescent

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F0FDFA` | `#0D1B2A` |
| `--surface` | `#FFFFFF` | `#1B2838` |
| `--glass` | `rgba(255,255,255,0.55)` | `rgba(27,40,56,0.65)` |
| `--glass-border` | `rgba(255,255,255,0.3)` | `rgba(255,255,255,0.08)` |
| `--primary` | `#2DD4BF` | `#5EEAD4` |
| `--secondary` | `#C084FC` | `#D8B4FE` |
| `--accent` | `#F472B6` | `#FDA4CA` |
| `--accent-alt` | `#38BDF8` | `#7DD3FC` |
| `--text` | `#1A2E3A` | `#F0FDFA` |
| `--text-muted` | `#64748B` | `#94A3B8` |
| `--glow` | `rgba(45,212,191,0.15)` | `rgba(94,234,212,0.12)` |

### Cabin — Warm & Rustic

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FDF8F3` | `#1A1410` |
| `--surface` | `#FFFFFF` | `#2A221D` |
| `--glass` | `rgba(255,255,255,0.55)` | `rgba(42,34,29,0.65)` |
| `--glass-border` | `rgba(255,255,255,0.3)` | `rgba(255,255,255,0.08)` |
| `--primary` | `#D97706` | `#F59E0B` |
| `--secondary` | `#92400E` | `#B45309` |
| `--accent` | `#FDE68A` | `#FEF08A` |
| `--accent-alt` | `#6EE7B7` | `#86EFAC` |
| `--text` | `#292524` | `#FAFAF9` |
| `--text-muted` | `#78716C` | `#A8A29E` |
| `--glow` | `rgba(217,119,6,0.12)` | `rgba(245,158,11,0.1)` |

### Midnight — Deep & Starry

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F5F3FF` | `#0A0A14` |
| `--surface` | `#FFFFFF` | `#16162A` |
| `--glass` | `rgba(255,255,255,0.55)` | `rgba(22,22,42,0.7)` |
| `--glass-border` | `rgba(255,255,255,0.3)` | `rgba(255,255,255,0.06)` |
| `--primary` | `#818CF8` | `#A5B4FC` |
| `--secondary` | `#C084FC` | `#D8B4FE` |
| `--accent` | `#F472B6` | `#FDA4CA` |
| `--accent-alt` | `#38BDF8` | `#7DD3FC` |
| `--text` | `#1E1B4B` | `#F8FAFC` |
| `--text-muted` | `#6B7280` | `#94A3B8` |
| `--glow` | `rgba(129,140,248,0.15)` | `rgba(165,180,252,0.1)` |

### Bloom — Soft & Rosy

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FFF5F5` | `#1F1418` |
| `--surface` | `#FFFFFF` | `#2E1F25` |
| `--glass` | `rgba(255,255,255,0.55)` | `rgba(46,31,37,0.65)` |
| `--glass-border` | `rgba(255,255,255,0.3)` | `rgba(255,255,255,0.08)` |
| `--primary` | `#F472B6` | `#FDA4CA` |
| `--secondary` | `#6EE7B7` | `#86EFAC` |
| `--accent` | `#FB923C` | `#FDBA74` |
| `--accent-alt` | `#A78BFA` | `#C4B5FD` |
| `--text` | `#291A24` | `#FDF2F8` |
| `--text-muted` | `#78716C` | `#A8A29E` |
| `--glow` | `rgba(244,114,182,0.15)` | `rgba(253,164,202,0.12)` |

## 4. Typography

| Context | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Timer display | Cabinet Grotesk | 96–128px | 700 | -0.03em |
| Page heading (h1) | Cabinet Grotesk | 40px | 600 | -0.02em |
| Section heading (h2) | Cabinet Grotesk | 24px | 600 | -0.01em |
| Card title (h3) | Cabinet Grotesk | 18px | 600 | normal |
| Body | Inter | 15px | 400 | normal |
| Small / meta | Inter | 13px | 500 | normal |
| Button label | Inter | 14px | 600 | 0.03em |
| Timer label | Cabinet Grotesk | 14px | 500 | 0.05em |
| Stat number | Cabinet Grotesk | 32px | 700 | -0.02em |
| Shortcut hint | Inter | 12px | 500 | normal |

## 5. Spacing Scale

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80` (px).

## 6. Shadows

```
--shadow-sm:   0 1px 3px rgba(0,0,0,0.06)
--shadow-md:   0 4px 16px rgba(0,0,0,0.08)
--shadow-lg:   0 8px 32px rgba(0,0,0,0.10)
--shadow-glow: 0 0 24px var(--glow)
--shadow-glass: 0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.3)
```

## 7. Common Components

### Buttons

| Variant | Style |
|---|---|
| Primary | `bg-primary` coloured glass with glow on hover |
| Secondary | `glass` background, subtle border |
| Ghost | Transparent, text-coloured, underline on hover |
| Danger | Rose-tinted glass |
| Icon | Circular, 40x40, same variants |

### Inputs

Glass-styled with inner glow on focus. Floating labels. Error state with rose border + message.

### Cards

Glass with 16px radius, padding varies by context (16–24px). Hover state raises shadow slightly.

### Toasts

Small glass pill at bottom-center, coloured accent border (green for success, rose for error).

### Modals

Elevated glass, 20px radius, backdrop blur on overlay. `Esc` to close. Animates in with scale+fade.
