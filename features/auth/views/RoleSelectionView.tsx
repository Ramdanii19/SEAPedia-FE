"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { roleHome } from "@/utils/roleHome";
import { Role } from "@/features/auth/types/auth.types";
import { RoleSelectionSection } from "@/features/auth/sections/RoleSelectionSection";

export function RoleSelectionView() {
  const router = useRouter();
  const { user, activeRole, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace("/login"); return; }
    if (activeRole) { router.replace(roleHome(activeRole as unknown as Role)); return; }
  }, [isLoading, user, activeRole, router]);

  if (isLoading || !user) return null;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#f8f9fb]">
      {/* Mesh gradient */}
      <div
        className="fixed inset-0 -z-10 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(at 0% 0%, #89f5e7 0%, transparent 50%), radial-gradient(at 100% 0%, #c2e8ff 0%, transparent 50%), radial-gradient(at 50% 100%, #f8f9fb 0%, transparent 50%)",
        }}
      />

      {/* Header */}
      <header className="w-full py-8 px-10 flex justify-center z-10">
        <h1 className="text-3xl font-bold tracking-tighter text-[#00685f]">SEAPEDIA</h1>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-10 py-8">
        <div className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <RoleSelectionSection />
        </div>
      </main>

      <footer className="relative z-10 w-full py-4 text-center opacity-60">
        <p className="text-sm text-[#3d4947]">© 2024 SEAPEDIA. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
