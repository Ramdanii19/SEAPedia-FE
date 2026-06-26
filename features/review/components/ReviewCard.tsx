import { Review } from "../types/review.types";
import { StarRating } from "./StarRating";

type Props = { review: Review };

export function ReviewCard({ review }: Props) {
  const initial = review.reviewerName[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#bcc9c6]/40 bg-white p-4">
      <StarRating value={review.rating} readOnly />
      {/* Render sebagai teks biasa — JANGAN dangerouslySetInnerHTML */}
      <p className="text-sm text-[#3d4947] leading-relaxed">
        &ldquo;{review.comment}&rdquo;
      </p>
      <div className="flex items-center gap-2 mt-auto pt-1">
        <div className="w-7 h-7 rounded-full bg-[#00685f] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initial}
        </div>
        <span className="text-sm font-medium text-[#191c1e]">
          {review.reviewerName}
        </span>
      </div>
    </div>
  );
}
