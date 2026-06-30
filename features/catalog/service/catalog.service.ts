import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Product, ProductListData, Store } from "../types/catalog.types";

export type ListProductsParams = {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
};

const catalogService = {
  listProducts: (params?: ListProductsParams) => {
    const query = new URLSearchParams();
    if (params?.search)   query.set("search",   params.search);
    if (params?.page)     query.set("page",     String(params.page));
    if (params?.limit)    query.set("limit",    String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.sort)     query.set("sort",     params.sort);
    if (params?.minPrice) query.set("minPrice", String(params.minPrice));
    if (params?.maxPrice) query.set("maxPrice", String(params.maxPrice));
    const qs = query.toString();
    return apiClient.get<ApiResponse<ProductListData>>(
      qs ? `/products?${qs}` : "/products",
      { auth: false }
    );
  },

  getProduct: (id: string) =>
    apiClient.get<ApiResponse<{ product: Product }>>(`/products/${id}`, { auth: false }),

  getStore: (id: number) =>
    apiClient.get<ApiResponse<Store>>(`/stores/${id}`, { auth: false }),
};

export default catalogService;
