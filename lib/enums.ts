export const ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  DRIVER: "driver",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ORDER_STATUS = {
  PACKING: "PACKING",
  WAITING_DELIVERY: "WAITING_DELIVERY",
  DELIVERING: "DELIVERING",
  COMPLETED: "COMPLETED",
  RETURNED: "RETURNED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const DELIVERY_METHOD = {
  INSTANT: "INSTANT",
  NEXT_DAY: "NEXT_DAY",
  REGULAR: "REGULAR",
} as const;

export type DeliveryMethod = (typeof DELIVERY_METHOD)[keyof typeof DELIVERY_METHOD];

export const DELIVERY_JOB_STATUS = {
  AVAILABLE: "available",
  TAKEN: "taken",
  PICKED_UP: "picked_up",
  DELIVERED: "delivered",
} as const;

export type DeliveryJobStatus = (typeof DELIVERY_JOB_STATUS)[keyof typeof DELIVERY_JOB_STATUS];
