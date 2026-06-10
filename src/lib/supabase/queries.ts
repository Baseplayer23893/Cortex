import { createClient } from "./client";

export interface SessionStory {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: { name: string; avatar_url: string | null };
}

export interface FinisherNote {
  id: string;
  template_id: string;
  user_id: string;
  note: string;
  created_at: string;
  profiles?: { name: string; avatar_url: string | null };
}

export interface FocusSessionRecord {
  id: string;
  duration_minutes: number;
  mode: string;
  started_at: string;
  completed_at: string;
}

export async function saveFocusSession(
  userId: string,
  durationMinutes: number,
  mode: "pomodoro" | "free" | "break",
): Promise<FocusSessionRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("focus_sessions")
    .insert({
      user_id: userId,
      duration_minutes: durationMinutes,
      mode,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to save focus session:", error);
    return null;
  }
  return data;
}

export async function saveSessionStory(
  userId: string,
  content: string,
  enrollmentId?: string,
  sessionId?: string,
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("session_stories").insert({
    user_id: userId,
    content: content.slice(0, 280),
    enrollment_id: enrollmentId ?? null,
    session_id: sessionId ?? null,
  });
  if (error) console.error("Failed to save story:", error);
  return !error;
}

export async function saveFinisherNote(
  userId: string,
  templateId: string,
  note: string,
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("finisher_notes").insert({
    user_id: userId,
    template_id: templateId,
    note: note.slice(0, 500),
  });
  if (error) console.error("Failed to save finisher note:", error);
  return !error;
}

export async function getCommunityFeed(limit = 20): Promise<{ stories: SessionStory[]; notes: FinisherNote[] }> {
  const supabase = createClient();

  const [storiesRes, notesRes] = await Promise.all([
    supabase
      .from("session_stories")
      .select("*, profiles(name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("finisher_notes")
      .select("*, profiles(name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  return {
    stories: (storiesRes.data ?? []) as SessionStory[],
    notes: (notesRes.data ?? []) as FinisherNote[],
  };
}

export async function getRecentSessions(userId: string, limit = 10): Promise<FocusSessionRecord[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as FocusSessionRecord[];
}
