import { Product, Store } from "@/features/catalog/types/catalog.types";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  store: Store | null;
  items: CartItem[];
  subtotal: number;
};
