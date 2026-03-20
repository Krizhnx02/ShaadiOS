"use client";

import { useState } from "react";
import { useWeddingData } from "@/hooks/useWeddingData";
import { GuestList } from "@/features/guests/guest-list";
import { GuestModal } from "@/features/guests/guest-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, Plus } from "lucide-react";
import type { Guest } from "@/lib/types/wedding";

export default function GuestsPage() {
  const { guests, addGuest, updateGuest, deleteGuest } = useWeddingData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const totalHeadcount = guests.reduce((sum, g) => sum + 1 + g.plusOnes, 0);
  const confirmedCount = guests
    .filter((g) => g.rsvpStatus === "confirmed")
    .reduce((sum, g) => sum + 1 + g.plusOnes, 0);

  const openAdd = () => { setEditingGuest(null); setIsModalOpen(true); };
  const openEdit = (guest: Guest) => { setEditingGuest(guest); setIsModalOpen(true); };
  const closeModal = () => { setEditingGuest(null); setIsModalOpen(false); };

  if (guests.length === 0) {
    return (
      <>
        <EmptyState
          icon={<Users size={28} />}
          title="No guests yet"
          description="Start building your guest list. Track RSVPs, manage plus-ones, and assign guests to events."
          action={
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-emerald/90 transition-colors">
              <Plus size={16} />Add Guest
            </button>
          }
        />
        <GuestModal isOpen={isModalOpen} onClose={closeModal} onAdd={addGuest}
          editingGuest={editingGuest} onUpdate={updateGuest} />
      </>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Guest List</h1>
          <p className="text-sm text-muted-foreground">{confirmedCount} confirmed of {totalHeadcount} total headcount</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-emerald/90 transition-colors">
          <Plus size={16} />Add Guest
        </button>
      </div>
      <GuestList guests={guests} onUpdate={updateGuest} onDelete={deleteGuest} onEditGuest={openEdit} />
      <GuestModal isOpen={isModalOpen} onClose={closeModal} onAdd={addGuest}
        editingGuest={editingGuest} onUpdate={updateGuest} />
    </div>
  );
}
