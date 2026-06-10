"use client";

import { Menu } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

export function TopBar() {
  const { toggleSidebar } = useUIStore();

  return (
    <header
      className="fixed top-0 right-0 left-0 z-20 h-14 flex items-center px-4"
      style={{
        background: "color-mix(in srgb, var(--surface) 60%, transparent)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg transition-all hover:opacity-70"
        style={{ color: "var(--text-muted)" }}
      >
        <Menu size={20} />
      </button>
      <div className="flex-1" />
    </header>
  );
}
