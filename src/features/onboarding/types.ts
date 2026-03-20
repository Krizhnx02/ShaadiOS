import { z } from "zod";
import { EventCategory } from "@/lib/types/wedding";

export const OnboardingSchema = z.object({
  currentStep: z.number().int().min(0).max(4),
  brideName: z.string(),
  groomName: z.string(),
  weddingDate: z.string(),
  totalBudget: z.string(),
  selectedEvents: z.array(EventCategory),
  userSide: z.enum(["bride", "groom"]).nullable(),
  coordinatorName: z.string(),
  coordinatorContact: z.string(),
  isComplete: z.boolean(),
});

export type OnboardingData = z.infer<typeof OnboardingSchema>;

export const ONBOARDING_INITIAL: OnboardingData = {
  currentStep: 0,
  brideName: "",
  groomName: "",
  weddingDate: "",
  totalBudget: "",
  selectedEvents: [],
  userSide: null,
  coordinatorName: "",
  coordinatorContact: "",
  isComplete: false,
};

export const WEDDING_TIPS = [
  "Pro Tip: Book your venue at least 6 months in advance — the best mandaps go fast!",
  "Pro Tip: Indian weddings average ₹15–50 lakhs. Set a realistic ceiling and track every rupee!",
  "Pro Tip: Mehendi artists get booked 4–5 months ahead during wedding season (Nov–Feb).",
  "Pro Tip: Assign a coordinator from each family early — it saves 100+ WhatsApp messages!",
  "Pro Tip: Share this with your coordinator now — they'll thank you on the wedding day!",
] as const;
