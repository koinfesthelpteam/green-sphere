/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Package, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  AlertCircle,
  CreditCard,
  Truck,
  Building,
  Box,
  Send,
  Plane,
  Home,
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { trackingApi } from '@/lib/api';
import { PublicShipment, TrackingTimeline } from '@/types';
import PaymentModal from '@/components/PaymentModal';
import TrackingTimelines from '@/components/TrackingTimeline';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import TrackingMap from '@/components/TrackingMap';
import Image from 'next/image';

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const trackingNumber = params.trackingNumber as string;

  const [shipment, setShipment] = useState<PublicShipment | null>(null);
  const [timeline, setTimeline] = useState<TrackingTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!trackingNumber) return;

    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [shipmentResponse, timelineResponse] = await Promise.all([
          trackingApi.track(trackingNumber),
          trackingApi.getTimeline(trackingNumber)
        ]);

        if (shipmentResponse.success && shipmentResponse.data) {
          setShipment(shipmentResponse.data);
          console.log('Fetched shipment data:', shipmentResponse.data);
        } else {
          setError(shipmentResponse.message || 'Shipment not found');
        }

        if (timelineResponse.success && timelineResponse.data) {
          setTimeline(timelineResponse.data);
        }

      } catch (err: any) {
        console.error('Error fetching tracking data:', err);
        setError(err.response?.data?.message || 'Failed to fetch tracking information');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [trackingNumber]);

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-400 bg-yellow-900/50',
      paid: 'text-green-400 bg-green-900/50',
      failed: 'text-red-400 bg-red-900/50',
      refunded: 'text-gray-400 bg-gray-800'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400 bg-gray-800';
  };

  const getProgressSteps = () => {
    const steps = [
      { key: 'created', label: 'Order Created', icon: Package },
      { key: 'picked_up', label: 'Picked Up', icon: Truck },
      { key: 'in_transit', label: 'In Transit', icon: Plane },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
      { key: 'delivered', label: 'Delivered', icon: Home }
    ];

    const currentStatus = shipment?.status.current;
    const currentIndex = steps.findIndex(step => step.key === currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
      upcoming: index > currentIndex
    }));
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Shipment Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 w-full"
            >
              Try Another Number
            </button>
            <Link href="/" className="bg-transparent border-2 border-gray-700 hover:border-red-500 text-white hover:text-red-400 px-6 py-3 rounded-lg font-semibold transition-all duration-200 w-full block text-center">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return null;
  }

  const progressSteps = getProgressSteps();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Image
                  src='/images/chat.png'
                  width={120}
                  height={120}
                  alt='logo'
                />
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Tracking: <span className="font-mono font-medium text-white">{trackingNumber}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Package {shipment.status.current.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
              <p className="text-gray-400">
                Last updated: {format(new Date(shipment.status.lastUpdated), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            
            {shipment.payment.status === 'pending' && (
              <div className="mt-4 sm:mt-0 space-x-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/20 flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Make Payment</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              {progressSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center relative">
                    {index < progressSteps.length - 1 && (
                      <div className="absolute top-6 left-6 w-full h-0.5 -z-10">
                        <div className="w-full h-full bg-gray-700"></div>
                        <div 
                          className={`h-full bg-green-500 transition-all duration-1000 ${
                            step.completed ? 'w-full' : 'w-0'
                          }`}
                        ></div>
                      </div>
                    )}
                    
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${step.completed 
                        ? 'bg-green-600 border-green-500 text-white' 
                        : step.current
                        ? 'bg-green-600 border-green-500 text-white animate-pulse'
                        : 'bg-gray-800 border-gray-600 text-gray-400'
                      }
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="text-center mt-2">
                      <div className={`text-sm font-medium ${
                        step.completed || step.current ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </div>
                      {step.current && (
                        <div className="text-xs text-green-400 mt-1">Current</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Send className="h-5 w-5 text-green-500" />
                <span>Shipping Route</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">FROM</div>
                      <div className="font-semibold text-white">{shipment.sender.name || 'Unknown Sender'}</div>
                    </div>
                  </div>
                  <div className="ml-13 space-y-1">
                    <div className="text-gray-300">{shipment.sender.city}, {shipment.sender.state}</div>
                    <div className="text-gray-400">{shipment.sender.country}</div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">TO</div>
                      <div className="font-semibold text-white">{shipment.recipient.name || 'Unknown Recipient'}</div>
                    </div>
                  </div>
                  <div className="ml-13 space-y-1">
                    <div className="text-gray-300">{shipment.recipient.city}, {shipment.recipient.state}</div>
                    <div className="text-gray-400">{shipment.recipient.country}</div>
                  </div>
                </div>
              </div>
            </div>

            <TrackingMap shipment={shipment} />

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Box className="h-5 w-5 text-green-500" />
                <span>Package Information</span>
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Description</div>
                  <div className="font-medium text-white">{shipment.package.description}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Weight</div>
                  <div className="font-medium text-white">
                    {shipment.package.weight.value} {shipment.package.weight.unit}
                  </div>
                </div>
                {shipment.package.dimensions && (
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Dimensions</div>
                    <div className="font-medium text-white">
                      {shipment.package.dimensions.length} x {shipment.package.dimensions.width} x {shipment.package.dimensions.height} {shipment.package.dimensions.unit}
                    </div>
                  </div>
                )}
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Service Type</div>
                  <div className="font-medium text-white capitalize">{shipment.service.type}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Estimated Delivery</div>
                  <div className="font-medium text-green-400">
                    {format(new Date(shipment.service.estimatedDelivery), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Created</div>
                  <div className="font-medium text-white">
                    {format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                  </div>
                </div>
                {shipment.currentLocation && (
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Current Location</div>
                    <div className="font-medium text-white">
                      {shipment.currentLocation.city}, {shipment.currentLocation.state}
                    </div>
                  </div>
                )}
                <div className="bg-gray-800/30 rounded-lg p-4 sm:col-span-2 lg:col-span-3">
                  <div className="text-sm text-gray-400 mb-2">Package Images</div>
                  {shipment.package.images && Array.isArray(shipment.package.images) && shipment.package.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {shipment.package.images.map((image, index) => (
                        <div key={image.filename || index} className="relative group">
                          <Image
                            src={image.path || image.url || '/images/default-package.jpg'}
                            alt={image.description || `Package image ${index + 1}`}
                            width={500}
                            height={500}
                            className="w-full h-32 object-cover rounded-lg border border-gray-700"
                            onError={(e) => {
                              e.currentTarget.src = '/images/delivery.jpg';
                            }}
                          />
                          {image.description && (
                            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2 rounded-lg">
                              <p className="text-xs text-white text-center">{image.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4 text-gray-400">
                      <ImageIcon className="h-6 w-6 mr-2" />
                      <span>No images available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span>Detailed Timeline</span>
              </h2>
              
              {timeline ? (
                <TrackingTimelines timeline={timeline} />
              ) : shipment.tracking && shipment.tracking.length > 0 ? (
                <div className="space-y-4">
                  {shipment.tracking.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-800 last:border-b-0">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white capitalize">
                              {event.status.replace('_', ' ')}
                            </h4>
                            <p className="text-gray-400 text-sm">{event.description}</p>
                            {event.location && (
                              <p className="text-gray-500 text-xs">
                                {event.location.city}, {event.location.state}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No detailed timeline available</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-green-500" />
                <span>Payment Details</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-bold text-white text-lg">
                    ${shipment.payment.amount} {shipment.payment.currency}
                  </span>
                </div>
                {shipment.payment.paymentType === 'partial' && (
                  <div className="text-sm text-yellow-400">
                    The sender has paid 50% of the total amount (${shipment.payment.baseAmount}). 
                    Please pay the remaining ${shipment.payment.amount} to proceed with the shipment.
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(shipment.payment.status)}`}>
                    {shipment.payment.status.toUpperCase()}
                  </span>
                </div>
                {shipment.payment.paymentType === 'partial' && (
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-100">
                      <strong>Action Required:</strong> The shipment will remain on hold until the remaining payment is completed. 
                      Please make the payment to move the shipment to &quot;In Transit&quot; status.
                    </div>
                  </div>
                )}
                {shipment.payment.allowedMethods && shipment.payment.allowedMethods.length > 0 && (
                  <div className="pt-2 border-t border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Allowed Payment Methods</div>
                    <div className="flex flex-wrap gap-2">
                      {shipment.payment.allowedMethods.map((method: string) => (
                        <span key={method} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs uppercase">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {shipment.payment.paidAt && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="text-gray-400">Paid At</span>
                    <span className="font-medium text-green-400">
                      {format(new Date(shipment.payment.paidAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                {shipment.payment.status === 'pending' && (
                  <div className="pt-2 border-t border-gray-700">
                    <div className="text-sm text-gray-300 mb-2">Payment Instructions</div>
                    <div className="text-xs text-gray-400 leading-relaxed">
                      {shipment.paymentInstructions?.message || 
                       "Contact our admin team via email to receive specific payment details and wallet addresses."}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/20 via-black to-red-900/20 border border-red-500/20 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-3 flex items-center space-x-2">
                <Building className="h-5 w-5 text-green-500" />
                <span>Need Help?</span>
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Contact our support team for assistance with your shipment or payment.
              </p>
              <div className="space-y-2">
                <Link 
                  href="/support"
                  className="block bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Contact Support
                </Link>
                <Link 
                  href="/"
                  className="block border border-gray-600 hover:border-green-500 text-gray-300 hover:text-white text-center py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  Track Another Package
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          trackingNumber={trackingNumber}
          amount={shipment.payment.amount}
          currency={shipment.payment.currency}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={() => {
            setShowPaymentModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}