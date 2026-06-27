"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AddressCard } from "../components/AddressCard";
import { AddressForm } from "../components/AddressForm";
import { useAddresses } from "../hooks/useAddresses";
import { Address } from "../types/wallet.types";
import { AddressFormValues } from "../schema/wallet.schema";

export function AddressSection() {
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress } =
    useAddresses();

  const [editTarget, setEditTarget] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreate() {
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(address: Address) {
    setEditTarget(address);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditTarget(null);
  }

  async function handleFormSubmit(values: AddressFormValues) {
    if (editTarget) {
      await updateAddress(editTarget.id, values);
    } else {
      await createAddress(values);
    }
    closeForm();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAddress(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 max-w-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#191c1e]">Daftar Alamat</p>
          <Button
            size="sm"
            onClick={openCreate}
            className="gap-1.5 bg-[#00685f] hover:bg-[#005049]"
          >
            <Plus size={14} />
            Tambah Alamat
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#bcc9c6] py-10 text-center">
            <p className="text-sm text-[#6d7a77]">Belum ada alamat tersimpan.</p>
            <button
              onClick={openCreate}
              className="mt-1 text-sm text-[#00685f] font-medium hover:underline"
            >
              Tambah sekarang
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={openEdit}
                onDelete={(id) =>
                  setDeleteTarget(addresses.find((a) => a.id === id) ?? null)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      <Dialog open={showForm} onOpenChange={(v) => !v && closeForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit Alamat" : "Tambah Alamat"}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            defaultValues={
              editTarget
                ? {
                    recipientName: editTarget.recipientName,
                    phone: editTarget.phone,
                    addressDetail: editTarget.addressDetail,
                    isDefault: editTarget.isDefault,
                  }
                : undefined
            }
            onSuccess={handleFormSubmit}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Hapus Alamat</DialogTitle>
            <DialogDescription>
              Hapus alamat{" "}
              <span className="font-medium text-[#191c1e]">
                &ldquo;{deleteTarget?.recipientName}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              disabled={isDeleting}
              className="bg-[#cc4636] hover:bg-[#b03a2e] text-white"
              onClick={handleDelete}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
