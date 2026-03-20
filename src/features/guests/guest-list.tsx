"use client";

import { useState } from "react";
import type { Guest, FamilySide, GuestRsvpStatus } from "@/lib/types/wedding";
import { SideBadge } from "@/components/ui/side-badge";
import { usePerspective } from "@/hooks";
import { EVENT_META } from "@/lib/constants/events";
import { cn } from "@/lib/utils";
import { Filter, Users, UserCheck, UserX, HelpCircle, Trash2, Pencil } from "lucide-react";

const RSVP_CONFIG: Record<GuestRsvpStatus, { label: string; icon: typeof UserCheck; className: string }> = {
  confirmed: { label: "Confirmed", icon: UserCheck, className: "text-emerald-600 bg-emerald-100" },
  declined: { label: "Declined", icon: UserX, className: "text-red-600 bg-red-100" },
  pending: { label: "Pending", icon: HelpCircle, className: "text-amber-600 bg-amber-100" },
  maybe: { label: "Maybe", icon: HelpCircle, className: "text-blue-600 bg-blue-100" },
};

const RSVP_CYCLE: GuestRsvpStatus[] = ["pending", "confirmed", "maybe", "declined"];

interface GuestListProps {
  guests: Guest[];
  onUpdate: (id: string, patch: Partial<Guest>) => void;
  onDelete: (id: string) => void;
  onEditGuest?: (guest: Guest) => void;
}

export function GuestList({ guests, onUpdate, onDelete, onEditGuest }: GuestListProps) {
  const { isVisible } = usePerspective();
  const [filterSide, setFilterSide] = useState<FamilySide | "all">("all");
  const [filterRsvp, setFilterRsvp] = useState<GuestRsvpStatus | "all">("all");

  const filtered = guests
    .filter((g) => (filterSide === "all" || g.side === filterSide) && isVisible(g.side))
    .filter((g) => filterRsvp === "all" || g.rsvpStatus === filterRsvp);

  const totalHeadcount = filtered.reduce((sum, g) => sum + 1 + g.plusOnes, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-muted-foreground" />
        <select value={filterSide} onChange={(e) => setFilterSide(e.target.value as FamilySide | "all")}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
          <option value="all">All Sides</option>
          <option value="bride">Bride&apos;s Side</option>
          <option value="groom">Groom&apos;s Side</option>
          <option value="shared">Shared</option>
        </select>
        <select value={filterRsvp} onChange={(e) => setFilterRsvp(e.target.value as GuestRsvpStatus | "all")}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
          <option value="all">All RSVP</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="maybe">Maybe</option>
          <option value="declined">Declined</option>
        </select>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users size={12} /><span>{totalHeadcount} total headcount</span>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((guest) => {
          const rsvp = RSVP_CONFIG[guest.rsvpStatus];
          const RsvpIcon = rsvp.icon;
          const cycleRsvp = () => {
            const idx = RSVP_CYCLE.indexOf(guest.rsvpStatus);
            const next = RSVP_CYCLE[(idx + 1) % RSVP_CYCLE.length];
            onUpdate(guest.id, { rsvpStatus: next });
          };
          return (
            <div key={guest.id} className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium">{guest.name}</h4>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <SideBadge side={guest.side} />
                    <button onClick={cycleRsvp} className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium cursor-pointer transition-colors",
                      rsvp.className
                    )} title="Click to cycle RSVP status">
                      <RsvpIcon size={10} />{rsvp.label}
                    </button>
                    {guest.plusOnes > 0 && (
                      <span className="text-[10px] text-muted-foreground">+{guest.plusOnes} guests</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {guest.events.map((event) => (
                      <span key={event} className="text-xs" title={EVENT_META[event].label}>
                        {EVENT_META[event].emoji}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  {onEditGuest && (
                    <button onClick={() => onEditGuest(guest)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-blue-50 hover:text-blue-500 transition-colors"
                      title="Edit"><Pencil size={14} /></button>
                  )}
                  <button onClick={() => onDelete(guest.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
