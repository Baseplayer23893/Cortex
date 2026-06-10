"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  glow?: boolean;
  as?: "div" | "button" | "form";
  onClick?: () => void;
}

const paddingMap = {
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export function GlassCard({
  children,
  className,
  padding = "md",
  hover,
  glow,
  as: Tag = "div",
  onClick,
}: GlassCardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "glass",
        paddingMap[padding],
        hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        glow && "glow-sm",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
