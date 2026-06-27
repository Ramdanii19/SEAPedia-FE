import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { BuyerSpending, SellerRevenue } from "../types/report.types";

const reportService = {
  getBuyerSpending: () =>
    apiClient.get<ApiResponse<BuyerSpending>>("/reports/buyer/spending"),

  getSellerRevenue: () =>
    apiClient.get<ApiResponse<SellerRevenue>>("/reports/seller/revenue"),
};

export default reportService;
