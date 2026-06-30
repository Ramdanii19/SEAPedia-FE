"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import productService from "../service/product.service";
import { productSchema, ProductFormValues } from "../schema/product.schema";
import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";

type Options = {
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
  onSuccess: () => void;
};

export function useProductForm({ productId, defaultValues, onSuccess }: Options) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.imageUrl ?? null
  );

  const isEdit = productId !== undefined;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined as unknown as number,
      stock: undefined as unknown as number,
      imageUrl: "",
      ...defaultValues,
    },
  });

  function onFileChange(file: File | null) {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(defaultValues?.imageUrl ?? null);
    }
  }

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = values.imageUrl || undefined;

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await apiClient.upload<ApiResponse<{ url: string }>>("/upload", fd);
        imageUrl = res.data.url;
      }

      const { imageUrl: _ignored, ...rest } = values;
      const payload: ProductFormValues = { ...rest, ...(imageUrl ? { imageUrl } : {}) };

      if (isEdit) {
        await productService.updateProduct(productId, payload);
      } else {
        await productService.createProduct(payload);
      }
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Gagal menyimpan produk");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    isSubmitting,
    error,
    isEdit,
    imageFile,
    imagePreview,
    onFileChange,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
