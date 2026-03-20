"use client";

import { Users } from "lucide-react";
import type { OnboardingData } from "../types";
import { cn } from "@/lib/utils";

interface StepSideProps {
  data: OnboardingData;
  onUpdate: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
}

export function StepSide({ data, onUpdate }: StepSideProps) {
  const brideName = data.brideName || "the Bride";
  const groomName = data.groomName || "the Groom";

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-bride-pink/20 to-groom-blue/20">
          <Users size={28} className="text-accent-emerald" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          The Side
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This helps us personalize your dashboard and set up
          <br />
          the right privacy defaults.
        </p>
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => onUpdate("userSide", "bride")}
          className={cn(
            "group relative flex flex-1 flex-col items-center gap-4 rounded-2xl border-2 p-8 transition-all duration-200",
            data.userSide === "bride"
              ? "border-bride-pink bg-bride-pink/5 shadow-lg shadow-bride-pink/10"
              : "border-border bg-card hover:border-bride-pink/30 hover:shadow-sm"
          )}
        >
          {data.userSide === "bride" && (
            <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-bride-pink">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          <span className="text-5xl transition-transform duration-200 group-hover:scale-110">👰</span>

          <div className="text-center">
            <p className={cn(
              "text-lg font-bold transition-colors",
              data.userSide === "bride" ? "text-bride-pink" : "text-foreground"
            )}>
              {brideName}&apos;s Side
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Family, friends &amp; crew of the bride
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onUpdate("userSide", "groom")}
          className={cn(
            "group relative flex flex-1 flex-col items-center gap-4 rounded-2xl border-2 p-8 transition-all duration-200",
            data.userSide === "groom"
              ? "border-groom-blue bg-groom-blue/5 shadow-lg shadow-groom-blue/10"
              : "border-border bg-card hover:border-groom-blue/30 hover:shadow-sm"
          )}
        >
          {data.userSide === "groom" && (
            <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-groom-blue">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          <span className="text-5xl transition-transform duration-200 group-hover:scale-110">🤵</span>

          <div className="text-center">
            <p className={cn(
              "text-lg font-bold transition-colors",
              data.userSide === "groom" ? "text-groom-blue" : "text-foreground"
            )}>
              {groomName}&apos;s Side
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Family, friends &amp; crew of the groom
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
