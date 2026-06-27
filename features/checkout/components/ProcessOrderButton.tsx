"use client";

import { useState } from "react";
import { PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS, OrderStatus } from "@/lib/enums";
import orderService from "../service/order.service";

type Props = {
  orderId: string;
  status: OrderStatus;
  onProcessed: () => void;
};

export function ProcessOrderButton({ orderId, status, onProcessed }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  if (status !== ORDER_STATUS.PREPARING) return null;

  async function handleProcess() {
    setIsLoading(true);
    try {
      await orderService.processOrder(orderId);
      onProcessed();
    } catch {
      // silently ignore — section will still reload on next navigation
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleProcess}
      disabled={isLoading}
      className="bg-[#00685f] hover:bg-[#005049] text-white gap-1.5 whitespace-nowrap"
    >
      <PackageCheck size={14} />
      {isLoading ? "Memproses..." : "Proses Pesanan"}
    </Button>
  );
}
