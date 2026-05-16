/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  RefreshCw,
  X,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { paymentsApi, shipmentsApi } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentStatBreakdown {
  _id: string;
  totalAmount: number;
  count: number;
}

interface PaymentStats {
  paymentStatusBreakdown: PaymentStatBreakdown[];
  paymentMethodBreakdown: Array<{ _id: string; count: number; totalAmount: number }>;
  recentPayments: number;
  pendingVerifications: number;
}

interface AdminVerificationRequest {
  shipmentId: string;
  trackingNumber: string;
  paymentAmount: number;
  paymentStatus: string;
  transactionId?: string;
  paymentMethod?: string;
  customerEmail?: string;
  notes?: string;
  submittedAt: string;
  status: string;
}

type PaymentMethod = 'crypto' | 'cashapp' | 'etransfer' | 'bank_transfer' | 'cash' | 'other';

interface RecordPaymentForm {
  trackingNumber: string;
  amountPaid: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  adminNotes: string;
  markFullyPaid: boolean;
}

const EMPTY_FORM: RecordPaymentForm = {
  trackingNumber: '',
  amountPaid: '',
  paymentMethod: 'crypto',
  transactionId: '',
  adminNotes: '',
  markFullyPaid: false,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [verifications, setVerifications] = useState<AdminVerificationRequest[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingVerifications, setLoadingVerifications] = useState(true);

  // inline confirm state: which row is being confirmed, and which action
  const [confirmingRow, setConfirmingRow] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);
  const [processingRow, setProcessingRow] = useState<string | null>(null);

  // record payment modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [form, setForm] = useState<RecordPaymentForm>(EMPTY_FORM);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => Promise.all([fetchStats(), fetchVerifications()]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await paymentsApi.getPaymentStats();
      if (res.success && res.data) {
        setStats(res.data as PaymentStats);
      }
    } catch (err: any) {
      console.error('Failed to load payment stats:', err);
      toast.error('Failed to load payment stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchVerifications = async () => {
    try {
      setLoadingVerifications(true);
      const res = await paymentsApi.getVerificationRequests();
      if (res.success && res.data) {
        setVerifications(res.data as any as AdminVerificationRequest[]);
      }
    } catch (err: any) {
      console.error('Failed to load verification requests:', err);
      toast.error('Failed to load verification requests');
    } finally {
      setLoadingVerifications(false);
    }
  };

  const handleApprove = async (req: AdminVerificationRequest) => {
    try {
      setProcessingRow(req.shipmentId);
      await paymentsApi.updatePaymentStatus(req.shipmentId, {
        status: 'paid',
        transactionId: req.transactionId,
        paymentMethod: req.paymentMethod as any,
      });
      toast.success(`Payment approved for ${req.trackingNumber}`);
      setConfirmingRow(null);
      await fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve payment');
    } finally {
      setProcessingRow(null);
    }
  };

  const handleReject = async (req: AdminVerificationRequest) => {
    try {
      setProcessingRow(req.shipmentId);
      await paymentsApi.updatePaymentStatus(req.shipmentId, { status: 'failed' });
      toast.success(`Payment rejected for ${req.trackingNumber}`);
      setConfirmingRow(null);
      await fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject payment');
    } finally {
      setProcessingRow(null);
    }
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.trackingNumber.trim()) {
      toast.error('Tracking number is required');
      return;
    }
    const parsedAmount = parseFloat(form.amountPaid);
    if (!form.amountPaid || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      setRecordingPayment(true);

      // Resolve tracking number → shipment ID
      const search = await shipmentsApi.getAll({ search: form.trackingNumber.trim(), limit: 1 });
      const shipment = search.data?.[0];

      if (!shipment) {
        toast.error(`No shipment found for tracking number "${form.trackingNumber}"`);
        return;
      }

      await paymentsApi.recordPayment(shipment._id, {
        amountPaid: parsedAmount,
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId.trim() || undefined,
        adminNotes: form.adminNotes.trim() || undefined,
        markFullyPaid: form.markFullyPaid,
      });

      toast.success('Payment recorded successfully');
      setShowRecordModal(false);
      setForm(EMPTY_FORM);
      await fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setRecordingPayment(false);
    }
  };

  const closeModal = () => {
    if (recordingPayment) return;
    setShowRecordModal(false);
    setForm(EMPTY_FORM);
  };

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalPaidAmount = stats?.paymentStatusBreakdown.find(b => b._id === 'paid')?.totalAmount ?? 0;
  const pendingCount = stats?.paymentStatusBreakdown.find(b => b._id === 'pending')?.count ?? 0;
  const pendingVerifCount = stats?.pendingVerifications ?? 0;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: 'bg-green-50 text-green-700 border border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      pending_review: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      failed: 'bg-red-50 text-red-700 border border-red-200',
      rejected: 'bg-red-50 text-red-700 border border-red-200',
      refunded: 'bg-gray-100 text-gray-600 border border-gray-200',
      approved: 'bg-green-50 text-green-700 border border-green-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="mt-1 text-sm text-gray-500">Manage payments and verify transactions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAll}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowRecordModal(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Record Payment
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Total Paid */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Paid</p>
                {loadingStats
                  ? <div className="h-8 w-28 bg-gray-100 rounded animate-pulse mt-1" />
                  : <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(totalPaidAmount)}</p>
                }
              </div>
              <CheckCircle className="h-8 w-8 text-green-400 opacity-80 shrink-0" />
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                {loadingStats
                  ? <div className="h-8 w-12 bg-gray-100 rounded animate-pulse mt-1" />
                  : <p className="mt-1 text-2xl font-semibold text-gray-900">{pendingCount}</p>
                }
              </div>
              <Clock className="h-8 w-8 text-yellow-400 opacity-80 shrink-0" />
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Recent Payments</p>
                {loadingStats
                  ? <div className="h-8 w-12 bg-gray-100 rounded animate-pulse mt-1" />
                  : (
                    <>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{stats?.recentPayments ?? 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                    </>
                  )
                }
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400 opacity-80 shrink-0" />
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                {loadingStats
                  ? <div className="h-8 w-12 bg-gray-100 rounded animate-pulse mt-1" />
                  : (
                    <p className={`mt-1 text-2xl font-semibold ${pendingVerifCount > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {pendingVerifCount}
                    </p>
                  )
                }
              </div>
              <AlertCircle className={`h-8 w-8 opacity-80 shrink-0 ${pendingVerifCount > 0 ? 'text-yellow-500' : 'text-gray-300'}`} />
            </div>
          </div>
        </div>

        {/* ── Verification Requests ── */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pending Verifications</h2>
            {verifications.length > 0 && (
              <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-medium px-2 py-0.5 rounded-full">
                {verifications.length}
              </span>
            )}
          </div>

          {loadingVerifications ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded" />
              ))}
            </div>
          ) : verifications.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
              <p className="mt-1 text-sm text-gray-500">All payment verifications are up to date.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {verifications.map((req) => {
                    const isConfirmApprove = confirmingRow?.id === req.shipmentId && confirmingRow.action === 'approve';
                    const isConfirmReject = confirmingRow?.id === req.shipmentId && confirmingRow.action === 'reject';
                    const isProcessing = processingRow === req.shipmentId;

                    return (
                      <tr key={req.shipmentId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {req.trackingNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {req.customerEmail || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {req.paymentMethod?.replace('_', ' ') || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono max-w-[140px] truncate" title={req.transactionId}>
                          {req.transactionId || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {req.paymentAmount != null ? formatCurrency(req.paymentAmount) : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {req.submittedAt ? format(new Date(req.submittedAt), 'MMM dd, yyyy') : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {isConfirmApprove ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(req)}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
                              >
                                {isProcessing ? 'Processing…' : 'Confirm Approve'}
                              </button>
                              <button
                                onClick={() => setConfirmingRow(null)}
                                disabled={isProcessing}
                                className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : isConfirmReject ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleReject(req)}
                                disabled={isProcessing}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
                              >
                                {isProcessing ? 'Processing…' : 'Confirm Reject'}
                              </button>
                              <button
                                onClick={() => setConfirmingRow(null)}
                                disabled={isProcessing}
                                className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setConfirmingRow({ id: req.shipmentId, action: 'approve' })}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setConfirmingRow({ id: req.shipmentId, action: 'reject' })}
                                disabled={isProcessing}
                                className="border border-red-300 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Record Payment Modal ── */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Record Payment</h2>
              <button
                onClick={closeModal}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-4">
              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.trackingNumber}
                  onChange={e => setForm(f => ({ ...f, trackingNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder-gray-400"
                  placeholder="e.g. TRK-123456"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.amountPaid}
                    onChange={e => setForm(f => ({ ...f, amountPaid: e.target.value }))}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.paymentMethod}
                  onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900"
                >
                  <option value="crypto">Crypto</option>
                  <option value="cashapp">Cash App</option>
                  <option value="etransfer">e-Transfer</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.transactionId}
                  onChange={e => setForm(f => ({ ...f, transactionId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder-gray-400"
                  placeholder="Hash, reference, or receipt number"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.adminNotes}
                  onChange={e => setForm(f => ({ ...f, adminNotes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder-gray-400 resize-none"
                  rows={3}
                  placeholder="Any internal notes about this payment…"
                />
              </div>

              {/* Mark Fully Paid */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.markFullyPaid}
                  onChange={e => setForm(f => ({ ...f, markFullyPaid: e.target.checked }))}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm text-gray-700">
                  Mark shipment as <strong className="text-green-700">fully paid</strong> after recording
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recordingPayment}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {recordingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Recording…
                    </>
                  ) : (
                    'Record Payment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
