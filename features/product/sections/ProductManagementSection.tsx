"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Store, Package, AlertTriangle, EyeOff, Search } from "lucide-react";
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

const PAGE_SIZE = 10;

export function ProductManagementSection() {
  const { products, isLoading, reload } = useMyProducts();
  const [formProduct, setFormProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [showNoStoreModal, setShowNoStoreModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    storeService.getMyStore()
      .then(() => setHasStore(true))
      .catch(() => setHasStore(false));
  }, []);

  function openCreate() {
    if (hasStore === false) { setShowNoStoreModal(true); return; }
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

  // Stats
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  // Search + paginate
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#191c1e]">Kelola Produk</h1>
          <p className="text-sm text-[#6d7a77] mt-0.5">
            Atur stok, harga, dan informasi produk marketplace Anda.
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0 gap-1.5 bg-[#00685f] hover:bg-[#005049]">
          <Plus size={16} />
          Tambah Produk Baru
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#e8f4f3] flex items-center justify-center shrink-0">
            <Package size={18} className="text-[#00685f]" />
          </div>
          <div>
            <p className="text-xs text-[#6d7a77]">Total Produk</p>
            <p className="text-xl font-bold text-[#191c1e]">{isLoading ? "—" : totalProducts}</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#fff3e0] flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-[#e65100]" />
          </div>
          <div>
            <p className="text-xs text-[#6d7a77]">Stok Tipis</p>
            <p className="text-xl font-bold text-[#191c1e]">{isLoading ? "—" : lowStock}</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#fde8e6] flex items-center justify-center shrink-0">
            <EyeOff size={18} className="text-[#cc4636]" />
          </div>
          <div>
            <p className="text-xs text-[#6d7a77]">Stok Habis</p>
            <p className="text-xl font-bold text-[#191c1e]">{isLoading ? "—" : outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-[#bcc9c6]/30">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a77] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari nama produk..."
              className="w-full rounded-lg border border-[#bcc9c6] py-2 pl-9 pr-3 text-sm text-[#191c1e] placeholder:text-[#6d7a77] focus:border-[#00685f] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-14 text-center text-sm text-[#6d7a77]">
            {search ? `Tidak ada produk dengan nama "${search}".` : (
              <>Belum ada produk.{" "}
                <button onClick={openCreate} className="text-[#00685f] font-medium hover:underline">Tambah sekarang</button>
              </>
            )}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#bcc9c6]/30 bg-[#f8f9fb]">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide w-16">Foto</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">Nama Produk</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">Harga (Rp)</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">Stok</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onEdit={openEdit}
                    onDelete={(id) => setDeleteTarget(products.find((p) => p._id === id) ?? null)}
                  />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#bcc9c6]/30">
              <p className="text-xs text-[#6d7a77]">
                Menampilkan {paginated.length} dari {filtered.length} produk
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#bcc9c6] text-sm text-[#3d4947] hover:bg-[#f0f5f4] disabled:opacity-40 transition-colors"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page ? "bg-[#00685f] text-white" : "border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f0f5f4]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#bcc9c6] text-sm text-[#3d4947] hover:bg-[#f0f5f4] disabled:opacity-40 transition-colors"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={showForm} onOpenChange={(v) => !v && closeForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formProduct ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
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

      {/* Delete Confirm */}
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
              <Button onClick={() => router.push("/seller/store")} className="w-full bg-[#00685f] hover:bg-[#005049]">
                Buat Toko Sekarang
              </Button>
              <Button variant="outline" onClick={() => setShowNoStoreModal(false)} className="w-full border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f4f6]">
                Nanti Saja
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
