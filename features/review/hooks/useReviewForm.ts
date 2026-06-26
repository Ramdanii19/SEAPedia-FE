"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import reviewService from "../service/review.service";
import { reviewSchema, ReviewFormValues } from "../schema/review.schema";
import { Review } from "../types/review.types";

export function useReviewForm(onSuccess: () => void, existing?: Review | null) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!existing;
  const sessionName = (user as any)?.fullName ?? (user as any)?.name ?? "";

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: isEdit
      ? { reviewerName: existing.reviewerName, rating: existing.rating, comment: existing.comment }
      : { reviewerName: sessionName, rating: 0, comment: "" },
  });

  async function onSubmit(values: ReviewFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEdit && existing) {
        await reviewService.updateReview(existing._id, values);
      } else {
        await reviewService.createReview(values);
      }
      form.reset({ reviewerName: sessionName, rating: 0, comment: "" });
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Gagal mengirim ulasan");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    isSubmitting,
    error,
    isLoggedIn: !!user,
    isEdit,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
