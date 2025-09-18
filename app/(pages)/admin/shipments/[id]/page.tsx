/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
  import { shipmentsApi } from '@/lib/api';
  import { Shipment, TrackingForm } from '@/types';
  import AdminLayout from '@/components/admin/AdminLayout';
  import LoadingSkeleton from '@/components/LoadingSkeleton';
  import TrackingTimeline from '@/components/TrackingTimeline'; // Assume you have this component from public tracking
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function ViewShipment() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingTracking, setAddingTracking] = useState(false);
  const { register, handleSubmit, reset } = useForm<TrackingForm>();

  useEffect(() => {
    fetchShipment();
  }, [id]);

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

  if (loading || !shipment) return <LoadingSkeleton />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-white">Shipment {shipment.trackingNumber}</h1>
        </div>

        <div className="card">
          <div className="flex justify-end space-x-2 mb-4">
            <Link href={`/admin/shipments/${id}/edit`} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button onClick={handleDelete} className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm bg-red-700 hover:bg-red-600 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>

          {/* Shipment details similar to public tracking, but more fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Sender</h3>
              <p>{shipment.sender.name}</p>
              <p>{shipment.sender.address1} {shipment.sender.address2}</p>
              <p>{shipment.sender.city}, {shipment.sender.state} {shipment.sender.postalCode}</p>
              <p>{shipment.sender.country}</p>
              <p>Phone: {shipment.sender.phone}</p>
              <p>Email: {shipment.sender.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recipient</h3>
              <p>{shipment.recipient.name}</p>
              <p>{shipment.recipient.address1} {shipment.recipient.address2}</p>
              <p>{shipment.recipient.city}, {shipment.recipient.state} {shipment.recipient.postalCode}</p>
              <p>{shipment.recipient.country}</p>
              <p>Phone: {shipment.recipient.phone}</p>
              <p>Email: {shipment.recipient.email}</p>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Package</h3>
              <p>Description: {shipment.package.description}</p>
              <p>Weight: {shipment.package.weight.value} {shipment.package.weight.unit}</p>
              <p>Dimensions: {shipment.package.dimensions.length}x{shipment.package.dimensions.width}x{shipment.package.dimensions.height} {shipment.package.dimensions.unit}</p>
              <p>Value: {shipment.package.value.amount} {shipment.package.value.currency}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Service</h3>
              <p>Type: {shipment.service.type}</p>
              <p>Estimated Delivery: {format(new Date(shipment.service.estimatedDelivery), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Payment</h3>
            <p>Amount: {shipment.payment.amount} {shipment.payment.currency}</p>
            <p>Status: {shipment.payment.status}</p>
            {shipment.payment.transactionId && <p>Transaction ID: {shipment.payment.transactionId}</p>}
            {shipment.payment.paidAt && <p>Paid At: {format(new Date(shipment.payment.paidAt), 'MMM dd, yyyy HH:mm')}</p>}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p>{shipment.notes || 'No notes'}</p>
          </div>
        </div>

        {/* Tracking History */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
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
              allowedMethods: ['crypto', 'cashapp', 'etransfer'], // or get from shipment data
              instructions: 'Payment instructions here' // or get from shipment data
            }
          }} />
        </div>

        {/* Add Tracking Event */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Add Tracking Event</h3>
          <form onSubmit={handleSubmit(onAddTracking)} className="space-y-4 ">
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <select {...register('status', { required: true })} className="border border-white p-2 rounded text-gray-200 mt-1 bg-black">
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="exception">Exception</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">City</label>
                <input {...register('location.city', { required: true })} className="border border-white p-2 rounded text-gray-200 mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">State</label>
                <input {...register('location.state', { required: true })} className="border border-white p-2 rounded text-gray-200 mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Country</label>
                <input {...register('location.country', { required: true })} className="border border-white p-2 rounded text-gray-200 mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Description</label>
                <textarea {...register('description', { required: true })} className="border border-white p-2 rounded text-gray-200 bg-gray-900 mt-1 h-24" />
              </div>
            </div>
            <button type="submit" disabled={addingTracking} className="bg-red-600 hover:bg-red-700 rounded px-4 py-2 w-full">
              {addingTracking ? 'Adding...' : 'Add Event'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}