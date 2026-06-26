import { z } from "zod";

export const storeSchema = z.object({
  storeName: z.string().min(3, "Nama toko minimal 3 karakter"),
  description: z.string().optional(),
  addressDetail: z.string().optional(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;
