"use client";

import { Store as StoreIcon, MapPin, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useStoreForm } from "../hooks/useStoreForm";

export function StoreForm() {
  const {
    form,
    existingStore,
    isLoadingStore,
    isSubmitting,
    successMessage,
    error,
    isEdit,
    onSubmit,
  } = useStoreForm();

  const {
    register,
    formState: { errors },
  } = form;

  if (isLoadingStore) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Ringkasan toko aktif */}
      {existingStore && (
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-[#f8f9fb] p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#00685f] flex items-center justify-center shrink-0">
              <StoreIcon size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#191c1e]">
                {existingStore.storeName}
              </p>
              <p className="text-xs text-[#00685f] font-medium">Toko Aktif</p>
            </div>
          </div>
          {existingStore.description && (
            <div className="flex gap-2 text-sm text-[#3d4947]">
              <FileText size={14} className="shrink-0 mt-0.5 text-[#6d7a77]" />
              <span>{existingStore.description}</span>
            </div>
          )}
          {existingStore.addressDetail && (
            <div className="flex gap-2 text-sm text-[#3d4947]">
              <MapPin size={14} className="shrink-0 mt-0.5 text-[#6d7a77]" />
              <span>{existingStore.addressDetail}</span>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* Nama Toko */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#191c1e]">
            Nama Toko <span className="text-[#cc4636]">*</span>
          </label>
          <Input
            placeholder="Contoh: Toko Ikan Segar Pak Budi"
            {...register("storeName")}
            aria-invalid={!!errors.storeName}
          />
          {errors.storeName && (
            <p className="text-xs font-medium text-[#cc4636]">
              {errors.storeName.message}
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#191c1e]">
            Deskripsi Toko
          </label>
          <Textarea
            placeholder="Ceritakan tentang toko Anda..."
            rows={4}
            {...register("description")}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Alamat */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#191c1e]">
            Alamat Toko
          </label>
          <Input
            placeholder="Jl. Contoh No. 1, Kota..."
            {...register("addressDetail")}
            aria-invalid={!!errors.addressDetail}
          />
          {errors.addressDetail && (
            <p className="text-xs text-red-500">
              {errors.addressDetail.message}
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#cc4636]">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="rounded-lg bg-[#00685f]/10 px-3 py-2 text-sm text-[#00685f]">
            {successMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#00685f] hover:bg-[#005049]"
        >
          {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Toko"}
        </Button>
      </form>
    </div>
  );
}
