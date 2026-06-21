import { Wallet, TrendingUp, Bike } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";

type Props = {
  walletBalance: number;
  sellerRevenue: number;
  driverEarning: number;
};

const items = [
  { key: "walletBalance", label: "Saldo Dompet",     Icon: Wallet,     color: "text-[#3d6377]", bg: "bg-[#bee5fd]" },
  { key: "sellerRevenue", label: "Pendapatan Toko",  Icon: TrendingUp,  color: "text-[#00685f]", bg: "bg-[#89f5e7]" },
  { key: "driverEarning", label: "Penghasilan Driver", Icon: Bike,      color: "text-[#aa2e21]", bg: "bg-[#ffdad4]" },
] as const;

export function FinancialSummaryCard({ walletBalance, sellerRevenue, driverEarning }: Props) {
  const values = { walletBalance, sellerRevenue, driverEarning };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map(({ key, label, Icon, color, bg }) => (
        <div
          key={key}
          className="flex items-center gap-4 p-4 rounded-xl border border-[#bcc9c6]/30 bg-white shadow-sm"
        >
          <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={color} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#6d7a77] truncate">{label}</p>
            <p className="text-base font-semibold text-[#191c1e] truncate">
              {formatRupiah(values[key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
