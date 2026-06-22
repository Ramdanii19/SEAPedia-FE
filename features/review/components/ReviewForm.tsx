"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { useReviewForm } from "../hooks/useReviewForm";

type Props = { onSuccess: () => void };

export function ReviewForm({ onSuccess }: Props) {
  const { form, isSubmitting, error, onSubmit } = useReviewForm(onSuccess);
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Nama Lengkap */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">Nama Lengkap</label>
        <Input
          placeholder="Masukkan nama Anda"
          {...register("reviewerName")}
          aria-invalid={!!errors.reviewerName}
        />
        {errors.reviewerName && (
          <p className="text-xs text-red-500">{errors.reviewerName.message}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">Rating</label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <StarRating value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.rating && (
          <p className="text-xs text-red-500">{errors.rating.message}</p>
        )}
      </div>

      {/* Komentar */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#191c1e]">Komentar</label>
        <Textarea
          placeholder="Apa pendapat Anda?"
          rows={4}
          {...register("comment")}
          aria-invalid={!!errors.comment}
        />
        {errors.comment && (
          <p className="text-xs text-red-500">{errors.comment.message}</p>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00685f] hover:bg-[#005049]">
        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
      </Button>
    </form>
  );
}
