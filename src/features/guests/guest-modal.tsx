"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EVENT_META } from "@/lib/constants/events";
import { useWeddingData } from "@/hooks/useWeddingData";
import { cn } from "@/lib/utils";
import type { EventCategory, Guest, GuestRsvpStatus } from "@/lib/types/wedding";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  side: z.enum(["bride", "groom", "shared"]),
  phone: z.string().optional(),
  email: z.string().optional(),
  plusOnes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: Omit<Guest, "id" | "createdAt" | "updatedAt">) => void;
  editingGuest?: Guest | null;
  onUpdate?: (id: string, patch: Partial<Guest>) => void;
}

export function GuestModal({ isOpen, onClose, onAdd, editingGuest, onUpdate }: GuestModalProps) {
  const { selectedEvents: savedEvents } = useWeddingData();
  const [selectedEvents, setSelectedEvents] = useState<EventCategory[]>([]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", side: "shared", phone: "", email: "", plusOnes: "0" },
  });

  const isEditing = !!editingGuest;

  useEffect(() => {
    if (editingGuest) {
      reset({
        name: editingGuest.name,
        side: editingGuest.side,
        phone: editingGuest.phone ?? "",
        email: editingGuest.email ?? "",
        plusOnes: String(editingGuest.plusOnes),
      });
      setSelectedEvents(editingGuest.events);
    } else {
      reset({ name: "", side: "shared", phone: "", email: "", plusOnes: "0" });
      setSelectedEvents([]);
    }
  }, [editingGuest, reset]);

  const visibleEvents = savedEvents.length > 0 ? savedEvents : (Object.keys(EVENT_META) as EventCategory[]);

  const toggleEvent = (event: EventCategory) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const onSubmit = (values: FormValues) => {
    if (editingGuest && onUpdate) {
      onUpdate(editingGuest.id, {
        name: values.name,
        side: values.side,
        phone: values.phone || undefined,
        email: values.email || undefined,
        plusOnes: Number(values.plusOnes) || 0,
        events: selectedEvents,
      });
    } else {
      onAdd({
        name: values.name,
        side: values.side,
        phone: values.phone || undefined,
        email: values.email || undefined,
        rsvpStatus: "pending" as GuestRsvpStatus,
        plusOnes: Number(values.plusOnes) || 0,
        events: selectedEvents,
      });
    }
    reset();
    setSelectedEvents([]);
    onClose();
  };

  const dismiss = () => { reset(); setSelectedEvents([]); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={dismiss} size="lg" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="text-lg font-bold">{isEditing ? "Edit Guest" : "Add Guest"}</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="space-y-1.5">
              <Label>Guest Name</Label>
              <Controller name="name" control={control} render={({ field }) => (
                <Input {...field} placeholder="e.g. Sharma Family" />
              )} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Family Side</Label>
                <Controller name="side" control={control} render={({ field }) => (
                  <Select {...field}>
                    <option value="shared">Shared</option>
                    <option value="bride">Bride&apos;s Side</option>
                    <option value="groom">Groom&apos;s Side</option>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Plus Ones</Label>
                <Controller name="plusOnes" control={control} render={({ field }) => (
                  <Input {...field} type="number" placeholder="0" />
                )} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Controller name="phone" control={control} render={({ field }) => (
                  <Input {...field} placeholder="919876543210" />
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Controller name="email" control={control} render={({ field }) => (
                  <Input {...field} placeholder="guest@email.com" />
                )} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Attending Events</Label>
              <div className="flex flex-wrap gap-2">
                {visibleEvents.map((event) => {
                  const meta = EVENT_META[event];
                  const isSelected = selectedEvents.includes(event);
                  return (
                    <button key={event} type="button" onClick={() => toggleEvent(event)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                        isSelected
                          ? "border-accent-emerald bg-accent-emerald/10 text-accent-emerald"
                          : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
                      )}>
                      {meta.emoji} {meta.label}
                    </button>
                  );
                })}
              </div>
              {selectedEvents.length === 0 && (
                <p className="text-xs text-muted-foreground">Select at least one event</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={dismiss}>Cancel</Button>
            <Button type="submit" isDisabled={selectedEvents.length === 0}
              className="bg-accent-emerald font-semibold text-white">
              {isEditing ? "Save Changes" : "Add Guest"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
