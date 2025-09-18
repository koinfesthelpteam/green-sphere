export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'admin';
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface Address {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface PackageInfo {
  weight: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  description: string;
  value: {
    amount: number;
    currency: string;
  };
  images?: PackageImage[];
}

export interface PackageImage {
  _id?: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedAt?: string;
  description?: string;
}

export interface ServiceInfo {
  type: 'standard' | 'express' | 'overnight' | 'economy';
  estimatedDelivery: string;
}

export interface Location {
  name: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type ShipmentStatus = 'created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'returned';

export interface TrackingEvent {
  _id: string;
  status: ShipmentStatus;
  location: Location;
  description: string;
  timestamp: string;
  updatedBy: string;
}

export interface VerificationRequest {
  _id?: string;
  transactionId: string;
  paymentMethod: 'crypto' | 'cashapp' | 'etransfer';
  customerEmail: string;
  notes?: string;
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'rejected';
  processedAt?: string;
  processedBy?: string;
  adminNotes?: string;
}

export interface Payment {
  baseAmount: number;
  amount: number;
  currency: string;
  paymentType: 'full' | 'partial';
  allowedMethods: Array<'crypto' | 'cashapp' | 'etransfer'>;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: string;
  paymentMethod?: 'crypto' | 'cashapp' | 'etransfer';
  exchangeRates?: {
    BTC?: number;
    ETH?: number;
    LTC?: number;
  };
  verificationRequests?: VerificationRequest[];
  adminNotes?: string;
}

export interface Shipment {
  _id: string;
  trackingNumber: string;
  sender: Address;
  recipient: Address;
  package: PackageInfo;
  service: ServiceInfo;
  status: {
    current: ShipmentStatus;
    lastUpdated: string;
  };
  tracking: TrackingEvent[];
  payment: Payment;
  createdBy: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  currentLocation?: Location;
}

export interface PublicShipment {
  trackingNumber: string;
  status: {
    current: ShipmentStatus;
    lastUpdated: string;
  };
  service: {
    type: string;
    estimatedDelivery: string;
  };
  sender: {
    name: string;
    city: string;
    state: string;
    country: string;
  };
  recipient: {
    name: string;
    city: string;
    state: string;
    country: string;
  };
  package: {
    dimensions: any;
    images: boolean;
    description: string;
    weight: {
      value: number;
      unit: string;
    };
  };
  tracking: Array<{
    status: ShipmentStatus;
    location: Location;
    description: string;
    timestamp: string;
    updatedBy: string;
  }>;
  payment: {
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentType: 'full' | 'partial';
    baseAmount: number;
    allowedMethods: Array<'crypto' | 'cashapp' | 'etransfer'>;
    message: string;
    paidAt?: string;
  };
  paymentInstructions: {
    message: string;
    contactInfo: string;
    supportMessage: string;
  };
  createdAt: string;
  currentLocation?: Location;
}

export interface TimelineEvent {
  status: ShipmentStatus | 'payment_received' | 'payment_pending';
  location?: Location;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  category: 'shipment' | 'payment';
}

export interface TrackingTimeline {
  trackingNumber: string;
  currentStatus: ShipmentStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  estimatedDelivery: string;
  timeline: TimelineEvent[];
  paymentInfo: {
    amount: number;
    currency: string;
    paymentType: 'full' | 'partial';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    allowedMethods: Array<'crypto' | 'cashapp' | 'etransfer'>;
    instructions: string;
  };
}

export interface PaymentInfo {
  trackingNumber: string;
  payment: {
    baseAmount: number;
    amount: number;
    paymentType: 'full' | 'partial';
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paidAt?: string;
    paymentMethod?: string;
  };
  paymentAmounts: {
    USD: number;
    BTC: string | null;
    ETH: string | null;
    LTC: string | null;
  };
  allowedMethods: Array<'crypto' | 'cashapp' | 'etransfer'>;
  availableCurrencies: string[];
  shipmentStatus: ShipmentStatus;
  exchangeRates: {
    BTC: number;
    ETH: number;
    LTC: number;
  };
  paymentInstructions: string;
}

export interface PaymentDetailsRequest {
  customerEmail: string;
  preferredMethod?: 'crypto' | 'cashapp' | 'etransfer';
  message?: string;
}

export interface PaymentVerification {
  transactionId: string;
  paymentMethod: 'crypto' | 'cashapp' | 'etransfer';
  customerEmail: string;
  notes?: string;
}

export interface DashboardStats {
  totalShipments: number;
  recentShipments: number;
  totalRevenue: number;
  statusBreakdown: Record<ShipmentStatus, number>;
  paymentBreakdown: Record<Payment['status'], number>;
  paymentMethodBreakdown: Record<string, number>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  user?: User;
}

export interface PaginationInfo {
  current: number;
  total: number;
  count: number;
  totalRecords: number;
}

export interface ShipmentListResponse {
  success: boolean;
  data: Shipment[];
  pagination: PaginationInfo;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateShipmentForm {
  sender: Address;
  recipient: Address;
  package: PackageInfo;
  service: ServiceInfo;
  payment: {
    baseAmount: number;
    paymentType?: 'full' | 'partial';
  };
  notes?: string;
}

export interface TrackingForm {
  status: ShipmentStatus;
  location: Location;
  description: string;
  timestamp?: string;
}

export interface PaymentVerificationForm {
  transactionId: string;
  paymentMethod: 'crypto' | 'cashapp' | 'etransfer';
  customerEmail: string;
  notes?: string;
}