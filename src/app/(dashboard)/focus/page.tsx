"use client";

import { GlassCard } from "@/components/glass/GlassCard";

export default function FocusPage() {
  return (
    <div className="max-w-4xl mx-auto pt-12 text-center">
      <div className="flex flex-col items-center gap-8">
        <h1
          className="text-8xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          25:00
        </h1>
        <div className="flex gap-3">
          <button
            className="glass glow px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "var(--primary)", color: "#FFFFFF", border: "none" }}
          >
            Start Focus
          </button>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Pomodoro · Press Space to start
        </p>
      </div>
    </div>
  );
}
