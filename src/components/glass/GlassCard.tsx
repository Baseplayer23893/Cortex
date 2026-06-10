"use client";

import { cn } from "@/lib/utils/cn";

interface Props {
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}

export function GlassCard({ children, padding = "md", hover, className, onClick, glow }: Props) {
  const pad = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "card",
        pad[padding],
        hover && "card-hover cursor-pointer",
        glow && "neon-active",
        className,
      )}
    >
      {children}
    </div>
  );
}
