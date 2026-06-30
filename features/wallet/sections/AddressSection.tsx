"use client";

import { AddressCard } from "../components/AddressCard";
import { Address } from "../types/wallet.types";

type Props = {
  addresses: Address[];
  isLoading: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onAddClick: () => void;
};

export function AddressSection({
  addresses,
  isLoading,
  onEdit,
  onDelete,
  onSetDefault,
  onAddClick,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#bcc9c6] py-14 text-center">
        <p className="text-sm text-[#6d7a77]">Belum ada alamat tersimpan.</p>
        <button
          onClick={onAddClick}
          className="mt-1 text-sm text-[#00685f] font-medium hover:underline"
        >
          Tambah sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {addresses.map((addr) => (
        <AddressCard
          key={addr._id}
          address={addr}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
