export function formatRupiah(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "Rp0";
  return "Rp" + n.toLocaleString("id-ID");
}
