
export type Role = 'admin' | 'supplier' | 'distributor' | 'retailer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  supplierId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  performanceScore: number;
  products: string[]; // Product IDs
  createdAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockItems: number;
  topProducts: {
    id: string;
    name: string;
    quantity: number;
  }[];
}
