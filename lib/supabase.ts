import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export async function setSupabaseToken(token: string | null) {
  if (token) {
    await supabase.auth.setSession({ access_token: token, refresh_token: '' });
  } else {
    await supabase.auth.signOut();
  }
}
