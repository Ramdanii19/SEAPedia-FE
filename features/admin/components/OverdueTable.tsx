import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { DataTable, Column } from "./DataTable";
import { AdminOrder } from "../types/admin.types";

type Props = { orders: AdminOrder[]; isLoading?: boolean };

const COLUMNS: Column<AdminOrder>[] = [
  {
    key: "id",
    header: "ID Pesanan",
    render: (v) => (
      <span className="font-mono text-xs text-[#6d7a77]">
        #{String(v).slice(-8).toUpperCase()}
      </span>
    ),
  },
  { key: "buyerName", header: "Pembeli" },
  { key: "storeName", header: "Toko" },
  {
    key: "status",
    header: "Status",
    render: (v) => {
      const isReturned = /returned|cancelled|refund/i.test(String(v));
      return (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            isReturned
              ? "bg-[#cc4636]/10 text-[#cc4636]"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {v}
        </span>
      );
    },
  },
  {
    key: "finalTotal",
    header: "Total",
    render: (v) => formatRupiah(v),
  },
  {
    key: "createdAt",
    header: "Dibuat",
    render: (v) => formatDate(v),
  },
  {
    key: "updatedAt",
    header: "Diperbarui",
    render: (v) => (v ? formatDate(v) : "—"),
  },
];

export function OverdueTable({ orders, isLoading }: Props) {
  return (
    <DataTable
      columns={COLUMNS}
      rows={orders}
      isLoading={isLoading}
      emptyText="Tidak ada pesanan overdue."
    />
  );
}
