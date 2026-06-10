"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { MessageSquare, Award, Users, Sparkles, Send } from "lucide-react";
import { getCommunityFeed, saveSessionStory, SessionStory, FinisherNote } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

export default function CommunityPage() {
  const [stories, setStories] = useState<SessionStory[]>([]);
  const [notes, setNotes] = useState<FinisherNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [storyContent, setStoryContent] = useState("");
  const [posting, setPosting] = useState(false);

  const feed = [...stories, ...notes.map((n) => ({ type: "finisher" as const, ...n }))]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  useEffect(() => {
    getCommunityFeed().then((data) => {
      setStories(data.stories);
      setNotes(data.notes);
      setLoading(false);
    });
  }, []);

  const handlePostStory = async () => {
    if (!storyContent.trim()) return;
    setPosting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ok = await saveSessionStory(user.id, storyContent.trim());
    if (ok) {
      setStoryContent("");
      const updated = await getCommunityFeed();
      setStories(updated.stories);
      setNotes(updated.notes);
    }
    setPosting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Community
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Shared stories and journeys from fellow travelers.
          </p>
        </div>
      </div>

      <GlassCard padding="lg">
        <div className="flex items-start gap-3">
          <textarea
            placeholder="Share your focus experience (max 280 chars)..."
            value={storyContent}
            onChange={(e) => setStoryContent(e.target.value.slice(0, 280))}
            className="flex-1 bg-transparent text-sm border-none outline-none resize-none min-h-[60px]"
            style={{ color: "var(--text)" }}
          />
          <button
            onClick={handlePostStory}
            disabled={posting || !storyContent.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-30"
            style={{ background: "var(--primary)", color: "#131315" }}
          >
            <Send size={14} />
            Share
          </button>
        </div>
      </GlassCard>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex gap-1.5">
            {[0, 150, 300].map((d) => (
              <div
                key={d}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ background: "var(--primary)", animationDelay: `${d}ms` }}
              />
            ))}
          </div>
        </div>
      ) : feed.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Users size={40} style={{ color: "var(--text-muted)", opacity: 0.3 }} />
          <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>
            No community activity yet. Be the first to share your story!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {feed.map((item, i) => {
            const isNote = "template_id" in item && "note" in item && !("content" in item);
            const profileName = (item as any).profiles?.name ?? "Traveler";
            const time = new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
            });

            return (
              <GlassCard key={`${item.id}-${i}`} padding="md" className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: isNote ? "var(--secondary)" : "var(--primary-container)", color: isNote ? "var(--on-primary-container)" : "var(--on-primary-container)" }}
                >
                  {profileName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{profileName}</span>
                    {isNote && (
                      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--glass)", color: "var(--secondary)" }}>
                        <Award size={10} /> Journey Complete
                      </span>
                    )}
                    <span className="text-[10px] ml-auto" style={{ color: "var(--text-muted)" }}>{time}</span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    {isNote ? (item as FinisherNote).note : (item as SessionStory).content}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
