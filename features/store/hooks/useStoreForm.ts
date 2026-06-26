"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import storeService from "../service/store.service";
import { storeSchema, StoreFormValues } from "../schema/store.schema";
import { Store } from "../types/store.types";

export function useStoreForm() {
  const [existingStore, setExistingStore] = useState<Store | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: { storeName: "", description: "", addressDetail: "" },
  });

  const loadStore = useCallback(async () => {
    setIsLoadingStore(true);
    try {
      const res = await storeService.getMyStore();
      const store = res.data;
      setExistingStore(store);
      form.reset({
        storeName: store.storeName ?? "",
        description: store.description ?? "",
        addressDetail: store.addressDetail ?? "",
      });
    } catch {
      // 404 or no store yet → create mode, keep empty form
      setExistingStore(null);
    } finally {
      setIsLoadingStore(false);
    }
  }, [form]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  async function onSubmit(values: StoreFormValues) {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (existingStore) {
        const res = await storeService.updateStore(existingStore.id, values);
        setExistingStore(res.data);
        setSuccessMessage("Profil toko berhasil diperbarui.");
      } else {
        const res = await storeService.createStore(values);
        setExistingStore(res.data);
        setSuccessMessage("Toko berhasil dibuat!");
      }
    } catch (err: any) {
      const nameErrors: string[] | undefined = err?.errors?.storeName;
      const msg: string = err?.message ?? "";

      if (
        nameErrors?.length ||
        /sudah dipakai|already taken|duplicate|unique/i.test(msg)
      ) {
        form.setError("storeName", {
          message: nameErrors?.[0] ?? "Nama toko sudah dipakai, coba nama lain.",
        });
      } else {
        setError(msg || "Gagal menyimpan toko.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    existingStore,
    isLoadingStore,
    isSubmitting,
    successMessage,
    error,
    isEdit: !!existingStore,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
