import { TableProperties } from "lucide-react";

export type Column<T = any> = {
  key: string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
};

type Props<T = any> = {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyText?: string;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  isLoading = false,
  emptyText = "Tidak ada data.",
}: Props<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-3 text-center rounded-xl border border-[#bcc9c6]/40 bg-white">
        <TableProperties size={28} className="text-[#bcc9c6]" />
        <p className="text-sm text-[#6d7a77]">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-x-auto">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr className="border-b border-[#bcc9c6]/30 bg-[#f8f9fb]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-[#bcc9c6]/30 last:border-0 hover:bg-[#f8f9fb] transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-sm text-[#3d4947]">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
