"use client";

import { useState } from "react";
import { CalendarClock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Action = "next-day" | "late-orders";

type Props = {
  onSimulateNextDay: () => Promise<void>;
  onProcessLateOrders: () => Promise<void>;
  isSimulating: boolean;
  isProcessing: boolean;
  simulateMessage: string | null;
  processMessage: string | null;
  error: string | null;
};

export function SimulateTimePanel({
  onSimulateNextDay,
  onProcessLateOrders,
  isSimulating,
  isProcessing,
  simulateMessage,
  processMessage,
  error,
}: Props) {
  const [confirmAction, setConfirmAction] = useState<Action | null>(null);

  const now = new Date().toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });

  async function handleConfirm() {
    if (confirmAction === "next-day") await onSimulateNextDay();
    if (confirmAction === "late-orders") await onProcessLateOrders();
    setConfirmAction(null);
  }

  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <CalendarClock size={20} className="text-[#00685f] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#191c1e]">Simulasi Waktu Sistem</p>
          <p className="text-xs text-[#6d7a77] mt-0.5">Waktu saat ini (lokal): {now}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Dialog
          open={confirmAction === "next-day"}
          onOpenChange={(open) => !open && setConfirmAction(null)}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmAction("next-day")}
              disabled={isSimulating || isProcessing}
            >
              {isSimulating ? "Memajukan..." : "Majukan 1 Hari"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Majukan Waktu 1 Hari?</DialogTitle>
            </DialogHeader>
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Aksi ini memajukan waktu server dan dapat mempengaruhi status order yang kedaluwarsa.
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmAction(null)}>
                Batal
              </Button>
              <Button
                className="flex-1 bg-[#00685f] hover:bg-[#005049] text-white"
                onClick={handleConfirm}
                disabled={isSimulating}
              >
                {isSimulating ? "Memproses..." : "Ya, Majukan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={confirmAction === "late-orders"}
          onOpenChange={(open) => !open && setConfirmAction(null)}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmAction("late-orders")}
              disabled={isSimulating || isProcessing}
              className="border-[#cc4636]/40 text-[#cc4636] hover:bg-[#cc4636]/5"
            >
              {isProcessing ? "Memproses..." : "Proses Order Telat"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Proses Order Telat?</DialogTitle>
            </DialogHeader>
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
              <AlertTriangle size={15} className="text-[#cc4636] shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">
                Order yang melebihi batas waktu akan dikembalikan dan pembeli mendapat refund otomatis.
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmAction(null)}>
                Batal
              </Button>
              <Button
                className="flex-1 bg-[#cc4636] hover:bg-[#b03020] text-white"
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? "Memproses..." : "Ya, Proses"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {simulateMessage && (
        <div className="flex items-center gap-2 text-xs text-[#00685f]">
          <CheckCircle2 size={13} />
          {simulateMessage}
        </div>
      )}
      {processMessage && (
        <div className="flex items-center gap-2 text-xs text-[#00685f]">
          <CheckCircle2 size={13} />
          {processMessage}
        </div>
      )}
      {error && <p className="text-xs text-[#cc4636]">{error}</p>}
    </div>
  );
}
