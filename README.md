# SEAPEDIA Frontend

Marketplace maritim berbasis Next.js (App Router). Frontend ini mengonsumsi REST API SEAPEDIA Backend yang sudah selesai.

---

## Instalasi & Menjalankan

```bash
# 1. Install dependensi
npm install

# 2. Salin file env dan isi nilainya
cp .env.example .env.local

# 3. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variabel | Keterangan | Contoh |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL backend (tanpa trailing slash) | `http://localhost:5000/api` |

---

## Arsitektur

### Feature-Based

Setiap fitur domain disimpan dalam `features/<nama>/` dengan lapisan yang konsisten:

```
service  →  hook  →  component  →  section  →  view  →  app/.../page.tsx
```

| Lapisan | Tanggung jawab |
|---|---|
| `service` | Semua panggilan HTTP via `apiClient`. Tidak ada `fetch` di luar lapisan ini. |
| `hook` | State management + business logic. Memanggil service, mengekspos data & action ke UI. |
| `component` | UI kecil, bisa dipakai ulang di dalam fitur (misal: `ProductCard`, `OrderTimeline`). |
| `section` | Rakitan komponen menjadi blok halaman yang bermakna. Menggunakan satu hook utama. |
| `view` | Satu halaman penuh. Hanya menyusun sections + judul. Tidak memanggil hook sendiri. |
| `page.tsx` | Route tipis — hanya mengimpor View. Async params di-unwrap di sini. |

### Aturan Wajib

- **Component tidak pernah memanggil API langsung** — selalu lewat `service`.
- **Import antar fitur** harus lewat barrel `@/features/<x>` (bukan path dalam folder).
- Komponen UI generik (Button, Input, Dialog, dll.) → `components/ui/`.
- Layout (Navbar, DashboardShell, BottomNav) → `components/layout/`.

### Struktur Folder

```
├── app/
│   ├── (public)/          # landing, katalog, detail produk, login, register
│   ├── (buyer)/           # wallet, cart, checkout, orders, reports
│   ├── (seller)/seller/   # dashboard, store, products, orders, revenue
│   ├── (driver)/driver/   # dashboard, jobs
│   ├── (admin)/admin/     # monitoring, discounts, operations
│   ├── profile/           # profil semua role
│   └── select-role/       # pilih active role setelah login
├── components/
│   ├── ui/                # shadcn/ui (Button, Input, Dialog, Checkbox, Textarea)
│   └── layout/            # Navbar, BottomNav, DashboardShell, RoleBadge
├── contexts/
│   └── AuthContext.tsx    # user, token, activeRole, setSession, clearSession
├── features/
│   ├── auth/              # login, register, role selection, profile, RouteGuard
│   ├── catalog/           # landing, product listing & detail (publik)
│   ├── review/            # ulasan produk (1 user 1 review, edit/delete)
│   ├── store/             # manajemen toko seller
│   ├── product/           # CRUD produk seller
│   ├── wallet/            # dompet + topup + alamat buyer
│   ├── cart/              # keranjang one-store + CartContext
│   ├── checkout/          # checkout, order history, order detail, timeline, seller incoming
│   ├── discount/          # DiscountInput (voucher/promo) + service
│   ├── report/            # laporan pengeluaran buyer & pendapatan seller
│   ├── delivery/          # job listing, job detail, driver dashboard
│   └── admin/             # monitoring, voucher/promo management, simulasi waktu
├── lib/
│   ├── enums.ts           # ORDER_STATUS, DELIVERY_METHOD, ROLES, DELIVERY_JOB_STATUS
│   ├── labels.ts          # Label Indonesia per enum value
│   └── session.ts         # SESSION_KEYS, getToken(), clearStorageSession()
├── services/
│   └── apiClient.ts       # HTTP client tunggal (auth header, 401 interceptor)
└── utils/
    ├── formatRupiah.ts
    ├── formatDate.ts
    └── roleHome.ts
```

---

## Aturan One-Store Checkout

Keranjang hanya boleh berisi produk dari **satu toko**. Jika buyer mencoba menambah produk dari toko berbeda:

1. Backend mengembalikan error (pesan mengandung kata "different store" / "beda toko" / "toko lain").
2. `CartContext` mendeteksi pesan tersebut via regex `/different store|beda toko|toko lain|store/i`.
3. Dialog konfirmasi muncul: **"Keranjang akan dikosongkan dan diganti produk dari toko baru. Lanjutkan?"**
4. Jika buyer konfirmasi → `clear()` keranjang → tambah produk baru.
5. Jika batal → produk tidak ditambahkan.

Logika ini ada di `features/cart/contexts/CartContext.tsx`.

---

## PPN & Diskon

### PPN 12%

- Dihitung dari `subtotal` (sebelum diskon dan ongkir).
- Formula: `ppnAmount = Math.round(subtotal * 0.12)`
- Nilai yang ditampilkan di `PriceSummary` checkout adalah **estimasi FE**.
- **Nilai final dikonfirmasi oleh backend** saat order dibuat dan tersimpan di `order.ppnAmount`.

### Diskon (Voucher + Promo)

- Voucher dan promo **boleh digabung** sekaligus dalam satu checkout.
- Estimasi diskon FE dihitung oleh `calcDiscount()` di `useCheckout.ts`:
  - `PERCENTAGE`: `Math.round(subtotal * discountValue / 100)`
  - `FIXED`: `discountValue`
- Urutan kalkulasi FE (estimasi): `subtotal − diskon + ongkir + PPN = total`
- Backend adalah **source of truth** — nilai yang tersimpan di order adalah hasil kalkulasi BE.
- Kode voucher/promo divalidasi dulu ke BE via `discountService.checkVoucher/checkPromo` sebelum checkout, memberikan feedback cepat jika kode kedaluwarsa atau habis.

---

## Keamanan (Frontend Layer)

> Semua mekanisme di bawah adalah lapisan UX / defense-in-depth. **Otorisasi sebenarnya tetap di backend.**

### XSS Prevention

- Semua konten user-generated (komentar review, nama toko, deskripsi produk, nama produk) dirender via JSX biasa — `{value}` — yang di-escape otomatis oleh React menjadi text node.
- **Tidak ada `dangerouslySetInnerHTML`** di seluruh codebase (diverifikasi via grep pada Branch 11).

### Validasi Form

Semua form menggunakan **Zod schema + react-hook-form** dengan pesan error yang jelas:

| Form | Validasi utama |
|---|---|
| Register | email regex, nama min 3, password min 6, roles min 1 |
| Login | email regex, password min 6 |
| Alamat | nomor telepon regex `^(\+62\|62\|0)[0-9]{7,14}$`, nama min 2, alamat min 5 |
| Produk | harga ≥ 0, stok integer ≥ 0, URL gambar valid atau kosong |
| Top-up | jumlah > 0 |
| Review | rating 1–5, komentar max 500 karakter |
| Voucher/Promo | nilai diskon > 0, sisa pemakaian > 0, tanggal kedaluwarsa wajib |

### Route Guard

Semua route privat dibungkus `RouteGuard` (`features/auth/components/RouteGuard.tsx`):

| Route group | Role yang diizinkan |
|---|---|
| `app/(buyer)/**` | `BUYER` |
| `app/(seller)/**` | `SELLER` |
| `app/(driver)/**` | `DRIVER` |
| `app/(admin)/**` | `ADMIN` |

Behavior guard:
- Belum login → redirect `/login`
- Login tapi belum pilih role → redirect `/select-role`
- Role salah → redirect ke dashboard role yang aktif (`roleHome(activeRole)`)

Menu navigasi (Navbar & BottomNav) juga hanya menampilkan item sesuai `activeRole`.

### Token Expiry

`apiClient.ts` mencegat respons `401`:
1. Memanggil `clearStorageSession()` — menghapus `token` dan `user` dari localStorage.
2. `window.location.replace("/login")` — hard redirect (React state otomatis reset).

Logout manual (`useLogout`) memanggil endpoint BE logout, lalu `clearSession()` (localStorage + React state), lalu redirect ke `/`.

---

## Daftar Halaman per Role

### Guest / Publik

| URL | Halaman |
|---|---|
| `/` | Landing page + ulasan |
| `/products` | Katalog produk |
| `/products/:id` | Detail produk |
| `/login` | Login |
| `/register` | Register |

### Buyer

| URL | Halaman |
|---|---|
| `/wallet` | Dompet, top-up, manajemen alamat |
| `/cart` | Keranjang belanja |
| `/checkout` | Checkout (pilih alamat, metode kirim, voucher/promo) |
| `/orders` | Riwayat pesanan |
| `/orders/:id` | Detail pesanan + timeline status |
| `/reports` | Laporan pengeluaran |

### Seller

| URL | Halaman |
|---|---|
| `/seller` | Dashboard seller |
| `/seller/store` | Manajemen toko |
| `/seller/products` | CRUD produk |
| `/seller/orders` | Pesanan masuk (dapat proses order) |
| `/seller/orders/:id` | Detail pesanan + tombol "Proses Pesanan" |
| `/seller/revenue` | Laporan pendapatan |

### Driver

| URL | Halaman |
|---|---|
| `/driver` | Dashboard driver (earning + riwayat job) |
| `/driver/jobs` | Daftar job tersedia |
| `/driver/jobs/:id` | Detail job (ambil / selesaikan pengiriman) |

### Admin

| URL | Halaman |
|---|---|
| `/admin` | Monitoring semua koleksi (Users/Stores/Products/Orders/Vouchers/Promos/Deliveries/Overdue) |
| `/admin/discounts` | Buat voucher & promo |
| `/admin/operations` | Simulasi waktu + proses order overdue |

---

## Akun Demo (sesuai seeder Backend)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@seapedia.id` | `admin123` |
| Seller | `seller@seapedia.id` | `seller123` |
| Buyer | `buyer@seapedia.id` | `buyer123` |
| Driver | `driver@seapedia.id` | `driver123` |

> Akun ini dibuat oleh seeder backend. Sesuaikan jika seeder BE menggunakan kredensial berbeda.

---

## Security Note

Frontend guard adalah **lapisan UX** semata — mencegah navigasi tidak sengaja dan menyembunyikan UI yang tidak relevan. Seorang pengguna yang memanipulasi localStorage atau memanggil API langsung tetap akan ditolak oleh backend dengan HTTP 401/403. Jangan pernah mengandalkan FE guard sebagai batas keamanan.
