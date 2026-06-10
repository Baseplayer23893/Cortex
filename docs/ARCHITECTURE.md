# Application Architecture

## 1. System Overview

A cross-platform productivity and focus application — Cortex. Runs on iOS, Android, and Web from a single codebase. Decoupled, client-heavy "solo stack" topology with no custom backend middleware.

## 2. Core Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Expo (React Native) + Expo Router | Universal app — iOS, Android, Web |
| Backend | Supabase (PostgreSQL + PostgREST) | Database, auth hooks, RLS |
| Identity | Clerk | Multi-tenant JWT sessions |
| UI Prototyping | Google Stitch | Rapid screen generation |
| AI Agent | OpenCode CLI | Vibe coding orchestration |

## 3. Tooling & Workflow

- **OpenCode CLI** — Terminal-based AI coding assistant. Development steered via intent.
- **Google Stitch** — Generates high-fidelity UI screens matching the design system. Outputs ready-to-use React components.
- **Model Context Protocol (MCP)** — Connected to OpenCode for live web search and up-to-date Expo/Supabase docs.

## 4. Database Schema (Supabase DDL)

```sql
-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- 1. Tasks & Events
create table public.tasks (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null,
    title text not null,
    scheduled_date date not null,
    is_completed boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habit Tracking
create table public.habits (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null,
    name text not null,
    streak_count integer default 0 not null,
    last_completed_at date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Study Sessions (Pomodoro / Free Mode)
create table public.study_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null,
    duration_minutes integer not null,
    mode text check (mode in ('pomodoro', 'free')) not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row-Level Security
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.study_sessions enable row level security;

-- RLS Policies (matches Clerk JWT context)
create policy "Users manage their own tasks"
    on public.tasks for all
    using (auth.uid()::text = user_id);

create policy "Users manage their own habits"
    on public.habits for all
    using (auth.uid()::text = user_id);

create policy "Users manage their own sessions"
    on public.study_sessions for all
    using (auth.uid()::text = user_id);
```

## 5. Data Synchronization Flow

1. **Client Handshake** — Clerk SDK generates a short-lived JWT on authentication.
2. **API Vector** — Client injects JWT into `Authorization: Bearer <token>` header.
3. **Database Assertion** — Supabase PostgREST validates the JWT against RLS policies, allowing direct CRUD without custom middleware.
4. **Web Export** — `npx expo export -p web` generates static assets deployed to Vercel.
5. **Mobile Build** — `eas build -p android --profile preview` compiles native APK.
