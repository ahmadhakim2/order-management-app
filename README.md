# Order Management App

Aplikasi manajemen order yang sederhana dan modern, dibangun dengan Next.js 14, React 18, dan Tailwind CSS.

## 🚀 Fitur Utama

- **Order Management**: Tambah, edit, dan hapus order dengan mudah
- **Product Integration**: Integrasi dengan RESTful API untuk data produk
- **Stock Validation**: Validasi stok real-time saat mengubah quantity
- **Responsive Design**: Interface yang responsif untuk semua device
- **Modern UI**: Design yang clean dan user-friendly dengan Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **State Management**: React useState (local state)

## 📁 Project Structure

```
order-management-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout dengan navigation
│   │   ├── page.tsx            # Halaman beranda
│   │   └── orders/
│   │       └── page.tsx        # Halaman order list
│   ├── components/
│   │   ├── OrderList.tsx       # Tabel order list dengan scrollable
│   │   └── OrderAddModal.tsx   # Modal untuk tambah order
│   ├── lib/
│   │   └── productsApi.ts      # API service untuk produk
│   └── types/
│       └── order.ts            # TypeScript interfaces
├── public/                      # Static assets
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.ts              # Next.js configuration
└── package.json                 # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd order-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Aplikasi akan berjalan di development mode

## 📱 Cara Penggunaan

### 1. Halaman Beranda
- Landing page dengan overview fitur aplikasi
- Tombol "Lihat Order List" untuk masuk ke halaman order

### 2. Order List
- Tabel yang menampilkan semua order
- Tombol + dan - untuk mengubah quantity
- Konfirmasi hapus saat quantity = 0
- Validasi stok saat menambah quantity
- Tabel scrollable untuk device kecil

### 3. Add Order
- Modal untuk menambah order baru
- Dropdown pilihan produk
- Input quantity dengan validasi
- Preview produk (gambar, nama, deskripsi, stok)
- Kalkulasi otomatis total harga

## 🔧 Configuration

### API Configuration
File `src/lib/productsApi.ts` berisi konfigurasi API:
- Base URL: `https://recruitment-spe.vercel.app/api/v1`
- Authentication: Bearer token
- Endpoints: `/products` untuk fetch data produk

### Environment Variables
Jika diperlukan, buat file `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://recruitment-spe.vercel.app/api/v1
NEXT_PUBLIC_AUTH_TOKEN=your_bearer_token_here
```

## 📊 Data Structure

### Product Interface
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  url_image: string;
  stock: number;
}
```

### OrderItem Interface
```typescript
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  url_image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

## 🎨 UI Components

### OrderList
- Tabel scrollable dengan 4 kolom
- Product column dengan gambar dan deskripsi truncate
- Quantity controls dengan tombol + dan -
- Harga satuan dan subtotal
- Modal konfirmasi hapus dan alert stok

### OrderAddModal
- Modal dengan form validation
- Product selection dropdown
- Quantity input dengan validasi
- Preview produk yang dipilih
- Kalkulasi otomatis total

## 🚀 Build & Deploy

### Development
```bash
npm run dev          # Development server
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

### Production Build
```bash
npm run build
npm run start
```

**Dibuat dengan ❤️ menggunakan Next.js, React, dan Tailwind CSS**
