import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export function LoginSection() {
  return (
    <>
      {/* Branding */}
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-[#00685f]">SEAPEDIA</h1>
        <h2 className="text-2xl font-semibold text-[#191c1e] mt-3">Selamat Datang Kembali</h2>
        <p className="text-[#3d4947] mt-1.5 text-[15px]">Akses pasar maritim premium Anda</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl p-8 shadow-[0px_24px_48px_rgba(15,58,77,0.08)] border border-[#bcc9c6]/30">
        <LoginForm />
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-[#3d4947] mt-6">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="text-[#00685f] font-bold hover:underline underline-offset-4 decoration-2"
        >
          Daftar
        </Link>
      </p>
    </>
  );
}
