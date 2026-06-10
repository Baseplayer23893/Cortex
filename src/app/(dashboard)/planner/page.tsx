"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { Plus, Play, MoreVertical, ChevronLeft, ChevronRight, Clock, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { useTaskStore, Task } from "@/store/task-store";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function PlannerPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const removeTask = useTaskStore((s) => s.removeTask);

  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("Medium");
  const [newTime, setNewTime] = useState("");

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const monthName = MONTHS[month];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const startDayAdjusted = startDay === 0 ? 6 : startDay - 1;

  const todayTasks = tasks.filter((t) => t.scheduledDate === today());
  const doneToday = todayTasks.filter((t) => t.isCompleted).length;

  const handlePrev = () => setViewDate(new Date(year, month - 1, 1));
  const handleNext = () => setViewDate(new Date(year, month + 1, 1));

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      priority: newPriority,
      scheduledDate: today(),
      scheduledTime: newTime || undefined,
      project: undefined,
    });
    setNewTitle("");
    setNewTime("");
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Planner
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--primary)", color: "#131315", border: "none" }}
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {showForm && (
        <GlassCard padding="md" className="flex items-center gap-3">
          <input
            autoFocus
            placeholder="Task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 bg-transparent text-sm border-none outline-none"
            style={{ color: "var(--text)" }}
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="text-xs bg-transparent border rounded-lg px-2 py-1"
            style={{ color: "var(--text-muted)", borderColor: "var(--glass-border)" }}
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
            className="text-xs bg-transparent border rounded-lg px-2 py-1"
            style={{ color: "var(--text-muted)", borderColor: "var(--glass-border)" }}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            onClick={handleAdd}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: "var(--primary)", color: "#131315" }}
          >
            Add
          </button>
          <button
            onClick={() => { setShowForm(false); setNewTitle(""); }}
            className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            Cancel
          </button>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard padding="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {monthName} {year}
              </h2>
              <div className="flex items-center gap-1">
                <button onClick={handlePrev} className="p-1 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--text-muted)" }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={handleNext} className="p-1 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--text-muted)" }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={`day-${i}`} className="py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({ length: startDayAdjusted }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayTasks = tasks.filter((t) => t.scheduledDate === dateStr);
                const isToday = dateStr === today();

                return (
                  <div
                    key={day}
                    className="py-1.5 rounded-lg transition-all relative"
                    style={{
                      background: isToday ? "var(--primary)" : "transparent",
                      color: isToday ? "#131315" : "var(--text)",
                      fontWeight: isToday ? 700 : 400,
                    }}
                  >
                    {day}
                    {dayTasks.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard padding="md">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Today&apos;s Progress
            </h3>
            <div className="h-2 rounded-full" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${todayTasks.length > 0 ? (doneToday / todayTasks.length) * 100 : 0}%`, background: "var(--primary)" }} />
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {doneToday} of {todayTasks.length} tasks done
            </p>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
              Today &middot; {formatDate(today())}
            </h2>
          </div>
          {todayTasks.length === 0 ? (
            <GlassCard padding="lg" className="text-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No tasks for today. Add one to get started.
              </p>
            </GlassCard>
          ) : (
            todayTasks
              .sort((a, b) => {
                const order = { High: 0, Medium: 1, Low: 2 };
                return order[a.priority] - order[b.priority];
              })
              .map((task) => (
                <GlassCard key={task.id} padding="md" className="flex items-center gap-4">
                  <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                    {task.isCompleted ? (
                      <CheckCircle size={18} style={{ color: "var(--secondary)" }} />
                    ) : (
                      <Circle size={18} style={{ color: "var(--text-muted)" }} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ textDecoration: task.isCompleted ? "line-through" : "none", opacity: task.isCompleted ? 0.5 : 1 }}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.scheduledTime && (
                        <>
                          <Clock size={12} style={{ color: "var(--text-muted)" }} />
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{task.scheduledTime}</span>
                        </>
                      )}
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "var(--glass)",
                          border: "1px solid var(--glass-border)",
                          color: task.priority === "High" ? "var(--primary)" : task.priority === "Medium" ? "var(--secondary)" : "var(--text-muted)",
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="p-1 rounded-lg transition-all hover:opacity-70"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </GlassCard>
              ))
          )}

          <GlassCard padding="lg" className="text-center mt-6">
            <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Ready to Focus?
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Activate the Flow timer to enter your deep work session. All notifications will be muted.
            </p>
            <Link
              href="/focus"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 glow"
              style={{ background: "var(--primary)", color: "#131315", border: "none" }}
            >
              <Play size={16} fill="#131315" />
              Start Flow Session
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
