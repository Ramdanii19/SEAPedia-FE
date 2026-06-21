import Link from "next/link";
import { Shield } from "lucide-react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export function RegisterSection() {
  return (
    <>
      {/* Branding */}
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-[#00685f]">SEAPEDIA</h1>
        <p className="text-[#3d4947] mt-2 text-[15px]">Mulai perjalanan maritim Anda hari ini</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl p-8 shadow-[0px_24px_48px_rgba(15,58,77,0.08)] border border-[#bcc9c6]/30">
        <h2 className="text-lg font-semibold text-[#191c1e] mb-6 text-center">Buat Akun Baru</h2>

        <RegisterForm />

        <div className="relative my-6">
          <span className="w-full border-t border-[#bcc9c6]/50 block" />
        </div>

        <p className="text-center text-sm text-[#3d4947]">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="text-[#00685f] font-bold hover:underline underline-offset-4 decoration-2"
          >
            Masuk Sekarang
          </Link>
        </p>
      </div>

      {/* Security badges */}
      <div className="flex justify-center gap-8 mt-6">
        <div className="flex items-center gap-1.5 text-[#6d7a77]">
          <Shield size={14} />
          <span className="text-xs">Enkripsi AES-256</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#6d7a77]">
          <Shield size={14} />
          <span className="text-xs">Privasi Terjaga</span>
        </div>
      </div>
    </>
  );
}
