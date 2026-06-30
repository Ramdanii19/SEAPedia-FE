import { OrderStatus, DeliveryMethod } from "./enums";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu Konfirmasi",
  confirmed: "Dikonfirmasi",
  preparing: "Diproses",
  ready_for_pickup: "Siap Diambil",
  on_delivery: "Dalam Pengiriman",
  delivered: "Telah Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export const DELIVERY_METHOD_LABEL: Record<DeliveryMethod, string> = {
  INSTANT: "Seapedia Express – Sameday",
  NEXT_DAY: "Seapedia Express – Next Day",
  REGULAR: "Seapedia Express – Regular",
};
