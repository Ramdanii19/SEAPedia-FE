"use client";

import { ReviewCard } from "../components/ReviewCard";
import { ReviewForm } from "../components/ReviewForm";
import { useReviews } from "../hooks/useReviews";

export function ReviewSection() {
  const { reviews, isLoading, reload } = useReviews();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#191c1e] mb-8">
          Ulasan Pengguna
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Review list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {isLoading ? (
              <div className="col-span-2 flex justify-center py-10">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="col-span-2 text-sm text-[#6d7a77] py-6">
                Belum ada ulasan. Jadilah yang pertama!
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>

          {/* Form */}
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-[#f8f9fb] p-5 sticky top-20">
            <p className="text-sm font-semibold text-[#191c1e] mb-1">
              Tulis Ulasan
            </p>
            <p className="text-xs text-[#6d7a77] mb-4">
              Bagikan pengalaman belanja Anda di SEAPEDIA.
            </p>
            <ReviewForm onSuccess={reload} />
          </div>
        </div>
      </div>
    </section>
  );
}
