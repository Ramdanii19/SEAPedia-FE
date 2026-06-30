import { OrderStatus, DeliveryMethod } from "@/lib/enums";
import { Store } from "@/features/catalog/types/catalog.types";

export type { OrderStatus, DeliveryMethod };

export type OrderItem = {
  product?: { name: string; imageUrl?: string };
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type StatusHistory = {
  status: OrderStatus;
  notes?: string;
  createdAt: string;
};

export type Order = {
  _id: string;
  store: Store;
  items: OrderItem[];
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  ppnAmount: number;
  finalTotal: number;
  status: OrderStatus;
  statusHistory: StatusHistory[];
  shippingRecipientName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: string;
};

export type CheckoutPayload = {
  addressId: string;
  deliveryMethod: DeliveryMethod;
  voucherCode?: string;
  promoCode?: string;
};
