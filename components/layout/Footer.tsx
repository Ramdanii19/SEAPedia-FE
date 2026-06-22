import Link from "next/link";
import { Globe, Share2 } from "lucide-react";

const COLUMNS = [
  {
    title: "Tentang Kami",
    links: [
      { label: "Visi & Misi", href: "#" },
      { label: "Karir", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pusat Bantuan", href: "#" },
      { label: "Syarat & Ketentuan", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#191c1e] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="text-xl font-bold tracking-tighter text-[#6bd8cb]">SEAPEDIA</span>
            <p className="text-sm text-[#bcc9c6] leading-relaxed">
              Membangun ekosistem perdagangan digital yang merata dan
              berkelanjutan di seluruh kepulauan Indonesia.
            </p>
            <div className="flex gap-3 mt-1">
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-[#3d4947] flex items-center justify-center text-[#bcc9c6] hover:border-[#6bd8cb] hover:text-[#6bd8cb] transition-colors"
              >
                <Globe size={15} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-[#3d4947] flex items-center justify-center text-[#bcc9c6] hover:border-[#6bd8cb] hover:text-[#6bd8cb] transition-colors"
              >
                <Share2 size={15} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              {links.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-[#bcc9c6] hover:text-[#6bd8cb] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}

          {/* Download app */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">Unduh Aplikasi</h4>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 border border-[#3d4947] rounded-lg hover:border-[#6bd8cb] transition-colors w-fit"
            >
              <span className="text-xs text-[#bcc9c6] leading-tight">
                <span className="block text-[10px] uppercase tracking-wider opacity-70">Available on</span>
                <span className="font-semibold text-white">Google Play</span>
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 border border-[#3d4947] rounded-lg hover:border-[#6bd8cb] transition-colors w-fit"
            >
              <span className="text-xs text-[#bcc9c6] leading-tight">
                <span className="block text-[10px] uppercase tracking-wider opacity-70">Download on the</span>
                <span className="font-semibold text-white">App Store</span>
              </span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#3d4947] mt-10 pt-6 text-center">
          <p className="text-xs text-[#6d7a77]">
            © 2024 SEAPEDIA. Seluruh hak cipta dilindungi. — Marketplace multi-penjual produk bahari Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
