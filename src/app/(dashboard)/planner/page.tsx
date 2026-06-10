"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { Plus } from "lucide-react";

export default function PlannerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Planner
        </h1>
        <button
          className="glass flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:opacity-80"
          style={{ color: "var(--text)" }}
        >
          <Plus size={16} /> New Task
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlassCard padding="md">
            <p className="text-sm font-medium mb-2">June 2026</p>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Calendar coming soon
            </div>
          </GlassCard>
        </div>
        <div className="lg:col-span-2">
          <GlassCard padding="lg">
            <h3 className="font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Wednesday, June 10
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Nothing planned — enjoy the quiet ✦
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
