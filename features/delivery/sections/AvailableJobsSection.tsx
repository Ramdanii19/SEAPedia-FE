"use client";

import { Bike } from "lucide-react";
import deliveryService from "../service/delivery.service";
import { JobCard } from "../components/JobCard";
import { useAvailableJobs } from "../hooks/useAvailableJobs";

export function AvailableJobsSection() {
  const { jobs, isLoading, error, reload } = useAvailableJobs();

  async function handleTake(id: string) {
    try {
      await deliveryService.takeJob(id);
      await reload();
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (/taken|diambil|sudah/i.test(msg)) {
        // Job already taken by another driver — reload to remove it from the list
        await reload();
      }
      // Re-throw so JobCard can clear its loading state
      throw err;
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-[#cc4636]">{error}</p>;
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f2f4f6] flex items-center justify-center">
          <Bike size={28} className="text-[#bcc9c6]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[#191c1e]">Tidak Ada Job Tersedia</p>
          <p className="text-sm text-[#6d7a77] mt-1">
            Belum ada pengiriman yang menunggu driver.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onTake={handleTake} />
      ))}
    </div>
  );
}
