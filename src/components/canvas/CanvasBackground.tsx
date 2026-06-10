"use client";

import { useRef, useEffect } from "react";
import { CanvasEngine, AnimMode, CanvasColors } from "@/lib/canvas/engine";
import { useThemeStore } from "@/store/theme-store";

const THEME_MODES: Record<string, AnimMode> = {
  dawn: "fluid",
  dusk: "geometric",
  forest: "particles",
  ocean: "fluid",
  aurora: "aurora",
  cabin: "fireflies",
  midnight: "stars",
  bloom: "petals",
};

function getCssColor(varName: string): string {
  if (typeof document === "undefined") return "#a78bfa";
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "#a78bfa";
}

function extractColors(): CanvasColors {
  return [getCssColor("--primary"), getCssColor("--secondary"), getCssColor("--accent")];
}

interface Props {
  mode?: AnimMode;
  speed?: number;
  opacity?: number;
}

export function CanvasBackground({ mode: modeProp, speed, opacity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CanvasEngine | null>(null);
  const { themeId, intensity } = useThemeStore();

  const animMode = modeProp || THEME_MODES[themeId] || "fluid";

  useEffect(() => {
    if (intensity === "off") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new CanvasEngine({
      mode: animMode,
      speed: speed ?? 1,
      opacity: opacity ?? (intensity === "subtle" ? 0.4 : 1),
      colors: extractColors(),
    });

    engineRef.current = engine;
    engine.start(canvas);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [animMode, intensity]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setColors(extractColors());
  }, [themeId]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (speed !== undefined) engine.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (opacity !== undefined) engine.setOpacity(opacity);
  }, [opacity]);

  if (intensity === "off") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
