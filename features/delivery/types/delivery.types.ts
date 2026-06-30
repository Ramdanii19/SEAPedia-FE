import { Order } from "@/features/checkout/types/order.types";

export type DeliveryJobStatus = "AVAILABLE" | "TAKEN" | "COMPLETED";

export type DeliveryJob = {
  _id: string;
  order: Order;
  status: DeliveryJobStatus;
  earning: number;
  takenAt?: string;
  completedAt?: string;
  createdAt?: string;
};

export type DriverDashboard = {
  activeJob: DeliveryJob | null;
  jobHistory: DeliveryJob[];
  totalEarning: number;
  completedCount: number;
  walletBalance: number;
};
