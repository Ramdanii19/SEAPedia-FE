export type Role = "ADMIN" | "SELLER" | "BUYER" | "DRIVER";

export type User = {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];
  activeRole: Role | null;
  walletBalance: number;
  sellerRevenue: number;
  driverEarning: number;
};

export type LoginResponse = {
  token: string;
  user: User;
  roles: Role[];
  needRoleSelection: boolean;
};
