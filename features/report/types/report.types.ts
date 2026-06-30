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
  orderId: string;
  buyerName: string;
  createdAt: string;
  finalTotal: number;
  status: string;
};

export type MonthlyTrendPoint = {
  month: string;
  revenue: number;
};

export type SellerRevenue = {
  storeName: string;
  totals: {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    curMonthRevenue: number;
    prevMonthRevenue: number;
  };
  countByStatus: Record<string, number>;
  monthlyTrend: MonthlyTrendPoint[];
  orders: SellerRevenueOrder[];
};
