/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Package, Home } from 'lucide-react';
import { Location, PublicShipment } from '@/types';

interface Coordinates {
  lat: number;
  lng: number;
}

interface CoordinatesState {
  sender: Coordinates | null;
  recipient: Coordinates | null;
  current: Coordinates | null;
}

interface TrackingMapProps {
  shipment: PublicShipment;
}

interface LeafletHTMLElement extends HTMLElement {
  _leaflet_id?: number;
}

declare global {
  interface Window {
    L: any;
  }
}

const TrackingMap: React.FC<TrackingMapProps> = ({ shipment }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState<CoordinatesState>({
    sender: null,
    recipient: null,
    current: null
  });

  const geocodeLocation = async (location: Location): Promise<Coordinates | null> => {
    try {
      const query = `${location.city}, ${location.state}, ${location.country}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!shipment) return;

      try {
        const [senderCoords, recipientCoords, currentCoords] = await Promise.all([
          geocodeLocation(shipment.sender),
          geocodeLocation(shipment.recipient),
          shipment.currentLocation ? geocodeLocation(shipment.currentLocation) : Promise.resolve(null)
        ]);

        setCoordinates({
          sender: senderCoords,
          recipient: recipientCoords,
          current: currentCoords
        });

        if (!window.L) {
          const leafletScript = document.createElement('script');
          leafletScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
          leafletScript.onload = () => {
            const leafletCSS = document.createElement('link');
            leafletCSS.rel = 'stylesheet';
            leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
            document.head.appendChild(leafletCSS);
            setMapLoaded(true);
          };
          document.head.appendChild(leafletScript);
        } else {
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    initializeMap();
  }, [shipment]);

  useEffect(() => {
    if (!mapLoaded || !coordinates.sender || !coordinates.recipient) return;

    const mapContainer = document.getElementById('tracking-map') as LeafletHTMLElement;
    if (!mapContainer || mapContainer._leaflet_id) return;

    try {
      const map = window.L.map('tracking-map', {
        zoomControl: true,
        scrollWheelZoom: true
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      const senderIcon = window.L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
          </svg>
        </div>`,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const recipientIcon = window.L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.25 9.035 14.394 6.92a1 1 0 000-1.84l-4-2z"/>
          </svg>
        </div>`,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const currentIcon = coordinates.current ? window.L.divIcon({
        html: `<div class="flex items-center justify-center w-10 h-10 bg-red-600 rounded-full border-2 border-white shadow-lg animate-pulse">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>`,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      }) : null;

      const senderMarker = window.L.marker([coordinates.sender.lat, coordinates.sender.lng], {
        icon: senderIcon
      }).addTo(map).bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-blue-600">Origin</h3>
          <p class="text-sm">${shipment.sender.name || 'Unknown Sender'}</p>
          <p class="text-xs text-gray-600">${shipment.sender.city}, ${shipment.sender.state}</p>
        </div>
      `);

      const recipientMarker = window.L.marker([coordinates.recipient.lat, coordinates.recipient.lng], {
        icon: recipientIcon
      }).addTo(map).bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-green-600">Destination</h3>
          <p class="text-sm">${shipment.recipient.name || 'Unknown Recipient'}</p>
          <p class="text-xs text-gray-600">${shipment.recipient.city}, ${shipment.recipient.state}</p>
        </div>
      `);

      let currentMarker = null;
      if (coordinates.current && currentIcon && shipment.currentLocation) {
        currentMarker = window.L.marker([coordinates.current.lat, coordinates.current.lng], {
          icon: currentIcon
        }).addTo(map).bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-red-600">Current Location</h3>
            <p class="text-xs text-gray-600">${shipment.currentLocation.name || 'Current Location'}, ${shipment.currentLocation.city}, ${shipment.currentLocation.state}</p>
            <p class="text-xs text-gray-500">Status: ${shipment.status.current.replace('_', ' ').toUpperCase()}</p>
          </div>
        `);
      }

      const routePoints: [number, number][] = [
        [coordinates.sender.lat, coordinates.sender.lng]
      ];

      if (coordinates.current) {
        routePoints.push([coordinates.current.lat, coordinates.current.lng]);
      }

      routePoints.push([coordinates.recipient.lat, coordinates.recipient.lng]);

      const isDelivered = shipment.status.current === 'delivered';
      const routeLine = window.L.polyline(routePoints, {
        color: isDelivered ? '#10B981' : '#EF4444',
        weight: 3,
        opacity: 0.8,
        dashArray: isDelivered ? undefined : '10, 10'
      }).addTo(map);

      const group = new window.L.featureGroup([
        senderMarker,
        recipientMarker,
        ...(currentMarker ? [currentMarker] : [])
      ]);
      map.fitBounds(group.getBounds().pad(0.1));

      return () => {
        if (map) {
          map.remove();
        }
      };
    } catch (error) {
      console.error('Error creating map:', error);
    }
  }, [mapLoaded, coordinates, shipment]);

  if (!shipment) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No shipment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <Navigation className="h-5 w-5 text-red-500" />
        <span>Route Map</span>
      </h2>
      
      <div 
        id="tracking-map" 
        className="w-full h-96 rounded-lg border border-gray-700 bg-gray-800"
        style={{ minHeight: '400px' }}
      />
      
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <Home className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-300">Origin</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-300">Destination</span>
        </div>
        
        {coordinates.current && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <Package className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-300">Current</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Distance:</span>
            <span className="text-white ml-2">
              {coordinates.sender && coordinates.recipient 
                ? `~${Math.round(getDistance(coordinates.sender, coordinates.recipient))} km`
                : 'Calculating...'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <span className="text-white ml-2 capitalize">
              {shipment.status.current.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const getDistance = (point1: Coordinates, point2: Coordinates): number => {
  const R = 6371;
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

export default TrackingMap;