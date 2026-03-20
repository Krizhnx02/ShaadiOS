"use client";

import { EVENT_META } from "@/lib/constants/events";
import type { EventCategory } from "@/lib/types/wedding";

interface EventTimelineProps {
  events: EventCategory[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Wedding Events</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {events.map((event) => {
          const meta = EVENT_META[event];
          return (
            <div
              key={event}
              className="flex shrink-0 flex-col items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-accent-emerald/30"
            >
              <span className="text-2xl">{meta.emoji}</span>
              <span className="text-xs font-medium text-foreground">{meta.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
