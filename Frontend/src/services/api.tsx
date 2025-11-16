import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  phone: any;
  id: string;
  email: string;
  name: string;
  role: string;
  business?: Business;
}

export interface Business {
  id: string;
  name: string;
  address?: string;
  contactNumber?: string;
  email?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface DashboardData {
  totals: {
    totalProducts: number;
    todaysSales: number;
    lowStockItems: number;
    monthlyProfit: number;
    totalCustomers?: number;
    totalSales?: number;
  };
  recentSales: RecentSale[];
  lowStockAlerts: LowStockProduct[];
  salesTrend: SalesTrend[];
  productCategories: ProductCategory[];
}

export interface RecentSale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  saleDate: string;
  paymentStatus: string;
  items: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  lowStockAlert: number;
  category: string;
}

export interface SalesTrend {
  date: string;
  totalSales: number;
  transactionCount: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  productCount: number;
}

export interface ApiResponse<T> {
  sales: any;
  purchases: any;
  success: boolean;
  message: string;
  data: T;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  lowStockAlert: number;
  unit: string;
  category?: Category;
  categoryId: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    products: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
}

export interface CreateSaleData {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  saleItems: SaleItem[];
  subtotal: number;
  taxAmount: number;
  discount?: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE';
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIALLY_PAID';
  notes?: string;
}

export interface Sale {
  createdAt: string | number | Date;
  id: string;
  invoiceNumber: string;
  customer?: Customer;
  customerName?: string;
  customerPhone?: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  saleDate: string;
  notes?: string;
  saleItems: SaleItemWithProduct[];
}

export interface SaleItemWithProduct extends SaleItem {
  id: string;
  product: Product;
}

export interface SalesResponse {
  data: any;
  sales: Sale[];
  summary: {
    totalSales: number;
    totalAmount: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CustomersResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  costPrice: number;
  totalCost: number;
  product?: Product;
}

export interface CreatePurchaseData {
  supplierId: string;
  purchaseItems: PurchaseItem[];
  totalAmount: number;
  purchaseDate: string;
  notes?: string;
}

export interface Purchase {
  id: string;
  supplier: Supplier;
  totalAmount: number;
  purchaseDate: string;
  notes?: string;
  purchaseItems: PurchaseItemWithProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItemWithProduct extends PurchaseItem {
  id: string;
  product: Product;
}

export interface PurchasesResponse {
  data: any;
  purchases: Purchase[];
  summary: {
    totalPurchases: number;
    totalAmount: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}


// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials): Promise<{ data: LoginResponse }> => 
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
};

// Dashboard API
export const dashboardAPI = {
  getDashboardData: (): Promise<{ data: ApiResponse<DashboardData> }> => 
    api.get('/dashboard'),
};

// Products API
export const productsAPI = {
  getAllProducts: (params?: any) => api.get('/products', { params }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  createProduct: (productData: any) => api.post('/products', productData),
  updateProduct: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

// Customers API
export const customersAPI = {
  getAllCustomers: (params?: any): Promise<{ data: ApiResponse<CustomersResponse> }> => 
    api.get('/customers', { params }),
  getCustomer: (id: string) => api.get(`/customers/${id}`),
  createCustomer: (customerData: any) => api.post('/customers', customerData),
  updateCustomer: (id: string, customerData: any) => api.put(`/customers/${id}`, customerData),
  deleteCustomer: (id: string) => api.delete(`/customers/${id}`),
};

// Sales API
export const salesAPI = {
  getAllSales: (params?: any): Promise<{ data: ApiResponse<SalesResponse> }> => 
    api.get('/sales', { params }),
  getSale: (id: string) => api.get(`/sales/${id}`),
  createSale: (saleData: CreateSaleData) => api.post('/sales', saleData),
  updateSale: (id: string, saleData: any) => api.put(`/sales/${id}`, saleData),
  deleteSale: (id: string) => api.delete(`/sales/${id}`),
  getSalesStats: (params?: any) => api.get('/sales/stats', { params }),
};

// Categories API
export const categoriesAPI = {
  getAllCategories: (): Promise<{ data: ApiResponse<CategoriesResponse> }> => 
    api.get('/categories'),
  getCategory: (id: string) => api.get(`/categories/${id}`),
  createCategory: (categoryData: any) => api.post('/categories', categoryData),
  updateCategory: (id: string, categoryData: any) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

export const suppliersAPI = {
  getAllSuppliers: (params?: any): Promise<{ data: ApiResponse<any> }> => 
    api.get('/suppliers', { params }),
  getSupplier: (id: string) => api.get(`/suppliers/${id}`),
  createSupplier: (supplierData: any) => api.post('/suppliers', supplierData),
  updateSupplier: (id: string, supplierData: any) => api.put(`/suppliers/${id}`, supplierData),
  deleteSupplier: (id: string) => api.delete(`/suppliers/${id}`),
};

export const purchasesAPI = {
  getAllPurchases: (params?: any): Promise<{ data: ApiResponse<PurchasesResponse> }> => 
    api.get('/purchases', { params }),
  getPurchase: (id: string) => api.get(`/purchases/${id}`),
  createPurchase: (purchaseData: CreatePurchaseData) => api.post('/purchases', purchaseData),
  updatePurchase: (id: string, purchaseData: any) => api.put(`/purchases/${id}`, purchaseData),
  deletePurchase: (id: string) => api.delete(`/purchases/${id}`),
};

export const reportsAPI = {
  getSalesReport: (params?: any) => api.get('/reports/sales', { params }),
  getPurchaseReport: (params?: any) => api.get('/reports/purchases', { params }),
  getGSTReport: (params?: any) => api.get('/reports/gst', { params }),
};

export const settingsAPI = {
  updateProfile: (profileData: any) => api.put('/settings/profile', profileData),
  updateBusiness: (businessData: any) => api.put('/settings/business', businessData),
  updatePassword: (passwordData: any) => api.put('/settings/password', passwordData),
  updateSettings: (settingsData: any) => api.put('/settings/preferences', settingsData),
  generatePDF: (billData: any) => api.post('/settings/generate-pdf', billData),
};

export default api;
