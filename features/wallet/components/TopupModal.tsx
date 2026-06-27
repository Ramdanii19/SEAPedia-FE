"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { topupSchema, TopupFormValues } from "../schema/wallet.schema";
import { formatRupiah } from "@/utils/formatRupiah";

const PRESETS = [50_000, 100_000, 250_000, 500_000];

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
};

export function TopupModal({ open, onClose, onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TopupFormValues>({
    resolver: zodResolver(topupSchema),
    defaultValues: { amount: 0 },
  });

  async function submit(values: TopupFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values.amount);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up Saldo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
          {/* Preset amounts */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[#191c1e]">Pilih Nominal</p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setValue("amount", preset, { shouldValidate: true })}
                  className="rounded-lg border border-[#bcc9c6]/60 bg-[#f8f9fb] py-2.5 text-sm font-medium text-[#191c1e] hover:border-[#00685f] hover:bg-[#00685f]/5 transition-colors"
                >
                  {formatRupiah(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Free input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#191c1e]">
              Atau Masukkan Nominal Lain
            </label>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <Input
                  type="number"
                  min={1}
                  placeholder="Contoh: 75000"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00685f] hover:bg-[#005049]"
            >
              {isSubmitting ? "Memproses..." : "Top Up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
