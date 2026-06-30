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
          <a href="/forgot-password" className="text-xs text-[#00685f] hover:underline">Lupa Sandi?</a>
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

      <button
        type="button"
        onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`; }}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#bcc9c6] rounded-lg hover:bg-[#f2f4f6] transition-colors active:scale-95 text-sm font-medium text-[#191c1e]"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
        Masuk dengan Google
      </button>
    </form>
  );
}
