# Aura — Setup Guide

## 1. Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (free tier)
- Vercel account (free Hobby tier)

## 2. Local Development Setup

```bash
# Clone the repo
git clone <repo-url> aura
cd aura

# Install dependencies
npm install
# or
pnpm install

# Copy environment variables
cp .env.local.example .env.local
```

## 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL editor, run the full schema from `docs/API.md` (all CREATE TABLE statements)
3. Create the auth trigger for profile creation (from `docs/AUTH.md`)
4. Seed journey templates:

```sql
INSERT INTO journey_templates (id, title, description, goal_type, goal_count, icon) VALUES
  ('first-steps', 'First Steps', 'A gentle beginning. One week of daily focus.', 'days', 7, '🌱'),
  ('two-weeks', 'Two Weeks of Focus', 'Building momentum. Two consistent weeks.', 'days', 14, '🔥'),
  ('monthly-path', 'The Monthly Path', 'The classic. 30 days of focused presence.', 'days', 30, '✦'),
  ('quarter-mile', 'Quarter Mile', 'For the dedicated. 50 focused sessions.', 'sessions', 50, '⚡'),
  ('century', 'Century', 'The long haul. 100 hours of deep work.', 'hours', 100, '🌟'),
  ('marathon', 'The Marathon', 'Two-month commitment. You emerge different.', 'days', 60, '🏔️');
```

5. Go to Project Settings → API and copy your URL and anon key

## 4. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

## 5. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

## 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set custom domain (optional)
vercel domains add aura.yourdomain.com
```

## 7. Enable OAuth Providers (Supabase)

In Supabase Dashboard → Authentication → Providers:

- **Google**: Enable, add Client ID + Secret from Google Cloud Console
- **GitHub**: Enable, add Client ID + Secret from GitHub OAuth Apps

Add the callback URL: `https://your-domain.com/api/auth/callback` to each provider.

## 8. Tech Dependencies

```json
{
  "next": "^14",
  "react": "^18",
  "react-dom": "^18",
  "typescript": "^5",
  "tailwindcss": "^3",
  "@supabase/ssr": "^0.x",
  "@supabase/supabase-js": "^2",
  "zustand": "^4",
  "@tanstack/react-query": "^5",
  "framer-motion": "^11",
  "howler": "^2",
  "clsx": "^2",
  "tailwind-merge": "^2",
  "date-fns": "^3",
  "recharts": "^2",
  "lucide-react": "^0.x"
}
```
