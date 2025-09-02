// Product interface sesuai dengan API response
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  url_image: string;
  stock: number;
}

// Simplified order item - just what we need for the table
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  url_image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
