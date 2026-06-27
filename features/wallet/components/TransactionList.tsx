import { WalletTransaction } from "../types/wallet.types";
import { formatRupiah } from "@/utils/formatRupiah";

const TYPE_LABEL: Record<string, string> = {
  topup: "TOPUP",
  payment: "PAYMENT",
  refund: "REFUND",
  earning: "EARNING",
};

const TYPE_STYLE: Record<string, string> = {
  topup: "bg-[#00685f]/10 text-[#00685f]",
  earning: "bg-[#00685f]/10 text-[#00685f]",
  payment: "bg-[#cc4636]/10 text-[#cc4636]",
  refund: "bg-amber-100 text-amber-700",
};

const AMOUNT_STYLE: Record<string, string> = {
  topup: "text-[#00685f]",
  earning: "text-[#00685f]",
  payment: "text-[#cc4636]",
  refund: "text-amber-600",
};

type Props = {
  transactions: WalletTransaction[];
};

export function TransactionList({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[#6d7a77]">
        Belum ada transaksi.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[#bcc9c6]/30">
      {transactions.map((tx) => {
        const typeKey = tx.type.toLowerCase();
        const isCredit = typeKey === "topup" || typeKey === "earning" || typeKey === "refund";
        return (
          <li key={tx.id} className="flex items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  TYPE_STYLE[typeKey] ?? "bg-[#f2f4f6] text-[#6d7a77]"
                }`}
              >
                {TYPE_LABEL[typeKey] ?? tx.type.toUpperCase()}
              </span>
              <span className="text-sm text-[#3d4947] truncate">{tx.description}</span>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span
                className={`text-sm font-semibold ${
                  AMOUNT_STYLE[typeKey] ?? "text-[#191c1e]"
                }`}
              >
                {isCredit ? "+" : "-"}{formatRupiah(tx.amount)}
              </span>
              <span className="text-[11px] text-[#6d7a77]">
                {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
