import { z } from "zod";

const SELECTABLE_ROLES = ["SELLER", "BUYER", "DRIVER"] as const;

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  roles: z
    .array(z.enum(SELECTABLE_ROLES))
    .min(1, "Pilih minimal 1 role"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
