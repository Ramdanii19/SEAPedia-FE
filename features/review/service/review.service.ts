import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Review } from "../types/review.types";
import { ReviewFormValues } from "../schema/review.schema";

const reviewService = {
  listReviews: () =>
    apiClient.get<ApiResponse<Review[]>>("/reviews", { auth: false }),

  // auth:true so backend links review to user via optionalProtect (guests without token still work)
  createReview: (payload: ReviewFormValues) =>
    apiClient.post<ApiResponse<Review>>("/reviews", payload, { auth: true }),

  updateReview: (id: string, payload: Partial<ReviewFormValues>) =>
    apiClient.patch<ApiResponse<Review>>(`/reviews/${id}`, payload, { auth: true }),

  deleteReview: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/reviews/${id}`, { auth: true }),
};

export default reviewService;
