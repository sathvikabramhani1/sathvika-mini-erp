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
  SalesOrderStatus,
} from '../types';

const STORAGE_KEY_PREFIX = 'sathvika_mini_erp_';

const initialUsers: User[] = [
  {
    id: '5bb8b92d-f392-4f83-877c-75d4c6fe284c',
    email: 'admin@sathvika.com',
    name: 'Sathvika Admin',
    role: 'ADMIN',
  },
  {
    id: '795f61f5-916a-464e-a6bd-dbc495a04914',
    email: 'sales@sathvika.com',
    name: 'Sathvika Sales',
    role: 'SALES',
  },
];

const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    companyName: 'ABC Engineering Pvt. Ltd.',
    contactPerson: 'Rajesh Sharma',
    mobile: '+91 98765 43210',
    email: 'purchase@abcengineering.com',
    city: 'Mumbai',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-2',
    companyName: 'Apex Industrial Manufacturing Ltd.',
    contactPerson: 'Sunita Patel',
    mobile: '+91 98234 56789',
    email: 'spatel@apexindustrial.in',
    city: 'Pune',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-3',
    companyName: 'Titan Heavy Machineries Corp',
    contactPerson: 'Amit Verma',
    mobile: '+91 98111 22334',
    email: 'averma@titanmachineries.com',
    city: 'Hyderabad',
    createdAt: new Date().toISOString(),
  },
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    productCode: 'IND-BRG-101',
    productName: 'Heavy-Duty Flange Ball Bearing (UCF 208)',
    category: 'Bearings & Bushings',
    unit: 'PCS',
    basePrice: 450.0,
    inventory: {
      physicalQuantity: 200,
      reservedQuantity: 0,
      damagedQuantity: 0,
      availableQuantity: 200,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    productCode: 'IND-VLV-202',
    productName: 'High-Pressure Hydraulic Directional Control Valve',
    category: 'Valves & Actuators',
    unit: 'PCS',
    basePrice: 1850.0,
    inventory: {
      physicalQuantity: 100,
      reservedQuantity: 0,
      damagedQuantity: 0,
      availableQuantity: 100,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    productCode: 'IND-PMP-303',
    productName: 'Industrial Cast-Iron Rotary Gear Pump (15 GPM)',
    category: 'Pumps & Motors',
    unit: 'SET',
    basePrice: 6200.0,
    inventory: {
      physicalQuantity: 50,
      reservedQuantity: 0,
      damagedQuantity: 0,
      availableQuantity: 50,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    productCode: 'IND-FLG-404',
    productName: 'Carbon Steel ANSI Class 150 Weld Neck Flange 4"',
    category: 'Piping & Flanges',
    unit: 'NOS',
    basePrice: 720.0,
    inventory: {
      physicalQuantity: 150,
      reservedQuantity: 30,
      damagedQuantity: 0,
      availableQuantity: 120,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    productCode: 'IND-CYL-505',
    productName: 'Double-Acting ISO Standard Pneumatic Cylinder 50x100',
    category: 'Pneumatics',
    unit: 'PCS',
    basePrice: 2400.0,
    inventory: {
      physicalQuantity: 80,
      reservedQuantity: 0,
      damagedQuantity: 0,
      availableQuantity: 80,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    productCode: 'IND-FST-606',
    productName: 'Grade 8.8 Galvanized High-Tensile Hex Bolt Fastener Kit',
    category: 'Fasteners & Hardware',
    unit: 'SET',
    basePrice: 350.0,
    inventory: {
      physicalQuantity: 300,
      reservedQuantity: 50,
      damagedQuantity: 0,
      availableQuantity: 250,
    },
    createdAt: new Date().toISOString(),
  },
];

const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    enquiryNumber: 'ENQ-2026-001',
    customerId: 'cust-1',
    customer: initialCustomers[0],
    enquiryDate: new Date().toISOString(),
    requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Urgent requirement for upcoming plant maintenance overhaul in Mumbai.',
    status: 'NEW',
    items: [
      { id: 'enq-item-1', enquiryId: 'enq-1', productId: 'prod-1', quantity: 40, product: initialProducts[0] },
      { id: 'enq-item-2', enquiryId: 'enq-1', productId: 'prod-2', quantity: 15, product: initialProducts[1] },
    ],
    createdByUser: initialUsers[1],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'enq-2',
    enquiryNumber: 'ENQ-2026-002',
    customerId: 'cust-2',
    customer: initialCustomers[1],
    enquiryDate: new Date().toISOString(),
    requiredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Quarterly procurement for Pune assembly facility.',
    status: 'QUOTED',
    items: [
      { id: 'enq-item-3', enquiryId: 'enq-2', productId: 'prod-3', quantity: 5, product: initialProducts[2] },
      { id: 'enq-item-4', enquiryId: 'enq-2', productId: 'prod-5', quantity: 10, product: initialProducts[4] },
    ],
    createdByUser: initialUsers[1],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'enq-3',
    enquiryNumber: 'ENQ-2026-003',
    customerId: 'cust-3',
    customer: initialCustomers[2],
    enquiryDate: new Date().toISOString(),
    requiredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Immediate supply required for Hyderabad engineering project.',
    status: 'WON',
    items: [
      { id: 'enq-item-5', enquiryId: 'enq-3', productId: 'prod-4', quantity: 30, product: initialProducts[3] },
      { id: 'enq-item-6', enquiryId: 'enq-3', productId: 'prod-6', quantity: 50, product: initialProducts[5] },
    ],
    createdByUser: initialUsers[1],
    createdAt: new Date().toISOString(),
  },
];

const initialQuotations: Quotation[] = [
  {
    id: 'qtn-1',
    quotationNumber: 'QTN-2026-001',
    enquiryId: 'enq-2',
    enquiry: {
      id: 'enq-2',
      enquiryNumber: 'ENQ-2026-002',
      status: 'QUOTED',
      requiredDate: initialEnquiries[1].requiredDate,
    },
    customerId: 'cust-2',
    customer: initialCustomers[1],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 55000,
    discountPercent: 5,
    discountAmount: 2750,
    gstPercent: 18,
    gstAmount: 9405,
    grandTotal: 61655,
    status: 'SENT',
    items: [
      {
        id: 'qtn-item-1',
        quotationId: 'qtn-1',
        productId: 'prod-3',
        quantity: 5,
        unitPrice: 6200,
        discountPercent: 5,
        gstPercent: 18,
        lineAmount: 34746.5,
        product: initialProducts[2],
      },
      {
        id: 'qtn-item-2',
        quotationId: 'qtn-1',
        productId: 'prod-5',
        quantity: 10,
        unitPrice: 2400,
        discountPercent: 5,
        gstPercent: 18,
        lineAmount: 26908.5,
        product: initialProducts[4],
      },
    ],
    createdByUser: initialUsers[1],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qtn-2',
    quotationNumber: 'QTN-2026-002',
    enquiryId: 'enq-3',
    enquiry: {
      id: 'enq-3',
      enquiryNumber: 'ENQ-2026-003',
      status: 'WON',
      requiredDate: initialEnquiries[2].requiredDate,
    },
    customerId: 'cust-3',
    customer: initialCustomers[2],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 39100,
    discountPercent: 10,
    discountAmount: 3910,
    gstPercent: 18,
    gstAmount: 6334.2,
    grandTotal: 41524.2,
    status: 'ACCEPTED',
    items: [
      {
        id: 'qtn-item-3',
        quotationId: 'qtn-2',
        productId: 'prod-4',
        quantity: 30,
        unitPrice: 720,
        discountPercent: 10,
        gstPercent: 18,
        lineAmount: 22939.2,
        product: initialProducts[3],
      },
      {
        id: 'qtn-item-4',
        quotationId: 'qtn-2',
        productId: 'prod-6',
        quantity: 50,
        unitPrice: 350,
        discountPercent: 10,
        gstPercent: 18,
        lineAmount: 18585,
        product: initialProducts[5],
      },
    ],
    createdByUser: initialUsers[1],
    createdAt: new Date().toISOString(),
  },
];

const initialSalesOrders: SalesOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2026-001',
    quotationId: 'qtn-2',
    quotation: {
      id: 'qtn-2',
      quotationNumber: 'QTN-2026-002',
      enquiry: {
        id: 'enq-3',
        enquiryNumber: 'ENQ-2026-003',
      },
    },
    customerId: 'cust-3',
    customer: initialCustomers[2],
    orderDate: new Date().toISOString(),
    totalAmount: 41524.2,
    status: 'CONFIRMED',
    confirmedAt: new Date().toISOString(),
    confirmedByUser: initialUsers[0],
    items: [
      {
        id: 'so-item-1',
        salesOrderId: 'so-1',
        productId: 'prod-4',
        quantity: 30,
        unitPrice: 720,
        lineAmount: 22939.2,
        product: initialProducts[3],
        stockStatus: {
          physicalQuantity: 150,
          reservedQuantity: 30,
          damagedQuantity: 0,
          availableQuantity: 120,
          sufficient: true,
        },
      },
      {
        id: 'so-item-2',
        salesOrderId: 'so-1',
        productId: 'prod-6',
        quantity: 50,
        unitPrice: 350,
        lineAmount: 18585,
        product: initialProducts[5],
        stockStatus: {
          physicalQuantity: 300,
          reservedQuantity: 50,
          damagedQuantity: 0,
          availableQuantity: 250,
          sufficient: true,
        },
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

class MockStore {
  private get<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private set<T>(key: string, val: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public getCustomers(): Customer[] {
    return this.get<Customer[]>('customers', initialCustomers);
  }

  public saveCustomers(customers: Customer[]): void {
    this.set('customers', customers);
  }

  public getProducts(): Product[] {
    return this.get<Product[]>('products', initialProducts);
  }

  public saveProducts(products: Product[]): void {
    this.set('products', products);
  }

  public getEnquiries(): Enquiry[] {
    return this.get<Enquiry[]>('enquiries', initialEnquiries);
  }

  public saveEnquiries(enquiries: Enquiry[]): void {
    this.set('enquiries', enquiries);
  }

  public getQuotations(): Quotation[] {
    return this.get<Quotation[]>('quotations', initialQuotations);
  }

  public saveQuotations(quotations: Quotation[]): void {
    this.set('quotations', quotations);
  }

  public getSalesOrders(): SalesOrder[] {
    return this.get<SalesOrder[]>('sales_orders', initialSalesOrders);
  }

  public saveSalesOrders(orders: SalesOrder[]): void {
    this.set('sales_orders', orders);
  }

  public getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'current_user');
    }
  }
}

export const mockStore = new MockStore();

export const mockService = {
  login: async (credentials: { email: string; password?: string }): Promise<{ token: string; user: User }> => {
    const email = credentials.email.toLowerCase().trim();
    let matchedUser = initialUsers.find((u) => u.email.toLowerCase() === email);

    if (!matchedUser) {
      if (email.includes('admin')) {
        matchedUser = initialUsers[0];
      } else {
        matchedUser = initialUsers[1];
      }
    }

    const token = `mock-jwt-token-${matchedUser.role.toLowerCase()}-${Date.now()}`;
    mockStore.setCurrentUser(matchedUser);

    return {
      token,
      user: matchedUser,
    };
  },

  getCurrentUser: async (): Promise<User> => {
    const user = mockStore.getCurrentUser();
    if (user) return user;
    const token = localStorage.getItem('token') || '';
    if (token.includes('sales')) return initialUsers[1];
    return initialUsers[0];
  },

  getDashboardMetrics: async () => {
    const customers = mockStore.getCustomers();
    const products = mockStore.getProducts();
    const enquiries = mockStore.getEnquiries();
    const quotations = mockStore.getQuotations();
    const salesOrders = mockStore.getSalesOrders();

    let totalPhysical = 0;
    let totalReserved = 0;
    let totalDamaged = 0;

    for (const p of products) {
      totalPhysical += p.inventory?.physicalQuantity || 0;
      totalReserved += p.inventory?.reservedQuantity || 0;
      totalDamaged += p.inventory?.damagedQuantity || 0;
    }

    const totalAvailable = Math.max(0, totalPhysical - totalReserved - totalDamaged);

    const enquiryCounts: Record<string, number> = { NEW: 0, QUOTED: 0, WON: 0, LOST: 0 };
    for (const e of enquiries) enquiryCounts[e.status] = (enquiryCounts[e.status] || 0) + 1;

    const quotationCounts: Record<string, number> = { DRAFT: 0, SENT: 0, ACCEPTED: 0, REJECTED: 0 };
    for (const q of quotations) quotationCounts[q.status] = (quotationCounts[q.status] || 0) + 1;

    const orderCounts: Record<string, number> = { PENDING: 0, CONFIRMED: 0, DISPATCHED: 0, CANCELLED: 0 };
    for (const o of salesOrders) orderCounts[o.status] = (orderCounts[o.status] || 0) + 1;

    return {
      counts: {
        customers: customers.length,
        products: products.length,
        enquiries: enquiries.length,
        quotations: quotations.length,
        salesOrders: salesOrders.length,
        dispatches: 1,
      },
      inventory: {
        totalPhysical,
        totalReserved,
        totalDamaged,
        totalAvailable,
      },
      breakdowns: {
        enquiries: enquiryCounts,
        quotations: quotationCounts,
        salesOrders: orderCounts,
      },
    };
  },

  getCustomers: async (): Promise<Customer[]> => {
    return mockStore.getCustomers();
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const cust = mockStore.getCustomers().find((c) => c.id === id);
    if (!cust) throw new Error('Customer not found');
    return cust;
  },

  createCustomer: async (data: Partial<Customer>): Promise<Customer> => {
    const customers = mockStore.getCustomers();
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      companyName: data.companyName || 'New Client Enterprise',
      contactPerson: data.contactPerson || 'Procurement Officer',
      mobile: data.mobile || '+91 99999 00000',
      email: data.email || 'contact@client.com',
      city: data.city || 'Hyderabad',
      createdAt: new Date().toISOString(),
    };
    customers.unshift(newCustomer);
    mockStore.saveCustomers(customers);
    return newCustomer;
  },

  getProducts: async (): Promise<Product[]> => {
    return mockStore.getProducts();
  },

  getProductById: async (id: string): Promise<Product> => {
    const prod = mockStore.getProducts().find((p) => p.id === id);
    if (!prod) throw new Error('Product not found');
    return prod;
  },

  createProduct: async (data: any): Promise<Product> => {
    const products = mockStore.getProducts();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      productCode: data.productCode || `IND-${Math.floor(100 + Math.random() * 900)}`,
      productName: data.productName,
      category: data.category || 'General',
      unit: data.unit || 'PCS',
      basePrice: Number(data.basePrice) || 500,
      inventory: {
        physicalQuantity: Number(data.physicalQuantity) || 100,
        reservedQuantity: 0,
        damagedQuantity: 0,
        availableQuantity: Number(data.physicalQuantity) || 100,
      },
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    mockStore.saveProducts(products);
    return newProduct;
  },

  getInventory: async (): Promise<InventoryItem[]> => {
    const products = mockStore.getProducts();
    return products.map((p) => {
      const inv = p.inventory || {
        physicalQuantity: 100,
        reservedQuantity: 0,
        damagedQuantity: 0,
        availableQuantity: 100,
      };
      return {
        id: `inv-${p.id}`,
        productId: p.id,
        productCode: p.productCode,
        productName: p.productName,
        category: p.category,
        unit: p.unit,
        basePrice: p.basePrice,
        physicalQuantity: inv.physicalQuantity,
        reservedQuantity: inv.reservedQuantity,
        damagedQuantity: inv.damagedQuantity,
        availableQuantity: Math.max(0, inv.physicalQuantity - inv.reservedQuantity - inv.damagedQuantity),
        updatedAt: new Date().toISOString(),
      };
    });
  },

  updateInventory: async (
    productId: string,
    data: { physicalQuantity?: number; damagedQuantity?: number }
  ): Promise<any> => {
    const products = mockStore.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found');

    if (!product.inventory) {
      product.inventory = {
        physicalQuantity: 100,
        reservedQuantity: 0,
        damagedQuantity: 0,
        availableQuantity: 100,
      };
    }

    if (data.physicalQuantity !== undefined) {
      product.inventory.physicalQuantity = Number(data.physicalQuantity);
    }
    if (data.damagedQuantity !== undefined) {
      product.inventory.damagedQuantity = Number(data.damagedQuantity);
    }
    product.inventory.availableQuantity = Math.max(
      0,
      product.inventory.physicalQuantity - product.inventory.reservedQuantity - product.inventory.damagedQuantity
    );

    mockStore.saveProducts(products);
    return product.inventory;
  },

  getEnquiries: async (status?: string): Promise<Enquiry[]> => {
    const enquiries = mockStore.getEnquiries();
    if (!status || status === 'ALL') return enquiries;
    return enquiries.filter((e) => e.status === status);
  },

  getEnquiryById: async (id: string): Promise<Enquiry> => {
    const enq = mockStore.getEnquiries().find((e) => e.id === id);
    if (!enq) throw new Error('Enquiry not found');
    return enq;
  },

  createEnquiry: async (data: {
    customerId?: string;
    customer?: Partial<Customer>;
    requiredDate: string;
    notes?: string;
    items: { productId: string; quantity: number }[];
  }): Promise<Enquiry> => {
    const enquiries = mockStore.getEnquiries();
    const products = mockStore.getProducts();
    let customer: Customer;

    if (data.customerId) {
      customer = mockStore.getCustomers().find((c) => c.id === data.customerId) || initialCustomers[0];
    } else if (data.customer) {
      customer = await mockService.createCustomer(data.customer);
    } else {
      customer = initialCustomers[0];
    }

    const enquiryNumber = `ENQ-2026-${String(enquiries.length + 1).padStart(3, '0')}`;
    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      enquiryNumber,
      customerId: customer.id,
      customer,
      enquiryDate: new Date().toISOString(),
      requiredDate: data.requiredDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      notes: data.notes || '',
      status: 'NEW',
      items: data.items.map((it, idx) => {
        const prod = products.find((p) => p.id === it.productId);
        return {
          id: `enq-item-${Date.now()}-${idx}`,
          enquiryId: `enq-${Date.now()}`,
          productId: it.productId,
          quantity: Number(it.quantity),
          product: prod,
        };
      }),
      createdByUser: initialUsers[1],
      createdAt: new Date().toISOString(),
    };

    enquiries.unshift(newEnquiry);
    mockStore.saveEnquiries(enquiries);
    return newEnquiry;
  },

  updateEnquiryStatus: async (id: string, status: EnquiryStatus): Promise<Enquiry> => {
    const enquiries = mockStore.getEnquiries();
    const enq = enquiries.find((e) => e.id === id);
    if (!enq) throw new Error('Enquiry not found');
    enq.status = status;
    mockStore.saveEnquiries(enquiries);
    return enq;
  },

  getQuotations: async (status?: string): Promise<Quotation[]> => {
    const quotes = mockStore.getQuotations();
    if (!status || status === 'ALL') return quotes;
    return quotes.filter((q) => q.status === status);
  },

  getQuotationById: async (id: string): Promise<Quotation> => {
    const quote = mockStore.getQuotations().find((q) => q.id === id);
    if (!quote) throw new Error('Quotation not found');
    return quote;
  },

  createQuotation: async (data: {
    enquiryId: string;
    customerId?: string;
    validUntil?: string;
    discountPercent?: number;
    gstPercent?: number;
    items: { productId: string; quantity: number; unitPrice?: number; discountPercent?: number; gstPercent?: number }[];
  }): Promise<Quotation> => {
    const quotes = mockStore.getQuotations();
    const enquiries = mockStore.getEnquiries();
    const products = mockStore.getProducts();

    const enq = enquiries.find((e) => e.id === data.enquiryId);
    if (!enq) throw new Error('Enquiry not found');

    const customer = enq.customer;
    const discountPercent = data.discountPercent || 0;
    const gstPercent = data.gstPercent !== undefined ? data.gstPercent : 18;

    let subtotal = 0;
    const items = data.items.map((it, idx) => {
      const prod = products.find((p) => p.id === it.productId);
      const unitPrice = it.unitPrice || prod?.basePrice || 500;
      const qty = Number(it.quantity);
      const itemDisc = it.discountPercent !== undefined ? it.discountPercent : discountPercent;
      const itemGst = it.gstPercent !== undefined ? it.gstPercent : gstPercent;

      const baseAmount = qty * unitPrice;
      subtotal += baseAmount;
      const discountedAmount = baseAmount * (1 - itemDisc / 100);
      const lineAmount = discountedAmount * (1 + itemGst / 100);

      return {
        id: `qtn-item-${Date.now()}-${idx}`,
        quotationId: `qtn-${Date.now()}`,
        productId: it.productId,
        quantity: qty,
        unitPrice,
        discountPercent: itemDisc,
        gstPercent: itemGst,
        lineAmount,
        product: prod,
      };
    });

    const discountAmount = subtotal * (discountPercent / 100);
    const taxableAmount = subtotal - discountAmount;
    const gstAmount = taxableAmount * (gstPercent / 100);
    const grandTotal = taxableAmount + gstAmount;

    const quotationNumber = `QTN-2026-${String(quotes.length + 1).padStart(3, '0')}`;
    const newQuote: Quotation = {
      id: `qtn-${Date.now()}`,
      quotationNumber,
      enquiryId: enq.id,
      enquiry: {
        id: enq.id,
        enquiryNumber: enq.enquiryNumber,
        status: 'QUOTED',
        requiredDate: enq.requiredDate,
      },
      customerId: customer.id,
      customer,
      validUntil: data.validUntil || new Date(Date.now() + 30 * 86400000).toISOString(),
      subtotal,
      discountPercent,
      discountAmount,
      gstPercent,
      gstAmount,
      grandTotal,
      status: 'DRAFT',
      items,
      createdByUser: initialUsers[1],
      createdAt: new Date().toISOString(),
    };

    quotes.unshift(newQuote);
    mockStore.saveQuotations(quotes);

    // Update enquiry status to QUOTED
    enq.status = 'QUOTED';
    mockStore.saveEnquiries(enquiries);

    return newQuote;
  },

  updateQuotationStatus: async (id: string, status: QuotationStatus): Promise<Quotation> => {
    const quotes = mockStore.getQuotations();
    const quote = quotes.find((q) => q.id === id);
    if (!quote) throw new Error('Quotation not found');
    quote.status = status;
    mockStore.saveQuotations(quotes);

    if (status === 'ACCEPTED') {
      const enquiries = mockStore.getEnquiries();
      const enq = enquiries.find((e) => e.id === quote.enquiryId);
      if (enq) {
        enq.status = 'WON';
        mockStore.saveEnquiries(enquiries);
      }
    }
    return quote;
  },

  convertQuotationToOrder: async (id: string): Promise<SalesOrder> => {
    const quotes = mockStore.getQuotations();
    const quote = quotes.find((q) => q.id === id);
    if (!quote) throw new Error('Quotation not found');

    const orders = mockStore.getSalesOrders();
    const existing = orders.find((o) => o.quotationId === id);
    if (existing) return existing;

    const products = mockStore.getProducts();
    const orderNumber = `SO-2026-${String(orders.length + 1).padStart(3, '0')}`;

    const newOrder: SalesOrder = {
      id: `so-${Date.now()}`,
      orderNumber,
      quotationId: quote.id,
      quotation: {
        id: quote.id,
        quotationNumber: quote.quotationNumber,
        enquiry: {
          id: quote.enquiryId,
          enquiryNumber: quote.enquiry?.enquiryNumber || 'ENQ-2026',
        },
      },
      customerId: quote.customerId,
      customer: quote.customer,
      orderDate: new Date().toISOString(),
      totalAmount: quote.grandTotal,
      status: 'PENDING',
      items: quote.items.map((it, idx) => {
        const prod = products.find((p) => p.id === it.productId);
        const inv = prod?.inventory || {
          physicalQuantity: 100,
          reservedQuantity: 0,
          damagedQuantity: 0,
          availableQuantity: 100,
        };
        const avail = Math.max(0, inv.physicalQuantity - inv.reservedQuantity - inv.damagedQuantity);
        return {
          id: `so-item-${Date.now()}-${idx}`,
          salesOrderId: `so-${Date.now()}`,
          productId: it.productId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          lineAmount: it.lineAmount,
          product: prod,
          stockStatus: {
            physicalQuantity: inv.physicalQuantity,
            reservedQuantity: inv.reservedQuantity,
            damagedQuantity: inv.damagedQuantity,
            availableQuantity: avail,
            sufficient: avail >= it.quantity,
          },
        };
      }),
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    mockStore.saveSalesOrders(orders);

    quote.status = 'ACCEPTED';
    quote.salesOrder = {
      id: newOrder.id,
      orderNumber: newOrder.orderNumber,
      status: newOrder.status,
      totalAmount: newOrder.totalAmount,
    };
    mockStore.saveQuotations(quotes);

    return newOrder;
  },

  getSalesOrders: async (status?: string): Promise<SalesOrder[]> => {
    const orders = mockStore.getSalesOrders();
    const products = mockStore.getProducts();

    // Dynamically calculate live stock sufficiency for each order
    for (const order of orders) {
      let allSufficient = true;
      for (const it of order.items) {
        const prod = products.find((p) => p.id === it.productId);
        const inv = prod?.inventory || {
          physicalQuantity: 100,
          reservedQuantity: 0,
          damagedQuantity: 0,
          availableQuantity: 100,
        };
        const avail = Math.max(0, inv.physicalQuantity - inv.reservedQuantity - inv.damagedQuantity);
        it.stockStatus = {
          physicalQuantity: inv.physicalQuantity,
          reservedQuantity: inv.reservedQuantity,
          damagedQuantity: inv.damagedQuantity,
          availableQuantity: avail,
          sufficient: avail >= it.quantity || order.status !== 'PENDING',
        };
        if (order.status === 'PENDING' && avail < it.quantity) {
          allSufficient = false;
        }
      }
      order.canFulfill = allSufficient;
    }

    if (!status || status === 'ALL') return orders;
    return orders.filter((o) => o.status === status);
  },

  getSalesOrderById: async (id: string): Promise<SalesOrder> => {
    const order = mockStore.getSalesOrders().find((o) => o.id === id);
    if (!order) throw new Error('Sales Order not found');
    return order;
  },

  confirmSalesOrder: async (id: string): Promise<SalesOrder> => {
    const orders = mockStore.getSalesOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error('Sales Order not found');
    if (order.status !== 'PENDING') throw new Error(`Order is already ${order.status}`);

    const products = mockStore.getProducts();

    // 1. Atomic Check Stock Feasibility
    for (const it of order.items) {
      const prod = products.find((p) => p.id === it.productId);
      if (!prod || !prod.inventory) throw new Error(`Product ${it.productId} not found`);
      const avail = Math.max(
        0,
        prod.inventory.physicalQuantity - prod.inventory.reservedQuantity - prod.inventory.damagedQuantity
      );
      if (avail < it.quantity) {
        throw new Error(
          `Insufficient stock for ${prod.productName}. Available: ${avail}, Requested: ${it.quantity}`
        );
      }
    }

    // 2. Atomically Reserve Stock (Physical quantity remains unchanged!)
    for (const it of order.items) {
      const prod = products.find((p) => p.id === it.productId);
      if (prod && prod.inventory) {
        prod.inventory.reservedQuantity += it.quantity;
        prod.inventory.availableQuantity = Math.max(
          0,
          prod.inventory.physicalQuantity - prod.inventory.reservedQuantity - prod.inventory.damagedQuantity
        );
      }
    }
    mockStore.saveProducts(products);

    order.status = 'CONFIRMED';
    order.confirmedAt = new Date().toISOString();
    order.confirmedByUser = initialUsers[0];
    mockStore.saveSalesOrders(orders);

    return order;
  },

  dispatchSalesOrder: async (
    id: string,
    data: { vehicleNumber: string; driverName: string }
  ): Promise<{ dispatch: any; order: SalesOrder }> => {
    const orders = mockStore.getSalesOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error('Sales Order not found');
    if (order.status !== 'CONFIRMED') throw new Error('Only CONFIRMED orders can be dispatched');

    const products = mockStore.getProducts();

    // Decrement BOTH physical and reserved stock
    for (const it of order.items) {
      const prod = products.find((p) => p.id === it.productId);
      if (prod && prod.inventory) {
        prod.inventory.physicalQuantity = Math.max(0, prod.inventory.physicalQuantity - it.quantity);
        prod.inventory.reservedQuantity = Math.max(0, prod.inventory.reservedQuantity - it.quantity);
        prod.inventory.availableQuantity = Math.max(
          0,
          prod.inventory.physicalQuantity - prod.inventory.reservedQuantity - prod.inventory.damagedQuantity
        );
      }
    }
    mockStore.saveProducts(products);

    order.status = 'DISPATCHED';

    const dispatch = {
      id: `dsp-${Date.now()}`,
      dispatchNumber: `DSP-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      salesOrderId: order.id,
      dispatchDate: new Date().toISOString(),
      vehicleNumber: data.vehicleNumber || 'MH-12-AZ-9988',
      driverName: data.driverName || 'Ramesh Kumar',
      items: order.items,
    };

    if (!order.dispatches) order.dispatches = [];
    order.dispatches.push(dispatch as any);

    mockStore.saveSalesOrders(orders);

    return { dispatch, order };
  },

  cancelSalesOrder: async (id: string): Promise<SalesOrder> => {
    const orders = mockStore.getSalesOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error('Sales Order not found');

    const products = mockStore.getProducts();

    // If order was CONFIRMED, release the reserved stock back to available!
    if (order.status === 'CONFIRMED') {
      for (const it of order.items) {
        const prod = products.find((p) => p.id === it.productId);
        if (prod && prod.inventory) {
          prod.inventory.reservedQuantity = Math.max(0, prod.inventory.reservedQuantity - it.quantity);
          prod.inventory.availableQuantity = Math.max(
            0,
            prod.inventory.physicalQuantity - prod.inventory.reservedQuantity - prod.inventory.damagedQuantity
          );
        }
      }
      mockStore.saveProducts(products);
    }

    order.status = 'CANCELLED';
    mockStore.saveSalesOrders(orders);
    return order;
  },
};
