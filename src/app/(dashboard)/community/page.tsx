"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { Award, Users, Send } from "lucide-react";
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
    getCommunityFeed().then((data) => { setStories(data.stories); setNotes(data.notes); setLoading(false); });
  }, []);

  const handlePostStory = async () => {
    if (!storyContent.trim()) return;
    setPosting(true);
    const { data: { user } } = await createClient().auth.getUser();
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glow" style={{ fontFamily: "var(--font-display)" }}>Community</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Stories from fellow travelers.</p>
      </div>

      <div className="card">
        <div className="flex items-start gap-2">
          <textarea placeholder="Share your focus experience (max 280 chars)..." value={storyContent}
            onChange={(e) => setStoryContent(e.target.value.slice(0, 280))}
            className="flex-1 bg-transparent text-xs border-none outline-none resize-none min-h-[48px]" style={{ color: "var(--text)" }} />
          <button onClick={handlePostStory} disabled={posting || !storyContent.trim()} className="btn btn-primary text-xs"><Send size={12} /> Share</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="flex gap-1">{[0,150,300].map((d) => (<div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--primary)", animationDelay: `${d}ms` }} />))}</div></div>
      ) : feed.length === 0 ? (
        <div className="flex flex-col items-center py-12"><Users size={32} style={{ color: "var(--text-muted)", opacity: 0.3 }} /><p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>No activity yet. Be the first!</p></div>
      ) : (
        <div className="space-y-3">
          {feed.map((item, i) => {
            const isNote = "template_id" in item && "note" in item && !("content" in item);
            const profileName = (item as any).profiles?.name ?? "Traveler";
            const time = new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
            return (
              <div key={`${item.id}-${i}`} className="card flex items-start gap-3 py-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: isNote ? "var(--secondary)" : "var(--primary-container)", color: "var(--on-primary-container)" }}>{profileName[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{profileName}</span>
                    {isNote && <span className="badge badge-primary"><Award size={9} /> Journey Complete</span>}
                    <span className="text-[10px] ml-auto" style={{ color: "var(--text-muted)" }}>{time}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{(item as any).note || (item as any).content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
