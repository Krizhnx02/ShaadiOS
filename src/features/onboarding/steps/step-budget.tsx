"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "../types";

const QUICK_PICKS = [
  { label: "₹10L", value: "1000000" },
  { label: "₹25L", value: "2500000" },
  { label: "₹50L", value: "5000000" },
  { label: "₹1Cr", value: "10000000" },
  { label: "₹2Cr", value: "20000000" },
];

interface StepBudgetProps {
  data: OnboardingData;
  onUpdate: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
}

export function StepBudget({ data, onUpdate }: StepBudgetProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-gold/20 to-accent-emerald/20">
          <Wallet size={28} className="text-accent-gold" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          The Budget
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          What&apos;s the total wedding budget across both families?
          <br />
          You can always change this later.
        </p>
      </div>

      <div className="mx-auto max-w-sm space-y-5">
        <div className="space-y-2">
          <Label htmlFor="totalBudget" className="text-accent-gold">
            Total Budget
          </Label>
          <Input
            id="totalBudget"
            type="number"
            placeholder="e.g. 2500000"
            value={data.totalBudget}
            onChange={(e) => onUpdate("totalBudget", e.target.value)}
            icon={<span className="text-sm font-medium text-accent-gold">₹</span>}
            className="text-lg focus-visible:ring-accent-gold/40 focus-visible:border-accent-gold"
          />
          {data.totalBudget && Number(data.totalBudget) > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              {Number(data.totalBudget) >= 10000000
                ? `₹${(Number(data.totalBudget) / 10000000).toFixed(1)} Crore`
                : `₹${(Number(data.totalBudget) / 100000).toFixed(1)} Lakh`}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground text-center">Quick pick</p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_PICKS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate("totalBudget", value)}
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
                  data.totalBudget === value
                    ? "border-accent-gold bg-accent-gold/10 text-accent-gold shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-accent-gold/40 hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
