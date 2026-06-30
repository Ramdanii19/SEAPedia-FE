import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Cart } from "../types/cart.types";

const cartService = {
  getCart: () =>
    apiClient.get<ApiResponse<{ cart: Cart; subtotal: number; totalItems: number }>>("/cart"),

  addToCart: (payload: { productId: string; quantity: number }) =>
    apiClient.post<ApiResponse<{ cart: Cart }>>("/cart/items", payload),

  updateQty: (productId: string, quantity: number) =>
    apiClient.patch<ApiResponse<{ cart: Cart }>>(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId: string) =>
    apiClient.delete<ApiResponse<{ cart: Cart }>>(`/cart/items/${productId}`),

  clearCart: () =>
    apiClient.delete<ApiResponse<null>>("/cart"),
};

export default cartService;
