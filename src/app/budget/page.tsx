"use client";

import { useState } from "react";
import { useWeddingData } from "@/hooks/useWeddingData";
import { BudgetSummary } from "@/features/budget/budget-summary";
import { BudgetList } from "@/features/budget/budget-list";
import { BudgetModal } from "@/features/budget/budget-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Wallet, Plus } from "lucide-react";
import type { BudgetItem } from "@/lib/types/wedding";

export default function BudgetPage() {
  const { budgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem, profile } = useWeddingData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  const openAdd = () => { setEditingItem(null); setIsModalOpen(true); };
  const openEdit = (item: BudgetItem) => { setEditingItem(item); setIsModalOpen(true); };
  const closeModal = () => { setEditingItem(null); setIsModalOpen(false); };

  if (budgetItems.length === 0) {
    return (
      <>
        <EmptyState
          icon={<Wallet size={28} />}
          title="No budget items yet"
          description="Start planning your wedding budget. Track expenses across both families with full privacy controls."
          action={
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-emerald/90 transition-colors">
              <Plus size={16} />Add Budget Item
            </button>
          }
        />
        <BudgetModal isOpen={isModalOpen} onClose={closeModal} onAdd={addBudgetItem}
          editingItem={editingItem} onUpdate={updateBudgetItem} />
      </>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Budget Tracker</h1>
          <p className="text-sm text-muted-foreground">Track wedding expenses across families</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-emerald/90 transition-colors">
          <Plus size={16} />Add Item
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <BudgetSummary items={budgetItems} totalBudget={profile.totalBudget} />
        <BudgetList items={budgetItems} onUpdate={updateBudgetItem} onDelete={deleteBudgetItem} onEditItem={openEdit} />
      </div>
      <BudgetModal isOpen={isModalOpen} onClose={closeModal} onAdd={addBudgetItem}
        editingItem={editingItem} onUpdate={updateBudgetItem} />
    </div>
  );
}
