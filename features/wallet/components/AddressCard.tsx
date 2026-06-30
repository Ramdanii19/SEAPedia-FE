"use client";

import { MapPin, Pencil, Trash2, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Address } from "../types/wallet.types";

type Props = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  selectable?: boolean;
  onSelect?: (address: Address) => void;
  selected?: boolean;
};

export function AddressCard({
  address,
  onEdit,
  onDelete,
  selectable,
  onSelect,
  selected,
}: Props) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors ${
        selected
          ? "border-[#00685f] bg-[#00685f]/5"
          : "border-[#bcc9c6]/40 bg-white"
      } ${selectable ? "cursor-pointer hover:border-[#00685f]/60" : ""}`}
      onClick={selectable && onSelect ? () => onSelect(address) : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="shrink-0 text-[#6d7a77] mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">
              {address.recipientName}
            </p>
            <p className="text-xs text-[#6d7a77]">{address.phone}</p>
          </div>
        </div>

        {/* Default badge */}
        {address.isDefault && (
          <span className="flex items-center gap-1 shrink-0 rounded-full bg-[#00685f]/10 px-2 py-0.5 text-[10px] font-bold text-[#00685f] uppercase">
            <Star size={10} />
            Utama
          </span>
        )}
      </div>

      {/* Detail */}
      <p className="text-sm text-[#3d4947] leading-relaxed">
        {address.addressDetail}
      </p>

      {/* Actions — hidden when selectable mode */}
      {!selectable && (
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
          >
            <Pencil size={13} />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-[#cc4636]/40 text-[#cc4636] hover:bg-[#cc4636]/5"
            onClick={(e) => { e.stopPropagation(); onDelete(address._id); }}
          >
            <Trash2 size={13} />
            Hapus
          </Button>
        </div>
      )}

      {/* Selected indicator in selectable mode */}
      {selectable && selected && (
        <p className="flex items-center gap-1 text-xs font-medium text-[#00685f]"><Check size={12} />Dipilih</p>
      )}
    </div>
  );
}
