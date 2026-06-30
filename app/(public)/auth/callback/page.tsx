"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SESSION_KEYS } from "@/lib/session";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login?error=oauth_failed");
      return;
    }

    localStorage.setItem(SESSION_KEYS.TOKEN, token);
    router.replace("/select-role");
  }, [searchParams, router]);

  return <div className="min-h-screen bg-[#f8f9fb]" />;
}
