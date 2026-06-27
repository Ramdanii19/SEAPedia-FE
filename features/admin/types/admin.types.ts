export type AdminUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
};

export type AdminStore = {
  id: string;
  storeName: string;
  ownerName: string;
  createdAt: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  storeName: string;
};

export type AdminOrder = {
  id: string;
  buyerName: string;
  storeName: string;
  finalTotal: number;
  status: string;
  createdAt: string;
};

export type AdminVoucher = {
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  remainingUsage: number;
};

export type AdminPromo = {
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  remainingUsage: number;
};

export type AdminDeliveryJob = {
  id: string;
  orderId: string;
  driverName: string;
  status: string;
  earning: number;
  takenAt?: string;
  completedAt?: string;
};
