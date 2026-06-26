"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import reviewService from "../service/review.service";
import { Review } from "../types/review.types";

export function useReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reviewService.listReviews();
      const data = res.data as any;
      setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
    } catch {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const myReview = user
    ? reviews.find((r) => {
        if (!r.user) return false;
        // backend may return user as raw ObjectId string or populated { _id }
        const reviewUserId =
          typeof r.user === "string" ? r.user : r.user._id;
        if (!reviewUserId) return false;
        // auth context types id as number but backend may send MongoDB string _id
        const currentUserId = (user as any)._id ?? user.id;
        return String(reviewUserId) === String(currentUserId);
      }) ?? null
    : null;

  return { reviews, isLoading, reload: load, myReview };
}
