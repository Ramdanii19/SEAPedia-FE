import { Order } from "@/features/checkout/types/order.types";

export type DeliveryJobStatus = "AVAILABLE" | "TAKEN" | "COMPLETED";

export type DeliveryJob = {
  id: string;
  order: Order;
  status: DeliveryJobStatus;
  earning: number;
  takenAt?: string;
  completedAt?: string;
};

export type DriverDashboard = {
  activeJob: DeliveryJob | null;
  jobHistory: DeliveryJob[];
  totalEarning: number;
  completedCount: number;
  walletBalance: number;
};
