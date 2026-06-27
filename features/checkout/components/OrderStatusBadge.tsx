import { OrderStatus, ORDER_STATUS } from "@/lib/enums";
import { ORDER_STATUS_LABEL } from "@/lib/labels";

const STATUS_STYLE: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]:          "bg-amber-100 text-amber-700",
  [ORDER_STATUS.CONFIRMED]:        "bg-blue-100 text-blue-700",
  [ORDER_STATUS.PREPARING]:        "bg-orange-100 text-orange-700",
  [ORDER_STATUS.READY_FOR_PICKUP]: "bg-purple-100 text-purple-700",
  [ORDER_STATUS.ON_DELIVERY]:      "bg-sky-100 text-sky-700",
  [ORDER_STATUS.DELIVERED]:        "bg-teal-100 text-teal-700",
  [ORDER_STATUS.COMPLETED]:        "bg-[#00685f]/10 text-[#00685f]",
  [ORDER_STATUS.CANCELLED]:        "bg-[#cc4636]/10 text-[#cc4636]",
};

type Props = { status: OrderStatus };

export function OrderStatusBadge({ status }: Props) {
  const style = STATUS_STYLE[status] ?? "bg-[#f2f4f6] text-[#6d7a77]";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {ORDER_STATUS_LABEL[status] ?? status}
    </span>
  );
}
