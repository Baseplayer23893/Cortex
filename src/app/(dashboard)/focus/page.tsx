"use client";

import { useEffect, useRef } from "react";
import { useTimer } from "@/hooks/useTimer";
import { Play, Pause, RotateCcw, Coffee, Sparkles } from "lucide-react";
import { saveFocusSession, saveSessionStory } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

export default function FocusPage() {
  const {
    status, mode, display, progress, sessionCount, elapsed,
    start, pause, resume, stop, setMode,
  } = useTimer();

  const savedRef = useRef(false);

  useEffect(() => {
    if (status !== "completed" || savedRef.current) return;
    savedRef.current = true;

    const mins = Math.max(1, Math.floor(elapsed / 60));
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const session = await saveFocusSession(user.id, mins, mode === "free" ? "free" : "pomodoro");
      if (mins >= 5 && session) {
        await saveSessionStory(user.id, `Completed a ${mins}-minute focus session.`, undefined, session.id);
      }
    })();
  }, [status, elapsed, mode]);

  useEffect(() => {
    if (status === "idle") savedRef.current = false;
  }, [status]);

  const isRunning = status === "focus" || status === "break";
  const isIdle = status === "idle";
  const isCompleted = status === "completed";

  return (
    <div className="max-w-3xl mx-auto pt-12 flex flex-col items-center min-h-[calc(100vh-8rem)]">
      <h1 className="text-xs font-semibold tracking-widest uppercase mb-10" style={{ color: "var(--text-muted)" }}>
        {status === "break" ? "Break Time" : isCompleted ? "Session Complete" : "Deep Focus"}
      </h1>

      <div
        className="text-[100px] font-bold tracking-tight leading-none tabular-nums select-none text-glow"
        style={{ fontFamily: "var(--font-display)", color: isCompleted ? "var(--secondary)" : undefined }}
      >
        {display}
      </div>

      {mode === "pomodoro" && isRunning && (
        <div className="w-48 h-1 mt-6 rounded-full overflow-hidden" style={{ background: "var(--glass)" }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%`, background: "var(--primary)" }} />
        </div>
      )}

      <div className="glass flex items-center gap-3 px-4 py-3 mt-10 rounded-full">
        {isIdle && (
          <button onClick={start} className="btn btn-primary btn-pill text-sm">
            <Play size={14} />
            Start
          </button>
        )}
        {isRunning && (
          <button onClick={pause} className="btn btn-primary btn-pill text-sm">
            <Pause size={14} />
            Pause
          </button>
        )}
        {status === "paused" && (
          <button onClick={resume} className="btn btn-primary btn-pill text-sm">
            <Play size={14} />
            Resume
          </button>
        )}
        {isCompleted && (
          <button onClick={stop} className="btn btn-primary btn-pill text-sm">
            <Sparkles size={14} />
            New Session
          </button>
        )}
        {(isRunning || status === "paused") && (
          <button onClick={stop} className="btn btn-secondary btn-pill text-sm">
            <RotateCcw size={14} />
            {status === "paused" ? "Quit" : "Stop"}
          </button>
        )}
      </div>

      {mode === "pomodoro" && (
        <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          Session {sessionCount + 1} of 4
        </p>
      )}

      {isIdle && (
        <div className="flex items-center gap-2 mt-6">
          {(["pomodoro", "free"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`btn ${mode === m ? "btn-primary" : "btn-secondary"} text-xs`}
            >
              {m === "pomodoro" ? "Pomodoro (25m)" : "Free Mode"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
        <kbd className="px-1 py-0.5 rounded text-[9px]" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>Space</kbd>
        <span>start/pause</span>
        <span className="mx-1">·</span>
        <kbd className="px-1 py-0.5 rounded text-[9px]" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>Esc</kbd>
        <span>stop</span>
      </div>

      {isCompleted && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <Coffee size={24} style={{ color: "var(--accent)" }} />
          <p className="text-base font-semibold text-glow" style={{ fontFamily: "var(--font-display)", color: "var(--secondary)" }}>
            Well done, traveler.
          </p>
          <p className="text-xs max-w-xs text-center" style={{ color: "var(--text-muted)" }}>
            Take a breath. The path continues whenever you're ready.
          </p>
        </div>
      )}

      <div className="mt-auto mb-10 text-center max-w-md mx-auto">
        <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
          &ldquo;The only way to do great work is to love what you do.&rdquo;
        </p>
      </div>
    </div>
  );
}
