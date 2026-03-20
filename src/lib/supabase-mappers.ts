import type {
  WeddingProfile,
  Task,
  BudgetItem,
  Vendor,
  Guest,
  EventCategory,
  Perspective,
} from "./types/wedding";
import type {
  WeddingProfileRow,
  TaskRow,
  BudgetItemRow,
  VendorRow,
  GuestRow,
} from "./types/database";

export function profileFromRow(row: WeddingProfileRow): WeddingProfile {
  return {
    id: row.id,
    brideName: row.bride_name,
    groomName: row.groom_name,
    weddingDate: row.wedding_date,
    venue: row.venue ?? undefined,
    city: row.city ?? undefined,
    totalBudget: Number(row.total_budget),
    currency: row.currency,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function profileToInsert(
  profile: WeddingProfile,
  perspective: Perspective,
  selectedEvents: EventCategory[]
) {
  return {
    id: profile.id,
    bride_name: profile.brideName,
    groom_name: profile.groomName,
    wedding_date: profile.weddingDate,
    venue: profile.venue ?? null,
    city: profile.city ?? null,
    total_budget: profile.totalBudget,
    currency: profile.currency,
    perspective,
    selected_events: selectedEvents,
    onboarding_complete: true,
  };
}

export function taskFromRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    side: row.side as Task["side"],
    event: row.event as Task["event"],
    priority: row.priority as Task["priority"],
    status: row.status as Task["status"],
    assignee: row.assignee ?? undefined,
    assigneePhone: row.assignee_phone ?? undefined,
    dueDate: row.due_date ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function taskToInsert(task: Omit<Task, "id" | "createdAt" | "updatedAt">, profileId: string) {
  return {
    profile_id: profileId,
    title: task.title,
    description: task.description ?? null,
    side: task.side,
    event: task.event,
    priority: task.priority,
    status: task.status,
    assignee: task.assignee ?? null,
    assignee_phone: task.assigneePhone ?? null,
    due_date: task.dueDate ?? null,
  };
}

export function taskPatchToUpdate(patch: Partial<Task>) {
  const update: Record<string, unknown> = {};
  if (patch.title !== undefined) update.title = patch.title;
  if (patch.description !== undefined) update.description = patch.description ?? null;
  if (patch.side !== undefined) update.side = patch.side;
  if (patch.event !== undefined) update.event = patch.event;
  if (patch.priority !== undefined) update.priority = patch.priority;
  if (patch.status !== undefined) update.status = patch.status;
  if (patch.assignee !== undefined) update.assignee = patch.assignee ?? null;
  if (patch.assigneePhone !== undefined) update.assignee_phone = patch.assigneePhone ?? null;
  if (patch.dueDate !== undefined) update.due_date = patch.dueDate ?? null;
  return update;
}

export function budgetFromRow(row: BudgetItemRow): BudgetItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as BudgetItem["category"],
    side: row.side as BudgetItem["side"],
    event: row.event as BudgetItem["event"],
    estimatedCost: Number(row.estimated_cost),
    actualCost: row.actual_cost != null ? Number(row.actual_cost) : undefined,
    isPaid: row.is_paid,
    vendorId: row.vendor_id ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function budgetToInsert(item: Omit<BudgetItem, "id" | "createdAt" | "updatedAt">, profileId: string) {
  return {
    profile_id: profileId,
    title: item.title,
    category: item.category,
    side: item.side,
    event: item.event,
    estimated_cost: item.estimatedCost,
    actual_cost: item.actualCost ?? null,
    is_paid: item.isPaid ?? false,
    vendor_id: item.vendorId ?? null,
    notes: item.notes ?? null,
  };
}

export function budgetPatchToUpdate(patch: Partial<BudgetItem>) {
  const update: Record<string, unknown> = {};
  if (patch.title !== undefined) update.title = patch.title;
  if (patch.category !== undefined) update.category = patch.category;
  if (patch.side !== undefined) update.side = patch.side;
  if (patch.event !== undefined) update.event = patch.event;
  if (patch.estimatedCost !== undefined) update.estimated_cost = patch.estimatedCost;
  if (patch.actualCost !== undefined) update.actual_cost = patch.actualCost ?? null;
  if (patch.isPaid !== undefined) update.is_paid = patch.isPaid;
  if (patch.vendorId !== undefined) update.vendor_id = patch.vendorId ?? null;
  if (patch.notes !== undefined) update.notes = patch.notes ?? null;
  return update;
}

export function vendorFromRow(row: VendorRow): Vendor {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Vendor["category"],
    side: row.side as Vendor["side"],
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    instagram: row.instagram ?? undefined,
    quotedPrice: row.quoted_price != null ? Number(row.quoted_price) : undefined,
    finalPrice: row.final_price != null ? Number(row.final_price) : undefined,
    isBooked: row.is_booked,
    rating: row.rating ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function vendorToInsert(vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">, profileId: string) {
  return {
    profile_id: profileId,
    name: vendor.name,
    category: vendor.category,
    side: vendor.side,
    phone: vendor.phone ?? null,
    email: vendor.email ?? null,
    instagram: vendor.instagram ?? null,
    quoted_price: vendor.quotedPrice ?? null,
    final_price: vendor.finalPrice ?? null,
    is_booked: vendor.isBooked ?? false,
    rating: vendor.rating ?? null,
    notes: vendor.notes ?? null,
  };
}

export function vendorPatchToUpdate(patch: Partial<Vendor>) {
  const update: Record<string, unknown> = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.category !== undefined) update.category = patch.category;
  if (patch.side !== undefined) update.side = patch.side;
  if (patch.phone !== undefined) update.phone = patch.phone ?? null;
  if (patch.email !== undefined) update.email = patch.email ?? null;
  if (patch.instagram !== undefined) update.instagram = patch.instagram ?? null;
  if (patch.quotedPrice !== undefined) update.quoted_price = patch.quotedPrice ?? null;
  if (patch.finalPrice !== undefined) update.final_price = patch.finalPrice ?? null;
  if (patch.isBooked !== undefined) update.is_booked = patch.isBooked;
  if (patch.rating !== undefined) update.rating = patch.rating ?? null;
  if (patch.notes !== undefined) update.notes = patch.notes ?? null;
  return update;
}

export function guestFromRow(row: GuestRow): Guest {
  return {
    id: row.id,
    name: row.name,
    side: row.side as Guest["side"],
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    rsvpStatus: row.rsvp_status as Guest["rsvpStatus"],
    plusOnes: row.plus_ones,
    events: row.events as EventCategory[],
    tableNumber: row.table_number ?? undefined,
    dietaryNotes: row.dietary_notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function guestToInsert(guest: Omit<Guest, "id" | "createdAt" | "updatedAt">, profileId: string) {
  return {
    profile_id: profileId,
    name: guest.name,
    side: guest.side,
    phone: guest.phone ?? null,
    email: guest.email ?? null,
    rsvp_status: guest.rsvpStatus,
    plus_ones: guest.plusOnes,
    events: guest.events,
    table_number: guest.tableNumber ?? null,
    dietary_notes: guest.dietaryNotes ?? null,
  };
}

export function guestPatchToUpdate(patch: Partial<Guest>) {
  const update: Record<string, unknown> = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.side !== undefined) update.side = patch.side;
  if (patch.phone !== undefined) update.phone = patch.phone ?? null;
  if (patch.email !== undefined) update.email = patch.email ?? null;
  if (patch.rsvpStatus !== undefined) update.rsvp_status = patch.rsvpStatus;
  if (patch.plusOnes !== undefined) update.plus_ones = patch.plusOnes;
  if (patch.events !== undefined) update.events = patch.events;
  if (patch.tableNumber !== undefined) update.table_number = patch.tableNumber ?? null;
  if (patch.dietaryNotes !== undefined) update.dietary_notes = patch.dietaryNotes ?? null;
  return update;
}
