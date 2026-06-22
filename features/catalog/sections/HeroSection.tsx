import Link from "next/link";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#f0f5f4] to-[#f8f9fb] py-20 px-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-[#191c1e]">
          Marketplace Terpercaya untuk{" "}
          <span className="text-[#00685f]">Penjual</span>,{" "}
          <span className="text-[#00685f]">Pembeli</span>, dan{" "}
          <span className="text-[#cc4636]">Kurir</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#6d7a77] leading-relaxed max-w-lg">
          Menghubungkan keindahan dan kekayaan Nusantara melalui platform
          perdagangan maritim yang aman, efisien, dan transparan untuk semua
          lapisan masyarakat Indonesia.
        </p>

        {/* Search bar + CTA */}
        <div className="flex w-full max-w-xl gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a77]"
            />
            <input
              type="text"
              placeholder="Cari kopi gayo, tenun ikat, atau kerajinan tangan..."
              className="w-full rounded-lg border border-[#bcc9c6] bg-white py-3 pl-9 pr-4 text-sm text-[#191c1e] placeholder:text-[#6d7a77] focus:border-[#00685f]/40 focus:outline-none"
            />
          </div>
          <Link
            href="/products"
            className="shrink-0 rounded-lg bg-[#cc4636] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b33d2f] transition-colors"
          >
            Mulai Belanja
          </Link>
        </div>
      </div>
    </section>
  );
}
