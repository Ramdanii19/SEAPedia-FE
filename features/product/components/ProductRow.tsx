import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/features/catalog/types/catalog.types";

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

function formatHarga(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="inline-flex items-center rounded-full bg-[#fde8e6] px-2.5 py-0.5 text-xs font-semibold text-[#cc4636]">
        0 Unit
      </span>
    );
  if (stock <= 5)
    return (
      <span className="inline-flex items-center rounded-full bg-[#fff3e0] px-2.5 py-0.5 text-xs font-semibold text-[#e65100]">
        {stock} Unit
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-xs font-semibold text-[#2e7d32]">
      {stock} Unit
    </span>
  );
}

export function ProductRow({ product, onEdit, onDelete }: Props) {
  const sku = `SKU-${product._id.slice(-6).toUpperCase()}`;

  return (
    <tr className="border-b border-[#bcc9c6]/30 hover:bg-[#f8f9fb] transition-colors">
      {/* Foto */}
      <td className="py-3 px-4 w-16">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover bg-[#f2f4f6]"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[#f2f4f6]" />
        )}
      </td>

      {/* Nama Produk + SKU */}
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-[#191c1e] line-clamp-1">{product.name}</p>
        <p className="text-xs text-[#6d7a77] mt-0.5">{sku}</p>
      </td>

      {/* Harga */}
      <td className="py-3 px-4 text-sm text-[#3d4947] whitespace-nowrap">
        {formatHarga(product.price)}
      </td>

      {/* Stok */}
      <td className="py-3 px-4">
        <StockBadge stock={product.stock} />
      </td>

      {/* Aksi */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            title="Edit produk"
            className="p-1.5 rounded text-[#6d7a77] hover:text-[#00685f] hover:bg-[#00685f]/5 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            title="Hapus produk"
            className="p-1.5 rounded text-[#6d7a77] hover:text-[#cc4636] hover:bg-[#cc4636]/5 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
