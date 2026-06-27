import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/formatRupiah";

type Props = {
  subtotal: number;
  onCheckout: () => void;
  disabled?: boolean;
};

export function CartSummary({ subtotal, onCheckout, disabled }: Props) {
  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-[#f8f9fb] p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold text-[#191c1e]">Ringkasan Belanja</p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-[#6d7a77]">Subtotal</span>
        <span className="font-semibold text-[#191c1e]">{formatRupiah(subtotal)}</span>
      </div>

      <div className="border-t border-[#bcc9c6]/40 pt-3 flex items-center justify-between">
        <span className="text-sm font-medium text-[#191c1e]">Total</span>
        <span className="text-lg font-bold text-[#191c1e]">{formatRupiah(subtotal)}</span>
      </div>

      <p className="text-xs text-[#6d7a77]">
        Ongkir & PPN dihitung saat checkout.
      </p>

      <Button
        onClick={onCheckout}
        disabled={disabled}
        className="w-full gap-2 bg-[#00685f] hover:bg-[#005049]"
      >
        <ShoppingBag size={16} />
        Checkout Sekarang
      </Button>
    </div>
  );
}
