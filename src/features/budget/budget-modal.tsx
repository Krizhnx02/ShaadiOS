"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { BUDGET_CATEGORY_LABELS, EVENT_META } from "@/lib/constants/events";
import { useWeddingData } from "@/hooks/useWeddingData";
import type { EventCategory, BudgetCategory, BudgetItem } from "@/lib/types/wedding";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Pick a category"),
  side: z.enum(["bride", "groom", "shared"]),
  event: z.string().min(1, "Pick an event"),
  estimatedCost: z.string().min(1, "Enter an amount"),
  actualCost: z.string().optional(),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<BudgetItem, "id" | "createdAt" | "updatedAt">) => void;
  editingItem?: BudgetItem | null;
  onUpdate?: (id: string, patch: Partial<BudgetItem>) => void;
}

export function BudgetModal({ isOpen, onClose, onAdd, editingItem, onUpdate }: BudgetModalProps) {
  const { selectedEvents: events } = useWeddingData();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", category: "", side: "shared", event: "", estimatedCost: "", actualCost: "", notes: "" },
  });

  const isEditing = !!editingItem;

  useEffect(() => {
    if (editingItem) {
      reset({
        title: editingItem.title,
        category: editingItem.category,
        side: editingItem.side,
        event: editingItem.event,
        estimatedCost: String(editingItem.estimatedCost),
        actualCost: editingItem.actualCost !== undefined ? String(editingItem.actualCost) : "",
        notes: editingItem.notes ?? "",
      });
    } else {
      reset({ title: "", category: "", side: "shared", event: "", estimatedCost: "", actualCost: "", notes: "" });
    }
  }, [editingItem, reset]);

  const onSubmit = (values: FormValues) => {
    if (editingItem && onUpdate) {
      onUpdate(editingItem.id, {
        title: values.title,
        category: values.category as BudgetCategory,
        side: values.side,
        event: values.event as EventCategory,
        estimatedCost: Number(values.estimatedCost),
        actualCost: values.actualCost ? Number(values.actualCost) : undefined,
        notes: values.notes || undefined,
      });
    } else {
      onAdd({
        title: values.title,
        category: values.category as BudgetCategory,
        side: values.side,
        event: values.event as EventCategory,
        estimatedCost: Number(values.estimatedCost),
        isPaid: false,
        notes: values.notes || undefined,
      });
    }
    reset();
    onClose();
  };

  const visibleEvents = events.length > 0 ? events : (Object.keys(EVENT_META) as EventCategory[]);
  const dismiss = () => { reset(); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={dismiss} size="lg" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="text-lg font-bold">{isEditing ? "Edit Budget Item" : "Add Budget Item"}</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="space-y-1.5">
              <Label>Item Name</Label>
              <Controller name="title" control={control} render={({ field }) => (
                <Input {...field} placeholder="e.g. Venue Booking" />
              )} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Controller name="category" control={control} render={({ field }) => (
                  <Select {...field}>
                    <option value="">Select category</option>
                    {Object.entries(BUDGET_CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </Select>
                )} />
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>
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
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Event</Label>
                <Controller name="event" control={control} render={({ field }) => (
                  <Select {...field}>
                    <option value="">Select event</option>
                    {visibleEvents.map((e) => (
                      <option key={e} value={e}>{EVENT_META[e].emoji} {EVENT_META[e].label}</option>
                    ))}
                  </Select>
                )} />
                {errors.event && <p className="text-xs text-red-500">{errors.event.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Estimated Cost ({"\u20B9"})</Label>
                <Controller name="estimatedCost" control={control} render={({ field }) => (
                  <Input {...field} type="number" placeholder="500000" icon={<span className="text-xs text-muted-foreground">{"\u20B9"}</span>} />
                )} />
                {errors.estimatedCost && <p className="text-xs text-red-500">{errors.estimatedCost.message}</p>}
              </div>
            </div>
            {isEditing && (
              <div className="space-y-1.5">
                <Label>Actual Cost ({"\u20B9"}) <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Controller name="actualCost" control={control} render={({ field }) => (
                  <Input {...field} type="number" placeholder="Actual amount paid" icon={<span className="text-xs text-muted-foreground">{"\u20B9"}</span>} />
                )} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Controller name="notes" control={control} render={({ field }) => (
                <Input {...field} placeholder="Any details" />
              )} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={dismiss}>Cancel</Button>
            <Button type="submit" className="bg-accent-emerald font-semibold text-white">
              {isEditing ? "Save Changes" : "Add Item"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
