"use client";

import { Sparkles } from "lucide-react";
import { EVENT_META } from "@/lib/constants/events";
import type { EventCategory } from "@/lib/types/wedding";
import type { OnboardingData } from "../types";
import { cn } from "@/lib/utils";

const SELECTABLE_EVENTS: EventCategory[] = [
  "engagement",
  "mehendi",
  "sangeet",
  "haldi",
  "baraat",
  "pheras",
  "reception",
];

interface StepScopeProps {
  data: OnboardingData;
  onUpdate: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
}

export function StepScope({ data, onUpdate }: StepScopeProps) {
  const toggle = (event: EventCategory) => {
    const current = data.selectedEvents;
    const next = current.includes(event)
      ? current.filter((e) => e !== event)
      : [...current, event];
    onUpdate("selectedEvents", next);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-emerald/20 to-accent-gold/20">
          <Sparkles size={28} className="text-accent-gold" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          The Scope
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Which celebrations are you planning?
          <br />
          Select all the events for your wedding.
        </p>
      </div>

      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:grid-cols-3">
        {SELECTABLE_EVENTS.map((event) => {
          const meta = EVENT_META[event];
          const isSelected = data.selectedEvents.includes(event);
          return (
            <button
              key={event}
              type="button"
              onClick={() => toggle(event)}
              className={cn(
                "group relative flex flex-col items-center gap-2.5 rounded-2xl border-2 p-5 transition-all duration-200",
                isSelected
                  ? "border-accent-emerald bg-accent-emerald/5 shadow-md shadow-accent-emerald/10"
                  : "border-border bg-card hover:border-muted-foreground/30 hover:shadow-sm"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-emerald">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
                {meta.emoji}
              </span>
              <span className={cn(
                "text-sm font-semibold transition-colors",
                isSelected ? "text-accent-emerald" : "text-foreground"
              )}>
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {data.selectedEvents.length === 0
          ? "Select at least one event to continue"
          : `${data.selectedEvents.length} event${data.selectedEvents.length > 1 ? "s" : ""} selected`}
      </p>
    </div>
  );
}
