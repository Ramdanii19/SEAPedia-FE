"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import apiClient from "@/services/apiClient";

const inputClass =
  "block w-full py-3 bg-[#f2f4f6] border border-[#bcc9c6] rounded-lg text-sm text-[#191c1e] placeholder-[#6d7a77] focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] transition-all";

type Step = "email" | "code" | "password" | "done";

export function ForgotPasswordView() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email }, { auth: false });
      setStep("code");
    } catch {
      setError("Gagal mengirim kode. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCodeNext(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Masukkan 6 digit kode.");
      return;
    }
    setError(null);
    setStep("password");
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await apiClient.post("/auth/reset-password", { email, code, newPassword }, { auth: false });
      setStep("done");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Kode tidak valid atau sudah kadaluarsa.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#f8f9fb]">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#bee5fd]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#89f5e7]/20 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-10 py-20">
        <div className="w-full max-w-md">
          {/* Branding */}
          <div className="flex flex-col items-center mb-8 text-center">
            <h1 className="text-5xl font-bold tracking-tighter text-[#00685f]">SEAPEDIA</h1>
            <h2 className="text-2xl font-semibold text-[#191c1e] mt-3">
              {step === "email" && "Lupa Password?"}
              {step === "code" && "Masukkan Kode"}
              {step === "password" && "Reset Password"}
              {step === "done" && "Password Berhasil Direset"}
            </h2>
            <p className="text-[#3d4947] mt-1.5 text-[15px]">
              {step === "email" && "Masukkan email untuk mendapatkan kode reset"}
              {step === "code" && `Kode telah dikirim ke ${email}`}
              {step === "password" && "Masukkan password baru untuk akun Anda"}
              {step === "done" && "Silakan login dengan password baru Anda"}
            </p>
          </div>

          {/* Step indicators */}
          {step !== "done" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {(["email", "code", "password"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s ? "bg-[#00685f] text-white" :
                    (["email", "code", "password"].indexOf(step) > i) ? "bg-[#00685f]/20 text-[#00685f]" :
                    "bg-[#e6e8ea] text-[#6d7a77]"
                  }`}>
                    {i + 1}
                  </div>
                  {i < 2 && <div className={`w-8 h-0.5 ${["email", "code", "password"].indexOf(step) > i ? "bg-[#00685f]/40" : "bg-[#e6e8ea]"}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Card */}
          <div className="bg-white rounded-xl p-8 shadow-[0px_24px_48px_rgba(15,58,77,0.08)] border border-[#bcc9c6]/30">

            {/* Step 1: Email */}
            {step === "email" && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#3d4947] px-1">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Mail size={17} className="text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className={`${inputClass} pl-10 pr-3`}
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#00685f] hover:bg-[#005049] text-white font-semibold rounded-lg transition-all mt-2 disabled:opacity-60"
                >
                  {isLoading ? "Mengirim..." : "Kirim Kode"}
                </button>
              </form>
            )}

            {/* Step 2: Code */}
            {step === "code" && (
              <form onSubmit={handleCodeNext} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#3d4947] px-1">Kode Verifikasi</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <KeyRound size={17} className="text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="6 digit kode"
                      className={`${inputClass} pl-10 pr-3 tracking-widest text-center text-lg font-bold`}
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#00685f] hover:bg-[#005049] text-white font-semibold rounded-lg transition-all mt-2"
                >
                  Verifikasi Kode
                </button>
                <button
                  type="button"
                  onClick={() => { setError(null); handleSendCode({ preventDefault: () => {} } as React.FormEvent); }}
                  disabled={isLoading}
                  className="w-full text-sm text-[#00685f] hover:underline disabled:opacity-50"
                >
                  {isLoading ? "Mengirim ulang..." : "Kirim ulang kode"}
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === "password" && (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#3d4947] px-1">Password Baru</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock size={17} className="text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className={`${inputClass} pl-10 pr-10`}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#6d7a77] hover:text-[#191c1e] transition-colors">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#3d4947] px-1">Konfirmasi Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock size={17} className="text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
                    </div>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className={`${inputClass} pl-10 pr-10`}
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#6d7a77] hover:text-[#191c1e] transition-colors">
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#00685f] hover:bg-[#005049] text-white font-semibold rounded-lg transition-all mt-2 disabled:opacity-60"
                >
                  {isLoading ? "Menyimpan..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Step 4: Done */}
            {step === "done" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle size={56} className="text-[#00685f]" />
                <p className="text-sm text-[#3d4947] text-center">Password Anda berhasil diperbarui. Silakan login kembali.</p>
                <button
                  onClick={() => router.replace("/login")}
                  className="w-full py-3.5 bg-[#00685f] hover:bg-[#005049] text-white font-semibold rounded-lg transition-all"
                >
                  Ke Halaman Login
                </button>
              </div>
            )}
          </div>

          {step !== "done" && (
            <div className="flex items-center justify-center mt-6">
              <Link href="/login" className="flex items-center gap-1.5 text-sm text-[#3d4947] hover:text-[#00685f] transition-colors">
                <ArrowLeft size={15} />
                Kembali ke Login
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 w-full py-4 text-center">
        <p className="text-xs text-[#6d7a77]">© 2024 SEAPEDIA. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
