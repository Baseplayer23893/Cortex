"use client";

import { useState } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { Plus, Play, MoreVertical, ChevronLeft, ChevronRight, Clock, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { useTaskStore, Task } from "@/store/task-store";

function today(): string { return new Date().toISOString().slice(0, 10); }
function formatDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask({ title: newTitle.trim(), priority: newPriority, scheduledDate: today(), scheduledTime: newTime || undefined });
    setNewTitle(""); setNewTime(""); setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-glow" style={{ fontFamily: "var(--font-display)" }}>Planner</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary text-xs"><Plus size={14} /> New Task</button>
      </div>

      {showForm && (
        <div className="card flex items-center gap-2">
          <input autoFocus placeholder="Task..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 bg-transparent text-xs border-none outline-none" style={{ color: "var(--text)" }} />
          <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
            className="text-[10px] bg-transparent border rounded px-1.5 py-1" style={{ color: "var(--text-muted)", borderColor: "var(--glass-border)" }} />
          <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
            className="text-[10px] bg-transparent border rounded px-1.5 py-1" style={{ color: "var(--text-muted)", borderColor: "var(--glass-border)" }}>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <button onClick={handleAdd} className="btn btn-primary text-xs">Add</button>
          <button onClick={() => { setShowForm(false); setNewTitle(""); }} className="btn btn-secondary text-xs">Cancel</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-glow" style={{ fontFamily: "var(--font-display)" }}>{monthName} {year}</h2>
              <div className="flex gap-0.5">
                <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="btn-ghost p-1"><ChevronLeft size={14} /></button>
                <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="btn-ghost p-1"><ChevronRight size={14} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>
              {["M","T","W","T","F","S","S"].map((d, i) => (<div key={i} className="py-1">{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
              {Array.from({ length: startDayAdjusted }).map((_, i) => (<div key={`e-${i}`} />))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const isToday = dateStr === today();
                const hasTasks = tasks.some((t) => t.scheduledDate === dateStr);
                return (<div key={day} className="py-1.5 rounded relative text-center transition-all"
                  style={{ background: isToday ? "var(--primary)" : "transparent", color: isToday ? "#131315" : "var(--text)", fontWeight: isToday ? 700 : 400 }}>
                  {day}
                  {hasTasks && <span className="absolute -top-px -right-px w-1 h-1 rounded-full" style={{ background: "var(--accent)" }} />}
                </div>);
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Today's Progress</h3>
            <div className="h-1.5 rounded-full" style={{ background: "var(--glass)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${todayTasks.length > 0 ? (doneToday / todayTasks.length) * 100 : 0}%`, background: "var(--primary)" }} />
            </div>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{doneToday}/{todayTasks.length} done</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Today &middot; {formatDate(today())}</p>
          {todayTasks.length === 0 ? (
            <div className="card text-center"><p className="text-xs" style={{ color: "var(--text-muted)" }}>No tasks for today.</p></div>
          ) : (
            todayTasks.sort((a, b) => ({ High: 0, Medium: 1, Low: 2 } as Record<string, number>)[a.priority] - ({ High: 0, Medium: 1, Low: 2 } as Record<string, number>)[b.priority])
              .map((task) => (
                <div key={task.id} className="card flex items-center gap-3 py-3">
                  <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                    {task.isCompleted ? <CheckCircle size={16} style={{ color: "var(--secondary)" }} /> : <Circle size={16} style={{ color: "var(--text-muted)" }} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ textDecoration: task.isCompleted ? "line-through" : "none", opacity: task.isCompleted ? 0.4 : 1 }}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.scheduledTime && <><Clock size={10} style={{ color: "var(--text-muted)" }} /><span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{task.scheduledTime}</span></>}
                      <span className="badge" style={{ color: task.priority === "High" ? "var(--primary)" : task.priority === "Medium" ? "var(--secondary)" : undefined }}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeTask(task.id)} className="btn-ghost p-1"><MoreVertical size={14} /></button>
                </div>
              ))
          )}

          <div className="card text-center mt-4">
            <h3 className="text-sm font-semibold text-glow mb-1" style={{ fontFamily: "var(--font-display)" }}>Ready to Focus?</h3>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Activate the Flow timer.</p>
            <Link href="/focus" className="btn btn-primary text-xs"><Play size={12} /> Start Flow</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
