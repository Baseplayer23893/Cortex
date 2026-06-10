# Aura — Components

## 1. UI Primitives (`/components/ui/`)

### Button

| Prop | Type | Default |
|---|---|---|
| variant | `'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'` | `'primary'` |
| size | `'sm' | 'md' | 'lg'` | `'md'` |
| loading | `boolean` | `false` |
| disabled | `boolean` | `false` |
| children | `ReactNode` | — |
| onClick | `() => void` | — |

States: default, hover (glow intensifies), active (scale 0.97), loading (spinner), disabled (opacity 50%).

### Card (GlassCard)

| Prop | Type | Default |
|---|---|---|
| variant | `'light' | 'dark' | 'elevated'` | `'light'` |
| padding | `'sm' | 'md' | 'lg'` | `'md'` |
| hover | `boolean` | `false` |
| glow | `boolean` | `false` |

States: default, hover (shadow increase, border glow), glow (pulsing accent shadow active).

### Input (GlassInput)

| Prop | Type | Default |
|---|---|---|
| label | `string` | — |
| type | `'text' | 'email' | 'password' | 'number' | 'date'` | `'text'` |
| error | `string` | — |
| placeholder | `string` | — |

States: default, focus (inner glow), filled, error (rose border + message), disabled.

### Modal

| Prop | Type |
|---|---|
| open | `boolean` |
| onClose | `() => void` |
| title | `string` |
| children | `ReactNode` |
| size | `'sm' | 'md' | 'lg'` |

Overlay: `bg-black/40 backdrop-blur-sm`. Content: elevated glass, entrance animation (scale + fade).

### Toast

| Prop | Type |
|---|---|
| type | `'success' | 'error' | 'info'` |
| message | `string` |
| duration | `number` (ms, default 4000) |
| onDismiss | `() => void` |

Auto-dismisses after duration. Stacked with Y offset.

## 2. Layout (`/components/layout/`)

### Sidebar

- Fixed left, 240px wide
- Glass background
- Navigation items with icon + label + active indicator
- Bottom: theme selector mini-widget, sign out button
- Collapsible (toggle via hamburger or `[` shortcut)

### TopBar

- Fixed top, full width
- Glass background
- Left: Aura logo + wordmark
- Center: Timer status pill (if running) / empty
- Right: Avatar + settings gear

### PageShell

Wrapper for all authenticated pages. Includes Sidebar + TopBar + main content area with padding.

## 3. Timer (`/components/timer/`)

### TimerDisplay

Massive digital timer (96–128px Cabinet Grotesk). Shows `MM:SS`. Animated digit transitions (CSS `transition: all 0.3s`). Accent colour glow pulse when active.

### TimerControls

Pill-shaped glass buttons: Start / Pause / Stop. Keyboard shortcut hints shown as small badges. Mode switcher (Pomodoro / Free) as tab-style toggle.

### SessionSummary

Slides up after session completion. Shows: duration, mode, time of day, "Leave a story" prompt.

## 4. Journeys (`/components/journeys/`)

### JourneyCard

Glass card for journey browse grid. Shows: icon, title, description, traveler count, finisher count, enrollment status. Hover: slight scale + glow.

### StepPath

Visual timeline of journey progress. Connected dots (completed = filled accent, current = pulsing, future = muted outline). Horizontal layout, scrollable.

### TravelersList

Grid of traveler avatars + name + progress. Shows first 12, overflow collapsed.

### LivePulse

Activity feed. Glass card. Items fade in on mount. Each: "[Name] [action] · [time] ago". Refresh button at top.

### FinisherNoteWall

List of finisher notes. Each rendered as a glass card with quote styling. Large opening quotation mark in primary colour. Author + completion date below.

### StoriesFeed

Scrollable list of post-session stories. Card per story: content, author, day number, relative time.

## 5. Habits (`/components/habits/`)

### HabitCard

Rounded glass pill showing: colour dot, habit name, streak count with flame icon, check button. Check: circle fill animation, subtle scale bounce.

### StreakGrid

30-day grid per habit. Each cell = small rounded square (12x12px). Colour intensity = streak depth. Today highlighted with ring. Hover tooltip.

## 6. Planner (`/components/planner/`)

### CalendarRibbon

Single-row month view with date squares. Selected date highlighted with accent fill. Arrow navigation for month.

### TaskList

Stacked task cards for selected date. Each: checkbox + title + optional time. Click to expand (description, edit, delete). Drag reorder via Framer Motion.

### TaskForm

Inline form (or modal for full edit). Fields: title, description (optional), time (optional).

## 7. Analytics (`/components/analytics/`)

### ContributionHeatmap

GitHub-style 12-month grid. Canvas-drawn for performance. Cells animate in staggered on mount. Colour scale per theme. Tooltip on hover.

### FocusTimeline

Horizontal bar chart of recent sessions. Each bar = one session, width proportional to duration. Mode-coloured (warm = focus, cool = break). Scrollable.

### StatCard

Glass card with large animated number, label, optional sparkline (Recharts Sparkline).

## 8. Dashboard (`/components/dashboard/`)

### TodayOverview

Top section: current time (large digital clock), today's session count, "Start Focus" CTA button.

### StatsStrip

Row of 4 StatCards: weekly hours, current streak, sessions today, tasks done.

### ActiveTimerWidget

Floating glass widget (bottom-right) that appears when timer is running. Shows: timer readout, pause button, progress ring. Draggable.

### JourneyProgressCard

Small glass card on dashboard showing current journey + circular progress.

### QuickActions

Row of pill buttons: "New Task", "New Habit", "View Analytics". Each opens relevant modal/navigation.

## 9. Auth (`/components/auth/`)

### AuthForm

Centered glass card with tab switcher (Sign In / Sign Up). Contains all input fields + OAuth buttons + magic link toggle.

### OAuthButtons

Row of provider buttons. Google (white bg, Google icon), GitHub (dark bg, GitHub icon). Each shows provider name + icon.

### MagicLinkForm

Collapsible section. Email input + "Send magic link" button. Success state: "Check your email for the login link."
