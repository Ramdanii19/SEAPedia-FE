"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { roleHome } from "@/utils/roleHome";
import { Role } from "@/features/auth/types/auth.types";
import { RegisterSection } from "@/features/auth/sections/RegisterSection";

export function RegisterView() {
  const router = useRouter();
  const { user, activeRole, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !user) return;
    const dest = activeRole ? roleHome(activeRole as unknown as Role) : "/select-role";
    router.replace(dest);
  }, [isLoading, user, activeRole, router]);

  if (isLoading || user) return null;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#f8f9fb]">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#bee5fd]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#89f5e7]/20 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-10 py-20">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <RegisterSection />
        </div>
      </main>

      <footer className="relative z-10 w-full py-4 text-center">
        <p className="text-xs text-[#6d7a77]">© 2024 SEAPEDIA. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
