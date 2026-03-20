"use client";

import { useState } from "react";
import type { BudgetItem, FamilySide, BudgetCategory } from "@/lib/types/wedding";
import { SideBadge } from "@/components/ui/side-badge";
import { usePerspective } from "@/hooks";
import { formatINR } from "@/lib/utils";
import { BUDGET_CATEGORY_LABELS, EVENT_META } from "@/lib/constants/events";
import { cn } from "@/lib/utils";
import { Check, IndianRupee, Filter, Trash2, Pencil } from "lucide-react";

interface BudgetListProps {
  items: BudgetItem[];
  onUpdate: (id: string, patch: Partial<BudgetItem>) => void;
  onDelete: (id: string) => void;
  onEditItem?: (item: BudgetItem) => void;
}

export function BudgetList({ items, onUpdate, onDelete, onEditItem }: BudgetListProps) {
  const { isBlurred, isVisible } = usePerspective();
  const [filterSide, setFilterSide] = useState<FamilySide | "all">("all");
  const [filterCategory, setFilterCategory] = useState<BudgetCategory | "all">("all");

  const filtered = items
    .filter((item) => (filterSide === "all" || item.side === filterSide) && isVisible(item.side))
    .filter((item) => filterCategory === "all" || item.category === filterCategory);

  const totalEstimated = filtered.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = filtered.reduce((sum, item) => sum + (item.actualCost ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-muted-foreground" />
        <select value={filterSide} onChange={(e) => setFilterSide(e.target.value as FamilySide | "all")}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
          <option value="all">All Sides</option>
          <option value="bride">Bride&apos;s Side</option>
          <option value="groom">Groom&apos;s Side</option>
          <option value="shared">Shared</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as BudgetCategory | "all")}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
          <option value="all">All Categories</option>
          {Object.entries(BUDGET_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Estimated Total</p>
          <p className="text-xl font-bold text-accent-gold">{formatINR(totalEstimated)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Actual Spent</p>
          <p className="text-xl font-bold text-accent-emerald">{formatINR(totalActual)}</p>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((item) => (
          <div key={item.id}
            className={cn("rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm",
              isBlurred(item.side) && "blur-privacy")}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{EVENT_META[item.event].emoji}</span>
                  <h4 className="text-sm font-medium truncate">{item.title}</h4>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">{BUDGET_CATEGORY_LABELS[item.category]}</span>
                  <SideBadge side={item.side} />
                  <button onClick={() => onUpdate(item.id, { isPaid: !item.isPaid })}
                    className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors cursor-pointer",
                      item.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground hover:bg-amber-100 hover:text-amber-700")}>
                    <Check size={10} /> {item.isPaid ? "Paid" : "Mark Paid"}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <IndianRupee size={12} />
                    {(item.actualCost ?? item.estimatedCost).toLocaleString("en-IN")}
                  </div>
                  {item.actualCost !== undefined && item.actualCost !== item.estimatedCost && (
                    <p className="text-[10px] text-muted-foreground line-through">{formatINR(item.estimatedCost)}</p>
                  )}
                </div>
                {onEditItem && (
                  <button onClick={() => onEditItem(item)}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-blue-50 hover:text-blue-500 transition-colors"
                    title="Edit"><Pencil size={14} /></button>
                )}
                <button onClick={() => onDelete(item.id)}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
