"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import {
  profileFromRow,
  profileToInsert,
  taskFromRow,
  taskToInsert,
  taskPatchToUpdate,
  budgetFromRow,
  budgetToInsert,
  budgetPatchToUpdate,
  vendorFromRow,
  vendorToInsert,
  vendorPatchToUpdate,
  guestFromRow,
  guestToInsert,
  guestPatchToUpdate,
} from "@/lib/supabase-mappers";
import { differenceInDays } from "date-fns";
import type {
  WeddingProfile,
  Task,
  BudgetItem,
  Vendor,
  Guest,
  DashboardStats,
  EventCategory,
  Perspective,
  FamilySide,
} from "@/lib/types/wedding";
import type { WeddingProfileRow, TaskRow, BudgetItemRow, VendorRow, GuestRow } from "@/lib/types/database";

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

interface WeddingContextValue {
  isLoading: boolean;
  onboardingComplete: boolean;

  profile: WeddingProfile;
  updateProfile: (patch: Partial<WeddingProfile>) => void;

  perspective: Perspective;
  setPerspective: (p: Perspective) => void;
  isVisible: (side: FamilySide) => boolean;
  isBlurred: (side: FamilySide) => boolean;

  selectedEvents: EventCategory[];

  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  budgetItems: BudgetItem[];
  addBudgetItem: (item: Omit<BudgetItem, "id" | "createdAt" | "updatedAt">) => void;
  updateBudgetItem: (id: string, patch: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;

  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">) => void;
  updateVendor: (id: string, patch: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  guests: Guest[];
  addGuest: (guest: Omit<Guest, "id" | "createdAt" | "updatedAt">) => void;
  updateGuest: (id: string, patch: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;

  stats: DashboardStats;

  completeOnboarding: (
    profile: WeddingProfile,
    perspective: Perspective,
    events: EventCategory[]
  ) => Promise<void>;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  const [profile, setProfile] = useState<WeddingProfile>(EMPTY_PROFILE);
  const [perspective, setPerspectiveState] = useState<Perspective>("all");
  const [selectedEvents, setSelectedEvents] = useState<EventCategory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("wedding_profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("onboarding_complete", true)
        .order("created_at", { ascending: false })
        .limit(1);
      const rows = data as WeddingProfileRow[] | null;

      const row = rows?.[0];
      if (!row) {
        setIsLoading(false);
        return;
      }

      setProfileId(row.id);
      setProfile(profileFromRow(row));
      setPerspectiveState(row.perspective as Perspective);
      setSelectedEvents(row.selected_events as EventCategory[]);
      setOnboardingComplete(true);

      const [taskRes, budgetRes, vendorRes, guestRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("profile_id", row.id).order("created_at"),
        supabase.from("budget_items").select("*").eq("profile_id", row.id).order("created_at"),
        supabase.from("vendors").select("*").eq("profile_id", row.id).order("created_at"),
        supabase.from("guests").select("*").eq("profile_id", row.id).order("created_at"),
      ]);

      if (taskRes.data) setTasks((taskRes.data as TaskRow[]).map(taskFromRow));
      if (budgetRes.data) setBudgetItems((budgetRes.data as BudgetItemRow[]).map(budgetFromRow));
      if (vendorRes.data) setVendors((vendorRes.data as VendorRow[]).map(vendorFromRow));
      if (guestRes.data) setGuests((guestRes.data as GuestRow[]).map(guestFromRow));

      setIsLoading(false);
    }

    load();
  }, [user]);

  const completeOnboarding = useCallback(
    async (p: WeddingProfile, persp: Perspective, events: EventCategory[]) => {
      if (!user) return;
      const insertData = { ...profileToInsert(p, persp, events), user_id: user.id };
      const result = await supabase
        .from("wedding_profiles")
        .insert(insertData)
        .select()
        .single();
      const profileRow = result.data as WeddingProfileRow | null;

      if (result.error || !profileRow) {
        console.error("Failed to create profile:", result.error);
        return;
      }

      setProfileId(profileRow.id);
      setProfile(profileFromRow(profileRow));
      setPerspectiveState(profileRow.perspective as Perspective);
      setSelectedEvents(profileRow.selected_events as EventCategory[]);
      setOnboardingComplete(true);
    },
    [user]
  );

  const updateProfile = useCallback(
    (patch: Partial<WeddingProfile>) => {
      if (!profileId) return;
      setProfile((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));

      const dbPatch: Record<string, unknown> = {};
      if (patch.brideName !== undefined) dbPatch.bride_name = patch.brideName;
      if (patch.groomName !== undefined) dbPatch.groom_name = patch.groomName;
      if (patch.weddingDate !== undefined) dbPatch.wedding_date = patch.weddingDate;
      if (patch.venue !== undefined) dbPatch.venue = patch.venue ?? null;
      if (patch.city !== undefined) dbPatch.city = patch.city ?? null;
      if (patch.totalBudget !== undefined) dbPatch.total_budget = patch.totalBudget;
      if (patch.currency !== undefined) dbPatch.currency = patch.currency;

      supabase.from("wedding_profiles").update(dbPatch).eq("id", profileId).then();
    },
    [profileId]
  );

  const setPerspective = useCallback(
    (p: Perspective) => {
      setPerspectiveState(p);
      if (profileId) {
        supabase.from("wedding_profiles").update({ perspective: p }).eq("id", profileId).then();
      }
    },
    [profileId]
  );

  const isVisible = useCallback(
    (side: FamilySide): boolean => {
      if (perspective === "all") return true;
      if (side === "shared") return true;
      return side === perspective;
    },
    [perspective]
  );

  const isBlurred = useCallback(
    (side: FamilySide): boolean => {
      if (perspective === "all") return false;
      if (side === "shared") return false;
      return side !== perspective;
    },
    [perspective]
  );

  // --- Tasks CRUD ---
  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      if (!profileId) return;
      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimistic: Task = { ...task, id: tempId, createdAt: now, updatedAt: now };
      setTasks((prev) => [...prev, optimistic]);

      supabase
        .from("tasks")
        .insert(taskToInsert(task, profileId))
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setTasks((prev) =>
              prev.map((t) => (t.id === tempId ? taskFromRow(data as TaskRow) : t))
            );
          }
        });
    },
    [profileId]
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
        )
      );
      supabase.from("tasks").update(taskPatchToUpdate(patch)).eq("id", id).then();
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    supabase.from("tasks").delete().eq("id", id).then();
  }, []);

  // --- Budget CRUD ---
  const addBudgetItem = useCallback(
    (item: Omit<BudgetItem, "id" | "createdAt" | "updatedAt">) => {
      if (!profileId) return;
      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimistic: BudgetItem = { ...item, id: tempId, createdAt: now, updatedAt: now };
      setBudgetItems((prev) => [...prev, optimistic]);

      supabase
        .from("budget_items")
        .insert(budgetToInsert(item, profileId))
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setBudgetItems((prev) =>
              prev.map((b) => (b.id === tempId ? budgetFromRow(data as BudgetItemRow) : b))
            );
          }
        });
    },
    [profileId]
  );

  const updateBudgetItem = useCallback(
    (id: string, patch: Partial<BudgetItem>) => {
      setBudgetItems((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b
        )
      );
      supabase.from("budget_items").update(budgetPatchToUpdate(patch)).eq("id", id).then();
    },
    []
  );

  const deleteBudgetItem = useCallback((id: string) => {
    setBudgetItems((prev) => prev.filter((b) => b.id !== id));
    supabase.from("budget_items").delete().eq("id", id).then();
  }, []);

  // --- Vendors CRUD ---
  const addVendor = useCallback(
    (vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">) => {
      if (!profileId) return;
      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimistic: Vendor = { ...vendor, id: tempId, createdAt: now, updatedAt: now };
      setVendors((prev) => [...prev, optimistic]);

      supabase
        .from("vendors")
        .insert(vendorToInsert(vendor, profileId))
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setVendors((prev) =>
              prev.map((v) => (v.id === tempId ? vendorFromRow(data as VendorRow) : v))
            );
          }
        });
    },
    [profileId]
  );

  const updateVendor = useCallback(
    (id: string, patch: Partial<Vendor>) => {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, ...patch, updatedAt: new Date().toISOString() } : v
        )
      );
      supabase.from("vendors").update(vendorPatchToUpdate(patch)).eq("id", id).then();
    },
    []
  );

  const deleteVendor = useCallback((id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    supabase.from("vendors").delete().eq("id", id).then();
  }, []);

  // --- Guests CRUD ---
  const addGuest = useCallback(
    (guest: Omit<Guest, "id" | "createdAt" | "updatedAt">) => {
      if (!profileId) return;
      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimistic: Guest = { ...guest, id: tempId, createdAt: now, updatedAt: now };
      setGuests((prev) => [...prev, optimistic]);

      supabase
        .from("guests")
        .insert(guestToInsert(guest, profileId))
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setGuests((prev) =>
              prev.map((g) => (g.id === tempId ? guestFromRow(data as GuestRow) : g))
            );
          }
        });
    },
    [profileId]
  );

  const updateGuest = useCallback(
    (id: string, patch: Partial<Guest>) => {
      setGuests((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, ...patch, updatedAt: new Date().toISOString() } : g
        )
      );
      supabase.from("guests").update(guestPatchToUpdate(patch)).eq("id", id).then();
    },
    []
  );

  const deleteGuest = useCallback((id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    supabase.from("guests").delete().eq("id", id).then();
  }, []);

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

  const value = useMemo<WeddingContextValue>(
    () => ({
      isLoading,
      onboardingComplete,
      profile,
      updateProfile,
      perspective,
      setPerspective,
      isVisible,
      isBlurred,
      selectedEvents,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      budgetItems,
      addBudgetItem,
      updateBudgetItem,
      deleteBudgetItem,
      vendors,
      addVendor,
      updateVendor,
      deleteVendor,
      guests,
      addGuest,
      updateGuest,
      deleteGuest,
      stats,
      completeOnboarding,
    }),
    [
      isLoading,
      onboardingComplete,
      profile,
      updateProfile,
      perspective,
      setPerspective,
      isVisible,
      isBlurred,
      selectedEvents,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      budgetItems,
      addBudgetItem,
      updateBudgetItem,
      deleteBudgetItem,
      vendors,
      addVendor,
      updateVendor,
      deleteVendor,
      guests,
      addGuest,
      updateGuest,
      deleteGuest,
      stats,
      completeOnboarding,
    ]
  );

  return (
    <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>
  );
}

export function useWedding() {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding must be used within <WeddingProvider>");
  return ctx;
}
