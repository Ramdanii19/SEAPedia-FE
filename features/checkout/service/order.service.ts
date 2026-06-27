import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Order } from "../types/order.types";

const orderService = {
  listMyOrders: () =>
    apiClient.get<ApiResponse<Order[]>>("/orders"),

  getOrder: (id: string) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${id}`),

  getSellerIncoming: () =>
    apiClient.get<ApiResponse<Order[]>>("/orders/seller/incoming"),
};

export default orderService;
