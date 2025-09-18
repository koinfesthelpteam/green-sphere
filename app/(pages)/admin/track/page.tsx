/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
  import { trackingApi } from '@/lib/api';
  import { PublicShipment, TrackingTimeline } from '@/types';
  import AdminLayout from '@/components/admin/AdminLayout';
  import TrackingTimelines from '@/components/TrackingTimeline';

interface SearchForm {
  trackingNumber: string;
}

export default function AdminTrack() {
  const [shipment, setShipment] = useState<PublicShipment | null>(null);
  const [timeline, setTimeline] = useState<TrackingTimeline | null>(null);
  const { register, handleSubmit } = useForm<SearchForm>();

  const onSubmit = async (data: SearchForm) => {
    try {
      const [shipmentRes, timelineRes] = await Promise.all([
        trackingApi.track(data.trackingNumber),
        trackingApi.getTimeline(data.trackingNumber)
      ]);
      if (shipmentRes.success && timelineRes.success) {
        setShipment(shipmentRes.data || null);
        setTimeline(timelineRes.data || null);
      } else {
        toast.error('Shipment not found');
      }
    } catch (err) {
      toast.error('Failed to track shipment');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-300">Track Shipment</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input {...register('trackingNumber', { required: true })} className="input pl-10 border border-gray-200 py-1 rounded" placeholder="Enter tracking number" />
          </div>
          <button type="submit" className="mt-4 bg-red-700 px-12 py-1 rounded hover:bg-red-600 transition-all duration-200 w-full lg:w-fit">Track</button>
        </form>

        {shipment && timeline && (
          <div className="card mt-8">
            {/* Display shipment details and timeline similar to public tracking */}
            <TrackingTimelines timeline={timeline} />
            {/* Add more admin-specific info if needed */}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}