"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/features/auth/hooks/useLogin";

const inputClass =
  "block w-full py-3 bg-[#f2f4f6] border border-[#bcc9c6] rounded-lg text-sm text-[#191c1e] placeholder-[#6d7a77] focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] transition-all";

export function LoginForm() {
  const { form, onSubmit, serverError, isSubmitting } = useLogin();
  const { register, formState: { errors } } = form;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            placeholder="nama@email.com"
            className={`${inputClass} pl-10 pr-3`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600 px-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-1">
          <label className="text-sm font-medium text-[#3d4947]">Kata Sandi</label>
          <a href="#" className="text-xs text-[#00685f] hover:underline">Lupa Sandi?</a>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Lock size={17} className="text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
          </div>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
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

      {/* Remember me */}
      <div className="flex items-center gap-2 px-1">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded border-[#bcc9c6] text-[#00685f] focus:ring-[#00685f]/20 accent-[#00685f]"
        />
        <label htmlFor="remember" className="text-sm text-[#3d4947] cursor-pointer">
          Ingat saya di perangkat ini
        </label>
      </div>

      {serverError && (
        <p className="text-sm text-red-600 text-center">{serverError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-[#cc4636] hover:bg-[#aa2e21] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting ? "Memproses..." : "Masuk"}
      </button>

      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#bcc9c6]/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-[10px] font-semibold uppercase tracking-widest text-[#6d7a77]">
            Atau masuk dengan
          </span>
        </div>
      </div>

      {/* Social login (UI only) */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 border border-[#bcc9c6] rounded-lg hover:bg-[#e6e8ea] transition-colors active:scale-95 text-sm font-medium text-[#191c1e]"
        >
          <span className="text-base font-bold text-[#4285F4]">G</span>
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 border border-[#bcc9c6] rounded-lg hover:bg-[#e6e8ea] transition-colors active:scale-95 text-sm font-medium text-[#191c1e]"
        >
          <span className="text-base font-bold text-[#1877F2]">f</span>
          Facebook
        </button>
      </div>
    </form>
  );
}
