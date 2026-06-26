import { z } from "zod";

export const reviewSchema = z.object({
  reviewerName: z.string().min(2, "Nama minimal 2 karakter"),
  rating: z.number().int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z
    .string()
    .min(1, "Komentar tidak boleh kosong")
    .max(500, "Komentar maksimal 500 karakter"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
