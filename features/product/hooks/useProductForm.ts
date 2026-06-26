"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import productService from "../service/product.service";
import { productSchema, ProductFormValues } from "../schema/product.schema";

type Options = {
  productId?: number;
  defaultValues?: Partial<ProductFormValues>;
  onSuccess: () => void;
};

export function useProductForm({ productId, defaultValues, onSuccess }: Options) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = productId !== undefined;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
      ...defaultValues,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    setError(null);

    // send undefined for empty imageUrl so backend ignores it
    const payload: ProductFormValues = {
      ...values,
      imageUrl: values.imageUrl || undefined,
    };

    try {
      if (isEdit) {
        await productService.updateProduct(productId, payload);
      } else {
        await productService.createProduct(payload);
      }
      form.reset();
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
    onSubmit: form.handleSubmit(onSubmit),
  };
}
