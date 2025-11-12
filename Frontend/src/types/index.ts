export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  stock: number;
  unit: string;
  price: number;
  description: string;
  imageUrl: string;
  usageInstructions?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: Date;
  status: 'pending' | 'paid' | 'cancelled';
}

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  supplier: string;
  purchaseDate: Date;
  total: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalProfit: number;
  lowStockProducts: number;
  todaySales: number;
  monthlyProfit: number;
}

export interface UserRole {
  id: string;
  role: 'customer' | 'admin';
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  type: "sale" | "purchase";
  amount: number;
  method: "cash" | "upi" | "bank";
  date: Date;
  referenceId: string;
  customerName?: string;
  supplierName?: string;
}