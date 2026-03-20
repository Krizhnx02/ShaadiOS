"use client";

import { usePerspective } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Perspective } from "@/lib/types/wedding";
import { Eye, EyeOff, Users } from "lucide-react";

const OPTIONS: { value: Perspective; label: string; icon: typeof Eye }[] = [
  { value: "all", label: "All", icon: Users },
  { value: "bride", label: "Bride", icon: Eye },
  { value: "groom", label: "Groom", icon: EyeOff },
];

export function PerspectiveToggle() {
  const { perspective, setPerspective } = usePerspective();

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setPerspective(value)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
            perspective === value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon size={14} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
