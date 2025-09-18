'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Home,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { TrackingTimeline as TimelineType, TimelineEvent } from '@/types';

interface TrackingTimelineProps {
  timeline: TimelineType;
}

export default function TrackingTimeline({ timeline }: TrackingTimelineProps) {
  const getStatusIcon = (status: string) => {
    const icons = {
      created: Package,
      picked_up: CheckCircle,
      in_transit: Truck,
      out_for_delivery: MapPin,
      delivered: Home,
      exception: AlertCircle,
      returned: RotateCcw
    };
    
    const IconComponent = icons[status as keyof typeof icons] || Clock;
    return <IconComponent className="h-5 w-5" />;
  };

  const getStatusColor = (status: string, isCompleted: boolean) => {
    if (!isCompleted) {
      return 'bg-gray-600 text-gray-400 border-gray-600';
    }

    const colors = {
      created: 'bg-gray-800 text-gray-400 border-gray-600',
      picked_up: 'bg-blue-900/50 text-blue-400 border-blue-600',
      in_transit: 'bg-yellow-900/50 text-yellow-400 border-yellow-600',
      out_for_delivery: 'bg-purple-900/50 text-purple-400 border-purple-600',
      delivered: 'bg-green-900/50 text-green-400 border-green-600',
      exception: 'bg-red-900/50 text-red-400 border-red-600',
      returned: 'bg-orange-900/50 text-orange-400 border-orange-600'
    };

    return colors[status as keyof typeof colors] || 'bg-gray-600 text-gray-400 border-gray-600';
  };

  const getStatusDescription = (status: string) => {
    const descriptions = {
      created: 'Shipment created and ready for pickup',
      picked_up: 'Package picked up from sender',
      in_transit: 'Package is in transit to destination',
      out_for_delivery: 'Package is out for delivery',
      delivered: 'Package delivered successfully',
      exception: 'Delivery exception occurred',
      returned: 'Package returned to sender'
    };
    
    return descriptions[status as keyof typeof descriptions] || 'Status update';
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-white">Package Journey</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Estimated Delivery</div>
          <div className="font-medium text-green-400">
            {format(new Date(timeline.estimatedDelivery), 'MMM dd, yyyy')}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {timeline.timeline.map((event: TimelineEvent, index: number) => (
          <div key={index} className="relative mb-6 last:mb-0">
            {/* Vertical line */}
            {index < timeline.timeline.length - 1 && (
              <div className="absolute top-6 left-[-24px] w-0.5 h-full bg-gray-700">
                <div 
                  className={`w-full h-full bg-green-500 transition-all duration-1000 ${
                    event.isCompleted ? 'opacity-100' : 'opacity-0'
                  }`}
                ></div>
              </div>
            )}
            
            {/* Status dot */}
            <div className={`
              absolute left-[-28px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-2
              ${getStatusColor(event.status, event.isCompleted)} transition-all duration-300
              ${event.isCompleted && event.status === timeline.currentStatus ? 'animate-pulse' : ''}
            `}>
              {getStatusIcon(event.status)}
            </div>

            {/* Content */}
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white capitalize">
                  {event.status.replace('_', ' ')}
                </h4>
                {event.timestamp && (
                  <span className="text-sm text-gray-400 flex-shrink-0 ml-4">
                    {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-400 mt-1">
                {event.description || getStatusDescription(event.status)}
              </p>

              {/* Location */}
              {event.location && (
                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {event.location.city}, {event.location.state}, {event.location.country}
                  </span>
                </div>
              )}

              {/* Expected time for future events */}
              {!event.isCompleted && !event.timestamp && (
                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>Expected soon</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Progress</span>
          <span className="text-sm text-gray-400">
            {Math.round((timeline.timeline.filter(e => e.isCompleted).length / timeline.timeline.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(timeline.timeline.filter(e => e.isCompleted).length / timeline.timeline.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}