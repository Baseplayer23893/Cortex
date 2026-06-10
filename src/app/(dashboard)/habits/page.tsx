"use client";

import { useState } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { Plus, Flame, Trash2 } from "lucide-react";
import { useHabitStore } from "@/store/habit-store";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function HabitsPage() {
  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const toggleLog = useHabitStore((s) => s.toggleLog);
  const getStreak = useHabitStore((s) => s.getStreak);

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    addHabit(newName.trim());
    setNewName("");
    setShowForm(false);
  };

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const todayNum = new Date().getDate();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Habits
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--primary)", color: "#131315", border: "none" }}
        >
          <Plus size={16} />
          New Habit
        </button>
      </div>

      {showForm && (
        <GlassCard padding="md" className="flex items-center gap-3">
          <input
            autoFocus
            placeholder="Habit name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 bg-transparent text-sm border-none outline-none"
            style={{ color: "var(--text)" }}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: "var(--primary)", color: "#131315" }}
          >
            Add
          </button>
          <button
            onClick={() => { setShowForm(false); setNewName(""); }}
            className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            Cancel
          </button>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {habits.length === 0 ? (
            <GlassCard padding="lg">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No habits yet. Create one to start tracking.
              </p>
            </GlassCard>
          ) : (
            habits.filter((h) => !h.isArchived).map((habit) => {
              const streak = getStreak(habit.id);
              const checked = habit.logs[today()] ?? false;

              return (
                <GlassCard key={habit.id} padding="md" className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLog(habit.id, today())}
                    className="w-5 h-5 rounded-full transition-all flex items-center justify-center"
                    style={{
                      background: checked ? habit.colour : "transparent",
                      border: `2px solid ${checked ? habit.colour : "var(--primary)"}`,
                    }}
                  >
                    {checked && <span className="text-[10px] font-bold" style={{ color: "#131315" }}>✓</span>}
                  </button>
                  <span className="flex-1 text-sm font-medium" style={{ textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.5 : 1 }}>
                    {habit.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 text-sm" style={{ color: "var(--primary)" }}>
                      <Flame size={14} />
                      <span className="font-semibold">{streak}</span>
                    </div>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="p-1 rounded transition-all hover:opacity-70"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>

        <div className="lg:col-span-2">
          <GlassCard padding="lg">
            <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Monthly Activity
            </h2>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const completedCount = habits.filter((h) => h.logs[dateStr]).length;
                const intensity = habits.length > 0 ? completedCount / habits.length : 0;

                return (
                  <div
                    key={i}
                    className="aspect-square rounded-md transition-all"
                    style={{
                      background: intensity > 0 ? "var(--primary)" : "var(--glass)",
                      opacity: intensity > 0 ? 0.2 + intensity * 0.6 : 0.5,
                      border: day === todayNum ? "2px solid var(--primary)" : "1px solid var(--glass-border)",
                    }}
                    title={`${dateStr}: ${completedCount}/${habits.length} habits`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>Less</span>
              {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                <div
                  key={opacity}
                  className="w-3 h-3 rounded-sm"
                  style={{ background: "var(--primary)", opacity, border: "1px solid var(--glass-border)" }}
                />
              ))}
              <span>More</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
