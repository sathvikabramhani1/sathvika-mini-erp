import {
  Customer,
  Product,
  InventoryItem,
  Enquiry,
  Quotation,
  SalesOrder,
  User,
  EnquiryStatus,
  QuotationStatus,
} from '../types';
import { mockService } from './mockService';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data.data;
}

async function withFallback<T>(backendCall: () => Promise<T>, fallbackCall: () => Promise<T>): Promise<T> {
  try {
    return await backendCall();
  } catch (err: any) {
    console.warn('[Sathvika Mini ERP] Operating via resilient client store:', err?.message || err);
    return await fallbackCall();
  }
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    withFallback(
      () =>
        request<{ token: string; user: User }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        }),
      () => mockService.login(credentials)
    ),

  getCurrentUser: () =>
    withFallback(
      () => request<User>('/auth/me'),
      () => mockService.getCurrentUser()
    ),

  // Dashboard
  getDashboardMetrics: () =>
    withFallback(
      () => request<any>('/dashboard/metrics'),
      () => mockService.getDashboardMetrics()
    ),

  // Customers
  getCustomers: () =>
    withFallback(
      () => request<Customer[]>('/customers'),
      () => mockService.getCustomers()
    ),
  getCustomerById: (id: string) =>
    withFallback(
      () => request<Customer>(`/customers/${id}`),
      () => mockService.getCustomerById(id)
    ),
  createCustomer: (data: Partial<Customer>) =>
    withFallback(
      () =>
        request<Customer>('/customers', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      () => mockService.createCustomer(data)
    ),

  // Products
  getProducts: () =>
    withFallback(
      () => request<Product[]>('/products'),
      () => mockService.getProducts()
    ),
  getProductById: (id: string) =>
    withFallback(
      () => request<Product>(`/products/${id}`),
      () => mockService.getProductById(id)
    ),
  createProduct: (data: any) =>
    withFallback(
      () =>
        request<Product>('/products', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      () => mockService.createProduct(data)
    ),

  // Inventory
  getInventory: () =>
    withFallback(
      () => request<InventoryItem[]>('/inventory'),
      () => mockService.getInventory()
    ),
  updateInventory: (productId: string, data: { physicalQuantity?: number; damagedQuantity?: number }) =>
    withFallback(
      () =>
        request<any>(`/inventory/${productId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      () => mockService.updateInventory(productId, data)
    ),

  // Enquiries
  getEnquiries: (status?: string) => {
    const query = status && status !== 'ALL' ? `?status=${status}` : '';
    return withFallback(
      () => request<Enquiry[]>(`/enquiries${query}`),
      () => mockService.getEnquiries(status)
    );
  },
  getEnquiryById: (id: string) =>
    withFallback(
      () => request<Enquiry>(`/enquiries/${id}`),
      () => mockService.getEnquiryById(id)
    ),
  createEnquiry: (data: {
    customerId?: string;
    customer?: Partial<Customer>;
    requiredDate: string;
    notes?: string;
    items: { productId: string; quantity: number }[];
  }) =>
    withFallback(
      () =>
        request<Enquiry>('/enquiries', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      () => mockService.createEnquiry(data)
    ),
  updateEnquiryStatus: (id: string, status: EnquiryStatus) =>
    withFallback(
      () =>
        request<Enquiry>(`/enquiries/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }),
      () => mockService.updateEnquiryStatus(id, status)
    ),

  // Quotations
  getQuotations: (status?: string) => {
    const query = status && status !== 'ALL' ? `?status=${status}` : '';
    return withFallback(
      () => request<Quotation[]>(`/quotations${query}`),
      () => mockService.getQuotations(status)
    );
  },
  getQuotationById: (id: string) =>
    withFallback(
      () => request<Quotation>(`/quotations/${id}`),
      () => mockService.getQuotationById(id)
    ),
  createQuotation: (data: {
    enquiryId: string;
    customerId?: string;
    validUntil?: string;
    discountPercent?: number;
    gstPercent?: number;
    items: { productId: string; quantity: number; unitPrice?: number; discountPercent?: number; gstPercent?: number }[];
  }) =>
    withFallback(
      () =>
        request<Quotation>('/quotations', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      () => mockService.createQuotation(data)
    ),
  updateQuotationStatus: (id: string, status: QuotationStatus) =>
    withFallback(
      () =>
        request<Quotation>(`/quotations/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }),
      () => mockService.updateQuotationStatus(id, status)
    ),
  convertQuotationToOrder: (id: string) =>
    withFallback(
      () =>
        request<SalesOrder>(`/quotations/${id}/convert`, {
          method: 'POST',
        }),
      () => mockService.convertQuotationToOrder(id)
    ),

  // Sales Orders
  getSalesOrders: (status?: string) => {
    const query = status && status !== 'ALL' ? `?status=${status}` : '';
    return withFallback(
      () => request<SalesOrder[]>(`/sales-orders${query}`),
      () => mockService.getSalesOrders(status)
    );
  },
  getSalesOrderById: (id: string) =>
    withFallback(
      () => request<SalesOrder>(`/sales-orders/${id}`),
      () => mockService.getSalesOrderById(id)
    ),
  confirmSalesOrder: (id: string) =>
    withFallback(
      () =>
        request<SalesOrder>(`/sales-orders/${id}/confirm`, {
          method: 'POST',
        }),
      () => mockService.confirmSalesOrder(id)
    ),
  dispatchSalesOrder: (id: string, data: { vehicleNumber: string; driverName: string }) =>
    withFallback(
      () =>
        request<{ dispatch: any; order: SalesOrder }>(`/sales-orders/${id}/dispatch`, {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      () => mockService.dispatchSalesOrder(id, data)
    ),
  cancelSalesOrder: (id: string) =>
    withFallback(
      () =>
        request<SalesOrder>(`/sales-orders/${id}/cancel`, {
          method: 'POST',
        }),
      () => mockService.cancelSalesOrder(id)
    ),
};
