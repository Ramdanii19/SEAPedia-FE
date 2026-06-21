import { OrderStatus } from "@/lib/enums";
import { ORDER_STATUS_LABEL } from "@/lib/labels";

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABEL[status] ?? status;
}
