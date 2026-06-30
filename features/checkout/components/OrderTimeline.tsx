"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { ORDER_STATUS_LABEL } from "@/lib/labels";
import { ORDER_STATUS } from "@/lib/enums";
import { StatusHistory, OrderStatus } from "../types/order.types";

const STATUS_FLOW: OrderStatus[] = [
  ORDER_STATUS.PACKING,
  ORDER_STATUS.WAITING_DELIVERY,
  ORDER_STATUS.DELIVERING,
  ORDER_STATUS.COMPLETED,
];

function getNextStatus(current: OrderStatus): OrderStatus | null {
  if (current === ORDER_STATUS.RETURNED) return null;
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

type Props = { history: StatusHistory[]; currentStatus: OrderStatus };

export function OrderTimeline({ history, currentStatus }: Props) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-[#6d7a77]">Belum ada riwayat status.</p>;
  }

  const reversed = [...history].reverse();
  const nextStatus = getNextStatus(currentStatus);

  return (
    <ol className="relative flex flex-col gap-0">
      {/* Next step (greyed out) */}
      {nextStatus && (
        <li className="flex gap-3 mb-1">
          <div className="flex flex-col items-center">
            <Circle size={18} className="mt-0.5 text-[#bcc9c6]" />
            <div className="w-px flex-1 bg-[#bcc9c6]/50 my-1 min-h-6" />
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-[#bcc9c6]">
              {ORDER_STATUS_LABEL[nextStatus] ?? nextStatus}
            </p>
          </div>
        </li>
      )}

      {/* Completed steps (newest first) */}
      {reversed.map((entry, idx) => (
        <li key={idx} className="flex gap-3">
          <div className="flex flex-col items-center">
            <CheckCircle2 size={18} className={`mt-0.5 ${idx === 0 ? "text-[#00685f]" : "text-[#00685f]/60"}`} />
            {idx < reversed.length - 1 && (
              <div className="w-px flex-1 bg-[#00685f]/20 my-1 min-h-6" />
            )}
          </div>
          <div className="pb-4">
            <p className={`text-sm font-semibold ${idx === 0 ? "text-[#191c1e]" : "text-[#6d7a77]"}`}>
              {ORDER_STATUS_LABEL[entry.status] ?? entry.status}
            </p>
            <p className="text-xs text-[#6d7a77] mt-0.5">
              {formatDate(entry.createdAt)}
            </p>
            {entry.notes && (
              <p className="text-xs text-[#8a9896] mt-0.5 leading-relaxed">{entry.notes}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
