import { Store as StoreIcon, Info } from "lucide-react";
import { Store } from "@/features/catalog/types/catalog.types";

type Props = { store: Store | null };

export function StoreBanner({ store }: Props) {
  if (!store) return null;

  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#00685f] flex items-center justify-center shrink-0">
          <StoreIcon size={14} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-[#6d7a77]">Pesanan dari toko</p>
          <p className="text-sm font-semibold text-[#191c1e]">{store.storeName}</p>
        </div>
      </div>
      <div className="flex items-start gap-1.5 text-xs text-[#6d7a77]">
        <Info size={12} className="shrink-0 mt-0.5" />
        <span>
          Keranjang hanya mendukung produk dari 1 toko per checkout. Untuk berbelanja dari toko lain, kosongkan keranjang terlebih dahulu.
        </span>
      </div>
    </div>
  );
}
