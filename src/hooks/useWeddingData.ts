"use client";

import { useWedding } from "@/contexts/wedding-context";

export function useWeddingData() {
  const ctx = useWedding();
  return {
    profile: ctx.profile,
    updateProfile: ctx.updateProfile,
    tasks: ctx.tasks,
    addTask: ctx.addTask,
    updateTask: ctx.updateTask,
    deleteTask: ctx.deleteTask,
    budgetItems: ctx.budgetItems,
    addBudgetItem: ctx.addBudgetItem,
    updateBudgetItem: ctx.updateBudgetItem,
    deleteBudgetItem: ctx.deleteBudgetItem,
    vendors: ctx.vendors,
    addVendor: ctx.addVendor,
    updateVendor: ctx.updateVendor,
    deleteVendor: ctx.deleteVendor,
    guests: ctx.guests,
    addGuest: ctx.addGuest,
    updateGuest: ctx.updateGuest,
    deleteGuest: ctx.deleteGuest,
    selectedEvents: ctx.selectedEvents,
    stats: ctx.stats,
  };
}
