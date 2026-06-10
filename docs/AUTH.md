# Aura — Authentication

## 1. Overview

Uses Supabase Auth (built-in, no Clerk). Providers:

- Email + password
- Magic link (email-only, no password)
- Google OAuth
- GitHub OAuth

## 2. Auth Flow

```
User visits /auth
  │
  ├── Already signed in? → redirect to /
  │
  └── Not signed in → show AuthForm
        │
        ├── Sign In tab → email/password
        │   │              or OAuth buttons
        │   │              or "Send magic link"
        │   │
        │   └── Success → session stored in cookie
        │                  redirect to /
        │
        └── Sign Up tab → email, password, name
                           or OAuth buttons
                           └── Success → profile created via trigger
                                         session stored in cookie
                                         redirect to /
```

## 3. Cookie-Based Sessions (Supabase SSR)

Uses `@supabase/ssr` package for Next.js App Router:

```typescript
// lib/supabase/client.ts
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts
export function createServerClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerComponentClient({ cookies: () => cookieStore });
}

// lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  const supabase = createMiddlewareClient({ request });
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
```

## 4. Middleware

`middleware.ts` runs on all `/app` routes:

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth page and API routes
  if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const supabase = createMiddlewareClient({ request });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}
```

## 5. Auth Page UI (`/auth`)

Full-page design:

- **Background**: Canvas animation (theme-matched, but dimmed for readability)
- **Card**: Centered glass card, max-w-md, with tab switcher (Sign In / Sign Up)
- **Sign In**: Email field, password field, "Forgot password?" link, OAuth buttons
- **Sign Up**: Name field, email field, password field, confirm password, OAuth buttons
- **Magic Link**: Collapsible section within Sign In, single email field + "Send link" button
- **OAuth Buttons**: Google (white/grey), GitHub (dark with icon)
- **States**: Loading (spinner in button), error (glass toast below form), success (redirect)

## 6. Callback Route

`/api/auth/callback` handles OAuth redirects:

```typescript
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
```

## 7. Profile Creation

On first sign-up, a Supabase database trigger creates the user's profile:

```sql
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Traveler'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();
```

## 8. Sign Out

```typescript
await supabase.auth.signOut();
router.push('/auth');
```

Sign out clears all Supabase cookies and redirects to `/auth`.

## 9. Forbidden & Error States

- **Expired session**: 401 from Supabase → client detects → redirect to `/auth`
- **Network error**: Toast "Connection error, please try again"
- **Invalid credentials**: Toast "Invalid email or password"
- **Email already registered**: Toast "An account with this email already exists"
