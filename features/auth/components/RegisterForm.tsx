"use client";

import { useState } from "react";
import {
  User, Mail, Lock, Eye, EyeOff,
  ShoppingBag, Store, Car, ArrowRight,
} from "lucide-react";
import { useRegister } from "@/features/auth/hooks/useRegister";

const ROLE_OPTIONS = [
  { value: "BUYER" as const, label: "Pembeli", Icon: ShoppingBag },
  { value: "SELLER" as const, label: "Penjual", Icon: Store },
  { value: "DRIVER" as const, label: "Pengemudi", Icon: Car },
];

const inputClass =
  "block w-full py-3 bg-[#f2f4f6] border border-[#bcc9c6] rounded-lg text-sm text-[#191c1e] placeholder-[#6d7a77] focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] transition-all";

export function RegisterForm() {
  const { form, onSubmit, serverError, isSubmitting } = useRegister();
  const { register, formState: { errors }, watch, setValue } = form;
  const [showPassword, setShowPassword] = useState(false);
  const selectedRoles = watch("roles");

  function toggleRole(role: "BUYER" | "SELLER" | "DRIVER") {
    const current = selectedRoles ?? [];
    const next = current.includes(role)
      ? current.filter((r) => r !== role)
      : [...current, role];
    setValue("roles", next, { shouldValidate: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nama Lengkap */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#3d4947] px-1">Nama Lengkap</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <User size={17} className="text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
          </div>
          <input
            {...register("fullName")}
            placeholder="Masukkan nama lengkap"
            className={`${inputClass} pl-10 pr-3`}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-red-600 px-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#3d4947] px-1">Email</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Mail size={17} className="text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="contoh@seapedia.id"
            className={`${inputClass} pl-10 pr-3`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600 px-1">{errors.email.message}</p>
        )}
      </div>

      {/* Kata Sandi */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#3d4947] px-1">Kata Sandi</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Lock size={17} className="text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
          </div>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            className={`${inputClass} pl-10 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-[#6d7a77] hover:text-[#191c1e] transition-colors"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-600 px-1">{errors.password.message}</p>
        )}
      </div>

      {/* Pilih Peran */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#3d4947] px-1">
          Pilih Peran{" "}
          <span className="font-normal text-[#6d7a77]">(Dapat memilih lebih dari satu)</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ROLE_OPTIONS.map(({ value, label, Icon }) => {
            const selected = selectedRoles?.includes(value) ?? false;
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleRole(value)}
                className={`flex flex-col items-center gap-2 py-4 rounded-lg border-2 transition-all active:scale-95 ${
                  selected
                    ? "border-[#00685f] bg-[#00685f]/5 text-[#00685f]"
                    : "border-[#bcc9c6] bg-white text-[#3d4947] hover:border-[#00685f]/40 hover:bg-[#00685f]/5"
                }`}
              >
                <Icon size={22} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
        {errors.roles && (
          <p className="text-xs text-red-600 px-1">{errors.roles.message}</p>
        )}
      </div>

      {/* Terms */}
      <p className="text-xs text-center text-[#3d4947] leading-relaxed px-2">
        Dengan mendaftar, Anda menyetujui{" "}
        <a href="#" className="text-[#00685f] hover:underline">Syarat & Ketentuan</a>
        {" "}serta{" "}
        <a href="#" className="text-[#00685f] hover:underline">Kebijakan Privasi</a>
        {" "}SEAPEDIA.
      </p>

      {serverError && (
        <p className="text-sm text-red-600 text-center">{serverError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#cc4636] hover:bg-[#aa2e21] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting ? "Mendaftar..." : <><span>Daftar</span><ArrowRight size={18} /></>}
      </button>
    </form>
  );
}
