"use client";

import { useWeddingData } from "@/hooks/useWeddingData";
import { Countdown } from "@/features/dashboard/countdown";
import { StatsGrid } from "@/features/dashboard/stats-grid";
import { EventTimeline } from "@/features/dashboard/event-timeline";
import { RecentTasks } from "@/features/dashboard/recent-tasks";
import type { EventCategory } from "@/lib/types/wedding";

export default function DashboardPage() {
  const { profile, tasks, stats, selectedEvents } = useWeddingData();

  const events: EventCategory[] = selectedEvents.length > 0
    ? selectedEvents
    : ["mehendi", "sangeet", "haldi", "baraat", "pheras", "reception"];

  return (
    <div className="space-y-6 animate-fade-in">
      <Countdown
        weddingDate={profile.weddingDate}
        brideName={profile.brideName}
        groomName={profile.groomName}
        venue={profile.venue}
      />

      <StatsGrid stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <EventTimeline events={events} />
        <RecentTasks tasks={tasks} />
      </div>
    </div>
  );
}
