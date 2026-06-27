import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { DeliveryJob, DriverDashboard } from "../types/delivery.types";

const deliveryService = {
  listAvailable: () =>
    apiClient.get<ApiResponse<DeliveryJob[]>>("/delivery/jobs/available"),

  getJob: (id: string) =>
    apiClient.get<ApiResponse<DeliveryJob>>(`/delivery/jobs/${id}`),

  takeJob: (id: string) =>
    apiClient.patch<ApiResponse<DeliveryJob>>(`/delivery/jobs/${id}/take`, {}),

  completeJob: (id: string) =>
    apiClient.patch<ApiResponse<DeliveryJob>>(`/delivery/jobs/${id}/complete`, {}),

  getDashboard: () =>
    apiClient.get<ApiResponse<DriverDashboard>>("/delivery/dashboard"),
};

export default deliveryService;
