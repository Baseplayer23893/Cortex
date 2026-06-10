"use client";

import { useTimer } from "@/hooks/useTimer";
import { Play, Pause, RotateCcw, Coffee, Sparkles } from "lucide-react";

export default function FocusPage() {
  const {
    status, mode, display, progress, sessionCount,
    start, pause, resume, stop, setMode,
  } = useTimer();

  const isRunning = status === "focus" || status === "break";
  const isIdle = status === "idle";
  const isCompleted = status === "completed";

  return (
    <div className="max-w-3xl mx-auto pt-8 flex flex-col items-center min-h-[calc(100vh-8rem)]">
      <h1 className="text-sm font-semibold tracking-widest uppercase mb-12" style={{ color: "var(--text-muted)" }}>
        {status === "break" ? "Break Time" : isCompleted ? "Session Complete" : "Deep Focus"}
      </h1>

      <div
        className="text-9xl font-bold tracking-tight leading-none tabular-nums select-none"
        style={{ fontFamily: "var(--font-display)", color: isCompleted ? "var(--secondary)" : undefined }}
      >
        {display}
      </div>

      {mode === "pomodoro" && isRunning && (
        <div className="w-64 h-1.5 mt-8 rounded-full overflow-hidden" style={{ background: "var(--glass)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.max(0, Math.min(100, progress * 100))}%`,
              background: "var(--primary)",
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-4 mt-12">
        {isIdle && (
          <button
            onClick={start}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 glow"
            style={{ background: "var(--primary)", color: "#131315", border: "none" }}
          >
            <Play size={16} fill="#131315" />
            Start
          </button>
        )}

        {isRunning && (
          <button
            onClick={pause}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 glow"
            style={{ background: "var(--primary)", color: "#131315", border: "none" }}
          >
            <Pause size={16} fill="#131315" />
            Pause
          </button>
        )}

        {status === "paused" && (
          <button
            onClick={resume}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 glow"
            style={{ background: "var(--primary)", color: "#131315", border: "none" }}
          >
            <Play size={16} fill="#131315" />
            Resume
          </button>
        )}

        {isCompleted && (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 glow"
            style={{ background: "var(--primary)", color: "#131315", border: "none" }}
          >
            <Sparkles size={16} fill="#131315" />
            New Session
          </button>
        )}

        {isRunning && (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "var(--glass)", color: "var(--text)", border: "1px solid var(--glass-border)" }}
          >
            <RotateCcw size={14} />
            Stop
          </button>
        )}

        {status === "paused" && (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "var(--glass)", color: "var(--text)", border: "1px solid var(--glass-border)" }}
          >
            <RotateCcw size={14} />
            Quit
          </button>
        )}
      </div>

      {mode === "pomodoro" && (
        <p className="text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          Session {sessionCount + 1} of 4
        </p>
      )}

      {isIdle && (
        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={() => setMode("pomodoro")}
            className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all ${
              mode === "pomodoro" ? "glow-sm" : ""
            }`}
            style={{
              background: mode === "pomodoro" ? "var(--primary)" : "var(--glass)",
              color: mode === "pomodoro" ? "#131315" : "var(--text-muted)",
              border: mode === "pomodoro" ? "none" : "1px solid var(--glass-border)",
            }}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => setMode("free")}
            className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all ${
              mode === "free" ? "glow-sm" : ""
            }`}
            style={{
              background: mode === "free" ? "var(--primary)" : "var(--glass)",
              color: mode === "free" ? "#131315" : "var(--text-muted)",
              border: mode === "free" ? "none" : "1px solid var(--glass-border)",
            }}
          >
            Free Mode
          </button>
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
        <kbd className="px-1.5 py-0.5 rounded" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>Space</kbd>
        <span>start/pause</span>
        <span className="mx-1">·</span>
        <kbd className="px-1.5 py-0.5 rounded" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>Esc</kbd>
        <span>stop</span>
      </div>

      {isCompleted && (
        <div className="mt-10 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Coffee size={32} style={{ color: "var(--accent)" }} />
          <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--secondary)" }}>
            Well done, traveler.
          </p>
          <p className="text-sm max-w-xs text-center" style={{ color: "var(--text-muted)" }}>
            Take a breath. The path continues whenever you're ready.
          </p>
        </div>
      )}

      <div className="mt-auto mb-12 text-center max-w-md mx-auto">
        <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
          &ldquo;The only way to do great work is to love what you do.&rdquo;
        </p>
      </div>
    </div>
  );
}
