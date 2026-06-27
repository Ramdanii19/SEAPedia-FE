"use client";

import { useState } from "react";
import { Tag, Ticket, CheckCircle2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/formatRupiah";
import { Discount } from "../types/discount.types";

type Label = "Voucher" | "Promo";

type Props = {
  label: Label;
  onApply: (code: string) => Promise<void>;
  onRemove?: () => void;
  applied?: Discount | null;
  error?: string;
};

const CONFIG: Record<Label, { icon: React.ReactNode; placeholder: string; color: string }> = {
  Voucher: {
    icon: <Ticket size={14} />,
    placeholder: "Masukkan kode voucher",
    color: "text-[#00685f] bg-[#00685f]/10",
  },
  Promo: {
    icon: <Tag size={14} />,
    placeholder: "Masukkan kode promo",
    color: "text-amber-700 bg-amber-100",
  },
};

function discountLabel(discount: Discount): string {
  if (discount.discountType === "PERCENTAGE") {
    return `Diskon ${discount.discountValue}%`;
  }
  return `Diskon ${formatRupiah(discount.discountValue)}`;
}

export function DiscountInput({ label, onApply, onRemove, applied, error }: Props) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cfg = CONFIG[label];

  async function handleApply() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setIsLoading(true);
    try {
      await onApply(trimmed);
      setCode("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-sm font-medium text-[#191c1e]">
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.color}`}>
          {cfg.icon}
          {label}
        </span>
      </div>

      {applied ? (
        /* Applied state */
        <div className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${cfg.color} border-current/20`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            <div>
              <p className="text-sm font-semibold">{applied.name}</p>
              <p className="text-xs opacity-80">{discountLabel(applied)}</p>
            </div>
          </div>
          {onRemove && (
            <button onClick={onRemove} className="opacity-60 hover:opacity-100 transition-opacity">
              <X size={15} />
            </button>
          )}
        </div>
      ) : (
        /* Input state */
        <div className="flex gap-2">
          <Input
            placeholder={cfg.placeholder}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="uppercase placeholder:normal-case"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
            className="shrink-0"
          >
            {isLoading ? "..." : "Pakai"}
          </Button>
        </div>
      )}

      {error && (
        <p className="text-xs text-[#cc4636]">{error}</p>
      )}
    </div>
  );
}
