import { cn } from "@/lib/utils";
import { Product } from "../types/catalog.types";
import { ProductCard } from "./ProductCard";

type Props = {
  products: Product[];
  isLoading?: boolean;
  gridClassName?: string;
};

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f5f4] text-2xl">
        📦
      </div>
      <p className="text-sm font-semibold text-[#191c1e]">Belum ada produk</p>
      <p className="text-xs text-[#6d7a77]">Produk akan ditampilkan di sini</p>
    </div>
  );
}

export function ProductGrid({ products, isLoading = false, gridClassName }: Props) {
  if (isLoading) return <Spinner />;
  if (products.length === 0) return <EmptyState />;

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", gridClassName)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
