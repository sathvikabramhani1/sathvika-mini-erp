export type UserRole = 'ADMIN' | 'SALES';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  city: string;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    enquiries?: number;
    quotations?: number;
    salesOrders?: number;
  };
}

export interface InventoryItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  category: string;
  unit: string;
  basePrice: number;
  physicalQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  availableQuantity: number;
  updatedAt?: string;
}

export interface Product {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  unit: string;
  basePrice: number;
  inventory?: {
    physicalQuantity: number;
    reservedQuantity: number;
    damagedQuantity: number;
    availableQuantity: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type EnquiryStatus = 'NEW' | 'QUOTED' | 'WON' | 'LOST';

export interface EnquiryItem {
  id: string;
  enquiryId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  customerId: string;
  customer: Customer;
  enquiryDate: string;
  requiredDate: string;
  notes?: string | null;
  status: EnquiryStatus;
  items: EnquiryItem[];
  createdByUser?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  quotations?: {
    id: string;
    quotationNumber: string;
    status: QuotationStatus;
    grandTotal: number;
    salesOrder?: {
      id: string;
      orderNumber: string;
      status: SalesOrderStatus;
    } | null;
  }[];
  createdAt: string;
}

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';

export interface QuotationItem {
  id: string;
  quotationId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  gstPercent: number;
  lineAmount: number;
  product?: Product;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  enquiryId: string;
  enquiry?: {
    id: string;
    enquiryNumber: string;
    status: EnquiryStatus;
    requiredDate: string;
  };
  customerId: string;
  customer: Customer;
  validUntil: string;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  gstPercent: number;
  gstAmount: number;
  grandTotal: number;
  status: QuotationStatus;
  items: QuotationItem[];
  createdByUser?: {
    id: string;
    name: string;
    role: UserRole;
  };
  salesOrder?: {
    id: string;
    orderNumber: string;
    status: SalesOrderStatus;
    totalAmount: number;
  } | null;
  createdAt: string;
}

export type SalesOrderStatus = 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED';

export interface SalesOrderItem {
  id: string;
  salesOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  product?: Product;
  stockStatus?: {
    physicalQuantity: number;
    reservedQuantity: number;
    damagedQuantity: number;
    availableQuantity: number;
    sufficient: boolean;
  };
}

export interface Dispatch {
  id: string;
  dispatchNumber: string;
  salesOrderId: string;
  dispatchDate: string;
  vehicleNumber: string;
  driverName: string;
  items: {
    id: string;
    productId: string;
    quantity: number;
    product?: Product;
  }[];
  createdAt: string;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  quotationId: string;
  quotation?: {
    id: string;
    quotationNumber: string;
    enquiry?: {
      id: string;
      enquiryNumber: string;
    };
  };
  customerId: string;
  customer: Customer;
  orderDate: string;
  totalAmount: number;
  status: SalesOrderStatus;
  confirmedAt?: string | null;
  confirmedByUser?: {
    id: string;
    name: string;
    role: UserRole;
  } | null;
  items: SalesOrderItem[];
  dispatches?: Dispatch[];
  canFulfill?: boolean;
  createdAt: string;
}
