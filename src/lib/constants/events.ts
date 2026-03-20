import type { EventCategory, BudgetCategory, VendorCategory, TaskPriority } from "@/lib/types/wedding";

interface EventMeta {
  label: string;
  emoji: string;
  color: string;
}

export const EVENT_META: Record<EventCategory, EventMeta> = {
  mehendi: { label: "Mehendi", emoji: "🌿", color: "#059669" },
  sangeet: { label: "Sangeet", emoji: "🎵", color: "#7C3AED" },
  haldi: { label: "Haldi", emoji: "✨", color: "#D97706" },
  baraat: { label: "Baraat", emoji: "🐴", color: "#DC2626" },
  pheras: { label: "Pheras", emoji: "🔥", color: "#EA580C" },
  reception: { label: "Reception", emoji: "🥂", color: "#2563EB" },
  engagement: { label: "Engagement", emoji: "💍", color: "#DB2777" },
  other: { label: "Other", emoji: "📋", color: "#6B7280" },
};

export const BUDGET_CATEGORY_LABELS: Record<BudgetCategory, string> = {
  venue: "Venue",
  catering: "Catering",
  decoration: "Decoration",
  photography: "Photography",
  clothing: "Clothing",
  jewellery: "Jewellery",
  music: "Music & DJ",
  makeup: "Makeup & Hair",
  invitation: "Invitations",
  transport: "Transport",
  gifts: "Gifts & Favors",
  miscellaneous: "Miscellaneous",
};

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  venue: "Venue",
  catering: "Catering",
  photography: "Photography",
  videography: "Videography",
  decoration: "Decoration",
  music: "Music & DJ",
  makeup: "Makeup & Hair",
  mehendi_artist: "Mehendi Artist",
  pandit: "Pandit / Priest",
  transport: "Transport",
  invitation: "Invitations",
  jewellery: "Jewellery",
  clothing: "Clothing",
  other: "Other",
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "#6B7280" },
  medium: { label: "Medium", color: "#2563EB" },
  high: { label: "High", color: "#D97706" },
  urgent: { label: "Urgent", color: "#DC2626" },
};

export const FAMILY_SIDE_LABELS = {
  bride: "Bride's Side",
  groom: "Groom's Side",
  shared: "Shared",
} as const;

export const FAMILY_SIDE_COLORS = {
  bride: "#DB2777",
  groom: "#2563EB",
  shared: "#059669",
} as const;
