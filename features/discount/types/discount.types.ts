export type DiscountType = "PERCENTAGE" | "FIXED";

export type Discount = {
  code: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  expiryDate: string;
  remainingUsage?: number;
};
