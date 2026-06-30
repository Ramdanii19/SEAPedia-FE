"use client";

import { useCallback, useEffect, useState } from "react";
import addressService from "../service/address.service";
import { Address } from "../types/wallet.types";
import { AddressFormValues } from "../schema/wallet.schema";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await addressService.listAddresses();
      setAddresses(res.data.addresses ?? []);
    } catch {
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createAddress(payload: AddressFormValues) {
    await addressService.createAddress(payload);
    await load();
  }

  async function updateAddress(id: string, payload: Partial<AddressFormValues>) {
    await addressService.updateAddress(id, payload);
    await load();
  }

  async function deleteAddress(id: string) {
    await addressService.deleteAddress(id);
    await load();
  }

  return { addresses, isLoading, reload: load, createAddress, updateAddress, deleteAddress };
}
