# SEAPEDIA Frontend

**Live Demo:** [https://sea-pedia-fe.vercel.app](https://sea-pedia-fe.vercel.app)

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

---

## Panduan Demo End-to-End

Ikuti langkah-langkah berikut secara berurutan untuk mendemonstrasikan seluruh alur SEAPEDIA.

---

### 1. Guest — Browse Katalog & Baca Ulasan

1. Buka `http://localhost:3000` tanpa login.
2. Scroll halaman landing — lihat daftar ulasan publik di bagian bawah.
3. Klik **Katalog** di navbar → halaman `/products`.
4. Klik salah satu produk → halaman detail `/products/:id`.
5. Perhatikan: tombol "Tambah ke Keranjang" tidak muncul (bukan BUYER), form ulasan muncul untuk guest.
6. Isi ulasan sebagai guest (nama, rating bintang 1–5, komentar) → klik **Kirim Ulasan**.
7. Ulasan langsung muncul di daftar. *(Catatan: guest review tidak terikat akun.)*

---

### 2. Register Akun Multi-Role

1. Klik **Daftar** di navbar → `/register`.
2. Isi nama lengkap, email baru, password (min 6 karakter).
3. Centang **minimal dua role** sekaligus, misal: `BUYER` + `SELLER` + `DRIVER`.
4. Submit → otomatis masuk ke `/select-role`.

---

### 3. Pilih Role Aktif

1. Di halaman `/select-role`, pilih **SELLER**.
2. Perhatikan: navbar berubah menampilkan menu seller; BottomNav menampilkan Produk / Toko / Laporan.
3. Klik **Ganti Peran** di dropdown profil → pilih **BUYER** → konfirmasi navbar berubah lagi.

---

### 4. Seller — Buat Toko & Produk

1. Di select-role, pilih **SELLER**.
2. Pergi ke `/seller/store` → isi nama toko dan deskripsi → klik **Simpan**.
3. Pergi ke `/seller/products` → klik **Tambah Produk**.
4. Isi nama produk, deskripsi, harga (≥ 0), stok (≥ 0), URL gambar (opsional) → **Simpan**.
5. Buat minimal 2 produk agar demo keranjang lebih menarik.
6. Kembali ke daftar produk — lihat tombol **Edit** dan **Hapus** di tiap baris.

---

### 5. Buyer — Top Up Dompet & Tambah Alamat

1. Ganti role ke **BUYER**.
2. Pergi ke `/wallet`.
3. Klik **Top Up** → masukkan nominal (misal Rp 500.000) → konfirmasi.
4. Saldo dompet bertambah di kartu "Saldo Dompet".
5. Gulir ke bagian **Alamat** → klik **Tambah Alamat**.
6. Isi nama penerima, nomor telepon (format `08xxxxxxxxxx`), dan alamat lengkap → **Simpan**.
7. Tandai sebagai alamat utama jika perlu.

---

### 6. Buyer — Tambah ke Keranjang (One-Store Rule)

1. Buka `/products` → klik produk dari toko yang sudah dibuat.
2. Pilih jumlah (tombol +/−) → klik **Tambah ke Keranjang**.
3. Konfirmasi notifikasi "Ditambahkan ✓".
4. Tambah produk kedua dari **toko yang sama** → berhasil.
5. Coba tambah produk dari **toko lain** → muncul Dialog konfirmasi "Keranjang akan dikosongkan...". Klik **Batal** untuk membatalkan, atau **Lanjutkan** untuk mengganti isi keranjang.
6. Pergi ke `/cart` → lihat daftar item, jumlah, dan subtotal.

---

### 7. Admin — Buat Voucher

1. Login atau ganti role ke **ADMIN** (gunakan akun `admin@seapedia.id`).
2. Pergi ke `/admin/discounts`.
3. Klik **Buat Voucher** → isi:
   - Nama: `Diskon Spesial`
   - Kode: `DEMO10`
   - Tipe: `Persentase (%)`
   - Nilai: `10`
   - Sisa Pemakaian: `100`
   - Kedaluwarsa: tanggal besok atau lebih
4. Klik **Buat Voucher** → voucher muncul di tabel.
5. Kembali ke role BUYER.

---

### 8. Buyer — Checkout dengan Voucher

1. Dari `/cart`, klik **Checkout**.
2. Pilih alamat pengiriman dari daftar.
3. Pilih metode pengiriman (Pickup = gratis, Delivery = estimasi ongkir).
4. Di bagian **Kode Diskon**, masukkan `DEMO10` di field Voucher → klik **Pakai**.
5. Badge hijau muncul: "Diskon Spesial — Diskon 10%".
6. Lihat **Ringkasan Pembayaran** — tampilkan: Subtotal, Diskon, Ongkir, PPN (12%), Total.
7. Pastikan saldo dompet cukup (jika tidak → link Top Up muncul).
8. Klik **Bayar Rp X** → pesanan dibuat → redirect ke `/orders/:id`.
9. Di halaman detail, lihat `OrderTimeline` menampilkan status awal.

---

### 9. Seller — Proses Pesanan Masuk

1. Ganti role ke **SELLER**.
2. Pergi ke `/seller/orders` → pesanan dari buyer muncul di tabel.
3. Klik ID pesanan → halaman detail `/seller/orders/:id`.
4. Status pesanan saat ini terlihat di badge dan timeline.
5. Jika status `preparing` → tombol **Proses Pesanan** muncul di header.
6. Klik → pesanan diproses → timeline diperbarui → tombol hilang.
7. Klik **Segarkan** di bagian Riwayat Status untuk melihat perubahan terkini.

---

### 10. Driver — Ambil & Selesaikan Job

1. Ganti role ke **DRIVER** (atau login akun driver).
2. Pergi ke `/driver/jobs` → daftar job tersedia muncul (pesanan yang butuh pengiriman).
3. Klik nama toko di salah satu kartu → halaman detail `/driver/jobs/:id`.
4. Lihat info: toko asal, alamat tujuan, penghasilan, daftar item, timeline.
5. Klik **Ambil Job Ini** → status job berubah ke `TAKEN`.
6. Tombol berganti menjadi **Selesaikan Pengiriman**.
7. Klik → job selesai → penghasilan tercatat → kembali ke dashboard.
8. Di `/driver` → lihat StatCard "Total Penghasilan" dan "Job Selesai" bertambah.

---

### 11. Buyer — Konfirmasi Pesanan Selesai

1. Kembali ke role **BUYER**.
2. Pergi ke `/orders/:id`.
3. Klik **Segarkan** di bagian Riwayat Status.
4. Timeline menampilkan status terbaru setelah driver menyelesaikan pengiriman.
5. Lihat **Rincian Pembayaran** — nilai `discountAmount` dan `ppnAmount` adalah nilai final dari BE.

---

### 12. Admin — Monitor Platform

1. Login / ganti ke role **ADMIN**.
2. Pergi ke `/admin` → halaman Monitoring.
3. StatCard di atas menampilkan total Users dan Orders.
4. Klik tab **Orders** → lihat semua pesanan dengan status terkini.
5. Klik tab **Vouchers** → voucher `DEMO10` terlihat beserta sisa pemakaian.
6. Klik tab **Deliveries** → lihat job driver yang sudah selesai.
7. Klik tab **Overdue** → saat ini kosong (belum ada pesanan kedaluwarsa).

---

### 13. Admin — Simulasi Waktu & Order Kedaluwarsa

> Skenario ini mendemonstrasikan mekanisme otomatis penanganan pesanan yang terlambat.

1. Di `/admin/operations`, lihat kartu **Simulasi Waktu Sistem**.
2. Pastikan ada pesanan aktif yang belum selesai (misal: masih status `pending` atau `confirmed`).
3. Klik **Majukan 1 Hari** → Dialog konfirmasi muncul → klik **Ya, Majukan**.
4. Pesan sukses muncul; waktu server maju 1 hari. Ulangi beberapa kali hingga pesanan melewati batas waktu.
5. Klik **Proses Order Telat** → Dialog konfirmasi merah muncul → klik **Ya, Proses**.
6. Tabel **Pesanan Overdue** di bawah diperbarui otomatis.
7. Status pesanan yang kedaluwarsa berubah menjadi `cancelled` / `returned` (badge merah).
8. Kembali ke tab **Overdue** di halaman Monitoring → pesanan tampil dengan timestamp diperbarui.
9. Buka `/orders/:id` sebagai Buyer → timeline menampilkan status "Dikembalikan" dengan catatan waktu.

---

*Demo selesai. Seluruh alur dari guest hingga resolusi pesanan kedaluwarsa telah didemonstrasikan.*
