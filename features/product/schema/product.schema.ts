import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional(),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  stock: z.number().int("Stok harus bilangan bulat").min(0, "Stok tidak boleh negatif"),
  imageUrl: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productSchema>;
