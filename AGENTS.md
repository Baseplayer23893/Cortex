# Cortex

## Stack
- **Mobile + Web:** Expo SDK 56 (React Native) + Expo Router (file-based routing)
- **Backend:** Supabase (PostgREST) via `@supabase/supabase-js`
- **Auth:** `@clerk/expo` v3 (Core 3) with JWT → Supabase RLS
- **State:** Zustand (UI/timer) + TanStack Query v5 (Supabase data)
- **Animations:** react-native-reanimated v4
- **Deploy:** Web → Vercel (`expo export -p web`), Mobile → `eas build`

## Commands
| Command | Purpose |
|---|---|
| `npx expo start` | Dev server (all platforms) |
| `npm run lint` | ESLint via expo config |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run export:web` | Static web export → `dist/` |
| `eas build -p android --profile preview` | APK build |

CI runs `npm ci → npx expo lint → npx tsc --noEmit` on push/PR to `main`.

## Clerk Core 3 Migrations
- `useSignIn`/`useSignUp` from `@clerk/expo` (default, not legacy).
- `create()` returns `{ error }`, not the resource. Read `signIn.status`, `signIn.createdSessionId` from the signal.
- Use `signIn.finalize()` / `signUp.finalize()` to activate session (handles `setActive` internally).
- No `setActive` needed — removed from sign-in/sign-up screens.
- Sign-up verification: `signUp.verifications.sendEmailCode()` / `.verifyEmailCode({ code })` — no more `prepareEmailAddressVerification`.
- `tokenCache` must be passed to `ClerkProvider`. Web uses `localStorage` (detect via `typeof document !== 'undefined'`); native uses `expo-secure-store` via `require()` to avoid import crash on web.
- Set `document.documentElement.style.colorScheme = 'dark'` on web to prevent Dark Reader/etc from inverting the dark theme.

## Conventions
- Single Expo codebase (no separate Next.js). Web = `expo export -p web`.
- `app/` — routes. `app/_layout.tsx` wraps `<Slot />` with ClerkProvider → QueryClient → AuthGate → Celebration.
- `app/(tabs)/` — 6 tab screens (index, timer, planner, habits, stats, settings). All kept mounted by Expo Router.
- `components/` — shared. `stores/` — Zustand stores. `lib/` — supabase client, clerk config, queries. `themes/` — theme defs. `types/` — TS types.
- Zustand for local state (timer, theme, background scene, celebration). TanStack Query for everything against Supabase.
- Reanimated for animations. No `Math.random()` during render (lint purity rule) — use module-level constant arrays.
- Env vars must be `EXPO_PUBLIC_*` prefix for Expo inlining. Required: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`. Vercel only: `CLERK_FAPI_URL` (Clerk Frontend API base URL, e.g. `https://genuine-antelope-72.clerk.accounts.dev`).

## Design
- `#0A0A0A` bg, `#F5F5F5` text, `#262626` borders, `#737373` muted text
- 4px corner radius, 1px solid borders, base-8 spacing grid
- Monospace for timer display, uppercase tracked headers
- See `docs/DESIGN_SYSTEM.md` for full token reference

## Architecture Constraints
- No separate backend server — Supabase RLS handles auth. JWT template named `"supabase"` must exist in Clerk Dashboard.
- No dual frontend — Expo web export is the web deployment.
- Keep Journey/community module out of MVP.

## Vercel Deployment
- Build: `npx expo export --platform web` → `dist/`
- SPA rewrites in `vercel.json` route all non-`api/` paths to `/`
- `api/clerk.js` proxies Clerk Frontend API through the app's domain so cookies are accepted by the browser (fixes `Cookie "_clerk_test_etld" has been rejected` on Vercel domains). `vercel.json` rewrites `/api/clerk/:path*` to the function.
- `ClerkProvider` in `_layout.tsx` receives `proxyUrl="/api/clerk"` which tells Clerk to route all API calls through the proxy.
