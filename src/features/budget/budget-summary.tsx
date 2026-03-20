"use client";

import { ProgressRing } from "@/components/ui/progress-ring";
import { formatINR, formatINRCompact } from "@/lib/utils";
import { usePerspective } from "@/hooks";
import type { BudgetItem } from "@/lib/types/wedding";
import { cn } from "@/lib/utils";

interface BudgetSummaryProps {
  items: BudgetItem[];
  totalBudget: number;
}

export function BudgetSummary({ items, totalBudget }: BudgetSummaryProps) {
  const { isBlurred } = usePerspective();

  const totalEstimated = items.reduce((sum, i) => sum + i.estimatedCost, 0);
  const totalActual = items.reduce((sum, i) => sum + (i.actualCost ?? 0), 0);
  const paidAmount = items.filter((i) => i.isPaid).reduce((sum, i) => sum + (i.actualCost ?? i.estimatedCost), 0);

  const brideTotal = items.filter((i) => i.side === "bride").reduce((sum, i) => sum + (i.actualCost ?? i.estimatedCost), 0);
  const groomTotal = items.filter((i) => i.side === "groom").reduce((sum, i) => sum + (i.actualCost ?? i.estimatedCost), 0);
  const sharedTotal = items.filter((i) => i.side === "shared").reduce((sum, i) => sum + (i.actualCost ?? i.estimatedCost), 0);

  const spentPercent = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total Wedding Budget</p>
          <p className="text-2xl font-bold">{formatINR(totalBudget)}</p>
        </div>
        <ProgressRing
          progress={spentPercent}
          size={80}
          strokeWidth={6}
          color={spentPercent > 90 ? "#DC2626" : "var(--accent-gold)"}
          label={`${Math.round(spentPercent)}%`}
          sublabel="Used"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Estimated</p>
          <p className="text-sm font-semibold">{formatINRCompact(totalEstimated)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Actual</p>
          <p className="text-sm font-semibold text-accent-gold">{formatINRCompact(totalActual)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="text-sm font-semibold text-accent-emerald">{formatINRCompact(paidAmount)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">By Family</h4>
        {[
          { label: "Bride's Side", amount: brideTotal, color: "bg-bride-pink", side: "bride" as const },
          { label: "Groom's Side", amount: groomTotal, color: "bg-groom-blue", side: "groom" as const },
          { label: "Shared", amount: sharedTotal, color: "bg-shared-green", side: "shared" as const },
        ].map(({ label, amount, color, side }) => {
          const percent = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
          return (
            <div key={label} className={cn(isBlurred(side) && "blur-privacy")}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{formatINRCompact(amount)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", color)}
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
