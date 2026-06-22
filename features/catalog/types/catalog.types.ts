export type Store = {
  id: number;
  storeName: string;
  description: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  store: Store;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductListData = {
  products: Product[];
  pagination: Pagination;
};
