"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EVENT_META, PRIORITY_CONFIG } from "@/lib/constants/events";
import { useWeddingData } from "@/hooks/useWeddingData";
import type { EventCategory, Task } from "@/lib/types/wedding";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  side: z.enum(["bride", "groom", "shared"]),
  event: z.string().min(1, "Pick an event"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignee: z.string().optional(),
  assigneePhone: z.string().optional(),
  dueDate: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  editingTask?: Task | null;
  onUpdate?: (id: string, patch: Partial<Task>) => void;
}

export function TaskModal({ isOpen, onClose, onAdd, editingTask, onUpdate }: TaskModalProps) {
  const { selectedEvents: events } = useWeddingData();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", description: "", side: "shared",
      event: "", priority: "medium", assignee: "", assigneePhone: "", dueDate: "",
    },
  });

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description ?? "",
        side: editingTask.side,
        event: editingTask.event,
        priority: editingTask.priority,
        assignee: editingTask.assignee ?? "",
        assigneePhone: editingTask.assigneePhone ?? "",
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "",
      });
    } else {
      reset({
        title: "", description: "", side: "shared",
        event: "", priority: "medium", assignee: "", assigneePhone: "", dueDate: "",
      });
    }
  }, [editingTask, reset]);

  const onSubmit = (values: FormValues) => {
    if (editingTask && onUpdate) {
      onUpdate(editingTask.id, {
        title: values.title,
        description: values.description || undefined,
        side: values.side,
        event: values.event as EventCategory,
        priority: values.priority,
        assignee: values.assignee || undefined,
        assigneePhone: values.assigneePhone || undefined,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
      });
    } else {
      onAdd({
        title: values.title,
        description: values.description || undefined,
        side: values.side,
        event: values.event as EventCategory,
        priority: values.priority,
        status: "pending",
        assignee: values.assignee || undefined,
        assigneePhone: values.assigneePhone || undefined,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
      });
    }
    reset();
    onClose();
  };

  const visibleEvents = events.length > 0 ? events : (Object.keys(EVENT_META) as EventCategory[]);
  const dismiss = () => { reset(); onClose(); };
  const isEditing = !!editingTask;

  return (
    <Modal isOpen={isOpen} onClose={dismiss} size="lg" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="text-lg font-bold">{isEditing ? "Edit Task" : "Add Task"}</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="space-y-1.5">
              <Label>Task Title</Label>
              <Controller name="title" control={control} render={({ field }) => (
                <Input {...field} placeholder="e.g. Book photographer" />
              )} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Controller name="description" control={control} render={({ field }) => (
                <Input {...field} placeholder="Any extra details" />
              )} />
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
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Controller name="priority" control={control} render={({ field }) => (
                  <Select {...field}>
                    {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Controller name="dueDate" control={control} render={({ field }) => (
                  <Input {...field} type="date" />
                )} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Assignee</Label>
                <Controller name="assignee" control={control} render={({ field }) => (
                  <Input {...field} placeholder="e.g. Mummy" />
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone <span className="text-muted-foreground font-normal">(for nudge)</span></Label>
                <Controller name="assigneePhone" control={control} render={({ field }) => (
                  <Input {...field} placeholder="919876543210" />
                )} />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={dismiss}>Cancel</Button>
            <Button type="submit" className="bg-accent-emerald font-semibold text-white">
              {isEditing ? "Save Changes" : "Add Task"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
