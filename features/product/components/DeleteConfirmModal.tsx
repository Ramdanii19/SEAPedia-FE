"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productName: string;
};

export function DeleteConfirmModal({ open, onClose, onConfirm, productName }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Hapus Produk</DialogTitle>
          <DialogDescription>
            Hapus <span className="font-medium text-[#191c1e]">&ldquo;{productName}&rdquo;</span>?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Batal
          </Button>
          <Button
            disabled={isDeleting}
            className="bg-[#cc4636] hover:bg-[#b03a2e] text-white"
            onClick={handleConfirm}
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
