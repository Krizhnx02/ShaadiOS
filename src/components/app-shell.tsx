"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ONBOARDING_INITIAL, type OnboardingData } from "@/features/onboarding/types";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { WeddingProfile, Perspective, EventCategory } from "@/lib/types/wedding";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [onboarding] = useLocalStorage<OnboardingData>("shaadios-onboarding", ONBOARDING_INITIAL);
  const [, setProfile] = useLocalStorage<WeddingProfile>("shaadios-profile", {} as WeddingProfile);
  const [, setPerspective] = useLocalStorage<Perspective>("shaadios-perspective", "all");
  const [, setEvents] = useLocalStorage<EventCategory[]>("shaadios-events", []);
  const [showDashboard, setShowDashboard] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowDashboard(onboarding.isComplete);
  }, [onboarding.isComplete]);

  const handleOnboardingComplete = useCallback(
    (finalData: OnboardingData) => {
      const now = new Date().toISOString();
      const weddingDateISO = finalData.weddingDate
        ? new Date(finalData.weddingDate).toISOString()
        : new Date().toISOString();

      setProfile({
        id: crypto.randomUUID(),
        brideName: finalData.brideName,
        groomName: finalData.groomName,
        weddingDate: weddingDateISO,
        totalBudget: Number(finalData.totalBudget) || 0,
        currency: "INR",
        createdAt: now,
        updatedAt: now,
      });

      setPerspective(finalData.userSide ?? "all");
      setEvents(finalData.selectedEvents);
      setShowDashboard(true);
    },
    [setProfile, setPerspective, setEvents]
  );

  if (!mounted) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <p className="text-lg font-bold tracking-tight">
            Shaadi<span className="text-accent-gold">OS</span>
          </p>
        </div>
      </div>
    );
  }

  if (!showDashboard) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
