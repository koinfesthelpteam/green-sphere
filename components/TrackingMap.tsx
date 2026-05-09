/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Location, PublicShipment } from '@/types';

interface Coordinates { lat: number; lng: number }
interface CoordinatesState { sender: Coordinates | null; recipient: Coordinates | null; current: Coordinates | null }
interface TrackingMapProps { shipment: PublicShipment }
interface LeafletHTMLElement extends HTMLElement { _leaflet_id?: number }

declare global { interface Window { L: any } }

const cream = '#F5F0E8';
const navy  = '#0D1B3E';
const rust  = '#C4713B';
const muted = 'rgba(245,240,232,0.55)';
const mono  = "'Courier New', monospace";
const lora  = "'Lora', Georgia, serif";
const serif = "'Playfair Display', Georgia, serif";

const getDistance = (a: Coordinates, b: Coordinates) => {
  const R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLon = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
};

const geocodeLocation = async (loc: Location): Promise<Coordinates | null> => {
  try {
    const q = encodeURIComponent(`${loc.city}, ${loc.state}, ${loc.country}`);
    const data = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`).then(r => r.json());
    return data[0] ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
  } catch { return null; }
};

/* Dot SVG markers — no rounded blobs, just clean squares with rust fill */
const makeIcon = (L: any, color: string, label: string) =>
  L.divIcon({
    html: `<div style="width:10px;height:10px;background:${color};border:2px solid #F5F0E8;box-shadow:0 0 0 1px ${color}"></div>`,
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

const TrackingMap: React.FC<TrackingMapProps> = ({ shipment }) => {
  const [mapLoaded, setMapLoaded]       = useState(false);
  const [coordinates, setCoordinates]   = useState<CoordinatesState>({ sender: null, recipient: null, current: null });

  useEffect(() => {
    (async () => {
      const [s, r, c] = await Promise.all([
        geocodeLocation(shipment.sender),
        geocodeLocation(shipment.recipient),
        shipment.currentLocation ? geocodeLocation(shipment.currentLocation) : null,
      ]);
      setCoordinates({ sender: s, recipient: r, current: c });

      if (!window.L) {
        const css = document.createElement('link');
        css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(css);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
      } else { setMapLoaded(true); }
    })();
  }, [shipment]);

  useEffect(() => {
    if (!mapLoaded || !coordinates.sender || !coordinates.recipient) return;
    const el = document.getElementById('tracking-map') as LeafletHTMLElement;
    if (!el || el._leaflet_id) return;

    try {
      const L = window.L;
      /* Dark-ish muted map tile — CartoDB dark matter without labels for cleaner look */
      const map = L.map('tracking-map', { zoomControl: true, scrollWheelZoom: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(map);

      const markers: any[] = [];

      const addMarker = (coord: Coordinates, color: string, popup: string) => {
        const m = L.marker([coord.lat, coord.lng], { icon: makeIcon(L, color, '') })
          .addTo(map)
          .bindPopup(`<div style="font-family:${mono};font-size:0.72rem;letter-spacing:0.06em;color:${navy};padding:4px 2px">${popup}</div>`);
        markers.push(m);
        return m;
      };

      addMarker(coordinates.sender!, rust, `ORIGIN — ${shipment.sender.city}, ${shipment.sender.state}`);
      addMarker(coordinates.recipient!, '#8BC34A', `DESTINATION — ${shipment.recipient.city}, ${shipment.recipient.state}`);
      if (coordinates.current && shipment.currentLocation) {
        addMarker(coordinates.current, cream, `CURRENT — ${shipment.currentLocation.city}, ${shipment.currentLocation.state}`);
      }

      const routePts: [number, number][] = [
        [coordinates.sender!.lat, coordinates.sender!.lng],
        ...(coordinates.current ? [[coordinates.current.lat, coordinates.current.lng] as [number, number]] : []),
        [coordinates.recipient!.lat, coordinates.recipient!.lng],
      ];

      const delivered = shipment.status.current === 'delivered';
      L.polyline(routePts, { color: delivered ? '#8BC34A' : rust, weight: 2, opacity: 0.7, dashArray: delivered ? undefined : '8 6' }).addTo(map);

      map.fitBounds(L.featureGroup(markers).getBounds().pad(0.15));
    } catch (e) { console.error('Map error:', e); }
  }, [mapLoaded, coordinates, shipment]);

  if (!shipment) return null;

  const { sender, recipient, current } = coordinates;
  const dist = sender && recipient ? Math.round(getDistance(sender, recipient)).toLocaleString() : null;

  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderTop: `3px solid ${rust}`, padding: '1.75rem', marginBottom: '0' }}>

      <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '1rem' }}>
        Route Map
      </p>

      {/* map container */}
      <div style={{ position: 'relative' }}>
        <div id="tracking-map" style={{ width: '100%', height: '380px', backgroundColor: '#0A1020' }} />
        {!mapLoaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A1020' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '24px', height: '24px', border: `2px solid rgba(245,240,232,0.15)`, borderTopColor: rust, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 0.75rem' }} />
              <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>Loading map…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          </div>
        )}
      </div>

      {/* legend + stats */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid rgba(245,240,232,0.08)`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
          {[
            { color: rust,     label: 'Origin' },
            { color: '#8BC34A', label: 'Destination' },
            ...(current ? [{ color: cream, label: 'Current Position' }] : []),
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: color, flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>{label}</span>
            </div>
          ))}
        </div>
        {dist && (
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <span style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: rust }}>Distance </span>
              <span style={{ fontFamily: mono, fontSize: '0.72rem', color: cream }}>~{dist} km</span>
            </div>
            <div>
              <span style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: rust }}>Status </span>
              <span style={{ fontFamily: mono, fontSize: '0.72rem', color: cream, textTransform: 'capitalize' }}>
                {shipment.status.current.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingMap;