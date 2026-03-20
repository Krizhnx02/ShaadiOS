"use client";

import { useCallback, type ReactNode } from "react";
import { useWedding } from "@/contexts/wedding-context";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { OnboardingData } from "@/features/onboarding/types";
import type { WeddingProfile, Perspective } from "@/lib/types/wedding";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isLoading, onboardingComplete, completeOnboarding } = useWedding();

  const handleOnboardingComplete = useCallback(
    (finalData: OnboardingData) => {
      const now = new Date().toISOString();
      const weddingDateISO = finalData.weddingDate
        ? new Date(finalData.weddingDate).toISOString()
        : new Date().toISOString();

      const profile: WeddingProfile = {
        id: crypto.randomUUID(),
        brideName: finalData.brideName,
        groomName: finalData.groomName,
        weddingDate: weddingDateISO,
        totalBudget: Number(finalData.totalBudget) || 0,
        currency: "INR",
        createdAt: now,
        updatedAt: now,
      };

      const perspective: Perspective = finalData.userSide ?? "all";

      completeOnboarding(profile, perspective, finalData.selectedEvents);
    },
    [completeOnboarding]
  );

  if (isLoading) {
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

  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
