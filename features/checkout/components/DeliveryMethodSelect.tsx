"use client";

import { Bike, Store } from "lucide-react";
import { DeliveryMethod, DELIVERY_METHOD } from "@/lib/enums";
import { DELIVERY_METHOD_LABEL } from "@/lib/labels";
import { formatRupiah } from "@/utils/formatRupiah";

const OPTIONS: {
  value: DeliveryMethod;
  icon: React.ReactNode;
  description: string;
  fee: number | null;
}[] = [
  {
    value: DELIVERY_METHOD.DELIVERY,
    icon: <Bike size={18} />,
    description: "Produk diantar ke alamat Anda",
    fee: null, // dihitung backend berdasarkan jarak
  },
  {
    value: DELIVERY_METHOD.PICKUP,
    icon: <Store size={18} />,
    description: "Ambil sendiri di lokasi toko",
    fee: 0,
  },
];

type Props = {
  value: DeliveryMethod;
  onChange: (v: DeliveryMethod) => void;
};

export function DeliveryMethodSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              isSelected
                ? "border-[#00685f] bg-[#00685f]/5"
                : "border-[#bcc9c6]/40 bg-white hover:border-[#00685f]/40"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isSelected
                  ? "bg-[#00685f] text-white"
                  : "bg-[#f2f4f6] text-[#6d7a77]"
              }`}
            >
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${isSelected ? "text-[#00685f]" : "text-[#191c1e]"}`}>
                {DELIVERY_METHOD_LABEL[opt.value]}
              </p>
              <p className="text-xs text-[#6d7a77]">{opt.description}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-[#191c1e]">
              {opt.fee === null
                ? "Dihitung backend"
                : opt.fee === 0
                ? "Gratis"
                : formatRupiah(opt.fee)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
