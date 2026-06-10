# Aura Design System

## Brand
- **Name**: Aura
- **Tagline**: Your focus, your space.
- **Vibe**: Cozy, warm, premium glassmorphism with generative art backgrounds. Desktop-first.

## Visual Style

### Glassmorphism
All surfaces use frosted glass:
- Background blur: 24px
- Border radius: 16px (cards), 20px (modals), 8px (buttons), 9999px (pills)
- Semi-transparent backgrounds with subtle border rim light
- Soft colored box-shadows matching the accent color at 12-15% opacity

### Color Palette (Dark Mode — Dawn Theme)
- BG: `#1C1824` (deep warm aubergine)
- Surface: `#2D283E`
- Glass: `rgba(45, 40, 62, 0.65)`
- Glass border: `rgba(255, 255, 255, 0.08)`
- Primary: `#C4B5FD` (soft lavender)
- Secondary: `#FDA4CA` (rose)
- Accent: `#86EFAC` (mint)
- Accent-alt: `#FCD34D` (warm gold)
- Text primary: `#FAFAF9`
- Text muted: `#A8A29E`

### Color Palette (Light Mode — Dawn Theme)
- BG: `#FFF8F5` (warm cream)
- Surface: `#FFFFFF`
- Glass: `rgba(255, 255, 255, 0.55)`
- Glass border: `rgba(255, 255, 255, 0.3)`
- Primary: `#A78BFA`
- Secondary: `#F9A8D4`
- Accent: `#6EE7B7`
- Accent-alt: `#FDBA74`
- Text primary: `#292524`
- Text muted: `#78716C`

### Typography
- Display/Headings: Plus Jakarta Sans (600-700 weight)
- Body: Inter (400 weight, 15px)
- Labels: Inter (500 weight, 12-13px)
- Buttons: Inter (600 weight, 14px, uppercase with 0.03em tracking)

### Spacing
Base-4 grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80

### Shapes
- Cards: 16px radius
- Modals: 20px radius
- Buttons: 8px radius (pill-like)
- Inputs: 8px radius
- Avatars/badges: 9999px (full round)

### Shadows
- Default glass: 0 4px 16px rgba(0,0,0,0.06)
- Elevated glass: 0 8px 32px rgba(0,0,0,0.12)
- Glow: 0 0 24px matching accent at 12% opacity

### Backgrounds
Full-screen canvas-generated fluid particles or abstract generative art. Muted pastels drifting slowly. Never distracting.

## Auth Page Specific

### Layout
- Full viewport, no top nav
- Centered single-column glass card (max-width: 420px)
- Card has no visible title bar — content starts immediately
- Background: full-screen fluid particle animation (canvas)

### States
1. **Sign In tab** — Email, Password, "Send magic link" link, "or continue with" divider, Google + GitHub buttons, Submit button
2. **Sign Up tab** — Name, Email, Password, Confirm password, "or continue with" divider, Google + GitHub buttons, Create Account button

### Tab Switcher
- Two buttons side by side at top of card
- Active tab: glass background with subtle glow
- Inactive tab: transparent, muted text
- Smooth transition on switch

### Form Fields
- Glass style: surface background, subtle border
- Focus state: border shifts to primary color with inner glow
- Placeholder text in muted color
- No floating labels — use placeholder only

### Primary Button
- Filled with primary color (lavender)
- White text, uppercase, tracking-wider
- Hover: slight opacity shift
- Loading: show ellipsis or spinner
- Full width

### OAuth Buttons
- Glass style with surface background
- Icon + provider name
- Google: white button with Google logo
- GitHub: dark button with GitHub logo

### Divider
- "or continue with" text centered
- Lines on both sides using glass-border color

### Magic Link
- Small text link below everything
- "Send magic link instead"
- Muted color, underline on hover
- Disabled when email field is empty

### Animations
- Card entrance: subtle fade + scale (0.97 → 1)
- Tab switch: smooth crossfade
- Button hover: brightness shift
- Loading state: gentle pulse on button
