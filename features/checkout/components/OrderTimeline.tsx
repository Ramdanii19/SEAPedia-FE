import { CheckCircle2, Circle } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { ORDER_STATUS_LABEL } from "@/lib/labels";
import { StatusHistory } from "../types/order.types";

type Props = { history: StatusHistory[] };

export function OrderTimeline({ history }: Props) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-[#6d7a77]">Belum ada riwayat status.</p>;
  }

  return (
    <ol className="relative flex flex-col gap-0">
      {history.map((entry, idx) => {
        const isLatest = idx === history.length - 1;
        return (
          <li key={idx} className="flex gap-3">
            {/* Icon + vertical line */}
            <div className="flex flex-col items-center">
              <div className={`mt-0.5 ${isLatest ? "text-[#00685f]" : "text-[#bcc9c6]"}`}>
                {isLatest ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Circle size={18} />
                )}
              </div>
              {idx < history.length - 1 && (
                <div className="w-px flex-1 bg-[#bcc9c6]/60 my-1" />
              )}
            </div>

            {/* Content */}
            <div className="pb-5">
              <p className={`text-sm font-medium ${isLatest ? "text-[#191c1e]" : "text-[#6d7a77]"}`}>
                {ORDER_STATUS_LABEL[entry.status] ?? entry.status}
              </p>
              {entry.notes && (
                <p className="text-xs text-[#6d7a77] mt-0.5">{entry.notes}</p>
              )}
              <p className="text-xs text-[#bcc9c6] mt-0.5">
                {formatDate(entry.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
