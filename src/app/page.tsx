import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Management System
          </h1>
          <p className="text-gray-600">
            Sistem manajemen order yang sederhana
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fitur</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Tambah dan kelola order</li>
            <li>• Validasi stok real-time</li>
            <li>• Interface yang responsif</li>
          </ul>
        </div>

        <Link
          href="/orders"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lihat Order List
        </Link>
      </div>
    </div>
  );
}
