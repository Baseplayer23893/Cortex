"use client";

import { useEffect, useRef, useCallback } from "react";
import { useFocusStore } from "@/store/focus-store";

export function useTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const {
    status, mode, elapsed, remaining, sessionCount,
    start, pause, resume, complete, stop, tick, setMode,
  } = useFocusStore();

  useEffect(() => {
    if (status === "focus" || status === "break") {
      intervalRef.current = setInterval(() => {
        const s = useFocusStore.getState();
        if (s.mode === "pomodoro" && s.remaining <= 1) {
          tick();
          complete();
          return;
        }
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (status === "idle") start();
          else if (status === "paused") resume();
          else if (status === "focus" || status === "break") pause();
          break;
        case "Escape":
          if (status !== "idle" && status !== "completed") stop();
          break;
        case "1":
          if (status === "idle") setMode("pomodoro");
          break;
        case "2":
          if (status === "idle") setMode("free");
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === "focus" || status === "break") {
      const onBefore = (e: BeforeUnloadEvent) => {
        e.preventDefault();
      };
      window.addEventListener("beforeunload", onBefore);
      return () => window.removeEventListener("beforeunload", onBefore);
    }
  }, [status]);

  const formatTime = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  const display = mode === "free"
    ? formatTime(elapsed)
    : formatTime(Math.max(0, remaining));

  const progress = mode === "free"
    ? 0
    : 1 - remaining / useFocusStore.getState().workDuration;

  return {
    status,
    mode,
    display,
    progress,
    elapsed,
    remaining,
    sessionCount,
    start,
    pause,
    resume,
    complete,
    stop,
    setMode,
  };
}
