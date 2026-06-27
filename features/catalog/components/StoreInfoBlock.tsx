import Link from "next/link";
import { BadgeCheck, MessageCircle } from "lucide-react";
import { Store } from "../types/catalog.types";

type Props = { store: Store };

export function StoreInfoBlock({ store }: Props) {
  const initial = store.storeName[0]?.toUpperCase() ?? "S";

  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col sm:flex-row items-start gap-4">
      {/* Avatar */}
      <div className="w-14 h-14 shrink-0 rounded-xl bg-[#00685f] flex items-center justify-center text-white text-xl font-bold">
        {initial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#191c1e]">{store.storeName}</span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-[#00685f] bg-[#e8f5f3] px-2 py-0.5 rounded-full">
            <BadgeCheck size={11} />
            Official Store
          </span>
        </div>
        {store.description && (
          <p className="text-sm text-[#6d7a77] mt-1 leading-relaxed line-clamp-2">
            {store.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <Link
          href={`/stores/${store._id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#00685f] text-sm font-medium text-[#00685f] hover:bg-[#f0f5f4] transition-colors"
        >
          Kunjungi Toko
        </Link>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00685f] text-sm font-medium text-white hover:bg-[#005049] transition-colors">
          <MessageCircle size={15} />
          Chat Penjual
        </button>
      </div>
    </div>
  );
}
