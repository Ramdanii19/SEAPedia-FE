"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addressSchema, AddressFormValues } from "../schema/wallet.schema";

type Props = {
  defaultValues?: Partial<AddressFormValues>;
  onSuccess: (values: AddressFormValues) => Promise<void>;
  onCancel?: () => void;
};

export function AddressForm({ defaultValues, onSuccess, onCancel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      recipientName: "",
      phone: "",
      addressDetail: "",
      isDefault: false,
      ...defaultValues,
    },
  });

  async function onSubmit(values: AddressFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSuccess(values);
    } catch (err: any) {
      setError(err?.message ?? "Gagal menyimpan alamat");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Label Alamat */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">
          Label Alamat
          <span className="text-[#6d7a77] font-normal ml-1">(opsional)</span>
        </label>
        <Input
          placeholder="cth: Rumah, Kantor, Kos"
          {...register("label")}
        />
      </div>

      {/* Nama Penerima */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">
          Nama Penerima <span className="text-[#cc4636]">*</span>
        </label>
        <Input
          placeholder="Nama lengkap penerima"
          {...register("recipientName")}
          aria-invalid={!!errors.recipientName}
        />
        {errors.recipientName && (
          <p className="text-xs text-red-500">{errors.recipientName.message}</p>
        )}
      </div>

      {/* Nomor Telepon */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">
          Nomor Telepon <span className="text-[#cc4636]">*</span>
        </label>
        <Input
          type="tel"
          placeholder="08xxxxxxxxxx"
          {...register("phone")}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Alamat Lengkap */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">
          Alamat Lengkap <span className="text-[#cc4636]">*</span>
        </label>
        <Input
          placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota"
          {...register("addressDetail")}
          aria-invalid={!!errors.addressDetail}
        />
        {errors.addressDetail && (
          <p className="text-xs text-red-500">{errors.addressDetail.message}</p>
        )}
      </div>

      {/* Jadikan Utama */}
      <Controller
        control={control}
        name="isDefault"
        render={({ field }) => (
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
            />
            <span className="text-sm text-[#3d4947]">Jadikan alamat utama</span>
          </label>
        )}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#cc4636]">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Batal
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#00685f] hover:bg-[#005049]"
        >
          {isSubmitting ? "Menyimpan..." : defaultValues?.recipientName ? "Simpan Perubahan" : "Tambah Alamat"}
        </Button>
      </div>
    </form>
  );
}
