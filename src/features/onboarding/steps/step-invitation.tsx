"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, User, Phone } from "lucide-react";
import type { OnboardingData } from "../types";

interface StepInvitationProps {
  data: OnboardingData;
  onUpdate: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
}

export function StepInvitation({ data, onUpdate }: StepInvitationProps) {
  const sideName = data.userSide === "bride"
    ? `${data.brideName || "Bride"}'s`
    : `${data.groomName || "Groom"}'s`;

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-emerald/20 to-accent-gold/20">
          <Send size={28} className="text-accent-emerald" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          The Invitation
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Add your first family coordinator from {sideName} side.
          <br />
          They&apos;ll help you manage tasks and vendors.
        </p>
      </div>

      <div className="mx-auto max-w-sm space-y-5">
        <div className="space-y-2">
          <Label htmlFor="coordinatorName" className="text-accent-emerald">
            Coordinator&apos;s Name
          </Label>
          <Input
            id="coordinatorName"
            placeholder="e.g. Mummy, Chacha ji, Best Friend"
            value={data.coordinatorName}
            onChange={(e) => onUpdate("coordinatorName", e.target.value)}
            icon={<User size={16} />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coordinatorContact" className="text-accent-gold">
            Phone or Email
          </Label>
          <Input
            id="coordinatorContact"
            placeholder="e.g. +91 98765 43210 or email@example.com"
            value={data.coordinatorContact}
            onChange={(e) => onUpdate("coordinatorContact", e.target.value)}
            icon={<Phone size={16} />}
            className="focus-visible:ring-accent-gold/40 focus-visible:border-accent-gold"
          />
          <p className="text-xs text-muted-foreground">
            We&apos;ll send them a WhatsApp or email invite later
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-sm rounded-xl border border-dashed border-accent-emerald/30 bg-accent-emerald/5 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          You can always add more family members later from the dashboard.
          <br />
          <span className="font-medium text-accent-emerald">This step is optional</span> — skip it if you like.
        </p>
      </div>
    </div>
  );
}
