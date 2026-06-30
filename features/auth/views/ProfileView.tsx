"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileSection } from "@/features/auth/sections/ProfileSection";
import { Navbar } from "@/components/layout/Navbar";

export function ProfileView() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f8f9fb]">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#bee5fd]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#89f5e7]/20 blur-[120px]" />
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="relative z-10 flex-1 px-4 md:px-10 py-12">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl font-bold text-[#191c1e]">Profil Saya</h1>
          <p className="text-sm text-[#6d7a77] mt-1">Informasi akun dan ringkasan finansial</p>
        </div>
        <ProfileSection />
      </main>

      <footer className="relative z-10 w-full py-4 text-center">
        <p className="text-xs text-[#6d7a77]">© 2024 SEAPEDIA. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
