"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Progress } from "@heroui/react";
import { ArrowLeft, ArrowRight, Sparkles, Heart, Lightbulb } from "lucide-react";
import { useOnboarding } from "./use-onboarding";
import { WEDDING_TIPS, type OnboardingData } from "./types";
import { StepVision } from "./steps/step-vision";
import { StepBudget } from "./steps/step-budget";
import { StepScope } from "./steps/step-scope";
import { StepSide } from "./steps/step-side";
import { StepInvitation } from "./steps/step-invitation";

const TOTAL_STEPS = 5;
const STEP_TITLES = ["The Vision", "The Budget", "The Scope", "The Side", "The Invitation"] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { data, updateField, completeOnboarding } = useOnboarding();
  const [step, setStep] = useState(data.currentStep);
  const [direction, setDirection] = useState(0);

  const lastStep = TOTAL_STEPS - 1;

  const goNext = useCallback(() => {
    if (step < lastStep) {
      setDirection(1);
      const next = step + 1;
      setStep(next);
      updateField("currentStep", next);
    }
  }, [step, lastStep, updateField]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      const prev = step - 1;
      setStep(prev);
      updateField("currentStep", prev);
    }
  }, [step, updateField]);

  const handleFinish = useCallback(() => {
    completeOnboarding();
    onComplete(data);
  }, [completeOnboarding, onComplete, data]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return data.brideName.trim().length > 0
          && data.groomName.trim().length > 0
          && data.weddingDate.length > 0;
      case 1:
        return data.totalBudget.length > 0 && Number(data.totalBudget) > 0;
      case 2:
        return data.selectedEvents.length > 0;
      case 3:
        return data.userSide !== null;
      case 4:
        return true;
      default:
        return false;
    }
  }, [step, data]);

  const progressValue = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-8">
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-accent-emerald" fill="currentColor" />
          <span className="text-base font-bold tracking-tight">
            Shaadi<span className="text-accent-gold">OS</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <div className="hidden sm:flex gap-1.5">
            {STEP_TITLES.map((title, i) => (
              <div
                key={title}
                className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-accent-emerald" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="sm:hidden px-4 pt-3">
        <Progress
          aria-label="Onboarding progress"
          value={progressValue}
          size="sm"
          classNames={{ indicator: "bg-accent-emerald", track: "bg-border" }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {step === 0 && <StepVision data={data} onUpdate={updateField} />}
              {step === 1 && <StepBudget data={data} onUpdate={updateField} />}
              {step === 2 && <StepScope data={data} onUpdate={updateField} />}
              {step === 3 && <StepSide data={data} onUpdate={updateField} />}
              {step === 4 && <StepInvitation data={data} onUpdate={updateField} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-border bg-accent-gold/5 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-lg items-start gap-2.5">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent-gold" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {WEDDING_TIPS[step]}
          </p>
        </div>
      </div>

      <footer className="border-t border-border px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Button
            variant="flat"
            onPress={goBack}
            isDisabled={step === 0}
            startContent={<ArrowLeft size={16} />}
            className="text-muted-foreground"
          >
            Back
          </Button>

          {step < lastStep ? (
            <Button
              color="primary"
              onPress={goNext}
              isDisabled={!canProceed}
              endContent={<ArrowRight size={16} />}
              className="bg-accent-emerald font-semibold text-white"
            >
              Continue
            </Button>
          ) : (
            <Button
              color="primary"
              onPress={handleFinish}
              endContent={<Sparkles size={16} />}
              className="bg-gradient-to-r from-accent-emerald to-accent-gold font-semibold text-white shadow-lg"
            >
              Launch ShaadiOS
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
