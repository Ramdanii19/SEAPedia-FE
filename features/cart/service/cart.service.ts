import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Cart } from "../types/cart.types";

const cartService = {
  getCart: () =>
    apiClient.get<ApiResponse<Cart>>("/cart"),

  addToCart: (payload: { productId: number; quantity: number }) =>
    apiClient.post<ApiResponse<Cart>>("/cart/items", payload),

  updateQty: (productId: number, quantity: number) =>
    apiClient.patch<ApiResponse<Cart>>(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId: number) =>
    apiClient.delete<ApiResponse<Cart>>(`/cart/items/${productId}`),

  clearCart: () =>
    apiClient.delete<ApiResponse<null>>("/cart"),
};

export default cartService;
