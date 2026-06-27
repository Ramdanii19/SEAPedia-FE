import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { Address } from "../types/wallet.types";
import { AddressFormValues } from "../schema/wallet.schema";

const addressService = {
  listAddresses: () =>
    apiClient.get<ApiResponse<Address[]>>("/addresses"),

  createAddress: (payload: AddressFormValues) =>
    apiClient.post<ApiResponse<Address>>("/addresses", payload),

  updateAddress: (id: string, payload: Partial<AddressFormValues>) =>
    apiClient.patch<ApiResponse<Address>>(`/addresses/${id}`, payload),

  deleteAddress: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/addresses/${id}`),
};

export default addressService;
