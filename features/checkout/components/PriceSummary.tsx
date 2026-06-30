import { formatRupiah } from "@/utils/formatRupiah";

type Props = {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  ppnAmount: number;
  finalTotal: number;
};

type Row = {
  label: string;
  value: number;
  negative?: boolean;
  muted?: boolean;
  bold?: boolean;
};

export function PriceSummary({
  subtotal,
  discountAmount,
  deliveryFee,
  ppnAmount,
  finalTotal,
}: Props) {
  const rows: Row[] = [
    { label: "Subtotal untuk Produk", value: subtotal },
    { label: "Total Ongkos Kirim", value: deliveryFee },
    { label: "Diskon", value: discountAmount, negative: true, muted: true },
    { label: "PPN 12%", value: ppnAmount, muted: true },
  ];

  return (
    <div className="flex flex-col gap-3">
      {rows.map(({ label, value, negative, muted }) => (
        <div key={label} className="flex items-center justify-between text-sm">
          <span className={muted ? "text-[#6d7a77]" : "text-[#3d4947]"}>{label}</span>
          <span className={negative ? "text-[#cc4636]" : "text-[#191c1e]"}>
            {negative && value > 0 ? "-" : ""}
            {formatRupiah(value)}
          </span>
        </div>
      ))}

      <div className="border-t border-[#bcc9c6]/40 pt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#191c1e]">Total Pembayaran</span>
        <span className="text-base font-bold text-[#00685f]">{formatRupiah(finalTotal)}</span>
      </div>
    </div>
  );
}
