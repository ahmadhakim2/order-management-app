'use client';

import { useState, useEffect } from 'react';
import { OrderItem, Product } from '@/types/order';
import { productsApi } from '@/lib/productsApi';
import OrderList from '@/components/OrderList';
import OrderAddModal from '@/components/OrderAddModal';

export default function OrdersPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Load orders and products on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load products from API
      const productsData = await productsApi.getProducts();
      setProducts(productsData);

      // Set empty order items array
      setOrderItems([]);
    } catch (error) {
      console.error('Error loading data:', error);
      setProducts([]);
      setOrderItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrderItem = (data: { productId: string; quantity: number }) => {
    try {
      // Find product from local state
      const product = products.find(p => p.id === data.productId);

      if (!product) {
        alert('Produk tidak ditemukan. Silakan coba lagi.');
        return;
      }

      // Create order item with product data
      const newOrderItem: OrderItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        description: product.description,
        url_image: product.url_image,
        quantity: data.quantity,
        unitPrice: product.price,
        totalPrice: data.quantity * product.price,
      };

      setOrderItems([...orderItems, newOrderItem]);
    } catch (error) {
      console.error('Error creating order item:', error);
      alert('Gagal membuat order item. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
          {/* Test styling */}
          <div className="mt-4 p-4 bg-red-500 text-white rounded-lg">
            Test CSS Loading - Jika ini merah dengan text putih, CSS bekerja
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order List */}
      <OrderList
        orders={orderItems}
        products={products}
        onAddOrder={() => setShowModal(true)}
        onUpdateOrders={setOrderItems}
      />

      {/* Order Add Modal */}
      <OrderAddModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddOrderItem}
        products={products}
      />
    </div>
  );
}
