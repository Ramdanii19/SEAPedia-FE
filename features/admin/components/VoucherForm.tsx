"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { voucherSchema, VoucherFormValues } from "../schema/discount.schema";
import adminService from "../service/admin.service";

type Props = { onSuccess: () => void };

export function VoucherForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VoucherFormValues>({ resolver: zodResolver(voucherSchema) });

  async function onSubmit(values: VoucherFormValues) {
    try {
      await adminService.createVoucher(values);
      onSuccess();
    } catch (err: any) {
      setError("root", { message: err?.message ?? "Gagal membuat voucher." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#191c1e]">Nama</label>
        <Input placeholder="Nama voucher" {...register("name")} />
        {errors.name && <p className="text-xs text-[#cc4636]">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#191c1e]">Kode</label>
        <Input placeholder="KODE123" className="uppercase" {...register("code")} />
        {errors.code && <p className="text-xs text-[#cc4636]">{errors.code.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#191c1e]">Tipe Diskon</label>
        <select
          {...register("discountType")}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#00685f]"
        >
          <option value="">Pilih tipe</option>
          <option value="PERCENTAGE">Persentase (%)</option>
          <option value="FIXED">Nominal (Rp)</option>
        </select>
        {errors.discountType && <p className="text-xs text-[#cc4636]">{errors.discountType.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#191c1e]">Nilai Diskon</label>
        <Input
          type="number"
          placeholder="10"
          min={0}
          {...register("discountValue", { valueAsNumber: true })}
        />
        {errors.discountValue && <p className="text-xs text-[#cc4636]">{errors.discountValue.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#191c1e]">Sisa Pemakaian</label>
        <Input
          type="number"
          placeholder="100"
          min={1}
          {...register("remainingUsage", { valueAsNumber: true })}
        />
        {errors.remainingUsage && <p className="text-xs text-[#cc4636]">{errors.remainingUsage.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#191c1e]">Kedaluwarsa</label>
        <Input type="date" {...register("expiryDate")} />
        {errors.expiryDate && <p className="text-xs text-[#cc4636]">{errors.expiryDate.message}</p>}
      </div>

      {errors.root && (
        <p className="text-xs text-[#cc4636]">{errors.root.message}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#00685f] hover:bg-[#005049] text-white"
      >
        {isSubmitting ? "Menyimpan..." : "Buat Voucher"}
      </Button>
    </form>
  );
}
