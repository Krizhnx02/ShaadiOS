"use client";

import { useState } from "react";
import type { Vendor, FamilySide, VendorCategory } from "@/lib/types/wedding";
import { SideBadge } from "@/components/ui/side-badge";
import { usePerspective } from "@/hooks";
import { formatINR, generateWhatsAppLink, buildVendorFollowUpMessage, cn } from "@/lib/utils";
import { VENDOR_CATEGORY_LABELS } from "@/lib/constants/events";
import {
  Phone, Mail, Instagram, MessageCircle, Star, CheckCircle2, Filter, Trash2, Bookmark, Pencil,
} from "lucide-react";

interface VendorListProps {
  vendors: Vendor[];
  onUpdate: (id: string, patch: Partial<Vendor>) => void;
  onDelete: (id: string) => void;
  onEditVendor?: (vendor: Vendor) => void;
}

export function VendorList({ vendors, onUpdate, onDelete, onEditVendor }: VendorListProps) {
  const { isVisible, isBlurred } = usePerspective();
  const [filterSide, setFilterSide] = useState<FamilySide | "all">("all");
  const [filterCategory, setFilterCategory] = useState<VendorCategory | "all">("all");
  const [onlyBooked, setOnlyBooked] = useState(false);

  const filtered = vendors
    .filter((v) => (filterSide === "all" || v.side === filterSide) && isVisible(v.side))
    .filter((v) => filterCategory === "all" || v.category === filterCategory)
    .filter((v) => !onlyBooked || v.isBooked);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-muted-foreground" />
        <select value={filterSide} onChange={(e) => setFilterSide(e.target.value as FamilySide | "all")}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
          <option value="all">All Sides</option>
          <option value="bride">Bride&apos;s Side</option>
          <option value="groom">Groom&apos;s Side</option>
          <option value="shared">Shared</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as VendorCategory | "all")}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
          <option value="all">All Categories</option>
          {Object.entries(VENDOR_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={onlyBooked} onChange={(e) => setOnlyBooked(e.target.checked)} className="rounded" />
          Booked only
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} blurred={isBlurred(vendor.side)}
            onUpdate={onUpdate} onDelete={onDelete} onEdit={onEditVendor} />
        ))}
      </div>
    </div>
  );
}

function VendorCard({ vendor, blurred, onUpdate, onDelete, onEdit }: {
  vendor: Vendor; blurred: boolean;
  onUpdate: (id: string, patch: Partial<Vendor>) => void;
  onDelete: (id: string) => void;
  onEdit?: (vendor: Vendor) => void;
}) {
  const handleFollowUp = () => {
    if (!vendor.phone) return;
    const message = buildVendorFollowUpMessage(vendor.name, VENDOR_CATEGORY_LABELS[vendor.category]);
    window.open(generateWhatsAppLink(message, vendor.phone), "_blank");
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm", blurred && "blur-privacy")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium truncate">{vendor.name}</h4>
            {vendor.isBooked && <CheckCircle2 size={14} className="text-accent-emerald shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{VENDOR_CATEGORY_LABELS[vendor.category]}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <SideBadge side={vendor.side} />
            {vendor.rating && (
              <span className="inline-flex items-center gap-0.5 text-xs text-accent-gold">
                <Star size={10} fill="currentColor" />{vendor.rating}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="text-right shrink-0 space-y-1">
            {vendor.finalPrice !== undefined ? (
              <>
                <p className="text-sm font-semibold">{formatINR(vendor.finalPrice)}</p>
                {vendor.quotedPrice !== undefined && vendor.quotedPrice !== vendor.finalPrice && (
                  <p className="text-[10px] text-muted-foreground line-through">{formatINR(vendor.quotedPrice)}</p>
                )}
              </>
            ) : vendor.quotedPrice !== undefined ? (
              <p className="text-sm font-medium text-muted-foreground">{formatINR(vendor.quotedPrice)}</p>
            ) : null}
          </div>
          {onEdit && (
            <button onClick={() => onEdit(vendor)}
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-blue-50 hover:text-blue-500 transition-colors"
              title="Edit"><Pencil size={14} /></button>
          )}
          <button onClick={() => onDelete(vendor.id)}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Delete"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <button onClick={() => onUpdate(vendor.id, { isBooked: !vendor.isBooked })}
          className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors",
            vendor.isBooked ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground hover:bg-blue-50 hover:text-blue-600")}>
          <Bookmark size={10} /> {vendor.isBooked ? "Booked" : "Mark Booked"}
        </button>
        {vendor.phone && (
          <a href={`tel:${vendor.phone}`}
            className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <Phone size={10} /> Call
          </a>
        )}
        {vendor.email && (
          <a href={`mailto:${vendor.email}`}
            className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <Mail size={10} /> Email
          </a>
        )}
        {vendor.instagram && (
          <a href={`https://instagram.com/${vendor.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <Instagram size={10} /> IG
          </a>
        )}
        {vendor.phone && (
          <button onClick={handleFollowUp}
            className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-700 hover:bg-emerald-200 transition-colors ml-auto">
            <MessageCircle size={10} /> WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
