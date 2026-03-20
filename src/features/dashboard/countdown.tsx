"use client";

import { useMemo } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { Heart, MapPin, Calendar } from "lucide-react";

interface CountdownProps {
  weddingDate: string;
  brideName: string;
  groomName: string;
  venue?: string;
}

export function Countdown({ weddingDate, brideName, groomName, venue }: CountdownProps) {
  const timeLeft = useMemo(() => {
    const target = new Date(weddingDate);
    const now = new Date();
    const days = differenceInDays(target, now);
    const hours = differenceInHours(target, now) % 24;
    const minutes = differenceInMinutes(target, now) % 60;
    return { days: Math.max(0, days), hours: Math.max(0, hours), minutes: Math.max(0, minutes) };
  }, [weddingDate]);

  const formattedDate = format(new Date(weddingDate), "EEEE, MMMM d, yyyy");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent-emerald/5 via-card to-accent-gold/5 p-6 md:p-8">
      <div className="absolute top-4 right-4 opacity-10">
        <Heart size={80} fill="currentColor" className="text-accent-gold" />
      </div>

      <div className="relative space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold">
          <span className="text-bride-pink">{brideName}</span>
          <span className="text-muted-foreground mx-2">&</span>
          <span className="text-groom-blue">{groomName}</span>
        </h1>

        {venue && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span>{venue}</span>
          </div>
        )}

        <div className="flex gap-4 pt-2">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="animate-count-up text-3xl md:text-4xl font-bold text-accent-emerald tabular-nums">
                {value}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
