export type Wallet = {
  balance: number;
};

export type WalletTransaction = {
  _id: string;
  type: "topup" | "payment" | "refund";
  amount: number;
  description: string;
  createdAt: string;
};

export type Address = {
  _id: string;
  recipientName: string;
  phone: string;
  addressDetail: string;
  isDefault: boolean;
};
