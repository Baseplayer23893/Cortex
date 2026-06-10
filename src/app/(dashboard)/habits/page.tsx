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
        <h1 className="text-2xl font-bold text-glow" style={{ fontFamily: "var(--font-display)" }}>Habits</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary text-xs">
          <Plus size={14} />
          New Habit
        </button>
      </div>

      {showForm && (
        <div className="card flex items-center gap-2">
          <input autoFocus placeholder="Habit name..." value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 bg-transparent text-xs border-none outline-none" style={{ color: "var(--text)" }} />
          <button onClick={handleAdd} className="btn btn-primary text-xs">Add</button>
          <button onClick={() => { setShowForm(false); setNewName(""); }} className="btn btn-secondary text-xs">Cancel</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {habits.length === 0 ? (
            <div className="card">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No habits yet.</p>
            </div>
          ) : (
            habits.filter((h) => !h.isArchived).map((habit) => {
              const streak = getStreak(habit.id);
              const checked = habit.logs[today()] ?? false;
              return (
                <div key={habit.id} className="card flex items-center gap-3 py-3">
                  <button onClick={() => toggleLog(habit.id, today())}
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: checked ? habit.colour : "transparent", border: `2px solid ${checked ? habit.colour : "var(--primary)"}` }}>
                    {checked && <span className="text-[8px] font-bold" style={{ color: "#131315" }}>✓</span>}
                  </button>
                  <span className="flex-1 text-xs font-medium truncate" style={{ textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.4 : 1 }}>{habit.name}</span>
                  <div className="flex items-center gap-1">
                    <Flame size={12} style={{ color: "var(--primary)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>{streak}</span>
                  </div>
                  <button onClick={() => removeHabit(habit.id)} className="btn-ghost p-1"><Trash2 size={11} /></button>
                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-sm font-semibold mb-3 text-glow" style={{ fontFamily: "var(--font-display)" }}>Monthly Activity</h2>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const completedCount = habits.filter((h) => h.logs[dateStr]).length;
                const intensity = habits.length > 0 ? completedCount / habits.length : 0;
                return (
                  <div key={i} className="aspect-square rounded transition-all"
                    style={{ background: intensity > 0 ? "var(--primary)" : "var(--glass)", opacity: intensity > 0 ? 0.2 + intensity * 0.6 : 0.4, border: day === todayNum ? "1px solid var(--primary)" : "1px solid transparent" }} />
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-1 mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
              <span>Less</span>
              {[0.2, 0.4, 0.6, 0.8, 1].map((o) => (<div key={o} className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--primary)", opacity: o }} />))}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
