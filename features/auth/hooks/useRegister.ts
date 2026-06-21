"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterInput } from "@/features/auth/schema/auth.schema";
import authService from "@/features/auth/service/auth.service";

export function useRegister() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", roles: [] },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null);
    try {
      await authService.register(data);
      router.push("/login");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Registrasi gagal, coba lagi.";
      setServerError(msg);
    }
  });

  return { form, onSubmit, serverError, isSubmitting: form.formState.isSubmitting };
}
