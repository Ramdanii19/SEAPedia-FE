import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Order, CheckoutPayload } from "../types/order.types";

const checkoutService = {
  checkout: (payload: CheckoutPayload) =>
    apiClient.post<ApiResponse<Order>>("/checkout", payload),
};

export default checkoutService;
