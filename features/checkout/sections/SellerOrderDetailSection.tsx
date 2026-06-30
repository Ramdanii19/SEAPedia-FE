"use client";

import { ProcessOrderButton } from "../components/ProcessOrderButton";
import { OrderDetailSection } from "./OrderDetailSection";
import { Order } from "../types/order.types";

type Props = { id: string };

export function SellerOrderDetailSection({ id }: Props) {
  return (
    <OrderDetailSection
      id={id}
      backHref="/seller/orders"
      backLabel="Kembali ke Pesanan Masuk"
      headerSlot={(order: Order, reload) => (
        <ProcessOrderButton
          orderId={order._id}
          status={order.status}
          onProcessed={reload}
        />
      )}
    />
  );
}
