"use client";

import { useState } from "react";
import { useWeddingData } from "@/hooks/useWeddingData";
import { VendorList } from "@/features/vendors/vendor-list";
import { VendorModal } from "@/features/vendors/vendor-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Store, Plus } from "lucide-react";
import type { Vendor } from "@/lib/types/wedding";

export default function VendorsPage() {
  const { vendors, addVendor, updateVendor, deleteVendor } = useWeddingData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const bookedCount = vendors.filter((v) => v.isBooked).length;

  const openAdd = () => { setEditingVendor(null); setIsModalOpen(true); };
  const openEdit = (vendor: Vendor) => { setEditingVendor(vendor); setIsModalOpen(true); };
  const closeModal = () => { setEditingVendor(null); setIsModalOpen(false); };

  if (vendors.length === 0) {
    return (
      <>
        <EmptyState
          icon={<Store size={28} />}
          title="No vendors yet"
          description="Add and manage your wedding vendors. Compare quotes, track bookings, and follow up via WhatsApp."
          action={
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-emerald/90 transition-colors">
              <Plus size={16} />Add Vendor
            </button>
          }
        />
        <VendorModal isOpen={isModalOpen} onClose={closeModal} onAdd={addVendor}
          editingVendor={editingVendor} onUpdate={updateVendor} />
      </>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Vendors</h1>
          <p className="text-sm text-muted-foreground">{bookedCount} of {vendors.length} booked</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-emerald/90 transition-colors">
          <Plus size={16} />Add Vendor
        </button>
      </div>
      <VendorList vendors={vendors} onUpdate={updateVendor} onDelete={deleteVendor} onEditVendor={openEdit} />
      <VendorModal isOpen={isModalOpen} onClose={closeModal} onAdd={addVendor}
        editingVendor={editingVendor} onUpdate={updateVendor} />
    </div>
  );
}
