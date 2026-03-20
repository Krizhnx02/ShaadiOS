"use client";

import { useState, useCallback } from "react";
import { ONBOARDING_INITIAL, type OnboardingData } from "./types";

export function useOnboarding() {
  const [data, setData] = useState<OnboardingData>(ONBOARDING_INITIAL);

  const updateField = useCallback(
    <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const goToStep = useCallback(
    (step: number) => {
      setData((prev) => ({ ...prev, currentStep: step }));
    },
    []
  );

  const nextStep = useCallback(() => {
    setData((prev) => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 3) }));
  }, []);

  const prevStep = useCallback(() => {
    setData((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 0) }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setData((prev) => ({ ...prev, isComplete: true }));
  }, []);

  return { data, updateField, goToStep, nextStep, prevStep, completeOnboarding };
}
