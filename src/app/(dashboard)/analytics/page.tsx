"use client";

import { GlassCard } from "@/components/glass/GlassCard";

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Analytics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard glow>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Total Focus Time</p>
          <p className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>0h</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Sessions</p>
          <p className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>0</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Best Streak</p>
          <p className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>0 days</p>
        </GlassCard>
      </div>
      <GlassCard padding="lg">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Start focusing to see your stats and heatmap.
        </p>
      </GlassCard>
    </div>
  );
}
