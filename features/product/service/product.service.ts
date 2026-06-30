import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Product, ProductListData } from "@/features/catalog/types/catalog.types";
import { ProductFormValues } from "../schema/product.schema";

const productService = {
  listMyProducts: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiClient.get<ApiResponse<ProductListData>>(
      `/products/me/list${qs ? `?${qs}` : ""}`
    );
  },

  createProduct: (payload: ProductFormValues) =>
    apiClient.post<ApiResponse<Product>>("/products", payload),

  updateProduct: (id: string, payload: Partial<ProductFormValues>) =>
    apiClient.patch<ApiResponse<Product>>(`/products/${id}`, payload),

  deleteProduct: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/products/${id}`),
};

export default productService;
