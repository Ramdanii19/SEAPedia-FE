import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Product, Store } from "../types/catalog.types";

export type ListProductsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

const catalogService = {
  listProducts: (params?: ListProductsParams) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page)   query.set("page",   String(params.page));
    if (params?.limit)  query.set("limit",  String(params.limit));
    const qs = query.toString();
    return apiClient.get<ApiResponse<Product[]>>(
      qs ? `/products?${qs}` : "/products",
      { auth: false }
    );
  },

  getProduct: (id: number) =>
    apiClient.get<ApiResponse<Product>>(`/products/${id}`, { auth: false }),

  getStore: (id: number) =>
    apiClient.get<ApiResponse<Store>>(`/stores/${id}`, { auth: false }),
};

export default catalogService;
