import { GlassCard } from "@/components/glass/GlassCard";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-surface/50" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassCard key={i}>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-surface/50" />
              <div className="space-y-2">
                <div className="h-6 w-16 rounded bg-surface/50" />
                <div className="h-3 w-24 rounded bg-surface/50" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
