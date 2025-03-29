
// Mock data for dashboard displays
// This would be replaced with actual API calls in a real application

import { DashboardStats, Order, Product, Supplier } from './types';

// Generate mock products
export const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
  id: `PRD${(i + 1).toString().padStart(3, '0')}`,
  name: `Product ${i + 1}`,
  description: `Description for Product ${i + 1}`,
  sku: `SKU-${(i + 1).toString().padStart(4, '0')}`,
  category: ['Electronics', 'Clothing', 'Food', 'Household'][Math.floor(Math.random() * 4)],
  price: Math.floor(Math.random() * 100) + 10,
  cost: Math.floor(Math.random() * 50) + 5,
  stockQuantity: Math.floor(Math.random() * 100),
  minStockLevel: 10,
  supplierId: `SUP${Math.floor(Math.random() * 5) + 1}`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
}));

// Generate mock suppliers
export const mockSuppliers: Supplier[] = Array.from({ length: 5 }, (_, i) => ({
  id: `SUP${i + 1}`,
  name: `Supplier ${i + 1}`,
  email: `supplier${i + 1}@example.com`,
  phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  address: `${Math.floor(Math.random() * 999) + 1} Main St, City, State, 12345`,
  performanceScore: Math.floor(Math.random() * 50) + 50,
  products: mockProducts.filter(p => p.supplierId === `SUP${i + 1}`).map(p => p.id),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
}));

// Generate mock orders
export const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const orderProducts = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    return {
      productId: product.id,
      quantity,
      price: product.price,
    };
  });
  
  const totalAmount = orderProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    id: `ORD${(i + 1).toString().padStart(3, '0')}`,
    customerId: `CUST${Math.floor(Math.random() * 100) + 1}`,
    products: orderProducts,
    status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)] as Order['status'],
    totalAmount,
    shippingAddress: `${Math.floor(Math.random() * 999) + 1} Customer St, City, State, 12345`,
    trackingNumber: Math.random() > 0.3 ? `TRK${Math.floor(Math.random() * 1000000)}` : undefined,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
  };
});

// Generate dashboard stats
export const getDashboardStats = (role: string): DashboardStats => {
  const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const lowStockItems = mockProducts.filter(product => product.stockQuantity < product.minStockLevel).length;
  
  // Top products
  const productSales: Record<string, number> = {};
  mockOrders.forEach(order => {
    order.products.forEach(product => {
      if (productSales[product.productId]) {
        productSales[product.productId] += product.quantity;
      } else {
        productSales[product.productId] = product.quantity;
      }
    });
  });
  
  const topProductIds = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, quantity]) => ({ 
      id, 
      name: mockProducts.find(p => p.id === id)?.name || 'Unknown Product',
      quantity 
    }));
    
  return {
    totalOrders: mockOrders.length,
    pendingOrders,
    totalRevenue,
    lowStockItems,
    topProducts: topProductIds,
  };
};

// Format orders for display in table
export const getFormattedOrders = () => {
  return mockOrders.map(order => ({
    id: order.id,
    customer: `Customer ${order.customerId.replace('CUST', '')}`,
    date: order.createdAt.toLocaleDateString(),
    amount: `$${order.totalAmount.toFixed(2)}`,
    status: order.status,
  })).sort((a, b) => {
    // Sort by date (newest first)
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};
