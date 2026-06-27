"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import deliveryService from "../service/delivery.service";

type Props = {
  jobId: string;
  onCompleted: () => void;
};

export function CompleteJobButton({ jobId, onCompleted }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete() {
    setIsLoading(true);
    setError(null);
    try {
      await deliveryService.completeJob(jobId);
      onCompleted();
    } catch (err: any) {
      setError(err?.message ?? "Gagal menyelesaikan pengiriman.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        onClick={handleComplete}
        disabled={isLoading}
        className="w-full bg-[#00685f] hover:bg-[#005049] text-white gap-2"
      >
        <CheckCircle2 size={15} />
        {isLoading ? "Memproses..." : "Selesaikan Pengiriman"}
      </Button>
      {error && <p className="text-xs text-[#cc4636] text-center">{error}</p>}
    </div>
  );
}
