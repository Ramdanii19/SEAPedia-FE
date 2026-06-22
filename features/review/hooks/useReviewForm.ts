"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import reviewService from "../service/review.service";
import { reviewSchema, ReviewFormValues } from "../schema/review.schema";

export function useReviewForm(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { reviewerName: "", rating: 0, comment: "" },
  });

  async function onSubmit(values: ReviewFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      await reviewService.createReview(values);
      form.reset();
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Gagal mengirim ulasan");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, isSubmitting, error, onSubmit: form.handleSubmit(onSubmit) };
}
