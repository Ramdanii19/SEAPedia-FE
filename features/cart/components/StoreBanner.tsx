import { Store as StoreIcon, MapPin } from "lucide-react";
import { Store } from "@/features/catalog/types/catalog.types";

type Props = {
  store: Store | null;
  checked: boolean;
  onCheck: (checked: boolean) => void;
};

export function StoreBanner({ store, checked, onCheck }: Props) {
  if (!store) return null;

  return (
    <div className="flex items-center gap-3 px-1 py-3 border-b border-[#bcc9c6]/30">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheck(e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-gray-300 accent-[#00685f] cursor-pointer"
      />
      <div className="w-7 h-7 rounded-md bg-[#00685f]/10 flex items-center justify-center shrink-0">
        <StoreIcon size={13} className="text-[#00685f]" />
      </div>
      <span className="text-sm font-bold text-[#191c1e]">{store.storeName}</span>
      <span className="inline-flex items-center rounded-full bg-[#00685f]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00685f]">
        TERVERIFIKASI
      </span>
      {store.addressDetail && (
        <div className="flex items-center gap-1 ml-auto text-xs text-[#6d7a77]">
          <MapPin size={11} />
          <span className="truncate max-w-30">{store.addressDetail}</span>
        </div>
      )}
    </div>
  );
}
