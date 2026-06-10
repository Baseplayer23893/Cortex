"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { Timer, Map, CheckSquare2, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-sm text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Sparkles size={14} style={{ color: "var(--primary)" }} />
          Welcome back
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow>
          <div className="flex items-center gap-3">
            <Timer size={20} style={{ color: "var(--primary)" }} />
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                0h
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Focused this week
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <Map size={20} style={{ color: "var(--secondary)" }} />
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                —
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Current streak
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <CheckSquare2 size={20} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                0
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Sessions today
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <Sparkles size={20} style={{ color: "var(--accent-alt)" }} />
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                0
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Tasks done
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard padding="lg">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Start your focus session
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Begin a Pomodoro or Free mode session. Each 25+ minute session counts as a step on your journey.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                className="glass glow px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "var(--primary)", color: "#FFFFFF", border: "none" }}
                onClick={() => window.location.href = "/focus"}
              >
                Start Focus
              </button>
            </div>
          </GlassCard>
        </div>

        <GlassCard padding="lg">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Journey
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No active journey.{" "}
            <a href="/journeys" style={{ color: "var(--primary)" }} className="underline">
              Browse paths
            </a>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
