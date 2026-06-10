# Implementation & Vibe Coding Plan

## Phase 1: Environment Bootstrap

- [ ] Run `curl -fsSL https://opencode.ai/install | bash` to install OpenCode.
- [ ] Configure MCP with `opencode mcp add` for live web search.
- [ ] Initialize Expo project: `npx create-expo-app cortex --template blank-typescript`.
- [ ] Install core deps: `supabase-js`, `@clerk/clerk-expo`, `expo-router`.
- [ ] Create directory structure: `/components/`, `/lib/`, `/app/(tabs)/`, `/types/`.

## Phase 2: Rapid UI Generation (Stitch)

- [ ] Prompt Stitch to generate core screens: Dashboard, Timer View, Planner, Settings.
- [ ] **Vibe check** each screen in Stitch's preview browser — verify against DESIGN_SYSTEM.md.
- [ ] Inject Stitch-generated components into `/components/` and `/app/(tabs)/`.

## Phase 3: Backend & Auth Integration

- [ ] Create Supabase project and execute DDL from ARCHITECTURE.md in SQL editor.
- [ ] Wire up Clerk providers in root layout (`/app/_layout.tsx`).
- [ ] Create `/lib/supabase.ts` with client config and `/lib/clerk.ts` with auth helpers.
- [ ] Test auth flow: Google, Apple ID, Email login.

## Phase 4: Core Logic (Bottom-Up REPL)

- [ ] Build timer state machine — Pomodoro 25/5 loop + Free Mode count-up.
- [ ] Implement habit streak engine — fetch, compute, reset logic.
- [ ] Implement task CRUD — create, complete, schedule, subtask collapse.
- [ ] Wire study stats aggregation and heatmap rendering.
- [ ] Test each module independently before integration.

## Phase 5: Polish & Deploy

- [ ] Implement native Study Session widget via EAS.
- [ ] Final vibe check — run locally, fix spacing/UI/routing bugs.
- [ ] Execute `eas build -p android --profile preview` for APK.
- [ ] Execute `npx expo export -p web` and deploy `dist/` to Vercel.
