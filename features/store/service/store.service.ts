import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Store } from "../types/store.types";
import { StoreFormValues } from "../schema/store.schema";

const storeService = {
  getMyStore: () =>
    apiClient.get<ApiResponse<Store>>("/stores/me/store"),

  createStore: (payload: StoreFormValues) =>
    apiClient.post<ApiResponse<Store>>("/stores", payload),

  updateStore: (id: number, payload: Partial<StoreFormValues>) =>
    apiClient.patch<ApiResponse<Store>>(`/stores/${id}`, payload),
};

export default storeService;
