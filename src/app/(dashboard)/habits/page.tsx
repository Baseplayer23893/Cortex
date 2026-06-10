"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { Plus } from "lucide-react";

export default function HabitsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Habits
        </h1>
        <button
          className="glass flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:opacity-80"
          style={{ color: "var(--text)" }}
        >
          <Plus size={16} /> New Habit
        </button>
      </div>
      <GlassCard padding="lg">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No habits yet. Create one to start tracking.
        </p>
      </GlassCard>
    </div>
  );
}
