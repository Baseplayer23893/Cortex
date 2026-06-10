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
  const weeklyPct = Math.min(100, Math.round((elapsed / (40 * 3600)) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glow" style={{ fontFamily: "var(--font-display)" }}>
          {greeting()}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {isRunning ? "A session is in progress — keep the flow." : "Ready for a distraction-free deep work block?"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Clock, value: formatHours(elapsed), label: "Focused this session", color: "var(--primary)" },
          { icon: Activity, value: sessionCount > 0 ? `${sessionCount} today` : "0 days", label: "Current streak", color: "var(--secondary)" },
          { icon: Target, value: String(sessionCount), label: "Sessions today", color: "var(--accent)" },
          { icon: CheckCheck, value: "0", label: "Tasks done", color: "var(--accent-alt)" },
        ].map((item, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-glow" style={{ fontFamily: "var(--font-display)" }}>{item.value}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <h2 className="text-base font-semibold mb-1 text-glow" style={{ fontFamily: "var(--font-display)" }}>
            {isRunning ? "Continue your focus session" : "Start your focus session"}
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {isRunning
              ? "You're in the zone. Keep going — every minute builds your momentum."
              : "Silence the noise and enter a state of flow."}
          </p>
          <Link href="/focus" className="btn btn-primary mt-4">
            <Play size={14} />
            {isRunning ? "Go to Timer" : "Start Focus"}
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} style={{ color: "var(--primary)" }} />
            <h2 className="text-sm font-semibold text-glow" style={{ fontFamily: "var(--font-display)" }}>Your Journey</h2>
          </div>
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>Weekly Goal</span>
              <span className="font-medium">{weeklyPct}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "var(--glass)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${weeklyPct}%`, background: "var(--primary)" }} />
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatHours(elapsed)} of 40h</p>
          </div>
          {[
            { name: "Orientation", done: true },
            { name: "Deep Work Novice", req: 1 },
            { name: "Flow Master", req: 10 },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-xs py-1.5" style={{ color: m.done || (typeof m.req !== 'undefined' && sessionCount >= m.req) ? "var(--text)" : "var(--text-muted)" }}>
              {m.done || (typeof m.req !== 'undefined' && sessionCount >= m.req) ? (
                <CheckCheck size={12} style={{ color: "var(--primary)" }} />
              ) : (
                <Lock size={12} />
              )}
              <span>{m.name}</span>
              {!m.done && typeof m.req !== 'undefined' && <span className="ml-auto text-[10px]" style={{ color: "var(--text-muted)" }}>{sessionCount}/{m.req}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History size={14} style={{ color: "var(--primary)" }} />
            <h2 className="text-sm font-semibold text-glow" style={{ fontFamily: "var(--font-display)" }}>Recent Sessions</h2>
          </div>
          <button className="btn-ghost text-xs">View History</button>
        </div>
        {sessionCount > 0 ? (
          <div className="flex items-center justify-between text-xs p-2 rounded-lg" style={{ background: "var(--glass)" }}>
            <span>Session #{sessionCount}</span>
            <span style={{ color: "var(--text-muted)" }}>{formatHours(elapsed)}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <History size={24} style={{ color: "var(--text-muted)", opacity: 0.3 }} />
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>No sessions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
