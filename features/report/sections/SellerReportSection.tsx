"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet as WalletIcon, ArrowRight } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { ORDER_STATUS_LABEL } from "@/lib/labels";
import { useSellerRevenue } from "../hooks/useSellerRevenue";
import walletService from "@/features/wallet/service/wallet.service";

// ─── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const label = (ORDER_STATUS_LABEL as Record<string, string>)[status] ?? status;
  const styles: Record<string, string> = {
    COMPLETED:        "bg-[#e8f5e9] text-[#2e7d32]",
    DELIVERING:       "bg-[#e3f2fd] text-[#1565c0]",
    PACKING:          "bg-[#fff3e0] text-[#e65100]",
    WAITING_DELIVERY: "bg-[#f3e5f5] text-[#6a1b9a]",
    CANCELLED:        "bg-[#fde8e6] text-[#cc4636]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? "bg-[#f2f4f6] text-[#6d7a77]"}`}>
      {label}
    </span>
  );
}

// ─── SVG Line Chart ─────────────────────────────────────────────────────────
function LineChart({ data }: { data: { month: string; revenue: number }[] }) {
  const W = 480;
  const H = 160;
  const PAD = { top: 16, right: 16, bottom: 32, left: 64 };

  const values = data.map((d) => d.revenue);
  const maxVal = Math.max(...values, 1);
  const minVal = 0;

  const toX = (i: number) =>
    PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
  const toY = (v: number) =>
    PAD.top + (1 - (v - minVal) / (maxVal - minVal)) * (H - PAD.top - PAD.bottom);

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.revenue), ...d }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x.toFixed(1)} ${H - PAD.bottom} L ${PAD.left} ${H - PAD.bottom} Z`;

  // Y-axis ticks (5 levels)
  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => {
    const val = (maxVal / ticks) * i;
    return { y: toY(val), label: val === 0 ? "0" : `Rp ${(val / 1_000_000).toFixed(1).replace(".0", "")}jt` };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00685f" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00685f" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            y1={t.y}
            x2={W - PAD.right}
            y2={t.y}
            stroke="#e5e9e8"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 8}
            y={t.y + 4}
            textAnchor="end"
            fontSize="9"
            fill="#9aadaa"
          >
            {t.label}
          </text>
        </g>
      ))}

      {/* Area */}
      <path d={areaD} fill="url(#chartGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="#00685f" strokeWidth="2" strokeLinejoin="round" />

      {/* Dots + month labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#00685f" />
          <circle cx={p.x} cy={p.y} r="2.5" fill="white" />
          <text
            x={p.x}
            y={H - PAD.bottom + 14}
            textAnchor="middle"
            fontSize="10"
            fill="#9aadaa"
          >
            {p.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Progress bar ────────────────────────────────────────────────────────────
function ProgressBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#3d4947]">{label}</span>
        <span className="text-xs font-semibold text-[#00685f]">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#e0e8e6]">
        <div
          className="h-1.5 rounded-full bg-[#00685f] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main section ────────────────────────────────────────────────────────────
export function SellerReportSection() {
  const { data, isLoading, error } = useSellerRevenue();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    walletService
      .getWallet()
      .then((res) => {
        const d = (res as any).data ?? res;
        setWalletBalance(d?.wallet?.balance ?? 0);
      })
      .catch(() => setWalletBalance(0));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="py-10 text-center text-sm text-[#cc4636]">
        {error ?? "Gagal memuat laporan."}
      </p>
    );
  }

  const { totals, monthlyTrend, orders } = data;
  const curMonth = totals.curMonthRevenue;
  const prevMonth = totals.prevMonthRevenue;
  const growthPct =
    prevMonth === 0
      ? curMonth > 0 ? 100 : 0
      : Math.round(((curMonth - prevMonth) / prevMonth) * 100);
  const isGrowthUp = growthPct >= 0;

  const recent5 = orders.slice(0, 5);

  // Insight: completion rate & retention (derived from data)
  const completionRate =
    totals.totalOrders === 0
      ? 0
      : Math.round((totals.completedOrders / totals.totalOrders) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Top 3 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pendapatan Bulan Ini */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-2">
          <p className="text-xs text-[#6d7a77]">Pendapatan Bulan Ini</p>
          <p className="text-2xl font-bold text-[#191c1e] leading-tight">
            {formatRupiah(curMonth)}
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isGrowthUp
                  ? "bg-[#e8f5e9] text-[#2e7d32]"
                  : "bg-[#fde8e6] text-[#cc4636]"
              }`}
            >
              {isGrowthUp ? (
                <TrendingUp size={11} />
              ) : (
                <TrendingDown size={11} />
              )}
              {isGrowthUp ? "+" : ""}{growthPct}%
            </span>
            <span className="text-[11px] text-[#9aadaa]">vs bulan lalu</span>
          </div>
        </div>

        {/* Total Pendapatan */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-2">
          <p className="text-xs text-[#6d7a77]">Total Pendapatan</p>
          <p className="text-2xl font-bold text-[#191c1e] leading-tight">
            {formatRupiah(totals.totalRevenue)}
          </p>
          <p className="text-[11px] text-[#9aadaa]">Akumulasi dari semua transaksi selesai</p>
        </div>

        {/* Saldo Siap Tarik */}
        <div className="rounded-xl bg-[#00685f] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/80 uppercase tracking-widest">
              Saldo Siap Tarik
            </p>
            <WalletIcon size={14} className="text-white/50" />
          </div>
          <p className="text-2xl font-bold text-white leading-tight">
            {walletBalance === null ? "Rp —" : formatRupiah(walletBalance)}
          </p>
          <Link
            href="/wallet"
            className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#00685f] hover:bg-white/90 transition-colors"
          >
            Tarik Saldo Sekarang
          </Link>
        </div>
      </div>

      {/* Chart + Insight row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line chart */}
        <div className="lg:col-span-2 rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-[#191c1e]">Tren Pendapatan 6 Bulan</p>
              <p className="text-xs text-[#9aadaa] mt-0.5">
                Visualisasi pertumbuhan bulanan toko Anda
              </p>
            </div>
            <span className="rounded-lg border border-[#bcc9c6]/40 px-3 py-1 text-xs font-semibold text-[#6d7a77]">
              {new Date().getFullYear()}
            </span>
          </div>
          {monthlyTrend.every((m) => m.revenue === 0) ? (
            <div className="flex items-center justify-center h-40 text-sm text-[#9aadaa]">
              Belum ada data pendapatan
            </div>
          ) : (
            <LineChart data={monthlyTrend} />
          )}
        </div>

        {/* Insight Toko */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-[#f8fffe] p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">Insight Toko</p>
            <p className="text-xs text-[#6d7a77] mt-2 leading-relaxed">
              {completionRate >= 80
                ? `Tingkat penyelesaian pesanan Anda ${completionRate}% — pertahankan konsistensi ini untuk meningkatkan kepercayaan pembeli.`
                : `Tingkat penyelesaian pesanan Anda ${completionRate}%. Proses pesanan lebih cepat untuk meningkatkan rating toko.`}
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-1">
            <ProgressBar label="Target Penyelesaian" pct={completionRate} />
            <ProgressBar
              label="Pesanan Selesai"
              pct={
                totals.totalOrders === 0
                  ? 0
                  : Math.min(100, Math.round((totals.completedOrders / totals.totalOrders) * 100))
              }
            />
          </div>

          <Link
            href="/seller/revenue"
            className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#00685f] hover:underline"
          >
            Lihat Laporan Lengkap
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Transaksi Terakhir */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#bcc9c6]/30">
          <p className="text-sm font-semibold text-[#191c1e]">Transaksi Terakhir</p>
          <Link
            href="/seller/orders"
            className="text-xs font-semibold text-[#00685f] hover:underline"
          >
            Lihat Semua Transaksi
          </Link>
        </div>

        {recent5.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#9aadaa]">
            Belum ada transaksi.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fb] border-b border-[#bcc9c6]/30">
                {["Tanggal", "ID Pesanan", "Pelanggan", "Status", "Jumlah"].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent5.map((order) => {
                const d = new Date(order.createdAt);
                const dateStr = d.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const timeStr = d.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <tr
                    key={order.orderId}
                    className="border-b border-[#bcc9c6]/30 last:border-0 hover:bg-[#f8f9fb] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="text-xs text-[#3d4947]">{dateStr}</p>
                      <p className="text-[10px] text-[#9aadaa]">{timeStr}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono font-semibold text-[#00685f]">
                        #ORD-SEA-{order.orderId.slice(-4).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#3d4947]">
                      {order.buyerName}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-[#191c1e]">
                      {formatRupiah(order.finalTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
