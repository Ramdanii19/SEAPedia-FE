import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Discount } from "../types/discount.types";

const discountService = {
  checkVoucher: (code: string) =>
    apiClient.get<ApiResponse<Discount>>(`/vouchers/${encodeURIComponent(code)}`),

  checkPromo: (code: string) =>
    apiClient.get<ApiResponse<Discount>>(`/promos/${encodeURIComponent(code)}`),
};

export default discountService;
