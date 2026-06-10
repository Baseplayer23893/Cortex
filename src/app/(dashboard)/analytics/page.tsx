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

  const totalStreak = habits.reduce((max, h) => {
    const logs = Object.entries(h.logs).filter(([, v]) => v).length;
    return Math.max(max, logs);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Your sanctuary for deep work is ready. Here&apos;s your focus overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <Clock size={18} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Efficiency</p>
              <p className="text-xl font-bold mt-0.5" style={{ fontFamily: "var(--font-display)" }}>Total Focus Time</p>
              <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>{formatHours(elapsed)}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <Layers size={18} style={{ color: "var(--secondary)" }} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Activity</p>
              <p className="text-xl font-bold mt-0.5" style={{ fontFamily: "var(--font-display)" }}>Sessions</p>
              <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>{sessionCount}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <Zap size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Consistency</p>
              <p className="text-xl font-bold mt-0.5" style={{ fontFamily: "var(--font-display)" }}>Best Streak</p>
              <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>{totalStreak} days</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard padding="lg">
          <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Weekly Focus Distribution
          </h2>
          <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
            Average focus hours per day
          </p>
          <div className="flex items-end justify-between gap-2 h-32">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <div key={`${day}-${i}`} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-lg transition-all"
                  style={{
                    height: `${sessionCount > 0 ? 20 + (sessionCount % 60) : 8}%`,
                    background: i < 5 ? "var(--primary)" : "var(--text-muted)",
                    opacity: 0.3,
                    minHeight: "8px",
                  }}
                />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{day}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard padding="lg">
          <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Monthly Momentum
          </h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Activity density for the current period
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => {
              const active = i < sessionCount + habits.length;
              return (
                <div
                  key={i}
                  className="aspect-square rounded-md transition-all"
                  style={{
                    background: active ? "var(--primary)" : "var(--glass)",
                    opacity: active ? 0.15 + (i % 5) * 0.15 : 0.5,
                    border: active ? "1px solid var(--glass-border)" : "1px solid transparent",
                  }}
                />
              );
            })}
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="lg" className="text-center">
        <div className="flex justify-center mb-4">
          <Sparkles size={24} style={{ color: "var(--primary)" }} />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
          The Flow State awaits.
        </h2>
        <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
          Aura Analytics tracks your deep work patterns to help you find your peak productivity windows. Start a session to see your live data reflow.
        </p>
        <Link
          href="/focus"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 glow"
          style={{ background: "var(--primary)", color: "#131315", border: "none" }}
        >
          <Play size={16} fill="#131315" />
          Start New Session
        </Link>
      </GlassCard>
    </div>
  );
}
