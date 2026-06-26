import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/features/catalog/types/catalog.types";
import { formatRupiah } from "@/utils/formatRupiah";

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
};

export function ProductRow({ product, onEdit, onDelete }: Props) {
  return (
    <tr className="border-b border-[#bcc9c6]/30 hover:bg-[#f8f9fb] transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-9 h-9 rounded-lg object-cover shrink-0 bg-[#f2f4f6]"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[#f2f4f6] shrink-0" />
          )}
          <span className="text-sm font-medium text-[#191c1e] line-clamp-1">
            {product.name}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-[#3d4947]">
        {formatRupiah(product.price)}
      </td>
      <td className="py-3 px-4 text-sm text-[#3d4947]">{product.stock}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onEdit(product)}
            title="Edit produk"
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onDelete(product.id)}
            title="Hapus produk"
            className="border-[#cc4636]/40 text-[#cc4636] hover:bg-[#cc4636]/5"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
