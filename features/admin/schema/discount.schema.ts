import { z } from "zod";

export const voucherSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  code: z.string().min(1, "Kode wajib diisi").toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FIXED"], {
    required_error: "Pilih tipe diskon",
  }),
  discountValue: z.number().positive("Nilai diskon harus lebih dari 0"),
  remainingUsage: z.number().int("Harus bilangan bulat").positive("Harus lebih dari 0"),
  expiryDate: z.string().min(1, "Tanggal kedaluwarsa wajib diisi"),
});

export const promoSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  code: z.string().min(1, "Kode wajib diisi").toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FIXED"], {
    required_error: "Pilih tipe diskon",
  }),
  discountValue: z.number().positive("Nilai diskon harus lebih dari 0"),
  expiryDate: z.string().min(1, "Tanggal kedaluwarsa wajib diisi"),
});

export type VoucherFormValues = z.infer<typeof voucherSchema>;
export type PromoFormValues = z.infer<typeof promoSchema>;
