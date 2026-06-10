# Aura

Desktop-first productivity web app with community Journeys. Pastel glassmorphism, generative canvas backgrounds, 8 themes.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS v3
- Supabase (Auth + PostgreSQL + RLS)
- Zustand + TanStack Query
- Custom Canvas Engine (no libraries)
- Framer Motion
- Vercel Hobby

## Key Directories
```
/app/(auth)/auth/       Sign in / Sign up
/app/(dashboard)/       Dashboard, Focus, Journeys, Habits, Planner, Analytics, Settings
/components/            ui/, glass/, layout/, timer/, journeys/, habits/, planner/, analytics/, dashboard/, auth/, canvas/
/lib/                   supabase/, themes/, canvas/, utils/
/store/                 focus-store, theme-store, ui-store
/hooks/                 useTimer, useTheme, useKeyboard, useJourney, useCanvas
/docs/                  All architecture & design documentation
```

## Design Tokens
- 8 themes: Dawn, Dusk, Forest, Ocean, Aurora, Cabin, Midnight, Bloom
- Each has light + dark mode, custom CSS properties on `<html>`
- Glassmorphism: `backdrop-filter: blur(24px)`, 16px radius, semi-transparent backgrounds
- Fonts: Cabinet Grotesk (headings), Inter (body) — both self-hosted via next/font

## Feature Flags
- Timer → 25min qualifies as journey step
- Journeys → auto-progression on session complete
- Ad-blocker safe → zero CDNs, direct Supabase client, canvas animations

## Build Order
1. Scaffold + auth + theme engine
2. Canvas background engine
3. Focus timer
4. Dashboard
5. Journeys system
6. Community (finisher notes, stories, live pulse)
7. Habits
8. Planner
9. Analytics
10. Polish

## Commands
```bash
npm run dev     # local dev
npm run build   # production build
vercel          # deploy
```
