"use client";

import { useState, useEffect } from "react";
import { Plus, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/features/catalog/types/catalog.types";
import { ProductForm } from "../components/ProductForm";
import { ProductRow } from "../components/ProductRow";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { useMyProducts } from "../hooks/useMyProducts";
import productService from "../service/product.service";
import storeService from "@/features/store/service/store.service";

export function ProductManagementSection() {
  const { products, isLoading, reload } = useMyProducts();
  const [formProduct, setFormProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [showNoStoreModal, setShowNoStoreModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    storeService.getMyStore()
      .then(() => setHasStore(true))
      .catch(() => setHasStore(false));
  }, []);

  function openCreate() {
    if (hasStore === false) {
      setShowNoStoreModal(true);
      return;
    }
    setFormProduct(null);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setFormProduct(product);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setFormProduct(null);
  }

  function handleFormSuccess() {
    closeForm();
    reload();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await productService.deleteProduct(deleteTarget._id);
    setDeleteTarget(null);
    reload();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#191c1e]">Produk Saya</h1>
          <p className="text-sm text-[#6d7a77] mt-0.5">
            Kelola produk yang Anda jual di SEAPEDIA.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-1.5 bg-[#00685f] hover:bg-[#005049]"
        >
          <Plus size={16} />
          Tambah Produk
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-14 text-center text-sm text-[#6d7a77]">
            Belum ada produk.{" "}
            <button onClick={openCreate} className="text-[#00685f] font-medium hover:underline">
              Tambah sekarang
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#bcc9c6]/30 bg-[#f8f9fb]">
                <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
                  Produk
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
                  Harga
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
                  Stok
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  onEdit={openEdit}
                  onDelete={(id) =>
                    setDeleteTarget(products.find((p) => p._id === id) ?? null)
                  }
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={showForm} onOpenChange={(v) => !v && closeForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formProduct ? "Edit Produk" : "Tambah Produk"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            productId={formProduct?._id}
            defaultValues={
              formProduct
                ? {
                    name: formProduct.name,
                    description: formProduct.description ?? "",
                    price: formProduct.price,
                    stock: formProduct.stock,
                    imageUrl: formProduct.imageUrl ?? "",
                  }
                : undefined
            }
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        productName={deleteTarget?.name ?? ""}
      />

      {/* No Store Modal */}
      <Dialog open={showNoStoreModal} onOpenChange={setShowNoStoreModal}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f5f4]">
              <Store size={26} className="text-[#00685f]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#191c1e]">Toko Belum Dibuat</h3>
              <p className="mt-1.5 text-sm text-[#6d7a77]">
                Anda belum memiliki toko. Buat toko terlebih dahulu sebelum menambahkan produk.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 pt-1">
              <Button
                onClick={() => router.push("/seller/store")}
                className="w-full bg-[#00685f] hover:bg-[#005049]"
              >
                Buat Toko Sekarang
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNoStoreModal(false)}
                className="w-full border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f4f6]"
              >
                Nanti Saja
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
