"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { Play, History, Lock, TrendingUp, Clock, Activity, Target, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useFocusStore } from "@/store/focus-store";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatHours(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  return h > 0 ? `${h}h` : `${Math.floor(seconds / 60)}m`;
}

export default function DashboardPage() {
  const sessionCount = useFocusStore((s) => s.sessionCount);
  const elapsed = useFocusStore((s) => s.elapsed);
  const status = useFocusStore((s) => s.status);

  const isRunning = status === "focus" || status === "break";
  const weeklySeconds = elapsed;
  const weeklyGoal = 40 * 3600;
  const weeklyPct = Math.min(100, Math.round((weeklySeconds / weeklyGoal) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {greeting()}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {isRunning ? "A session is in progress — keep the flow." : "Ready for a distraction-free deep work block?"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <Clock size={18} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{formatHours(weeklySeconds)}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Focused this session</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <Activity size={18} style={{ color: "var(--secondary)" }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{sessionCount > 0 ? `${sessionCount} today` : "0 days"}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Current streak</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <Target size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{sessionCount}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Sessions today</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <CheckCheck size={18} style={{ color: "var(--accent-alt)" }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>0</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tasks done</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard padding="lg">
            <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              {isRunning ? "Continue your focus session" : "Start your focus session"}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {isRunning
                ? "You're in the zone. Keep going — every minute builds your momentum."
                : "Silence the noise and enter a state of flow. Aura will intelligently manage your notifications and block distracting environments."}
            </p>
            <Link
              href="/focus"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 glow"
              style={{ background: "var(--primary)", color: "#131315", border: "none" }}
            >
              <Play size={16} fill="#131315" />
              {isRunning ? "Go to Timer" : "Start Focus"}
            </Link>
          </GlassCard>
        </div>

        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: "var(--primary)" }} />
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Your Journey
            </h2>
          </div>
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text-muted)" }}>Weekly Goal</span>
              <span className="font-medium">{weeklyPct}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${weeklyPct}%`, background: "var(--primary)" }} />
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatHours(weeklySeconds)} of 40h completed</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm p-2 rounded-lg" style={{ background: "var(--glass)" }}>
              <CheckCheck size={14} style={{ color: "var(--primary)" }} />
              <span>Orientation</span>
              <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>Completed</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-2 rounded-lg" style={{ color: sessionCount >= 1 ? undefined : "var(--text-muted)" }}>
              <Lock size={14} />
              <span>Deep Work Novice</span>
              <span className="ml-auto text-xs">1 session</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-2 rounded-lg" style={{ color: sessionCount >= 10 ? undefined : "var(--text-muted)" }}>
              <Lock size={14} />
              <span>Flow Master</span>
              <span className="ml-auto text-xs">10 sessions</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History size={16} style={{ color: "var(--primary)" }} />
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Recent Sessions
            </h2>
          </div>
          <button className="text-sm font-medium transition-all hover:opacity-80" style={{ color: "var(--primary)" }}>
            View History
          </button>
        </div>
        {sessionCount > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm p-3 rounded-lg" style={{ background: "var(--glass)" }}>
              <div className="flex items-center gap-3">
                <Clock size={14} style={{ color: "var(--primary)" }} />
                <span>Session #{sessionCount}</span>
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatHours(elapsed)}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <History size={32} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
            <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
              No focus sessions recorded yet. Start your first session to see your activity here.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
