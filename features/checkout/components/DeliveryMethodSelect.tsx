"use client";

import { Zap, Clock, Package } from "lucide-react";
import { DeliveryMethod, DELIVERY_METHOD } from "@/lib/enums";
import { formatRupiah } from "@/utils/formatRupiah";

const OPTIONS: {
  value: DeliveryMethod;
  label: string;
  icon: React.ReactNode;
  description: string;
  fee: number;
}[] = [
  {
    value: DELIVERY_METHOD.INSTANT,
    label: "Instan",
    icon: <Zap size={18} />,
    description: "Tiba dalam 3 jam",
    fee: 25_000,
  },
  {
    value: DELIVERY_METHOD.NEXT_DAY,
    label: "Hari Berikutnya",
    icon: <Clock size={18} />,
    description: "Tiba keesokan harinya",
    fee: 15_000,
  },
  {
    value: DELIVERY_METHOD.REGULAR,
    label: "Reguler",
    icon: <Package size={18} />,
    description: "Tiba dalam 3 hari",
    fee: 9_000,
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
                {opt.label}
              </p>
              <p className="text-xs text-[#6d7a77]">{opt.description}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-[#191c1e]">
              {opt.fee === 0 ? "Gratis" : formatRupiah(opt.fee)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
