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
      className="fixed left-0 top-0 bottom-0 w-56 z-30 flex flex-col glass rounded-none border-l-0"
      style={{
        background: "color-mix(in srgb, var(--surface) 80%, transparent)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid var(--glass-border)",
      }}
    >
      <div className="px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ✦ Aura
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "glass glow-sm"
                  : "hover:opacity-80",
              )}
              style={{
                color: isActive ? "var(--text)" : "var(--text-muted)",
                background: isActive ? "var(--glass)" : "transparent",
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all hover:opacity-80"
          style={{ color: "var(--text-muted)" }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
