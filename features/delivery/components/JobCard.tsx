"use client";

import { useState } from "react";
import { MapPin, Store, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/formatRupiah";
import { DeliveryJob } from "../types/delivery.types";

type Props = {
  job: DeliveryJob;
  onTake: (id: string) => Promise<void>;
};

export function JobCard({ job, onTake }: Props) {
  const [isTaking, setIsTaking] = useState(false);

  async function handleTake() {
    setIsTaking(true);
    try {
      await onTake(job.id);
    } finally {
      setIsTaking(false);
    }
  }

  const storeName = job.order.store?.storeName ?? "—";
  const address = (job.order as any).address ?? (job.order as any).deliveryAddress ?? null;
  const addressLine = address
    ? [address.street, address.city, address.province].filter(Boolean).join(", ")
    : "Alamat tidak tersedia";

  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          {/* Store */}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#191c1e]">
            <Store size={14} className="text-[#00685f] shrink-0" />
            {storeName}
          </div>
          {/* Destination */}
          <div className="flex items-start gap-1.5 text-xs text-[#6d7a77]">
            <MapPin size={13} className="shrink-0 mt-0.5" />
            <span>{addressLine}</span>
          </div>
        </div>
        {/* Earning */}
        <div className="text-right shrink-0">
          <p className="text-xs text-[#6d7a77]">Ongkir</p>
          <p className="text-base font-bold text-[#00685f]">{formatRupiah(job.earning)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#bcc9c6]/30">
        <div className="flex items-center gap-1.5 text-xs text-[#6d7a77]">
          <Bike size={13} />
          <span>{job.order.items.length} item · {formatRupiah(job.order.finalTotal)}</span>
        </div>
        <Button
          size="sm"
          onClick={handleTake}
          disabled={isTaking}
          className="bg-[#00685f] hover:bg-[#005049] text-white"
        >
          {isTaking ? "Mengambil..." : "Ambil Job"}
        </Button>
      </div>
    </div>
  );
}
