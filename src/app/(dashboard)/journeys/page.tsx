"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { Users, Flag, CheckCircle, Play } from "lucide-react";
import { useJourneyStore } from "@/store/journey-store";
import Link from "next/link";

const templates = [
  { id: "first-steps", title: "First Steps", desc: "A gentle beginning. One week of daily focus.", goal: 7, unit: "days", icon: "🌱" },
  { id: "two-weeks", title: "Two Weeks of Focus", desc: "Building momentum. Two consistent weeks.", goal: 14, unit: "days", icon: "🔥" },
  { id: "monthly-path", title: "The Monthly Path", desc: "The classic. 30 days of focused presence.", goal: 30, unit: "days", icon: "✦" },
  { id: "quarter-mile", title: "Quarter Mile", desc: "For the dedicated. 50 focused sessions.", goal: 50, unit: "sessions", icon: "⚡" },
  { id: "century", title: "Century", desc: "The long haul. 100 hours of deep work.", goal: 100, unit: "hours", icon: "🌟" },
  { id: "marathon", title: "The Marathon", desc: "Two-month commitment. You emerge different.", goal: 60, unit: "days", icon: "🏔️" },
];

export default function JourneysPage() {
  const enrollments = useJourneyStore((s) => s.enrollments);
  const enroll = useJourneyStore((s) => s.enroll);
  const unenroll = useJourneyStore((s) => s.unenroll);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Journeys
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Choose a path and walk it at your own pace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => {
          const enrolled = enrollments.find((e) => e.templateId === t.id);
          const pct = enrolled ? Math.min(100, Math.round((enrolled.progress / t.goal) * 100)) : 0;

          return (
            <GlassCard key={t.id} hover padding="lg">
              <div className="text-2xl mb-3">{t.icon}</div>
              <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {t.title}
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {t.desc}
              </p>

              {enrolled ? (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>{enrolled.progress} / {t.goal} {t.unit}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "var(--glass)" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: enrolled.completedAt ? "var(--secondary)" : "var(--primary)" }} />
                  </div>
                  {enrolled.completedAt ? (
                    <div className="flex items-center gap-1.5 text-xs mt-2" style={{ color: "var(--secondary)" }}>
                      <CheckCircle size={12} />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        href="/focus"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                        style={{ background: "var(--primary)", color: "#131315" }}
                      >
                        <Play size={12} fill="#131315" />
                        Continue
                      </Link>
                      <button
                        onClick={() => unenroll(t.id)}
                        className="px-3 py-2 rounded-lg text-xs transition-all hover:opacity-70"
                        style={{ color: "var(--text-muted)", border: "1px solid var(--glass-border)" }}
                      >
                        Leave
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {t.goal} {t.unit}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flag size={14} /> {t.goal} goal
                  </span>
                </div>
              )}

              {!enrolled && (
                <button
                  onClick={() => enroll(t.id)}
                  className="mt-4 w-full py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
                >
                  Start Journey
                </button>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
