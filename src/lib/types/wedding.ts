import { z } from "zod";

export const FamilySide = z.enum(["bride", "groom", "shared"]);
export type FamilySide = z.infer<typeof FamilySide>;

export const EventCategory = z.enum([
  "mehendi",
  "sangeet",
  "haldi",
  "baraat",
  "pheras",
  "reception",
  "engagement",
  "other",
]);
export type EventCategory = z.infer<typeof EventCategory>;

export const TaskPriority = z.enum(["low", "medium", "high", "urgent"]);
export type TaskPriority = z.infer<typeof TaskPriority>;

export const TaskStatus = z.enum([
  "pending",
  "in_progress",
  "done",
  "cancelled",
]);
export type TaskStatus = z.infer<typeof TaskStatus>;

export const VendorCategory = z.enum([
  "venue",
  "catering",
  "photography",
  "videography",
  "decoration",
  "music",
  "makeup",
  "mehendi_artist",
  "pandit",
  "transport",
  "invitation",
  "jewellery",
  "clothing",
  "other",
]);
export type VendorCategory = z.infer<typeof VendorCategory>;

export const BudgetCategory = z.enum([
  "venue",
  "catering",
  "decoration",
  "photography",
  "clothing",
  "jewellery",
  "music",
  "makeup",
  "invitation",
  "transport",
  "gifts",
  "miscellaneous",
]);
export type BudgetCategory = z.infer<typeof BudgetCategory>;

export const GuestRsvpStatus = z.enum([
  "pending",
  "confirmed",
  "declined",
  "maybe",
]);
export type GuestRsvpStatus = z.infer<typeof GuestRsvpStatus>;

// --- Core Schemas ---

export const WeddingProfileSchema = z.object({
  id: z.string().uuid(),
  brideName: z.string().min(1),
  groomName: z.string().min(1),
  weddingDate: z.string().datetime(),
  venue: z.string().optional(),
  city: z.string().optional(),
  totalBudget: z.number().nonnegative(),
  currency: z.string().default("INR"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type WeddingProfile = z.infer<typeof WeddingProfileSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  side: FamilySide,
  event: EventCategory,
  priority: TaskPriority,
  status: TaskStatus,
  assignee: z.string().optional(),
  assigneePhone: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Task = z.infer<typeof TaskSchema>;

export const BudgetItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  category: BudgetCategory,
  side: FamilySide,
  event: EventCategory,
  estimatedCost: z.number().nonnegative(),
  actualCost: z.number().nonnegative().optional(),
  isPaid: z.boolean().default(false),
  vendorId: z.string().uuid().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type BudgetItem = z.infer<typeof BudgetItemSchema>;

export const VendorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: VendorCategory,
  side: FamilySide,
  phone: z.string().optional(),
  email: z.string().email().optional(),
  instagram: z.string().optional(),
  quotedPrice: z.number().nonnegative().optional(),
  finalPrice: z.number().nonnegative().optional(),
  isBooked: z.boolean().default(false),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Vendor = z.infer<typeof VendorSchema>;

export const FamilyMemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  relation: z.string().min(1),
  side: FamilySide,
  phone: z.string().optional(),
  role: z.string().optional(),
});
export type FamilyMember = z.infer<typeof FamilyMemberSchema>;

export const GuestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  side: FamilySide,
  phone: z.string().optional(),
  email: z.string().email().optional(),
  rsvpStatus: GuestRsvpStatus.default("pending"),
  plusOnes: z.number().int().nonnegative().default(0),
  events: z.array(EventCategory),
  tableNumber: z.string().optional(),
  dietaryNotes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Guest = z.infer<typeof GuestSchema>;

// --- Aggregated Dashboard Types ---

export interface DashboardStats {
  totalBudget: number;
  spentBudget: number;
  brideSideBudget: number;
  groomSideBudget: number;
  sharedBudget: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalGuests: number;
  confirmedGuests: number;
  totalVendors: number;
  bookedVendors: number;
  daysUntilWedding: number;
}

export interface FamilySideStats {
  side: FamilySide;
  budgetAllocated: number;
  budgetSpent: number;
  tasksTotal: number;
  tasksCompleted: number;
  guestsTotal: number;
  guestsConfirmed: number;
}

/**
 * Perspective determines which family side's data is visible.
 * 'all' shows everything; 'bride'/'groom' applies the privacy filter.
 */
export type Perspective = "all" | "bride" | "groom";
