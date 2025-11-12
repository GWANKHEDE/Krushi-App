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
  success: boolean;
  message: string;
  data: T;
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
  getAllProducts: () => api.get('/products'),
  getProduct: (id: string) => api.get(`/products/${id}`),
  createProduct: (productData: any) => api.post('/products', productData),
  updateProduct: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

export default api;