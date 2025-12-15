/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Loader2, Package, AlertCircle } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<SearchForm>();

  const onSubmit = async (data: SearchForm) => {
    if (!data.trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError(null);
    setShipment(null);
    setTimeline(null);

    try {
      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 25000)
      );

      const fetchData = Promise.all([
        trackingApi.track(data.trackingNumber),
        trackingApi.getTimeline(data.trackingNumber)
      ]);

      const [shipmentRes, timelineRes] = await Promise.race([
        fetchData,
        timeout
      ]) as any;

      if (shipmentRes.success && timelineRes.success) {
        setShipment(shipmentRes.data || null);
        setTimeline(timelineRes.data || null);
        
        if (shipmentRes.data) {
          toast.success('Shipment found');
        } else {
          toast.error('Shipment not found');
          setError('Shipment not found');
        }
      } else {
        const errorMsg = shipmentRes.message || timelineRes.message || 'Shipment not found';
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Track error:', err);
      
      let errorMessage = 'Failed to track shipment';
      
      if (err.message === 'Request timeout') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.response?.status === 504) {
        errorMessage = 'Server timeout. Please try again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Track Shipment</h1>
          <p className="text-gray-400">Search for any shipment by tracking number</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tracking Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('trackingNumber', { 
                    required: 'Tracking number is required',
                    minLength: { value: 2, message: 'Tracking number too short' }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter tracking number (e.g., TRK123456)"
                  disabled={loading}
                />
              </div>
              {errors.trackingNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.trackingNumber.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Track Shipment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
              <p className="text-gray-400">Loading shipment data...</p>
              <p className="text-gray-500 text-sm">This may take a few moments</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                <p className="text-red-300 text-sm">{error}</p>
                <p className="text-red-400/70 text-xs mt-2">
                  Please check the tracking number and try again. If the problem persists, check the server logs.
                </p>
              </div>
            </div>
          </div>
        )}

        {shipment && timeline && !loading && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{shipment.trackingNumber}</h2>
                  <p className="text-gray-400 text-sm">
                    Status: <span className="capitalize text-white">{shipment.status.current.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">FROM</h3>
                  <div className="space-y-1">
                    <p className="text-white font-medium">{shipment.sender.name}</p>
                    <p className="text-gray-400 text-sm">
                      {shipment.sender.city}, {shipment.sender.state}
                    </p>
                    <p className="text-gray-400 text-sm">{shipment.sender.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">TO</h3>
                  <div className="space-y-1">
                    <p className="text-white font-medium">{shipment.recipient.name}</p>
                    <p className="text-gray-400 text-sm">
                      {shipment.recipient.city}, {shipment.recipient.state}
                    </p>
                    <p className="text-gray-400 text-sm">{shipment.recipient.country}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Weight</p>
                    <p className="text-white font-medium">
                      {shipment.package.weight.value} {shipment.package.weight.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Service</p>
                    <p className="text-white font-medium capitalize">{shipment.service.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Payment</p>
                    <p className={`font-medium ${
                      shipment.payment.status === 'paid' ? 'text-green-400' : 
                      shipment.payment.status === 'pending' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {shipment.payment.status.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Amount</p>
                    <p className="text-white font-medium">
                      ${shipment.payment.amount} {shipment.payment.currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Tracking Timeline</h2>
              <TrackingTimelines timeline={timeline} />
            </div>
          </div>
        )}

        {!shipment && !loading && !error && (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12">
            <div className="text-center">
              <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Enter a tracking number to view shipment details</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}