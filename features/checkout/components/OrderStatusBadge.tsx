import { Clock, Truck, CheckCircle2, RotateCcw, Package } from "lucide-react";
import { OrderStatus, ORDER_STATUS } from "@/lib/enums";
import { ORDER_STATUS_LABEL } from "@/lib/labels";

const STATUS_CONFIG: Record<OrderStatus, { bg: string; icon: React.ReactNode }> = {
  [ORDER_STATUS.PACKING]:          { bg: "bg-amber-50 text-amber-700 border border-amber-200",        icon: <Package size={11} /> },
  [ORDER_STATUS.WAITING_DELIVERY]: { bg: "bg-blue-50 text-blue-700 border border-blue-200",           icon: <Clock size={11} /> },
  [ORDER_STATUS.DELIVERING]:       { bg: "bg-[#e6f4f2] text-[#00685f] border border-[#00685f]/20",   icon: <Truck size={11} /> },
  [ORDER_STATUS.COMPLETED]:        { bg: "bg-[#00685f]/10 text-[#00685f] border border-[#00685f]/20", icon: <CheckCircle2 size={11} /> },
  [ORDER_STATUS.RETURNED]:         { bg: "bg-red-50 text-red-600 border border-red-200",              icon: <RotateCcw size={11} /> },
};

type Props = { status: OrderStatus };

export function OrderStatusBadge({ status }: Props) {
  const cfg = STATUS_CONFIG[status] ?? { bg: "bg-gray-100 text-gray-600 border border-gray-200", icon: <Package size={11} /> };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.bg}`}>
      {cfg.icon}
      {ORDER_STATUS_LABEL[status] ?? status}
    </span>
  );
}
