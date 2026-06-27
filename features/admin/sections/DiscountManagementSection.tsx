"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { DataTable, Column } from "../components/DataTable";
import { VoucherForm } from "../components/VoucherForm";
import { PromoForm } from "../components/PromoForm";
import adminService from "../service/admin.service";
import { AdminVoucher, AdminPromo } from "../types/admin.types";

function discountValueLabel(row: AdminVoucher | AdminPromo) {
  return row.discountType === "PERCENTAGE"
    ? `${row.discountValue}%`
    : formatRupiah(row.discountValue);
}

const VOUCHER_COLUMNS: Column<AdminVoucher>[] = [
  { key: "code", header: "Kode" },
  { key: "name", header: "Nama" },
  { key: "discountType", header: "Tipe" },
  { key: "discountValue", header: "Nilai", render: (_, row) => discountValueLabel(row) },
  { key: "remainingUsage", header: "Sisa Pemakaian" },
  { key: "expiryDate", header: "Kedaluwarsa", render: (v) => formatDate(v) },
];

const PROMO_COLUMNS: Column<AdminPromo>[] = [
  { key: "code", header: "Kode" },
  { key: "name", header: "Nama" },
  { key: "discountType", header: "Tipe" },
  { key: "discountValue", header: "Nilai", render: (_, row) => discountValueLabel(row) },
  { key: "expiryDate", header: "Kedaluwarsa", render: (v) => formatDate(v) },
];

export function DiscountManagementSection() {
  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const [isLoadingV, setIsLoadingV] = useState(true);
  const [isLoadingP, setIsLoadingP] = useState(true);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);

  async function loadVouchers() {
    setIsLoadingV(true);
    try {
      const res = await adminService.getVouchers();
      const data = res.data as any;
      setVouchers(Array.isArray(data) ? data : data?.vouchers ?? []);
    } catch {
      setVouchers([]);
    } finally {
      setIsLoadingV(false);
    }
  }

  async function loadPromos() {
    setIsLoadingP(true);
    try {
      const res = await adminService.getPromos();
      const data = res.data as any;
      setPromos(Array.isArray(data) ? data : data?.promos ?? []);
    } catch {
      setPromos([]);
    } finally {
      setIsLoadingP(false);
    }
  }

  useEffect(() => {
    loadVouchers();
    loadPromos();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Vouchers */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-[#191c1e]">Voucher</p>
          <Dialog open={voucherOpen} onOpenChange={setVoucherOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#00685f] hover:bg-[#005049] text-white gap-1.5">
                <Plus size={14} />
                Buat Voucher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Voucher Baru</DialogTitle>
              </DialogHeader>
              <VoucherForm
                onSuccess={() => {
                  setVoucherOpen(false);
                  loadVouchers();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          columns={VOUCHER_COLUMNS}
          rows={vouchers}
          isLoading={isLoadingV}
          emptyText="Belum ada voucher."
        />
      </div>

      {/* Promos */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-[#191c1e]">Promo</p>
          <Dialog open={promoOpen} onOpenChange={setPromoOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#00685f] hover:bg-[#005049] text-white gap-1.5">
                <Plus size={14} />
                Buat Promo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Promo Baru</DialogTitle>
              </DialogHeader>
              <PromoForm
                onSuccess={() => {
                  setPromoOpen(false);
                  loadPromos();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          columns={PROMO_COLUMNS}
          rows={promos}
          isLoading={isLoadingP}
          emptyText="Belum ada promo."
        />
      </div>
    </div>
  );
}
