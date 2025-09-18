/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  AuthResponse, 
  LoginForm, 
  RegisterForm,
  ApiResponse,
  Shipment,
  CreateShipmentForm,
  TrackingForm,
  DashboardStats,
  PublicShipment,
  TrackingTimeline,
  PaymentInfo,
  PaymentDetailsRequest,
  PaymentVerification,
  ShipmentListResponse,
  VerificationRequest
} from '../types/index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginForm): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterForm): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData: Partial<RegisterForm>): Promise<ApiResponse> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },
};

// Shipments API
export const shipmentsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ShipmentListResponse> => {
    const response = await api.get('/shipments', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Shipment>> => {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },

  create: async (shipmentData: CreateShipmentForm): Promise<ApiResponse<Shipment>> => {
    const response = await api.post('/shipments', shipmentData);
    return response.data;
  },

  createWithImages: async (formData: FormData): Promise<ApiResponse<Shipment>> => {
    const response = await api.post('/shipments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, updateData: Partial<CreateShipmentForm>): Promise<ApiResponse<Shipment>> => {
    const response = await api.put(`/shipments/${id}`, updateData);
    return response.data;
  },

  updateWithImages: async (id: string, formData: FormData): Promise<ApiResponse<Shipment>> => {
    const response = await api.put(`/shipments/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/shipments/${id}`);
    return response.data;
  },

  addTracking: async (id: string, trackingData: TrackingForm): Promise<ApiResponse<Shipment>> => {
    const response = await api.post(`/shipments/${id}/tracking`, trackingData);
    return response.data;
  },

  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/shipments/stats/dashboard');
    return response.data;
  },

  getImage: async (shipmentId: string, imageId: string): Promise<string> => {
    const response = await api.get(`/shipments/${shipmentId}/images/${imageId}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  },

  deleteImage: async (shipmentId: string, imageId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/shipments/${shipmentId}/images/${imageId}`);
    return response.data;
  },
};

// Public Tracking API (no auth required)
export const trackingApi = {
  track: async (trackingNumber: string): Promise<ApiResponse<PublicShipment>> => {
    const response = await axios.get(`${API_BASE_URL}/tracking/${trackingNumber}`);
    return response.data;
  },

  getTimeline: async (trackingNumber: string): Promise<ApiResponse<TrackingTimeline>> => {
    const response = await axios.get(`${API_BASE_URL}/tracking/${trackingNumber}/timeline`);
    return response.data;
  },

  getPaymentInfo: async (trackingNumber: string): Promise<ApiResponse<PaymentInfo>> => {
    const response = await axios.get(`${API_BASE_URL}/tracking/${trackingNumber}/payment`);
    return response.data;
  },
};

// Payments API
export const paymentsApi = {
  getPaymentInfo: async (trackingNumber: string): Promise<ApiResponse<PaymentInfo>> => {
    const response = await axios.get(`${API_BASE_URL}/payments/${trackingNumber}/info`);
    return response.data;
  },

  requestPaymentDetails: async (trackingNumber: string, requestData: PaymentDetailsRequest): Promise<ApiResponse> => {
    const response = await axios.post(`${API_BASE_URL}/payments/${trackingNumber}/request-details`, requestData);
    return response.data;
  },

  verifyPayment: async (trackingNumber: string, verificationData: PaymentVerification): Promise<ApiResponse> => {
    const response = await axios.post(`${API_BASE_URL}/payments/${trackingNumber}/verify`, verificationData);
    return response.data;
  },

  updatePaymentStatus: async (shipmentId: string, statusData: {
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paymentMethod?: 'crypto' | 'cashapp' | 'etransfer';
    adminNotes?: string;
  }): Promise<ApiResponse> => {
    const response = await api.put(`/payments/${shipmentId}/status`, statusData);
    return response.data;
  },

  getVerificationRequests: async (): Promise<ApiResponse<VerificationRequest[]>> => {
    const response = await api.get('/payments/verification-requests');
    return response.data;
  },

  getPaymentStats: async (): Promise<ApiResponse> => {
    const response = await api.get('/payments/stats');
    return response.data;
  },

  // Legacy methods for backward compatibility (deprecated)
  generateQR: async (trackingNumber: string, currency: string, walletAddress?: string): Promise<ApiResponse> => {
    console.warn('generateQR is deprecated - use requestPaymentDetails instead');
    return {
      success: false,
      message: 'QR generation is no longer supported. Please use the payment details request system.',
    };
  },

  requestPaymentDetailsLegacy: async (trackingNumber: string, paymentData: {
    customerEmail: string;
    preferredMethod?: string;
    message?: string;
  }): Promise<ApiResponse> => {
    // Map to new interface
    const requestData: PaymentDetailsRequest = {
      customerEmail: paymentData.customerEmail,
      preferredMethod: paymentData.preferredMethod as any,
      message: paymentData.message,
    };
    return paymentsApi.requestPaymentDetails(trackingNumber, requestData);
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<ApiResponse> => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },
};

export default api;