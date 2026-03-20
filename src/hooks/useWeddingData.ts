"use client";

import { useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type {
  WeddingProfile,
  Task,
  BudgetItem,
  Vendor,
  Guest,
  DashboardStats,
  EventCategory,
} from "@/lib/types/wedding";
import { differenceInDays } from "date-fns";

const EMPTY_PROFILE: WeddingProfile = {
  id: "",
  brideName: "",
  groomName: "",
  weddingDate: new Date().toISOString(),
  totalBudget: 0,
  currency: "INR",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function uid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

export function useWeddingData() {
  const [profile, setProfile] = useLocalStorage<WeddingProfile>("shaadios-profile", EMPTY_PROFILE);
  const [tasks, setTasks] = useLocalStorage<Task[]>("shaadios-tasks", []);
  const [budgetItems, setBudgetItems] = useLocalStorage<BudgetItem[]>("shaadios-budget", []);
  const [vendors, setVendors] = useLocalStorage<Vendor[]>("shaadios-vendors", []);
  const [guests, setGuests] = useLocalStorage<Guest[]>("shaadios-guests", []);
  const [selectedEvents] = useLocalStorage<EventCategory[]>("shaadios-events", []);

  // --- Profile ---
  const updateProfile = useCallback(
    (patch: Partial<WeddingProfile>) => {
      setProfile((prev) => ({ ...prev, ...patch, updatedAt: now() }));
    },
    [setProfile]
  );

  // --- Tasks CRUD ---
  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      setTasks((prev) => [...prev, { ...task, id: uid(), createdAt: now(), updatedAt: now() }]);
    },
    [setTasks]
  );
  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now() } : t))
      );
    },
    [setTasks]
  );
  const deleteTask = useCallback(
    (id: string) => { setTasks((prev) => prev.filter((t) => t.id !== id)); },
    [setTasks]
  );

  // --- Budget CRUD ---
  const addBudgetItem = useCallback(
    (item: Omit<BudgetItem, "id" | "createdAt" | "updatedAt">) => {
      setBudgetItems((prev) => [...prev, { ...item, id: uid(), createdAt: now(), updatedAt: now() }]);
    },
    [setBudgetItems]
  );
  const updateBudgetItem = useCallback(
    (id: string, patch: Partial<BudgetItem>) => {
      setBudgetItems((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...patch, updatedAt: now() } : b))
      );
    },
    [setBudgetItems]
  );
  const deleteBudgetItem = useCallback(
    (id: string) => { setBudgetItems((prev) => prev.filter((b) => b.id !== id)); },
    [setBudgetItems]
  );

  // --- Vendors CRUD ---
  const addVendor = useCallback(
    (vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">) => {
      setVendors((prev) => [...prev, { ...vendor, id: uid(), createdAt: now(), updatedAt: now() }]);
    },
    [setVendors]
  );
  const updateVendor = useCallback(
    (id: string, patch: Partial<Vendor>) => {
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...patch, updatedAt: now() } : v))
      );
    },
    [setVendors]
  );
  const deleteVendor = useCallback(
    (id: string) => { setVendors((prev) => prev.filter((v) => v.id !== id)); },
    [setVendors]
  );

  // --- Guests CRUD ---
  const addGuest = useCallback(
    (guest: Omit<Guest, "id" | "createdAt" | "updatedAt">) => {
      setGuests((prev) => [...prev, { ...guest, id: uid(), createdAt: now(), updatedAt: now() }]);
    },
    [setGuests]
  );
  const updateGuest = useCallback(
    (id: string, patch: Partial<Guest>) => {
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...patch, updatedAt: now() } : g))
      );
    },
    [setGuests]
  );
  const deleteGuest = useCallback(
    (id: string) => { setGuests((prev) => prev.filter((g) => g.id !== id)); },
    [setGuests]
  );

  // --- Computed stats ---
  const stats: DashboardStats = useMemo(() => {
    const today = new Date();
    const weddingDate = new Date(profile.weddingDate);
    const daysUntilWedding = Math.max(0, differenceInDays(weddingDate, today));

    const spentBudget = budgetItems.reduce((sum, item) => sum + (item.actualCost ?? 0), 0);
    const brideSideBudget = budgetItems
      .filter((i) => i.side === "bride")
      .reduce((sum, i) => sum + (i.actualCost ?? i.estimatedCost), 0);
    const groomSideBudget = budgetItems
      .filter((i) => i.side === "groom")
      .reduce((sum, i) => sum + (i.actualCost ?? i.estimatedCost), 0);
    const sharedBudget = budgetItems
      .filter((i) => i.side === "shared")
      .reduce((sum, i) => sum + (i.actualCost ?? i.estimatedCost), 0);

    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const pendingTasks = tasks.filter(
      (t) => t.status === "pending" || t.status === "in_progress"
    ).length;
    const overdueTasks = tasks.filter((t) => {
      if (t.status === "done" || t.status === "cancelled") return false;
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < today;
    }).length;

    const totalGuests = guests.reduce((sum, g) => sum + 1 + g.plusOnes, 0);
    const confirmedGuests = guests
      .filter((g) => g.rsvpStatus === "confirmed")
      .reduce((sum, g) => sum + 1 + g.plusOnes, 0);

    const bookedVendors = vendors.filter((v) => v.isBooked).length;

    return {
      totalBudget: profile.totalBudget,
      spentBudget,
      brideSideBudget,
      groomSideBudget,
      sharedBudget,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalGuests,
      confirmedGuests,
      totalVendors: vendors.length,
      bookedVendors,
      daysUntilWedding,
    };
  }, [profile, tasks, budgetItems, vendors, guests]);

  return {
    profile, updateProfile,
    tasks, addTask, updateTask, deleteTask,
    budgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem,
    vendors, addVendor, updateVendor, deleteVendor,
    guests, addGuest, updateGuest, deleteGuest,
    selectedEvents,
    stats,
  };
}
