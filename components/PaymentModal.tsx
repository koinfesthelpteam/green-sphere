/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Shield, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Send,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentsApi } from '@/lib/api';
import { PaymentInfo, PaymentDetailsRequest, PaymentVerification } from '@/types';

interface PaymentModalProps {
  trackingNumber: string;
  amount: number;
  currency: string;
  onClose: () => void;
  onPaymentComplete?: () => void;
}

export default function PaymentModal({ 
  trackingNumber, 
  amount, 
  currency, 
  onClose, 
  onPaymentComplete 
}: PaymentModalProps) {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'request' | 'verify'>('request');
  
  // Request payment details state
  const [requestForm, setRequestForm] = useState<{
    email: string;
    preferredMethod: '' | 'crypto' | 'cashapp' | 'etransfer';
    message: string;
  }>({
    email: '',
    preferredMethod: '',
    message: ''
  });
  const [requestingDetails, setRequestingDetails] = useState(false);
  
  // Verify payment state
  const [verifyForm, setVerifyForm] = useState<{
    email: string;
    transactionId: string;
    paymentMethod: '' | 'crypto' | 'cashapp' | 'etransfer';
    notes: string;
  }>({
    email: '',
    transactionId: '',
    paymentMethod: '',
    notes: ''
  });
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Define all possible payment methods
  const allPaymentMethods = [
    { value: 'crypto' as const, label: 'Cryptocurrency (BTC, ETH, LTC)', description: 'Pay with Bitcoin, Ethereum, or Litecoin' },
    { value: 'cashapp' as const, label: 'Cash App', description: 'Pay with USD via Cash App' },
    { value: 'etransfer' as const, label: 'E-Transfer', description: 'Pay with CAD via email money transfer' }
  ];

  useEffect(() => {
    fetchPaymentInfo();
  }, [trackingNumber]);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const response = await paymentsApi.getPaymentInfo(trackingNumber);
      
      if (response.success && response.data) {
        setPaymentInfo(response.data);
      } else {
        toast.error('Failed to load payment information');
      }
    } catch (error: any) {
      console.error('Error fetching payment info:', error);
      toast.error(error.response?.data?.message || 'Failed to load payment information');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPaymentDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestForm.email) {
      toast.error('Please enter your email address');
      return;
    }

    if (requestForm.preferredMethod && paymentInfo && !paymentInfo.allowedMethods.includes(requestForm.preferredMethod)) {
      toast.error('Selected payment method is not available for this shipment');
      return;
    }

    try {
      setRequestingDetails(true);
      
      const requestData: PaymentDetailsRequest = {
        customerEmail: requestForm.email,
        preferredMethod: requestForm.preferredMethod || undefined,
        message: requestForm.message || undefined
      };

      const response = await paymentsApi.requestPaymentDetails(trackingNumber, requestData);

      if (response.success) {
        toast.success('Payment details request sent! Check your email within 1-2 business hours.');
        setRequestForm({ email: '', preferredMethod: '', message: '' });
        onClose();
      } else {
        toast.error(response.message || 'Failed to request payment details');
      }
    } catch (error: any) {
      console.error('Error requesting payment details:', error);
      toast.error(error.response?.data?.message || 'Failed to request payment details');
    } finally {
      setRequestingDetails(false);
    }
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verifyForm.email || !verifyForm.transactionId || !verifyForm.paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!['crypto', 'cashapp', 'etransfer'].includes(verifyForm.paymentMethod)) {
      toast.error('Please select a valid payment method');
      return;
    }

    if (paymentInfo && !paymentInfo.allowedMethods.includes(verifyForm.paymentMethod)) {
      toast.error('Selected payment method is not allowed for this shipment');
      return;
    }

    try {
      setVerifyingPayment(true);
      
      const verificationData: PaymentVerification = {
        transactionId: verifyForm.transactionId,
        paymentMethod: verifyForm.paymentMethod,
        customerEmail: verifyForm.email,
        notes: verifyForm.notes || undefined
      };

      const response = await paymentsApi.verifyPayment(trackingNumber, verificationData);

      if (response.success) {
        toast.success('Payment verification submitted! Our team will review within 2-4 business hours.');
        setVerifyForm({ email: '', transactionId: '', paymentMethod: '', notes: '' });
        if (onPaymentComplete) {
          onPaymentComplete();
        }
        onClose();
      } else {
        toast.error(response.message || 'Failed to submit payment verification');
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit payment verification');
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            <span className="text-white">Loading payment information...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold text-white">Payment for {trackingNumber}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Payment Summary */}
        {paymentInfo && (
          <div className="p-6 border-b border-gray-700 bg-gray-800/50">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400">Amount Due</div>
                <div className="text-2xl font-bold text-white">
                  ${paymentInfo.payment.amount} {paymentInfo.payment.currency}
                </div>
                {paymentInfo.payment.paymentType === 'partial' && (
                  <div className="text-sm text-yellow-400 mt-2">
                    The sender has paid 50% of the total amount (${paymentInfo.payment.baseAmount}). 
                    Please pay the remaining ${paymentInfo.payment.amount} to proceed with the shipment.
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-400">Payment Status</div>
                <div className={`text-sm font-medium ${
                  paymentInfo.payment.status === 'paid' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {paymentInfo.payment.status.toUpperCase()}
                </div>
              </div>
            </div>

            {paymentInfo.payment.paymentType === 'partial' && (
              <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-100">
                  <strong>Action Required:</strong> The shipment will remain on hold until the remaining payment is completed. 
                  Please request payment details or submit payment proof to move the shipment to &quot;In Transit&quot; status.
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Payment Methods</div>
              <div className="flex flex-wrap gap-2">
                {allPaymentMethods.map(method => (
                  <div
                    key={method.value}
                    className={`px-3 py-1 rounded-full text-xs uppercase flex items-center space-x-2 ${
                      paymentInfo.allowedMethods.includes(method.value)
                        ? 'bg-green-700 text-green-100'
                        : 'bg-gray-700 text-gray-400 opacity-50'
                    }`}
                  >
                    <span>{method.label}</span>
                    {paymentInfo.allowedMethods.includes(method.value) ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'request'
                ? 'text-green-400 border-b-2 border-green-500 bg-green-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Request Payment Details
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'verify'
                ? 'text-green-400 border-b-2 border-green-500 bg-green-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Submit Payment Proof
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'request' && (
            <div>
              <div className="mb-6">
                <div className="flex items-start space-x-3 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-100">
                    <strong>How it works:</strong> Our admin team will email you specific payment instructions 
                    including wallet addresses, account details, or payment platform information based on your 
                    preferred method. Only available methods can be selected.
                  </div>
                </div>
              </div>

              <form onSubmit={handleRequestPaymentDetails} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Payment Method
                  </label>
                  <select
                    value={requestForm.preferredMethod}
                    onChange={(e) => setRequestForm({ ...requestForm, preferredMethod: e.target.value as '' | 'crypto' | 'cashapp' | 'etransfer' })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="">Any available method</option>
                    {allPaymentMethods.map(method => (
                      <option
                        key={method.value}
                        value={method.value}
                        disabled={!paymentInfo?.allowedMethods.includes(method.value)}
                      >
                        {method.label}
                        {!paymentInfo?.allowedMethods.includes(method.value) && ' (Not Available)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                    rows={3}
                    placeholder="Any specific requirements or questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={requestingDetails}
                  className="w-full bg-green-600 hover:bg-gree-700 disabled:bg-green-800 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {requestingDetails ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Requesting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Request Payment Details</span>
                    </>
                  )}
                </button>

                <div className="text-xs text-gray-400 text-center">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Response time: 1-2 business hours
                </div>
              </form>
            </div>
          )}

          {activeTab === 'verify' && (
            <div>
              <div className="mb-6">
                <div className="flex items-start space-x-3 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-100">
                    <strong>Already made payment?</strong> Submit your transaction details below and our team 
                    will verify your payment within 2-4 business hours. Only available methods can be selected.
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={verifyForm.email}
                    onChange={(e) => setVerifyForm({ ...verifyForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={verifyForm.transactionId}
                    onChange={(e) => setVerifyForm({ ...verifyForm, transactionId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                    placeholder="Enter transaction ID or reference number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method Used *
                  </label>
                  <select
                    required
                    value={verifyForm.paymentMethod}
                    onChange={(e) => setVerifyForm({ ...verifyForm, paymentMethod: e.target.value as '' | 'crypto' | 'cashapp' | 'etransfer' })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select payment method</option>
                    {allPaymentMethods.map(method => (
                      <option
                        key={method.value}
                        value={method.value}
                        disabled={!paymentInfo?.allowedMethods.includes(method.value)}
                      >
                        {method.label}
                        {!paymentInfo?.allowedMethods.includes(method.value) && ' (Not Available)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={verifyForm.notes}
                    onChange={(e) => setVerifyForm({ ...verifyForm, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                    rows={3}
                    placeholder="Any additional information about your payment..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyingPayment}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {verifyingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Submit for Verification</span>
                    </>
                  )}
                </button>

                <div className="text-xs text-gray-400 text-center">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Verification time: 2-4 business hours
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Instructions Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/30">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <strong>Important:</strong> All payments are processed manually by our admin team for security. 
              You will receive email confirmations for all payment-related activities. If you have any issues, 
              please contact our support team.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}