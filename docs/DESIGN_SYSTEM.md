# Design System & UI/UX Philosophy

## 1. Core Philosophy

A distraction-free, clutter-free environment engineered for deep work. Stark, high-contrast, hyper-minimalist. Inspired by terminal/ricing aesthetics. The UI must feel cozy, intentional, and never cramped.

## 2. Thematic Engine

- Users can personalize their workspace with different aesthetic themes.
- When a timer is active, the interface supports immersive background images.
- All themes maintain the core structural tokens below.

## 3. Color Tokens (Dark Mode Baseline)

| Token | Hex | Usage |
|---|---|---|
| `--bg-main` | `#0A0A0A` | Absolute canvas backdrop |
| `--surface` | `#121212` | Tab bars, cards, modals |
| `--border` | `#262626` | Structural dividers, borders |
| `--text-primary` | `#F5F5F5` | Primary content |
| `--text-muted` | `#737373` | Labels, subtitles, inactive states |
| `--accent` | `#FFFFFF` | Active elements, focus indicators |

## 4. Interface Geometry & Layout

| Rule | Value |
|---|---|
| Borders | `1px solid var(--border)` |
| Corner radii | `4px` or `0px` — sharp, structural |
| Spacing grid | Base-8: `8px`, `16px`, `24px`, `32px` |
| Interactive states | Border shifts to `--accent` on focus |
| Shadows | None — flat, no gradients |

## 5. Font Scale

| Context | Size | Weight | Style |
|---|---|---|---|
| Timer display | `48px – 64px` | Regular | Tabular lining monospace |
| Section headers | `18px` | Bold | Uppercase, `letter-spacing: 0.05em` |
| Body text | `14px` | Regular | System sans-serif stack |
| Labels / metadata | `12px` | Medium | `--text-muted` color |

## 6. AI Generation Rules

- Use generous padding — elements must never feel cramped.
- Text hierarchy must immediately draw the eye to active timers or current tasks.
- Soft, muted color palettes that reduce eye strain during prolonged sessions.
- All Stitch-generated UIs must be verified in Stitch's preview browser before importing.
