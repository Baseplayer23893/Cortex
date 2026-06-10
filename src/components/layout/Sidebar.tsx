"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Timer,
  Map,
  CheckSquare2,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/store/ui-store";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/focus", icon: Timer, label: "Focus" },
  { href: "/journeys", icon: Map, label: "Journeys" },
  { href: "/habits", icon: CheckSquare2, label: "Habits" },
  { href: "/planner", icon: CalendarDays, label: "Planner" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen } = useUIStore();

  if (!sidebarOpen) return null;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-56 z-30 flex flex-col border-r rounded-none"
      style={{
        background: "rgba(10, 12, 21, 0.95)",
        borderColor: "var(--glass-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span
            className="text-xl font-bold text-glow"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ✦ AURA
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              )}
              style={{
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                borderLeft: isActive ? "2px solid var(--primary)" : "2px solid transparent",
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 mt-auto">
        <button
          onClick={handleSignOut}
          className="btn-ghost flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
