"use client";

import { PerspectiveToggle } from "@/components/ui/perspective-toggle";
import { Heart } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex md:hidden h-14 items-center justify-between border-b border-border bg-card/95 backdrop-blur-lg px-4">
      <div className="flex items-center gap-2">
        <Heart size={20} className="text-accent-emerald" fill="currentColor" />
        <span className="text-base font-bold tracking-tight">
          Shaadi<span className="text-accent-gold">OS</span>
        </span>
      </div>
      <PerspectiveToggle />
    </header>
  );
}
