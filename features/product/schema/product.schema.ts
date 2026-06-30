import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional(),
  price: z.number({ required_error: "Harga wajib diisi", invalid_type_error: "Harga wajib diisi" }).min(0, "Harga tidak boleh negatif"),
  stock: z.number({ required_error: "Stok wajib diisi", invalid_type_error: "Stok wajib diisi" }).int("Stok harus bilangan bulat").min(0, "Stok tidak boleh negatif"),
  imageUrl: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
