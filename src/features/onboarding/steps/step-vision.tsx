"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, CalendarHeart } from "lucide-react";
import type { OnboardingData } from "../types";

interface StepVisionProps {
  data: OnboardingData;
  onUpdate: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
}

export function StepVision({ data, onUpdate }: StepVisionProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-bride-pink/20 to-accent-gold/20">
          <Heart size={28} className="text-bride-pink" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          The Vision
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Every great love story starts with two names and a date.
          <br />
          Let&apos;s begin yours.
        </p>
      </div>

      <div className="mx-auto max-w-sm space-y-5">
        <div className="space-y-2">
          <Label htmlFor="brideName" className="text-bride-pink">
            Bride&apos;s Name
          </Label>
          <Input
            id="brideName"
            placeholder="e.g. Priya"
            value={data.brideName}
            onChange={(e) => onUpdate("brideName", e.target.value)}
            icon={<span className="text-sm">👰</span>}
            className="focus-visible:ring-bride-pink/40 focus-visible:border-bride-pink"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="groomName" className="text-groom-blue">
            Groom&apos;s Name
          </Label>
          <Input
            id="groomName"
            placeholder="e.g. Arjun"
            value={data.groomName}
            onChange={(e) => onUpdate("groomName", e.target.value)}
            icon={<span className="text-sm">🤵</span>}
            className="focus-visible:ring-groom-blue/40 focus-visible:border-groom-blue"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingDate" className="text-accent-gold">
            Wedding Date
          </Label>
          <Input
            id="weddingDate"
            type="date"
            value={data.weddingDate}
            onChange={(e) => onUpdate("weddingDate", e.target.value)}
            icon={<CalendarHeart size={16} />}
            className="focus-visible:ring-accent-gold/40 focus-visible:border-accent-gold"
          />
        </div>
      </div>
    </div>
  );
}
