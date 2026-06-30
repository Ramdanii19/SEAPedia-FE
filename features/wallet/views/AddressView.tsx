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
import { AddressSection } from "../sections/AddressSection";
import { AddressForm } from "../components/AddressForm";
import { useAddresses } from "../hooks/useAddresses";
import { Address } from "../types/wallet.types";
import { AddressFormValues } from "../schema/wallet.schema";

export function AddressView() {
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress, setDefault } =
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
      await updateAddress(editTarget._id, values);
    } else {
      await createAddress(values);
    }
    closeForm();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAddress(deleteTarget._id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="p-6 flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#191c1e]">Alamat Pengiriman</h1>
          <p className="text-sm text-[#6d7a77] mt-1">
            Kelola daftar alamat pengiriman untuk memudahkan checkout.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="shrink-0 gap-2 bg-[#00685f] hover:bg-[#005049]"
        >
          <Plus size={16} />
          Tambah Alamat Baru
        </Button>
      </div>

      <AddressSection
        addresses={addresses}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={(id) => setDeleteTarget(addresses.find((a) => a._id === id) ?? null)}
        onSetDefault={setDefault}
        onAddClick={openCreate}
      />

      {/* Create / Edit dialog */}
      <Dialog open={showForm} onOpenChange={(v) => !v && closeForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit Alamat" : "Tambah Alamat Baru"}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            defaultValues={
              editTarget
                ? {
                    label: editTarget.label ?? "",
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
                &ldquo;{deleteTarget?.label || deleteTarget?.recipientName}&rdquo;
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
    </main>
  );
}
