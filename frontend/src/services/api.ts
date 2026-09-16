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

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => request<User>('/auth/me'),

  // Dashboard
  getDashboardMetrics: () => request<any>('/dashboard/metrics'),

  // Customers
  getCustomers: () => request<Customer[]>('/customers'),
  getCustomerById: (id: string) => request<Customer>(`/customers/${id}`),
  createCustomer: (data: Partial<Customer>) =>
    request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: () => request<Product[]>('/products'),
  getProductById: (id: string) => request<Product>(`/products/${id}`),
  createProduct: (data: any) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Inventory
  getInventory: () => request<InventoryItem[]>('/inventory'),
  updateInventory: (productId: string, data: { physicalQuantity?: number; damagedQuantity?: number }) =>
    request<any>(`/inventory/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Enquiries
  getEnquiries: (status?: string) => {
    const query = status && status !== 'ALL' ? `?status=${status}` : '';
    return request<Enquiry[]>(`/enquiries${query}`);
  },
  getEnquiryById: (id: string) => request<Enquiry>(`/enquiries/${id}`),
  createEnquiry: (data: {
    customerId?: string;
    customer?: Partial<Customer>;
    requiredDate: string;
    notes?: string;
    items: { productId: string; quantity: number }[];
  }) =>
    request<Enquiry>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEnquiryStatus: (id: string, status: EnquiryStatus) =>
    request<Enquiry>(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Quotations
  getQuotations: (status?: string) => {
    const query = status && status !== 'ALL' ? `?status=${status}` : '';
    return request<Quotation[]>(`/quotations${query}`);
  },
  getQuotationById: (id: string) => request<Quotation>(`/quotations/${id}`),
  createQuotation: (data: {
    enquiryId: string;
    customerId?: string;
    validUntil?: string;
    discountPercent?: number;
    gstPercent?: number;
    items: { productId: string; quantity: number; unitPrice?: number; discountPercent?: number; gstPercent?: number }[];
  }) =>
    request<Quotation>('/quotations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateQuotationStatus: (id: string, status: QuotationStatus) =>
    request<Quotation>(`/quotations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  convertQuotationToOrder: (id: string) =>
    request<SalesOrder>(`/quotations/${id}/convert`, {
      method: 'POST',
    }),

  // Sales Orders
  getSalesOrders: (status?: string) => {
    const query = status && status !== 'ALL' ? `?status=${status}` : '';
    return request<SalesOrder[]>(`/sales-orders${query}`);
  },
  getSalesOrderById: (id: string) => request<SalesOrder>(`/sales-orders/${id}`),
  confirmSalesOrder: (id: string) =>
    request<SalesOrder>(`/sales-orders/${id}/confirm`, {
      method: 'POST',
    }),
  dispatchSalesOrder: (id: string, data: { vehicleNumber: string; driverName: string }) =>
    request<{ dispatch: any; order: SalesOrder }>(`/sales-orders/${id}/dispatch`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancelSalesOrder: (id: string) =>
    request<SalesOrder>(`/sales-orders/${id}/cancel`, {
      method: 'POST',
    }),
};
