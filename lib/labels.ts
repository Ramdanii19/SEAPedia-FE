import { OrderStatus, DeliveryMethod } from "./enums";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PACKING: "Sedang Dikemas",
  WAITING_DELIVERY: "Menunggu Pengiriman",
  DELIVERING: "Sedang Dikirim",
  COMPLETED: "Selesai",
  RETURNED: "Dikembalikan",
};

export const DELIVERY_METHOD_LABEL: Record<DeliveryMethod, string> = {
  INSTANT: "Seapedia Express – Sameday",
  NEXT_DAY: "Seapedia Express – Next Day",
  REGULAR: "Seapedia Express – Regular",
};
