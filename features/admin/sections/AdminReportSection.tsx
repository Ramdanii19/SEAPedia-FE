"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp, TrendingDown, Users, ShoppingBag,
  Store, Truck, DollarSign,
} from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import apiClient from "@/services/apiClient";

// ─── Types ───────────────────────────────────────────────────────────────────
type MonthPoint = { month: string; revenue: number; orders: number };
type TopSeller  = { storeName: string; revenue: number; orders: number };
type RecentOrder = { orderId: string; buyerName: string; storeName: string; status: string; finalTotal: number; createdAt: string };

type AdminReport = {
  totals: {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    totalUsers: number;
    totalStores: number;
    totalDeliveries: number;
    curMonthRevenue: number;
    prevMonthRevenue: number;
  };
  countByStatus: Record<string, number>;
  monthlyTrend: MonthPoint[];
  topSellers: TopSeller[];
  recentOrders: RecentOrder[];
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  PACKING:          "Dikemas",
  WAITING_DELIVERY: "Menunggu Kurir",
  DELIVERING:       "Dikirim",
  COMPLETED:        "Selesai",
  RETURNED:         "Dikembalikan",
};
const STATUS_STYLE: Record<string, string> = {
  COMPLETED:        "bg-[#e8f5e9] text-[#2e7d32]",
  DELIVERING:       "bg-[#e3f2fd] text-[#1565c0]",
  PACKING:          "bg-[#fff3e0] text-[#e65100]",
  WAITING_DELIVERY: "bg-[#f3e5f5] text-[#6a1b9a]",
  RETURNED:         "bg-[#fde8e6] text-[#cc4636]",
};
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[status] ?? "bg-[#f2f4f6] text-[#6d7a77]"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

// ─── SVG Line Chart ──────────────────────────────────────────────────────────
function LineChart({ data }: { data: MonthPoint[] }) {
  const W = 480; const H = 160;
  const PAD = { top: 16, right: 16, bottom: 32, left: 64 };
  const values = data.map((d) => d.revenue);
  const maxVal = Math.max(...values, 1);
  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
  const toY = (v: number) => PAD.top + (1 - v / maxVal) * (H - PAD.top - PAD.bottom);
  const points = data.map((d, i) => ({ ...d, x: toX(i), y: toY(d.revenue) }));
  const pathD  = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaD  = pathD + ` L ${points[points.length - 1].x.toFixed(1)} ${H - PAD.bottom} L ${PAD.left} ${H - PAD.bottom} Z`;
  const ticks  = Array.from({ length: 5 }, (_, i) => {
    const val = (maxVal / 4) * i;
    return { y: toY(val), label: val === 0 ? "0" : `Rp ${(val / 1_000_000).toFixed(1).replace(".0", "")}jt` };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40">
      <defs>
        <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00685f" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00685f" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="#e5e9e8" strokeWidth="1" />
          <text x={PAD.left - 8} y={t.y + 4} textAnchor="end" fontSize="9" fill="#9aadaa">{t.label}</text>
        </g>
      ))}
      <path d={areaD} fill="url(#adminChartGrad)" />
      <path d={pathD} fill="none" stroke="#00685f" strokeWidth="2" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#00685f" />
          <circle cx={p.x} cy={p.y} r="2.5" fill="white" />
          <text x={p.x} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="10" fill="#9aadaa">{p.month}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ label, value, total, color = "#00685f" }: { label: string; value: number; total: number; color?: string }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#3d4947]">{label}</span>
        <span className="text-xs font-semibold text-[#191c1e]">{value} <span className="text-[#9aadaa] font-normal">({pct}%)</span></span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#e0e8e6]">
        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function AdminReportSection() {
  const [data, setData]       = useState<AdminReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<any>("/reports/admin")
      .then((res) => {
        const d = res.data ?? res;
        setData(d);
      })
      .catch((e) => setError(e?.message ?? "Gagal memuat laporan"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="py-10 text-center text-sm text-[#cc4636]">{error ?? "Gagal memuat laporan."}</p>;
  }

  const { totals, countByStatus, monthlyTrend, topSellers, recentOrders } = data;
  const growthPct = totals.prevMonthRevenue === 0
    ? (totals.curMonthRevenue > 0 ? 100 : 0)
    : Math.round(((totals.curMonthRevenue - totals.prevMonthRevenue) / totals.prevMonthRevenue) * 100);
  const isUp = growthPct >= 0;
  const totalOrdersForStatus = Object.values(countByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* Row 1 — 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pendapatan bulan ini */}
        <div className="rounded-xl bg-[#00685f] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Pendapatan Bulan Ini</p>
            <DollarSign size={15} className="text-white/50" />
          </div>
          <p className="text-2xl font-bold text-white leading-tight">{formatRupiah(totals.curMonthRevenue)}</p>
          <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 w-fit text-[11px] font-semibold bg-white/15 text-white">
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isUp ? "+" : ""}{growthPct}% vs bulan lalu
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-2">
          <p className="text-xs text-[#6d7a77]">Total Pendapatan Platform</p>
          <p className="text-2xl font-bold text-[#191c1e] leading-tight">{formatRupiah(totals.totalRevenue)}</p>
          <p className="text-[11px] text-[#9aadaa]">Dari {totals.completedOrders} pesanan selesai</p>
        </div>

        {/* Total Pesanan */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-2">
          <p className="text-xs text-[#6d7a77]">Total Pesanan</p>
          <p className="text-2xl font-bold text-[#191c1e] leading-tight">{totals.totalOrders}</p>
          <p className="text-[11px] text-[#9aadaa]">Selesai: {totals.completedOrders}</p>
        </div>
      </div>

      {/* Row 2 — 3 stat mini */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Pengguna",   value: totals.totalUsers,      icon: Users,       bg: "bg-[#bee5fd]",    ic: "text-[#3d6377]" },
          { label: "Total Toko",       value: totals.totalStores,     icon: Store,       bg: "bg-[#89f5e7]/40", ic: "text-[#00685f]" },
          { label: "Total Pengiriman", value: totals.totalDeliveries, icon: Truck,       bg: "bg-[#ffdad4]",    ic: "text-[#aa2e21]" },
        ].map(({ label, value, icon: Icon, bg, ic }) => (
          <div key={label} className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={ic} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#191c1e]">{value}</p>
              <p className="text-xs text-[#6d7a77]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 3 — Chart + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line chart */}
        <div className="lg:col-span-2 rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-[#191c1e]">Tren Pendapatan Platform (6 Bulan)</p>
              <p className="text-xs text-[#9aadaa] mt-0.5">Total revenue dari semua pesanan selesai</p>
            </div>
            <span className="rounded-lg border border-[#bcc9c6]/40 px-3 py-1 text-xs font-semibold text-[#6d7a77]">
              {new Date().getFullYear()}
            </span>
          </div>
          {monthlyTrend.every((m) => m.revenue === 0) ? (
            <div className="flex items-center justify-center h-40 text-sm text-[#9aadaa]">Belum ada data</div>
          ) : (
            <LineChart data={monthlyTrend} />
          )}
        </div>

        {/* Status breakdown */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-[#f8fffe] p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">Status Pesanan</p>
            <p className="text-xs text-[#6d7a77] mt-0.5">{totalOrdersForStatus} total pesanan</p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { key: "COMPLETED",        label: "Selesai",          color: "#2e7d32" },
              { key: "DELIVERING",       label: "Dikirim",          color: "#1565c0" },
              { key: "WAITING_DELIVERY", label: "Menunggu Kurir",   color: "#6a1b9a" },
              { key: "PACKING",          label: "Dikemas",          color: "#e65100" },
              { key: "RETURNED",         label: "Dikembalikan",     color: "#cc4636" },
            ].map(({ key, label, color }) => (
              <ProgressBar
                key={key}
                label={label}
                value={countByStatus[key] ?? 0}
                total={totalOrdersForStatus}
                color={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 4 — Top Sellers + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Sellers */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#bcc9c6]/30">
            <p className="text-sm font-semibold text-[#191c1e]">Top 5 Penjual</p>
            <p className="text-xs text-[#6d7a77] mt-0.5">Berdasarkan total revenue</p>
          </div>
          {topSellers.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#9aadaa]">Belum ada data</p>
          ) : (
            <div className="divide-y divide-[#bcc9c6]/30">
              {topSellers.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[#f8f9fb] transition-colors">
                  <span className="w-6 h-6 rounded-full bg-[#e8f4f3] text-[#00685f] text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#191c1e] truncate">{s.storeName}</p>
                    <p className="text-xs text-[#6d7a77]">{s.orders} pesanan selesai</p>
                  </div>
                  <p className="text-sm font-semibold text-[#00685f] shrink-0">{formatRupiah(s.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#bcc9c6]/30">
            <p className="text-sm font-semibold text-[#191c1e]">Pesanan Terbaru</p>
            <p className="text-xs text-[#6d7a77] mt-0.5">10 pesanan terakhir di platform</p>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#9aadaa]">Belum ada pesanan</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[380px]">
                <thead>
                  <tr className="bg-[#f8f9fb] border-b border-[#bcc9c6]/30">
                    {["Pembeli", "Toko", "Status", "Total"].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.orderId} className="border-b border-[#bcc9c6]/30 last:border-0 hover:bg-[#f8f9fb] transition-colors">
                      <td className="py-3 px-4 text-sm text-[#191c1e]">{o.buyerName}</td>
                      <td className="py-3 px-4 text-sm text-[#3d4947] max-w-[120px] truncate">{o.storeName}</td>
                      <td className="py-3 px-4"><StatusBadge status={o.status} /></td>
                      <td className="py-3 px-4 text-sm font-semibold text-[#191c1e] whitespace-nowrap">{formatRupiah(o.finalTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
