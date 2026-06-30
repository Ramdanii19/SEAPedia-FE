import { z } from "zod";

export const topupSchema = z.object({
  amount: z.number().positive("Jumlah top-up harus lebih dari 0"),
});

export type TopupFormValues = z.infer<typeof topupSchema>;

export const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(2, "Nama penerima minimal 2 karakter"),
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{8,13}$/, "Nomor HP minimal 9 digit"),
  addressDetail: z.string().min(5, "Alamat terlalu pendek"),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
