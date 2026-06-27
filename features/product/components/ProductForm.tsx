"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProductForm } from "../hooks/useProductForm";
import { ProductFormValues } from "../schema/product.schema";

type Props = {
  productId?: number;
  defaultValues?: Partial<ProductFormValues>;
  onSuccess: () => void;
};

export function ProductForm({ productId, defaultValues, onSuccess }: Props) {
  const { form, isSubmitting, error, isEdit, imagePreview, onFileChange, onSubmit } =
    useProductForm({ productId, defaultValues, onSuccess });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Nama Produk */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">
          Nama Produk <span className="text-[#cc4636]">*</span>
        </label>
        <Input
          placeholder="Contoh: Ikan Tuna Segar 1 kg"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Deskripsi */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">Deskripsi</label>
        <Textarea
          placeholder="Jelaskan produk Anda..."
          rows={3}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Harga & Stok */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#191c1e]">
            Harga (Rp) <span className="text-[#cc4636]">*</span>
          </label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#191c1e]">
            Stok <span className="text-[#cc4636]">*</span>
          </label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            {...register("stock", { valueAsNumber: true })}
            aria-invalid={!!errors.stock}
          />
          {errors.stock && (
            <p className="text-xs text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Upload Gambar */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">
          Foto Produk
        </label>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#e6f2f1] file:text-[#00685f] hover:file:bg-[#ccebe8] cursor-pointer"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        {imagePreview && (
          <div className="relative mt-1 h-32 w-32 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={imagePreview}
              alt="Preview gambar produk"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#cc4636]">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#00685f] hover:bg-[#005049]"
      >
        {isSubmitting
          ? "Menyimpan..."
          : isEdit
          ? "Simpan Perubahan"
          : "Tambah Produk"}
      </Button>
    </form>
  );
}
