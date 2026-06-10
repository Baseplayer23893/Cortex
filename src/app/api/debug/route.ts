import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const { data: sessionData } = await supabase.auth.getSession();

  const cookies = request.cookies.getAll();
  const authCookies = cookies.filter(
    (c) => c.name.includes("sb-") || c.name.includes("supabase"),
  );

  return NextResponse.json({
    cookiesPresent: cookies.length,
    authCookies: authCookies.map((c) => ({
      name: c.name,
      valuePrefix: c.value.substring(0, 30),
      valueLength: c.value.length,
    })),
    getUser: {
      user: userData?.user
        ? { id: userData.user.id, email: userData.user.email }
        : null,
      error: userError?.message ?? null,
    },
    getSession: {
      session: sessionData?.session
        ? {
            accessTokenPrefix:
              sessionData.session.access_token.substring(0, 10),
            expiresAt: sessionData.session.expires_at
              ? new Date(
                  sessionData.session.expires_at * 1000,
                ).toISOString()
              : null,
          }
        : null,
    },
  });
}
