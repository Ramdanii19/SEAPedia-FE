export type BuyerSpendingOrder = {
  id: string;
  createdAt: string;
  finalTotal: number;
  status: string;
};

export type BuyerSpending = {
  totalSpending: number;
  orders: BuyerSpendingOrder[];
};

export type SellerRevenueOrder = {
  id: string;
  createdAt: string;
  finalTotal: number;
  status: string;
};

export type SellerRevenue = {
  totalRevenue: number;
  incomingCount: number;
  processedCount: number;
  orders: SellerRevenueOrder[];
};
