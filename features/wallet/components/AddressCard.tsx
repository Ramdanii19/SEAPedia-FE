"use client";

import { Pencil, Trash2, Check } from "lucide-react";
import { Address } from "../types/wallet.types";

type Props = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
  selectable?: boolean;
  onSelect?: (address: Address) => void;
  selected?: boolean;
};

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  selectable,
  onSelect,
  selected,
}: Props) {
  const displayLabel = address.label?.trim() || address.recipientName;

  return (
    <div
      className={`rounded-xl border bg-white overflow-hidden transition-colors ${
        address.isDefault
          ? "border-[#00685f]/30"
          : "border-[#bcc9c6]/40"
      } ${selected ? "ring-2 ring-[#00685f] ring-offset-1" : ""} ${
        selectable ? "cursor-pointer hover:border-[#00685f]/60" : ""
      }`}
      style={address.isDefault ? { borderLeftWidth: "4px", borderLeftColor: "#00685f" } : undefined}
      onClick={selectable && onSelect ? () => onSelect(address) : undefined}
    >
      <div className="p-4">
        {/* Header: label + UTAMA badge + action icons */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#191c1e]">{displayLabel}</p>
            {address.isDefault && (
              <span className="border border-[#00685f] text-[#00685f] text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase leading-none">
                UTAMA
              </span>
            )}
          </div>

          {!selectable ? (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(address); }}
                className="p-1.5 rounded text-[#6d7a77] hover:text-[#00685f] hover:bg-[#00685f]/5 transition-colors"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(address._id); }}
                className="p-1.5 rounded text-[#6d7a77] hover:text-[#cc4636] hover:bg-[#cc4636]/5 transition-colors"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : selected ? (
            <Check size={16} className="text-[#00685f] shrink-0 mt-0.5" />
          ) : null}
        </div>

        {/* Recipient name */}
        <p className="text-sm font-medium text-[#191c1e]">{address.recipientName}</p>

        {/* Phone */}
        <p className="text-xs text-[#6d7a77] mt-0.5">{address.phone}</p>

        {/* Address detail */}
        <p className="text-sm text-[#3d4947] mt-2 leading-relaxed">{address.addressDetail}</p>

        {/* Jadikan Utama link */}
        {!selectable && !address.isDefault && onSetDefault && (
          <button
            onClick={(e) => { e.stopPropagation(); onSetDefault(address._id); }}
            className="mt-3 text-xs font-medium text-[#00685f] hover:underline"
          >
            Jadikan Utama
          </button>
        )}
      </div>
    </div>
  );
}
