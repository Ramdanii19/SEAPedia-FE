import type { Order } from "@/features/checkout/types/order.types";

function formatRp(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "Rp0";
  return "Rp" + n.toLocaleString("id-ID");
}

function formatDateFull(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  confirmed: "Dikonfirmasi",
  preparing: "Diproses",
  ready_for_pickup: "Siap Diambil",
  on_delivery: "Dalam Pengiriman",
  delivered: "Telah Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const DELIVERY_LABEL: Record<string, string> = {
  INSTANT: "Seapedia Express – Sameday",
  NEXT_DAY: "Seapedia Express – Next Day",
  REGULAR: "Seapedia Express – Regular",
};

export async function generateInvoicePdf(order: Order): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;

  // ── helpers ──────────────────────────────────────────────────────────────
  const line = (x1: number, y1: number, x2: number, y2: number, color = "#bcc9c6") => {
    doc.setDrawColor(color);
    doc.line(x1, y1, x2, y2);
  };

  const text = (
    str: string,
    x: number,
    yPos: number,
    opts?: { size?: number; bold?: boolean; color?: string; align?: "left" | "right" | "center" }
  ) => {
    doc.setFontSize(opts?.size ?? 10);
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setTextColor(opts?.color ?? "#191c1e");
    doc.text(str, x, yPos, { align: opts?.align ?? "left" });
  };

  // ── HEADER band ──────────────────────────────────────────────────────────
  doc.setFillColor("#00685f");
  doc.rect(0, 0, W, 28, "F");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#ffffff");
  doc.text("SEAPEDIA", margin, 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#a3cac7");
  doc.text("Marketplace Produk Bahari Indonesia", margin, 18);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#ffffff");
  doc.text("INVOICE", W - margin, 12, { align: "right" });

  const shortId = order._id.slice(-8).toUpperCase();
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#a3cac7");
  doc.text(`#${shortId}`, W - margin, 18, { align: "right" });

  y = 38;

  // ── Meta row (Date + Status) ─────────────────────────────────────────────
  text("Tanggal Pesanan", margin, y, { size: 8, color: "#6d7a77" });
  text("Status", W / 2, y, { size: 8, color: "#6d7a77" });

  y += 5;
  text(formatDateFull(order.createdAt), margin, y, { size: 9, bold: true });
  text(STATUS_LABEL[order.status] ?? order.status, W / 2, y, { size: 9, bold: true, color: "#00685f" });

  y += 10;
  line(margin, y, W - margin, y);
  y += 7;

  // ── Two-column: Store + Shipping ─────────────────────────────────────────
  const colMid = W / 2 + 2;

  text("Toko Penjual", margin, y, { size: 8, color: "#6d7a77" });
  text("Alamat Pengiriman", colMid, y, { size: 8, color: "#6d7a77" });
  y += 5;

  text(order.store?.storeName ?? "—", margin, y, { size: 9, bold: true });
  text(order.shippingRecipientName ?? "—", colMid, y, { size: 9, bold: true });
  y += 4.5;

  text(DELIVERY_LABEL[order.deliveryMethod] ?? order.deliveryMethod, margin, y, { size: 8, color: "#3d4947" });

  // wrap shipping address
  const addrLines = doc.splitTextToSize(order.shippingAddress ?? "—", contentW / 2 - 5);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#3d4947");
  doc.text(addrLines, colMid, y);
  y += Math.max(5, addrLines.length * 4.5);

  if (order.shippingPhone) {
    text(order.shippingPhone, colMid, y, { size: 8, color: "#6d7a77" });
    y += 5;
  }

  y += 4;
  line(margin, y, W - margin, y);
  y += 8;

  // ── Items table ──────────────────────────────────────────────────────────
  text("RINCIAN PRODUK", margin, y, { size: 8, bold: true, color: "#6d7a77" });
  y += 5;

  // Table header
  doc.setFillColor("#f2f4f6");
  doc.rect(margin, y - 4, contentW, 7, "F");

  const c1 = margin + 2;
  const c2 = W - margin - 55;
  const c3 = W - margin - 30;
  const c4 = W - margin - 2;

  text("Produk", c1, y, { size: 8, bold: true, color: "#6d7a77" });
  text("Qty", c2, y, { size: 8, bold: true, color: "#6d7a77", align: "right" });
  text("Harga Satuan", c3, y, { size: 8, bold: true, color: "#6d7a77", align: "right" });
  text("Subtotal", c4, y, { size: 8, bold: true, color: "#6d7a77", align: "right" });
  y += 6;

  for (const item of order.items) {
    const name = item.productName;
    const nameLines = doc.splitTextToSize(name, contentW - 80);

    // Alternate row background
    if (order.items.indexOf(item) % 2 === 1) {
      doc.setFillColor("#fafafa");
      doc.rect(margin, y - 3.5, contentW, nameLines.length * 5 + 2, "F");
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#191c1e");
    doc.text(nameLines, c1, y);

    text(String(item.quantity), c2, y, { size: 9, align: "right" });
    text(formatRp(item.price), c3, y, { size: 9, align: "right" });
    text(formatRp(item.subtotal), c4, y, { size: 9, bold: true, align: "right" });

    y += nameLines.length * 5 + 2;
    line(margin, y - 1, W - margin, y - 1, "#f2f4f6");
  }

  y += 5;
  line(margin, y, W - margin, y);
  y += 8;

  // ── Payment summary ───────────────────────────────────────────────────────
  text("RINGKASAN PEMBAYARAN", margin, y, { size: 8, bold: true, color: "#6d7a77" });
  y += 8;

  const labelX = W - margin - 75;
  const valueX = W - margin;

  const summaryRows: Array<{ label: string; value: string; red?: boolean }> = [
    { label: "Subtotal untuk Produk", value: formatRp(order.subtotal) },
    { label: "Total Ongkos Kirim", value: formatRp(order.deliveryFee) },
    ...(order.discountAmount > 0
      ? [{ label: "Diskon", value: `–${formatRp(order.discountAmount)}`, red: true }]
      : []),
    { label: "PPN (12%)", value: formatRp(order.ppnAmount) },
  ];

  for (const row of summaryRows) {
    text(row.label, labelX, y, { size: 9, color: "#6d7a77" });
    text(row.value, valueX, y, { size: 9, align: "right", color: row.red ? "#cc4636" : "#191c1e" });
    y += 6;
  }

  // Total row
  y += 1;
  doc.setFillColor("#00685f");
  doc.roundedRect(labelX - 2, y - 4.5, valueX - labelX + 4, 9, 2, 2, "F");

  text("Total Pembayaran", labelX, y, { size: 10, bold: true, color: "#ffffff" });
  text(formatRp(order.finalTotal), valueX, y, { size: 10, bold: true, align: "right", color: "#ffffff" });
  y += 12;

  // Payment method
  text("Metode Pembayaran:", labelX, y, { size: 8, color: "#6d7a77" });
  text("Saldo Dompet Seapedia", valueX, y, { size: 8, bold: true, align: "right" });
  y += 10;

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = 287;
  line(margin, footerY - 5, W - margin, footerY - 5);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#6d7a77");
  doc.text("Dokumen ini dibuat secara otomatis oleh sistem Seapedia.", margin, footerY);
  doc.text(`Dicetak pada ${formatDateFull(new Date().toISOString())}`, W - margin, footerY, { align: "right" });

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save(`invoice-seapedia-${shortId}.pdf`);
}
