"use client";

import { useCallback, useEffect, useState } from "react";
import reviewService from "../service/review.service";
import { Review } from "../types/review.types";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reviewService.listReviews();
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { reviews, isLoading, reload: load };
}
