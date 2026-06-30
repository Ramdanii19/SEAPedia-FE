import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Wallet, WalletTransaction } from "../types/wallet.types";
import { TopupFormValues } from "../schema/wallet.schema";

const walletService = {
  getWallet: () =>
    apiClient.get<ApiResponse<{ wallet: Wallet }>>("/wallet"),

  topUp: (payload: TopupFormValues) =>
    apiClient.post<ApiResponse<{ wallet: Wallet }>>("/wallet/topup", payload),

  getTransactions: () =>
    apiClient.get<ApiResponse<{ transactions: WalletTransaction[]; pagination: unknown }>>("/wallet/transactions"),
};

export default walletService;
