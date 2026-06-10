"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { useThemeStore, type ThemeId } from "@/store/theme-store";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const themeNames: Record<ThemeId, string> = {
  dawn: "Dawn", dusk: "Dusk", forest: "Forest", ocean: "Ocean",
  aurora: "Aurora", cabin: "Cabin", midnight: "Midnight", bloom: "Bloom",
};

const themeColors: Record<ThemeId, string[]> = {
  dawn: ["#C4B5FD", "#FDA4CA", "#86EFAC", "#FCD34D"],
  dusk: ["#FDBA74", "#C4B5FD", "#FCD34D", "#FDA4CA"],
  forest: ["#86EFAC", "#FEF08A", "#67E8F9", "#C4B5FD"],
  ocean: ["#7DD3FC", "#5EEAD4", "#FDA4CA", "#C4B5FD"],
  aurora: ["#5EEAD4", "#D8B4FE", "#FDA4CA", "#7DD3FC"],
  cabin: ["#F59E0B", "#B45309", "#FEF08A", "#86EFAC"],
  midnight: ["#A5B4FC", "#D8B4FE", "#FDA4CA", "#7DD3FC"],
  bloom: ["#FDA4CA", "#86EFAC", "#FDBA74", "#C4B5FD"],
};

export default function SettingsPage() {
  const { themeId, colorMode, setTheme, toggleColorMode, intensity, setIntensity } = useThemeStore();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Settings
      </h1>

      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Theme
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {(Object.keys(themeNames) as ThemeId[]).map((id) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={cn(
                "glass p-3 rounded-xl text-center transition-all hover:opacity-90",
                themeId === id && "glow-sm ring-2",
              )}
              style={{
                borderColor: themeId === id ? "var(--primary)" : "var(--glass-border)",
              }}
            >
              <div className="flex gap-1 justify-center mb-2">
                {themeColors[id].map((c, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium">{themeNames[id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Appearance
        </h2>
        <GlassCard padding="md" className="flex items-center justify-between">
          <span className="text-sm">Color Mode</span>
          <button
            onClick={toggleColorMode}
            className="glass flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:opacity-80"
          >
            {colorMode === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            {colorMode === "dark" ? "Dark" : "Light"}
          </button>
        </GlassCard>
        <GlassCard padding="md" className="flex items-center justify-between mt-3">
          <span className="text-sm">Background Animation</span>
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as "off" | "subtle" | "full")}
            className="glass px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--glass-border)" }}
          >
            <option value="off">Off</option>
            <option value="subtle">Subtle</option>
            <option value="full">Full</option>
          </select>
        </GlassCard>
      </div>
    </div>
  );
}
