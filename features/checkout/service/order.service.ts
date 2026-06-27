import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Order, StatusHistory } from "../types/order.types";

const orderService = {
  listMyOrders: () =>
    apiClient.get<ApiResponse<Order[]>>("/orders"),

  getOrder: (id: string) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${id}`),

  getSellerIncoming: () =>
    apiClient.get<ApiResponse<Order[]>>("/orders/seller/incoming"),

  processOrder: (id: string) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/process`, {}),

  getTimeline: (id: string) =>
    apiClient.get<ApiResponse<StatusHistory[]>>(`/orders/${id}/timeline`),
};

export default orderService;
