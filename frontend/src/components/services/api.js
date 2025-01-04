import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email, password, name, role) => {
  const response = await api.post('/auth/register', { email, password, name, role });
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// User Management
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Product Management
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Category Management
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

// Stock Transactions
export const createStockTransaction = async (transactionData) => {
  const response = await api.post('/stock-transactions', transactionData);
  return response.data;
};

export const getStockTransactions = async () => {
  const response = await api.get('/stock-transactions');
  return response.data;
};

export const removeStockTransaction = async (transactionId) => {
  const response = await api.delete(`/stock-transactions/${transactionId}`);
  return response.data;
};


// Supplier Management
export const getSuppliers = async () => {
  const response = await api.get('/suppliers');
  return response.data;
};

export const createSupplier = async (supplierData) => {
  const response = await api.post('/suppliers', supplierData);
  return response.data;
};

export const updateSupplier = async (id, supplierData) => {
  const response = await api.put(`/suppliers/${id}`, supplierData);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};

// Supplier Orders
export const getSupplierOrders = async () => {
  const response = await api.get('/supplier-orders');
  return response.data;
};

export const createSupplierOrder = async (orderData) => {
  const response = await api.post('/supplier-orders', orderData);
  return response.data;
};

export const updateSupplierOrder = async (id, orderData) => {
  const response = await api.put(`/supplier-orders/${id}`, orderData);
  return response.data;
};

export default api;

