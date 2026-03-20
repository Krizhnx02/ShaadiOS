"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { VENDOR_CATEGORY_LABELS } from "@/lib/constants/events";
import type { VendorCategory, Vendor } from "@/lib/types/wedding";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Pick a category"),
  side: z.enum(["bride", "groom", "shared"]),
  phone: z.string().optional(),
  email: z.string().optional(),
  instagram: z.string().optional(),
  quotedPrice: z.string().optional(),
  finalPrice: z.string().optional(),
  rating: z.string().optional(),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">) => void;
  editingVendor?: Vendor | null;
  onUpdate?: (id: string, patch: Partial<Vendor>) => void;
}

export function VendorModal({ isOpen, onClose, onAdd, editingVendor, onUpdate }: VendorModalProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", category: "", side: "shared", phone: "", email: "", instagram: "", quotedPrice: "", finalPrice: "", rating: "", notes: "" },
  });

  const isEditing = !!editingVendor;

  useEffect(() => {
    if (editingVendor) {
      reset({
        name: editingVendor.name,
        category: editingVendor.category,
        side: editingVendor.side,
        phone: editingVendor.phone ?? "",
        email: editingVendor.email ?? "",
        instagram: editingVendor.instagram ?? "",
        quotedPrice: editingVendor.quotedPrice !== undefined ? String(editingVendor.quotedPrice) : "",
        finalPrice: editingVendor.finalPrice !== undefined ? String(editingVendor.finalPrice) : "",
        rating: editingVendor.rating !== undefined ? String(editingVendor.rating) : "",
        notes: editingVendor.notes ?? "",
      });
    } else {
      reset({ name: "", category: "", side: "shared", phone: "", email: "", instagram: "", quotedPrice: "", finalPrice: "", rating: "", notes: "" });
    }
  }, [editingVendor, reset]);

  const onSubmit = (values: FormValues) => {
    if (editingVendor && onUpdate) {
      onUpdate(editingVendor.id, {
        name: values.name,
        category: values.category as VendorCategory,
        side: values.side,
        phone: values.phone || undefined,
        email: values.email || undefined,
        instagram: values.instagram || undefined,
        quotedPrice: values.quotedPrice ? Number(values.quotedPrice) : undefined,
        finalPrice: values.finalPrice ? Number(values.finalPrice) : undefined,
        rating: values.rating ? Number(values.rating) : undefined,
        notes: values.notes || undefined,
      });
    } else {
      onAdd({
        name: values.name,
        category: values.category as VendorCategory,
        side: values.side,
        phone: values.phone || undefined,
        email: values.email || undefined,
        instagram: values.instagram || undefined,
        quotedPrice: values.quotedPrice ? Number(values.quotedPrice) : undefined,
        isBooked: false,
        notes: values.notes || undefined,
      });
    }
    reset();
    onClose();
  };

  const dismiss = () => { reset(); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={dismiss} size="lg" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="text-lg font-bold">{isEditing ? "Edit Vendor" : "Add Vendor"}</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="space-y-1.5">
              <Label>Vendor Name</Label>
              <Controller name="name" control={control} render={({ field }) => (
                <Input {...field} placeholder="e.g. Taj Palace" />
              )} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Controller name="category" control={control} render={({ field }) => (
                  <Select {...field}>
                    <option value="">Select category</option>
                    {Object.entries(VENDOR_CATEGORY_LABELS).map(([key, label]) => (
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
                <Label>Phone</Label>
                <Controller name="phone" control={control} render={({ field }) => (
                  <Input {...field} placeholder="919876543210" />
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Controller name="email" control={control} render={({ field }) => (
                  <Input {...field} placeholder="vendor@email.com" />
                )} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Instagram</Label>
                <Controller name="instagram" control={control} render={({ field }) => (
                  <Input {...field} placeholder="@handle" />
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Quoted Price ({"\u20B9"})</Label>
                <Controller name="quotedPrice" control={control} render={({ field }) => (
                  <Input {...field} type="number" placeholder="200000" icon={<span className="text-xs text-muted-foreground">{"\u20B9"}</span>} />
                )} />
              </div>
            </div>
            {isEditing && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Final Price ({"\u20B9"})</Label>
                  <Controller name="finalPrice" control={control} render={({ field }) => (
                    <Input {...field} type="number" placeholder="Negotiated price" icon={<span className="text-xs text-muted-foreground">{"\u20B9"}</span>} />
                  )} />
                </div>
                <div className="space-y-1.5">
                  <Label>Rating (1-5)</Label>
                  <Controller name="rating" control={control} render={({ field }) => (
                    <Input {...field} type="number" placeholder="4.5" min="1" max="5" step="0.5" />
                  )} />
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={dismiss}>Cancel</Button>
            <Button type="submit" className="bg-accent-emerald font-semibold text-white">
              {isEditing ? "Save Changes" : "Add Vendor"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
