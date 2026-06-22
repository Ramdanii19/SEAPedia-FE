import { Search, Wallet, Bike } from "lucide-react";

const STEPS = [
  {
    icon: <Search size={24} className="text-[#00685f]" />,
    title: "Telusuri Produk",
    desc: "Cari dan temukan ribuan produk unik dari seluruh penjuru nusantara dengan mudah.",
  },
  {
    icon: <Wallet size={24} className="text-[#00685f]" />,
    title: "Bayar Pakai Dompet",
    desc: "Sistem pembayaran terintegrasi yang aman dan mendukung berbagai metode pembayaran lokal.",
  },
  {
    icon: <Bike size={24} className="text-[#00685f]" />,
    title: "Pesanan Diantar",
    desc: "Kurir terpercaya kami akan memastikan pesanan Anda tiba dengan selamat sampai tujuan.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-[#f8f9fb] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#191c1e] mb-12">
          Cara Kerja SEAPEDIA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#e8f5f3] flex items-center justify-center">
                {icon}
              </div>
              <h3 className="font-semibold text-[#191c1e]">{title}</h3>
              <p className="text-sm text-[#6d7a77] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
