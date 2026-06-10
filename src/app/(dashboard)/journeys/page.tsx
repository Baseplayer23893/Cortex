"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { Map, Users, Flag } from "lucide-react";

const templates = [
  { id: "first-steps", title: "First Steps", desc: "A gentle beginning. One week of daily focus.", days: 7, icon: "🌱" },
  { id: "two-weeks", title: "Two Weeks of Focus", desc: "Building momentum. Two consistent weeks.", days: 14, icon: "🔥" },
  { id: "monthly-path", title: "The Monthly Path", desc: "The classic. 30 days of focused presence.", days: 30, icon: "✦" },
  { id: "quarter-mile", title: "Quarter Mile", desc: "For the dedicated. 50 focused sessions.", days: 50, icon: "⚡" },
  { id: "century", title: "Century", desc: "The long haul. 100 hours of deep work.", hours: 100, icon: "🌟" },
  { id: "marathon", title: "The Marathon", desc: "Two-month commitment. You emerge different.", days: 60, icon: "🏔️" },
];

export default function JourneysPage() {
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
        {templates.map((t) => (
          <GlassCard key={t.id} hover padding="lg">
            <div className="text-2xl mb-3">{t.icon}</div>
            <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {t.title}
            </h3>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {t.desc}
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1">
                <Users size={14} /> 0 travelers
              </span>
              <span className="flex items-center gap-1">
                <Flag size={14} /> 0 finished
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
