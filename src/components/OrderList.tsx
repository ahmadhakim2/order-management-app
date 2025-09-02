'use client';

import { useState } from 'react';
import { OrderItem, Product } from '@/types/order';

interface OrderListProps {
  orders: OrderItem[];
  products: Product[];
  onAddOrder: () => void;
  onUpdateOrders: (updatedOrders: OrderItem[]) => void;
}

export default function OrderList({ orders, products, onAddOrder, onUpdateOrders }: OrderListProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; itemId: string }>({ show: false, itemId: '' });
  const [showAlertModal, setShowAlertModal] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const showDeleteConfirmation = (itemId: string) => {
    setShowDeleteModal({ show: true, itemId });
  };

  const showAlert = (message: string) => {
    setShowAlertModal({ show: true, message });
  };

  const handleDeleteConfirm = () => {
    const { itemId } = showDeleteModal;

    // Remove item from orders array
    const updatedOrders = orders.filter(item => item.id !== itemId);
    onUpdateOrders(updatedOrders);
    setShowDeleteModal({ show: false, itemId: '' });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // Find the item
    const itemIndex = orders.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const item = orders[itemIndex];

    // Find product to check stock
    const product = products.find(p =>
      p.id === item.productId ||
      p.name === item.productName
    );

    // Handle quantity decrease to 0 or below
    if (newQuantity <= 0) {
      showDeleteConfirmation(itemId);
      setEditingItem(null);
      return;
    }

    // Check stock availability
    if (product && newQuantity > product.stock) {
      showAlert(`Stok tidak mencukupi! Stok tersedia: ${product.stock}`);
      setEditingItem(null);
      return;
    }

    // Update quantity
    const updatedOrders = [...orders];
    const updatedItem = { ...item, quantity: newQuantity };

    // Update item quantity and recalculate subtotal
    updatedItem.totalPrice = newQuantity * updatedItem.unitPrice;
    updatedOrders[itemIndex] = updatedItem;

    onUpdateOrders(updatedOrders);
    setEditingItem(null);
  };

  const calculateSubtotal = (item: OrderItem) => {
    return item.quantity * item.unitPrice;
  };

  const calculateTotal = () => {
    return orders.reduce((total, item) => {
      return total + calculateSubtotal(item);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order List</h1>
          <button
            onClick={onAddOrder}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Order
          </button>
        </div>

        {/* Order List Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Harga Satuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* Product Column */}
                    <td className="px-6 py-4 whitespace-nowrap min-w-[250px]">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.url_image ? (
                            <img
                              src={item.url_image}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          {/* Fallback placeholder */}
                          <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${item.url_image ? 'hidden' : ''}`}>
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.productName}
                          </div>
                          <div className="group relative">
                            <div className="text-sm text-gray-500 truncate max-w-[200px] cursor-help">
                              {item.description}
                            </div>
                            {/* Custom Tooltip */}
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                              <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 max-w-xs shadow-lg">
                                <div className="whitespace-normal break-words">
                                  {item.description}
                                </div>
                                {/* Tooltip Arrow */}
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity Column */}
                    <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                      {editingItem === item.id ? (
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            handleQuantityChange(item.id, newQuantity);
                          }}
                          onBlur={() => setEditingItem(null)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleQuantityChange(item.id, item.quantity);
                            }
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span
                            className="w-8 text-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded font-medium text-gray-900"
                            onClick={() => setEditingItem(item.id)}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Unit Price Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[150px]">
                      {formatCurrency(item.unitPrice)}
                    </td>

                    {/* Subtotal Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 min-w-[150px]">
                      {formatCurrency(calculateSubtotal(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        {orders.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-lg text-gray-600">Total Order:</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="mt-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada order</h3>
            <p className="text-gray-600 mb-4">Mulai dengan membuat order pertama Anda</p>
            <button
              onClick={onAddOrder}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Order
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus produk ini dari order list?
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal({ show: false, itemId: '' })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Peringatan</h3>
              <p className="text-sm text-gray-500">
                {showAlertModal.message}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setShowAlertModal({ show: false, message: '' })}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
