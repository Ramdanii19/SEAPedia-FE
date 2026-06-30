"use client";

import { AlertTriangle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressCard } from "@/features/wallet";
import { DiscountInput } from "@/features/discount";
import { formatRupiah } from "@/utils/formatRupiah";
import { DeliveryMethodSelect } from "../components/DeliveryMethodSelect";
import { PriceSummary } from "../components/PriceSummary";
import { useCheckout } from "../hooks/useCheckout";

export function CheckoutSection() {
  const {
    cart,
    addresses,
    wallet,
    selectedAddressId,
    setSelectedAddressId,
    deliveryMethod,
    setDeliveryMethod,
    appliedVoucher,
    appliedPromo,
    voucherError,
    promoError,
    applyVoucher,
    applyPromo,
    removeVoucher,
    removePromo,
    isSubmitting,
    error,
    isBalanceSufficient,
    balance,
    subtotal,
    deliveryFee,
    discountAmount,
    ppnAmount,
    finalTotal,
    isLoading,
    submit,
  } = useCheckout();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[#6d7a77]">
        Keranjang kosong. Tambahkan produk sebelum checkout.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
      {/* Left column */}
      <div className="flex flex-col gap-6">
        {/* Alamat */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-[#191c1e]">Alamat Pengiriman</p>
          {addresses.length === 0 ? (
            <p className="text-sm text-[#6d7a77]">
              Belum ada alamat.{" "}
              <a href="/wallet" className="text-[#00685f] font-medium hover:underline">
                Tambah alamat
              </a>
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr._id}
                  address={addr}
                  selectable
                  selected={selectedAddressId === addr._id}
                  onSelect={(a) => setSelectedAddressId(a.id)}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Metode pengiriman */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-[#191c1e]">Metode Pengiriman</p>
          <DeliveryMethodSelect value={deliveryMethod} onChange={setDeliveryMethod} />
        </div>

        {/* Kode diskon */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex flex-col gap-4">
          <p className="text-sm font-semibold text-[#191c1e]">Kode Diskon</p>
          <DiscountInput
            label="Voucher"
            onApply={applyVoucher}
            onRemove={removeVoucher}
            applied={appliedVoucher}
            error={voucherError}
          />
          <div className="border-t border-[#bcc9c6]/30" />
          <DiscountInput
            label="Promo"
            onApply={applyPromo}
            onRemove={removePromo}
            applied={appliedPromo}
            error={promoError}
          />
        </div>

        {/* Ringkasan item */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-[#191c1e]">
            Produk ({cart.items.length} item)
          </p>
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white divide-y divide-[#bcc9c6]/30">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f2f4f6] overflow-hidden">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-sm text-[#191c1e] truncate">{item.product.name}</p>
                </div>
                <p className="text-sm font-medium text-[#191c1e] shrink-0 ml-3">
                  {item.quantity}× {formatRupiah(item.product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4 sticky top-20">
        {/* Saldo dompet */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-[#00685f]" />
            <span className="text-sm text-[#6d7a77]">Saldo Dompet</span>
          </div>
          <span className="text-sm font-semibold text-[#191c1e]">
            {formatRupiah(balance)}
          </span>
        </div>

        {/* Peringatan saldo kurang */}
        {!isBalanceSufficient && (
          <div className="flex items-start gap-2 rounded-xl border border-[#cc4636]/30 bg-[#cc4636]/5 p-3">
            <AlertTriangle size={15} className="shrink-0 text-[#cc4636] mt-0.5" />
            <p className="text-xs text-[#cc4636]">
              Saldo tidak cukup. Top up dompet Anda sebelum checkout.{" "}
              <a href="/wallet" className="font-semibold underline">
                Top Up
              </a>
            </p>
          </div>
        )}

        {/* Ringkasan harga */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
          <p className="text-sm font-semibold text-[#191c1e] mb-4">Ringkasan Pembayaran</p>
          <PriceSummary
            subtotal={subtotal}
            discountAmount={discountAmount}
            deliveryFee={deliveryFee}
            ppnAmount={ppnAmount}
            finalTotal={finalTotal}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#cc4636]">{error}</p>
        )}

        <Button
          onClick={submit}
          disabled={isSubmitting || !isBalanceSufficient || !selectedAddressId}
          className="w-full bg-[#00685f] hover:bg-[#005049] disabled:opacity-60"
        >
          {isSubmitting ? "Memproses..." : `Bayar ${formatRupiah(finalTotal)}`}
        </Button>

      </div>
    </div>
  );
}
