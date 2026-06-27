import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Wallet, WalletTransaction } from "../types/wallet.types";
import { TopupFormValues } from "../schema/wallet.schema";

const walletService = {
  getWallet: () =>
    apiClient.get<ApiResponse<Wallet>>("/wallet"),

  topUp: (payload: TopupFormValues) =>
    apiClient.post<ApiResponse<Wallet>>("/wallet/topup", payload),

  getTransactions: () =>
    apiClient.get<ApiResponse<WalletTransaction[]>>("/wallet/transactions"),
};

export default walletService;
