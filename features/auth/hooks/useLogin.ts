"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, LoginInput } from "@/features/auth/schema/auth.schema";
import authService from "@/features/auth/service/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { roleHome } from "@/utils/roleHome";

export function useLogin() {
  const router = useRouter();
  const { setSession, setActiveRole } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null);
    try {
      const res = await authService.login(data);
      const { user, token } = res.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSession(user as any, token);

      // Jika sudah ada activeRole (misal ADMIN), langsung ke dashboard-nya
      if (user.activeRole) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setActiveRole(user.activeRole as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push(roleHome(user.activeRole as any));
      } else {
        router.push("/select-role");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Login gagal, coba lagi.";
      setServerError(msg);
    }
  });

  return { form, onSubmit, serverError, isSubmitting: form.formState.isSubmitting };
}
