"use client";

import { StoreForm } from "../components/StoreForm";

export function StoreManagementSection() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[#191c1e]">Profil Toko</h1>
        <p className="text-sm text-[#6d7a77] mt-1">
          Kelola informasi toko Anda di SEAPEDIA.
        </p>
      </div>

      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-6">
        <StoreForm />
      </div>
    </div>
  );
}
