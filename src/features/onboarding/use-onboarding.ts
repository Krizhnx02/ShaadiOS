"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ONBOARDING_INITIAL, type OnboardingData } from "./types";
import { useCallback } from "react";

const STORAGE_KEY = "shaadios-onboarding";

export function useOnboarding() {
  const [data, setData] = useLocalStorage<OnboardingData>(STORAGE_KEY, ONBOARDING_INITIAL);

  const updateField = useCallback(
    <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    [setData]
  );

  const goToStep = useCallback(
    (step: number) => {
      setData((prev) => ({ ...prev, currentStep: step }));
    },
    [setData]
  );

  const nextStep = useCallback(() => {
    setData((prev) => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 3) }));
  }, [setData]);

  const prevStep = useCallback(() => {
    setData((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 0) }));
  }, [setData]);

  const completeOnboarding = useCallback(() => {
    setData((prev) => ({ ...prev, isComplete: true }));
  }, [setData]);

  return { data, updateField, goToStep, nextStep, prevStep, completeOnboarding };
}
