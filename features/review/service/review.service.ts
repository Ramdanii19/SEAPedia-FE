import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Review } from "../types/review.types";
import { ReviewFormValues } from "../schema/review.schema";

const reviewService = {
  listReviews: () =>
    apiClient.get<ApiResponse<Review[]>>("/reviews", { auth: false }),

  createReview: (payload: ReviewFormValues) =>
    apiClient.post<ApiResponse<Review>>("/reviews", payload, { auth: false }),
};

export default reviewService;
