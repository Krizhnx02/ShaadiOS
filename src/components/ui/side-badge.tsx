import { cn } from "@/lib/utils";
import type { FamilySide } from "@/lib/types/wedding";
import { FAMILY_SIDE_LABELS } from "@/lib/constants/events";

interface SideBadgeProps {
  side: FamilySide;
  className?: string;
}

export function SideBadge({ side, className }: SideBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        side === "bride" && "bg-pink-100 text-pink-700",
        side === "groom" && "bg-blue-100 text-blue-700",
        side === "shared" && "bg-emerald-100 text-emerald-700",
        className
      )}
    >
      {FAMILY_SIDE_LABELS[side]}
    </span>
  );
}
