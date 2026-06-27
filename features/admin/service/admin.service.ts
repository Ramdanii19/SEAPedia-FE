import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import {
  AdminUser,
  AdminStore,
  AdminProduct,
  AdminOrder,
  AdminVoucher,
  AdminPromo,
  AdminDeliveryJob,
} from "../types/admin.types";
import { VoucherFormValues, PromoFormValues } from "../schema/discount.schema";

const adminService = {
  getUsers: () =>
    apiClient.get<ApiResponse<AdminUser[]>>("/admin/users"),

  getStores: () =>
    apiClient.get<ApiResponse<AdminStore[]>>("/admin/stores"),

  getProducts: () =>
    apiClient.get<ApiResponse<AdminProduct[]>>("/admin/products"),

  getOrders: () =>
    apiClient.get<ApiResponse<AdminOrder[]>>("/admin/orders"),

  getVouchers: () =>
    apiClient.get<ApiResponse<AdminVoucher[]>>("/admin/vouchers"),

  getPromos: () =>
    apiClient.get<ApiResponse<AdminPromo[]>>("/admin/promos"),

  getDeliveryJobs: () =>
    apiClient.get<ApiResponse<AdminDeliveryJob[]>>("/admin/delivery-jobs"),

  getOverdueOrders: () =>
    apiClient.get<ApiResponse<AdminOrder[]>>("/admin/orders/overdue"),

  createVoucher: (payload: VoucherFormValues) =>
    apiClient.post<ApiResponse<AdminVoucher>>("/admin/vouchers", payload),

  createPromo: (payload: PromoFormValues) =>
    apiClient.post<ApiResponse<AdminPromo>>("/admin/promos", payload),

  simulateNextDay: () =>
    apiClient.post<ApiResponse<{ message: string }>>("/admin/simulate/next-day", {}),

  processLateOrders: () =>
    apiClient.post<ApiResponse<{ message: string }>>("/admin/process-late-orders", {}),
};

export default adminService;
