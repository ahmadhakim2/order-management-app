'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/types/order';

// Form schema
const orderItemSchema = z.object({
  productId: z.string().min(1, 'Produk harus dipilih'),
  quantity: z.number().min(1, 'Kuantitas minimal 1').max(999, 'Kuantitas maksimal 999'),
});

type OrderItemFormData = z.infer<typeof orderItemSchema>;

interface OrderAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OrderItemFormData) => void;
  products: Product[];
}

export default function OrderAddModal({ isOpen, onClose, onSave, products }: OrderAddModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
    reset,
    trigger,
    clearErrors,
  } = useForm<OrderItemFormData>({
    resolver: zodResolver(orderItemSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
    },
    mode: 'onChange',
  });

  const watchedQuantity = watch('quantity');
  const watchedProductId = watch('productId');

  const handleProductChange = (productId: string) => {
    if (!productId) {
      setSelectedProduct(null);
      setValue('productId', '');
      setValue('quantity', 1);
      clearErrors(['productId', 'quantity']);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setValue('productId', productId);
      setValue('quantity', 1);
      clearErrors(['productId', 'quantity']);

      // Trigger validation after a short delay to ensure state is updated
      setTimeout(() => {
        trigger(['productId', 'quantity']);
      }, 100);
    }
  };

  const handleQuantityChange = (quantity: number) => {
    if (!selectedProduct) return;

    // Validate quantity range
    let validQuantity = quantity;
    if (quantity > selectedProduct.stock) {
      validQuantity = selectedProduct.stock;
    }
    if (quantity < 1) {
      validQuantity = 1;
    }

    setValue('quantity', validQuantity);
    clearErrors('quantity');

    // Trigger validation after a short delay
    setTimeout(() => {
      trigger('quantity');
    }, 100);
  };

  const onSubmit = (data: OrderItemFormData) => {
    // Additional validation before submitting
    if (!selectedProduct || !data.productId || data.quantity < 1) {
      console.error('Invalid form data:', data);
      return;
    }

    // Validate quantity against stock
    if (data.quantity > selectedProduct.stock) {
      alert(`Kuantitas melebihi stok yang tersedia (${selectedProduct.stock})`);
      return;
    }

    onSave(data);
    reset();
    setSelectedProduct(null);
    clearErrors();
    onClose();
  };

  const handleClose = () => {
    reset();
    setSelectedProduct(null);
    clearErrors();
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const calculateTotal = () => {
    if (selectedProduct && watchedQuantity) {
      return selectedProduct.price * watchedQuantity;
    }
    return 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 text-white rounded-lg border border-gray-700 p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Order Add Page - Merchant</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Selection */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Nama Produk
            </label>
            <select
              {...register('productId')}
              onChange={(e) => handleProductChange(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[300px]"
            >
              <option value="">Dropdown</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - Stok: {product.stock}
                </option>
              ))}
            </select>
          </div>
          {errors.productId && (
            <p className="text-sm text-red-400 text-right">{errors.productId.message}</p>
          )}

          {/* Selected Product Display */}
          {selectedProduct && (
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={selectedProduct.url_image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik00MCAyNUM0Mi4wOTM5IDI1IDQ0IDI2LjkwNjEgNDQgMjlDNDQgMzEuMDkzOSA0Mi4wOTM5IDMzIDQwIDMzQzM3LjkwNjEgMzMgMzYgMzEuMDkzOSAzNiAyOUMzNiAyNi45MDYxIDM3LjkwNjEgMjUgNDAgMjVaIiBmaWxsPSIjN0M4Q0E2Ii8+CjxwYXRoIGQ9Ik0yMCA0MEMyMCAzNy45MDYxIDIxLjkwNjEgMzYgMjQgMzZIMjZDMjguMDkzOSAzNiAzMCAzNy45MDYxIDMwIDQwVjQyQzMwIDQ0LjA5MzkgMjguMDkzOSA0NiAyNiA0NkgyNEMyMS45MDYxIDQ2IDIwIDQ0LjA5MzkgMjAgNDJWNDBaIiBmaWxsPSIjN0M4Q0E2Ii8+CjxwYXRoIGQ9Ik01MCA0MEM1MCAzNy45MDYxIDUxLjkwNjEgMzYgNTQgMzZINTZDNjguMDkzOSAzNiA3MCAzNy45MDYxIDcwIDQwVjQyQzcwIDQ0LjA5MzkgNjguMDkzOSA0NiA2NiA0NkgyNEM2MS45MDYxIDQ2IDYwIDQ0LjA5MzkgNjAgNDJWNDBaIiBmaWxsPSIjN0M4Q0E2Ii8+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">{selectedProduct.description}</p>
                  <p className="text-sm text-gray-400">Stok tersedia: {selectedProduct.stock}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.stock || 1}
              disabled={!selectedProduct}
              {...register('quantity', { valueAsNumber: true })}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24 disabled:opacity-50"
              placeholder="1"
            />
          </div>
          {errors.quantity && (
            <p className="text-sm text-red-400 text-right">{errors.quantity.message}</p>
          )}

          {/* Unit Price */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Harga Satuan
            </label>
            <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-w-[150px] text-center">
              {selectedProduct ? formatCurrency(selectedProduct.price) : 'IDR 0'}
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Total Harga
            </label>
            <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-w-[150px] text-center font-medium">
              {formatCurrency(calculateTotal())}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!selectedProduct || !watchedProductId || watchedQuantity < 1}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
