/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { shipmentsApi } from '@/lib/api';
import { Shipment, TrackingForm } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import TrackingTimeline from '@/components/TrackingTimeline';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

interface RecordPaymentForm {
  amountPaid: number;
  paymentMethod: 'crypto' | 'cashapp' | 'etransfer' | 'bank_transfer' | 'cash' | 'other';
  transactionId?: string;
  adminNotes?: string;
  markFullyPaid?: boolean;
}

export default function ViewShipment() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingTracking, setAddingTracking] = useState(false);
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  const { register, handleSubmit, reset } = useForm<TrackingForm>();
  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    watch: watchPayment,
    reset: resetPayment,
    setValue: setPaymentValue,
  } = useForm<RecordPaymentForm>({
    defaultValues: {
      paymentMethod: 'crypto',
      markFullyPaid: false,
    },
  });

  const watchedAmount = watchPayment('amountPaid');

  useEffect(() => {
    fetchShipment();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [id]);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      const response = await shipmentsApi.getById(id);
      if (response.success && response.data) {
        setShipment(response.data);
      } else {
        toast.error('Shipment not found');
        router.push('/admin/shipments');
      }
    } catch (err) {
      toast.error('Failed to load shipment');
      router.push('/admin/shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;
    try {
      await shipmentsApi.delete(id);
      toast.success('Shipment deleted');
      router.push('/admin/shipments');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const onAddTracking = async (data: TrackingForm) => {
    try {
      setAddingTracking(true);
      const response = await shipmentsApi.addTracking(id, data);
      if (response.success && response.data) {
        setShipment(response.data);
        reset();
        toast.success('Tracking event added');
      } else {
        toast.error('Failed to add tracking');
      }
    } catch (err) {
      toast.error('Failed to add tracking');
    } finally {
      setAddingTracking(false);
    }
  };

  const onRecordPayment = async (data: RecordPaymentForm) => {
    try {
      setRecordingPayment(true);
      const response = await fetch(`/api/payments/${id}/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          amountPaid: parseFloat(String(data.amountPaid)),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Failed to record payment');
        return;
      }

      toast.success(result.message);
      resetPayment({ paymentMethod: 'crypto', markFullyPaid: false });
      // Refresh shipment data to reflect new payment state
      await fetchShipment();
      setShowPaymentHistory(true);
    } catch (err) {
      toast.error('Failed to record payment');
    } finally {
      setRecordingPayment(false);
    }
  };

  // Derived payment stats
  const totalPaid = shipment?.payment?.partialPayments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const totalDue = shipment?.payment?.amount ?? 0;
  const remainingBalance = Math.max(0, totalDue - totalPaid);
  const percentCollected = totalDue > 0 ? Math.min(100, (totalPaid / totalDue) * 100) : 0;

  const amountInputValue = parseFloat(String(watchedAmount));
  const previewPercent =
    totalDue > 0 && !isNaN(amountInputValue) && amountInputValue > 0
      ? Math.min(100, (amountInputValue / totalDue) * 100).toFixed(1)
      : null;

  if (loading || !shipment) return <LoadingSkeleton />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shipment {shipment.trackingNumber}</h1>
        </div>

        {/* Shipment Detail Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="flex justify-end space-x-2 mb-4">
            <Link
              href={`/admin/shipments/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm bg-red-600 hover:bg-red-700 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Sender</h3>
              <p>{shipment.sender.name}</p>
              <p>{shipment.sender.address1} {shipment.sender.address2}</p>
              <p>{shipment.sender.city}, {shipment.sender.state} {shipment.sender.postalCode}</p>
              <p>{shipment.sender.country}</p>
              <p>Phone: {shipment.sender.phone}</p>
              <p>Email: {shipment.sender.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Recipient</h3>
              <p>{shipment.recipient.name}</p>
              <p>{shipment.recipient.address1} {shipment.recipient.address2}</p>
              <p>{shipment.recipient.city}, {shipment.recipient.state} {shipment.recipient.postalCode}</p>
              <p>{shipment.recipient.country}</p>
              <p>Phone: {shipment.recipient.phone}</p>
              <p>Email: {shipment.recipient.email}</p>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Package</h3>
              <p>Description: {shipment.package.description}</p>
              <p>Weight: {shipment.package.weight.value} {shipment.package.weight.unit}</p>
              <p>Dimensions: {shipment.package.dimensions.length}x{shipment.package.dimensions.width}x{shipment.package.dimensions.height} {shipment.package.dimensions.unit}</p>
              <p>Value: {shipment.package.value.amount} {shipment.package.value.currency}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Service</h3>
              <p>Type: {shipment.service.type}</p>
              <p>Estimated Delivery: {format(new Date(shipment.service.estimatedDelivery), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="mt-6 text-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900">Payment</h3>
            <p>Amount: {shipment.payment.amount} {shipment.payment.currency}</p>
            <p>Status: {shipment.payment.status}</p>
            {shipment.payment.transactionId && <p>Transaction ID: {shipment.payment.transactionId}</p>}
            {shipment.payment.paidAt && <p>Paid At: {format(new Date(shipment.payment.paidAt), 'MMM dd, yyyy HH:mm')}</p>}
          </div>

          <div className="mt-6 text-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900">Notes</h3>
            <p>{shipment.notes || 'No notes'}</p>
          </div>
        </div>

        {/* ── Record Payment Panel ── */}
        {shipment.payment.status !== 'paid' && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Record Payment Receipt</h3>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Collected</span>
                <span>
                  ${totalPaid.toFixed(2)} / ${totalDue.toFixed(2)} {shipment.payment.currency}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentCollected}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{percentCollected.toFixed(1)}% paid</span>
                <span>Balance: ${remainingBalance.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit(onRecordPayment)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Received (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={remainingBalance}
                      {...registerPayment('amountPaid', { required: true, min: 0.01 })}
                      className="pl-7 border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder={`Max: ${remainingBalance.toFixed(2)}`}
                    />
                  </div>
                  {previewPercent && (
                    <p className="text-xs text-green-600 mt-1">
                      = {previewPercent}% of total due
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    {...registerPayment('paymentMethod', { required: true })}
                    className="border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                    Transaction ID <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    {...registerPayment('transactionId')}
                    className="border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Hash, reference, or receipt number"
                  />
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Notes <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    {...registerPayment('adminNotes')}
                    className="border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Any internal notes"
                  />
                </div>
              </div>

              {/* Mark fully paid toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  {...registerPayment('markFullyPaid')}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm text-gray-700">
                  Mark shipment as <strong className="text-green-700">fully paid</strong> after recording
                </span>
              </label>

              <button
                type="submit"
                disabled={recordingPayment}
                className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 rounded-lg px-4 py-2 w-full text-white font-medium transition-colors"
              >
                {recordingPayment ? 'Recording...' : 'Record Payment'}
              </button>
            </form>
          </div>
        )}

        {/* Fully paid badge */}
        {shipment.payment.status === 'paid' && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex items-center gap-3 border-l-4 border-l-green-500">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="text-green-700 font-medium">Payment complete</p>
              {shipment.payment.paidAt && (
                <p className="text-green-600 text-sm">
                  Marked paid on {format(new Date(shipment.payment.paidAt), 'MMM dd, yyyy HH:mm')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment History */}
        {shipment.payment.partialPayments && shipment.payment.partialPayments.length > 0 && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <button
              type="button"
              onClick={() => setShowPaymentHistory(v => !v)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Payment History
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({shipment.payment.partialPayments.length} record{shipment.payment.partialPayments.length !== 1 ? 's' : ''})
                  </span>
                </h3>
              </div>
              {showPaymentHistory ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {showPaymentHistory && (
              <div className="mt-4 space-y-3">
                {[...shipment.payment.partialPayments].reverse().map((p, i) => (
                  <div
                    key={String(p._id ?? i)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                  >
                    <div className="space-y-0.5">
                      <p className="text-gray-900 font-medium">
                        ${p.amount.toFixed(2)}{' '}
                        <span className="text-gray-500 font-normal text-sm">
                          ({p.percentageOfTotal.toFixed(1)}% of total)
                        </span>
                      </p>
                      <p className="text-gray-500 text-sm capitalize">{p.paymentMethod.replace('_', ' ')}</p>
                      {p.transactionId && (
                        <p className="text-gray-400 text-xs font-mono">{p.transactionId}</p>
                      )}
                      {p.adminNotes && (
                        <p className="text-gray-400 text-xs italic">{p.adminNotes}</p>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs shrink-0">
                      {format(new Date(p.recordedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tracking History */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking History</h3>
          <TrackingTimeline timeline={{
            trackingNumber: shipment.trackingNumber,
            currentStatus: shipment.status.current,
            estimatedDelivery: shipment.service.estimatedDelivery,
            timeline: shipment.tracking.map(event => ({
              status: event.status,
              location: event.location,
              description: event.description,
              timestamp: event.timestamp,
              isCompleted: true,
              category: 'shipment' as const
            })),
            paymentStatus: shipment.payment.status as 'pending' | 'paid' | 'failed' | 'refunded',
            paymentInfo: {
              amount: shipment.payment.amount,
              currency: shipment.payment.currency,
              paymentType: 'full' as const,
              status: shipment.payment.status as 'pending' | 'paid' | 'failed' | 'refunded',
              allowedMethods: ['crypto', 'cashapp', 'etransfer'],
              instructions: 'Payment instructions here'
            }
          }} />
        </div>

        {/* Add Tracking Event */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Tracking Event</h3>
          <form onSubmit={handleSubmit(onAddTracking)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  {...register('status', { required: true })}
                  className="border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="exception">Exception</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  {...register('location.city', { required: true })}
                  className="border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  {...register('location.state', { required: true })}
                  className="border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  {...register('location.country', { required: true })}
                  className="border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description', { required: true })}
                  className="border border-gray-300 p-2 rounded-lg text-gray-900 bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900 h-24"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={addingTracking}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 w-full font-medium transition-colors"
            >
              {addingTracking ? 'Adding...' : 'Add Event'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
