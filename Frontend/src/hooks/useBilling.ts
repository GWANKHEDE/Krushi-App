import { useState, useEffect } from 'react';
import { productsAPI, customersAPI, salesAPI, categoriesAPI } from '@/services/api';
import { Product, Customer, Category, CreateSaleData } from '@/services/api';

export const useBilling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsResponse, customersResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAllProducts(),
        customersAPI.getAllCustomers(),
        categoriesAPI.getAllCategories()
      ]);
      
      setProducts(productsResponse.data.data.products || []);
      setCustomers(customersResponse.data.data.customers || []);
      setCategories(categoriesResponse.data.data.categories || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
      console.error('Error loading billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (saleData: CreateSaleData) => {
    try {
      const response = await salesAPI.createSale(saleData);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create sale');
    }
  };

  const createCustomer = async (customerData: { name: string; phone?: string; email?: string }) => {
    try {
      const response = await customersAPI.createCustomer(customerData);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create customer');
    }
  };

  return {
    products,
    customers,
    categories,
    loading,
    error,
    createSale,
    createCustomer,
    refetch: loadInitialData
  };
};
