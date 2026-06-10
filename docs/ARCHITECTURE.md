# Aura — Application Architecture

## 1. System Overview

Aura is a desktop-first productivity web app with a community layer. Users track focus sessions (Pomodoro / Free mode), build habits, plan tasks, and walk curated Journey paths alongside other travelers.

- **Platform**: Web (desktop-first, tablet-friendly)
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS v3 + custom design tokens
- **Database + Auth**: Supabase (PostgreSQL + Auth)
- **State**: Zustand (client) + TanStack Query (server)
- **Animations**: Custom Canvas Engine (backgrounds) + Framer Motion (UI)
- **Deployment**: Vercel Hobby

## 2. Directory Structure

```
aura/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx                          # Dashboard
│   │   ├── focus/
│   │   │   └── page.tsx                      # Immersive Timer
│   │   ├── journeys/
│   │   │   ├── page.tsx                      # Browse journeys
│   │   │   └── [id]/
│   │   │       └── page.tsx                  # Journey detail
│   │   ├── habits/
│   │   │   └── page.tsx                      # Habit tracker
│   │   ├── planner/
│   │   │   └── page.tsx                      # Task planner
│   │   ├── analytics/
│   │   │   └── page.tsx                      # Stats & heatmaps
│   │   └── settings/
│   │       └── page.tsx                      # Preferences
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts                  # OAuth callback
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/             # Button, Card, Input, Modal, Toast, Skeleton
│   ├── glass/          # GlassCard, GlassPanel, GlassInput
│   ├── layout/         # Sidebar, TopBar, PageShell, KeyboardHint
│   ├── timer/          # TimerDisplay, TimerControls, SessionSummary
│   ├── journeys/       # JourneyCard, StepPath, TravelersList,
│   │                   # LivePulse, FinisherNoteWall, StoriesFeed
│   ├── habits/         # HabitCard, StreakGrid, HabitForm, HabitDay
│   ├── planner/        # CalendarRibbon, TaskList, TaskCard, TaskForm
│   ├── analytics/      # ContributionHeatmap, FocusTimeline,
│   │                   # StatCard, Treemap, Sparkline
│   ├── dashboard/      # TodayOverview, StatsStrip, ActiveTimerWidget,
│   │                   # JourneyProgressCard, QuickActions
│   ├── auth/           # AuthForm, OAuthButtons, MagicLinkForm,
│   │                   # AuthCard
│   └── canvas/         # CanvasBackground, ParticleEngine, FluidRenderer
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   ├── admin.ts          # Service role client (server-only)
│   │   └── middleware.ts     # Next.js auth middleware
│   ├── themes/
│   │   └── index.ts          # 8 theme definitions + engine
│   ├── canvas/
│   │   ├── engine.ts         # Main render loop
│   │   ├── particles.ts      # Particle system
│   │   ├── fluid.ts          # Fluid gradient renderer
│   │   ├── aurora.ts         # Aurora wave renderer
│   │   └── utils.ts          # Math, colour interpolation
│   └── utils/
│       ├── cn.ts             # clsx + tailwind-merge
│       ├── format.ts         # Date/time formatting
│       ├── keyboard.ts       # Keyboard shortcut manager
│       └── supabase-types.ts # Generated DB types
├── store/
│   ├── focus-store.ts        # Timer state machine
│   ├── theme-store.ts        # Active theme + mode
│   └── ui-store.ts           # Sidebar, modals, toasts
├── hooks/
│   ├── useTimer.ts
│   ├── useTheme.ts
│   ├── useKeyboard.ts
│   ├── useJourney.ts
│   ├── useCanvas.ts
│   └── useSupabase.ts
├── types/
│   ├── supabase.ts
│   ├── theme.ts
│   └── journey.ts
└── public/
    └── sounds/
        ├── focus-start.mp3
        ├── focus-end.mp3
        ├── break-start.mp3
        └── break-end.mp3
```

## 3. Data Flow

```
Browser
  ├── Supabase Client (direct, via @supabase/ssr)
  │     └── RLS policies enforce user isolation
  ├── Canvas Engine (custom, no libraries)
  │     └── draws to <canvas> element
  ├── Framer Motion (UI animations)
  └── Zustand stores (client state)
        ├── focus-store (timer)
        ├── theme-store (theme + mode)
        └── ui-store (sidebar, modals)
```

## 4. Key Design Decisions

| Decision | Rationale |
|---|---|
| Direct Supabase client | Simpler, faster, no Vercel timeout risk; RLS handles security |
| Custom canvas engine (zero libs) | No ad-blocker risk, full control, smaller bundle |
| 8 full visual themes | Viral aesthetic, user attachment, shareable |
| Journeys (not gamification) | Community warmth, shared path, not competitive leaderboard |
| Desktop-first | Focus tool belongs on desktop; mobile-responsive but secondary |
| Zero analytics/tracking | Privacy-first, immune to ad-blockers, builds trust |
