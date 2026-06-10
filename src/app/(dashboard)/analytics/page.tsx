"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { Clock, Layers, Zap, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { useFocusStore } from "@/store/focus-store";
import { useHabitStore } from "@/store/habit-store";

function formatHours(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  return h > 0 ? `${h}h` : `${Math.floor(seconds / 60)}m`;
}

export default function AnalyticsPage() {
  const sessionCount = useFocusStore((s) => s.sessionCount);
  const elapsed = useFocusStore((s) => s.elapsed);
  const habits = useHabitStore((s) => s.habits);
  const totalStreak = habits.reduce((max, h) => Math.max(max, Object.entries(h.logs).filter(([, v]) => v).length), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glow" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Your focus overview.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Clock, label: "Total Focus Time", value: formatHours(elapsed), sub: "Efficiency", color: "var(--primary)" },
          { icon: Layers, label: "Sessions", value: String(sessionCount), sub: "Activity", color: "var(--secondary)" },
          { icon: Zap, label: "Best Streak", value: `${totalStreak} days`, sub: "Consistency", color: "var(--accent)" },
        ].map((item, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                <item.icon size={15} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{item.sub}</p>
                <p className="text-base font-bold text-glow mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-xs font-semibold mb-3 text-glow" style={{ fontFamily: "var(--font-display)" }}>Weekly Focus Distribution</h2>
          <p className="text-[10px] mb-4" style={{ color: "var(--text-muted)" }}>Average hours per day</p>
          <div className="flex items-end justify-between gap-2 h-28">
            {["M","T","W","T","F","S","S"].map((day, i) => (
              <div key={`${day}-${i}`} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded transition-all" style={{ height: `${sessionCount > 0 ? 20 + (sessionCount % 60) : 8}%`, background: i < 5 ? "var(--primary)" : "var(--text-muted)", opacity: 0.3, minHeight: "6px" }} />
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xs font-semibold mb-3 text-glow" style={{ fontFamily: "var(--font-display)" }}>Monthly Momentum</h2>
          <p className="text-[10px] mb-3" style={{ color: "var(--text-muted)" }}>Activity density</p>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded transition-all" style={{ background: i < sessionCount + habits.length ? "var(--primary)" : "var(--glass)", opacity: i < sessionCount + habits.length ? 0.15 + (i % 5) * 0.15 : 0.4 }} />
            ))}
          </div>
        </div>
      </div>

      <div className="card text-center py-8">
        <Sparkles size={20} style={{ color: "var(--primary)" }} className="mx-auto mb-3" />
        <h2 className="text-base font-semibold text-glow mb-1" style={{ fontFamily: "var(--font-display)" }}>The Flow State awaits.</h2>
        <p className="text-xs mb-4 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>Start a session to see your live data reflow.</p>
        <Link href="/focus" className="btn btn-primary text-xs"><Play size={12} /> Start New Session</Link>
      </div>
    </div>
  );
}
