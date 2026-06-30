"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Store, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { OrderTimeline } from "@/features/checkout/components/OrderTimeline";
import { OrderStatusBadge } from "@/features/checkout/components/OrderStatusBadge";
import deliveryService from "../service/delivery.service";
import { CompleteJobButton } from "../components/CompleteJobButton";
import { useJobDetail } from "../hooks/useJobDetail";
import { useState } from "react";

type Props = { id: string };

export function JobDetailSection({ id }: Props) {
  const { job, isLoading, error, reload } = useJobDetail(id);
  const [isTaking, setIsTaking] = useState(false);
  const [takeError, setTakeError] = useState<string | null>(null);

  async function handleTake() {
    setIsTaking(true);
    setTakeError(null);
    try {
      await deliveryService.takeJob(id);
      await reload();
    } catch (err: any) {
      setTakeError(err?.message ?? "Gagal mengambil job.");
    } finally {
      setIsTaking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[#cc4636]">{error ?? "Job tidak ditemukan."}</p>
        <Link href="/driver/jobs" className="mt-3 block text-sm text-[#00685f] hover:underline">
          Kembali ke daftar job
        </Link>
      </div>
    );
  }

  const order = job.order;
  const storeName = (order as any).store?.storeName ?? "—";
  const addressLine = (order as any).shippingAddress ?? "Alamat tidak tersedia";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Back */}
      <Link
        href="/driver/jobs"
        className="flex items-center gap-1.5 text-sm text-[#6d7a77] hover:text-[#191c1e] w-fit"
      >
        <ArrowLeft size={14} />
        Kembali ke Daftar Job
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#6d7a77] mb-1">Job #{job._id.slice(-8).toUpperCase()}</p>
          {job.takenAt && (
            <p className="text-xs text-[#6d7a77]">Diambil: {formatDate(job.takenAt)}</p>
          )}
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#191c1e]">
          <Store size={14} className="text-[#00685f]" />
          {storeName}
        </div>
        <div className="flex items-start gap-2 text-sm text-[#6d7a77]">
          <MapPin size={14} className="shrink-0 mt-0.5" />
          <span>{addressLine}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#bcc9c6]/30">
          <div className="flex items-center gap-1.5 text-xs text-[#6d7a77]">
            <Bike size={13} />
            <span>{order.items.length} item · {formatRupiah(order.finalTotal)}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#6d7a77]">Penghasilan</p>
            <p className="text-base font-bold text-[#00685f]">{formatRupiah(job.earning)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
        <p className="text-sm font-semibold text-[#191c1e] px-4 py-3 border-b border-[#bcc9c6]/30">
          Produk ({order.items.length})
        </p>
        <div className="divide-y divide-[#bcc9c6]/30">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-[#191c1e]">
                {item.quantity}× {item.productName}
              </p>
              <p className="text-sm font-medium text-[#191c1e]">{formatRupiah(item.subtotal)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
        <p className="text-sm font-semibold text-[#191c1e] mb-4">Riwayat Status</p>
        <OrderTimeline history={order.statusHistory} />
      </div>

      {/* Action */}
      {job.status === "AVAILABLE" && (
        <div className="flex flex-col gap-1.5">
          <Button
            onClick={handleTake}
            disabled={isTaking}
            className="w-full bg-[#00685f] hover:bg-[#005049] text-white"
          >
            {isTaking ? "Mengambil..." : "Ambil Job Ini"}
          </Button>
          {takeError && <p className="text-xs text-[#cc4636] text-center">{takeError}</p>}
        </div>
      )}

      {job.status === "TAKEN" && (
        <CompleteJobButton jobId={job._id} onCompleted={reload} />
      )}

      {job.status === "COMPLETED" && job.completedAt && (
        <p className="text-center text-sm text-[#6d7a77]">
          Selesai pada {formatDate(job.completedAt)}
        </p>
      )}
    </div>
  );
}
