/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { trackingApi } from '@/lib/api';
import { PublicShipment, TrackingTimeline } from '@/types';
import PaymentModal from '@/components/PaymentModal';
import TrackingTimelines from '@/components/TrackingTimeline';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import TrackingMap from '@/components/TrackingMap';
import Image from 'next/image';

/* ── shared token helpers ──────────────────────────────────────── */
const cream = '#f0fdf4';
const navy  = '#111827';
const rust  = '#16a34a';
const muted = 'rgba(240,253,244,0.55)';
const border = 'rgba(240,253,244,0.1)';
const serif  = "'Playfair Display', Georgia, serif";
const lora   = "'Lora', Georgia, serif";
const mono   = "'Courier New', monospace";

const tag = (label: string, bg = navy, color = cream): React.ReactNode => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: mono,
      fontSize: '0.62rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      backgroundColor: bg,
      color,
      padding: '3px 10px',
    }}
  >
    {label}
  </span>
);

/* ── progress steps ────────────────────────────────────────────── */
const STEPS = [
  { key: 'created',          label: 'Order Created' },
  { key: 'picked_up',        label: 'Picked Up' },
  { key: 'in_transit',       label: 'In Transit' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered',        label: 'Delivered' },
];

function ManifestRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="flex items-baseline justify-between py-2.5"
      style={{ borderBottom: `1px solid ${border}` }}
    >
      <span style={{ fontFamily: mono, fontSize: '0.67rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust }}>
        {label}
      </span>
      <span style={{ fontFamily: mono, fontSize: '0.8rem', color: cream, textAlign: 'right', maxWidth: '60%' }}>
        {value}
      </span>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderTop: `3px solid ${rust}`, padding: '1.75rem', ...style }}>
      {children}
    </div>
  );
}

function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '1rem' }}>
      {children}
    </p>
  );
}

export default function TrackingPage() {
  const params  = useParams();
  const router  = useRouter();
  const trackingNumber = params.trackingNumber as string;

  const [shipment, setShipment]           = useState<PublicShipment | null>(null);
  const [timeline, setTimeline]           = useState<TrackingTimeline | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!trackingNumber) return;
    const fetch = async () => {
      try {
        setLoading(true); setError(null);
        const [sr, tr] = await Promise.all([
          trackingApi.track(trackingNumber),
          trackingApi.getTimeline(trackingNumber),
        ]);
        if (sr.success && sr.data)   setShipment(sr.data);
        else                          setError(sr.message || 'Shipment not found');
        if (tr.success && tr.data)   setTimeline(tr.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch tracking information');
      } finally { setLoading(false); }
    };
    fetch();
  }, [trackingNumber]);

  const paymentStatusTag = (status: string) => {
    const map: Record<string, [string, string]> = {
      pending:  ['#B87A00', '#FFF8E1'],
      paid:     ['#14532d', '#22c55e'],
      failed:   ['#5C1A1A', '#FF8A80'],
      refunded: [navy,      muted as string],
    };
    const [bg, color] = map[status] || [navy, cream];
    return tag(status.toUpperCase(), bg, color);
  };

  const getProgressSteps = () => {
    const idx = STEPS.findIndex(s => s.key === shipment?.status.current);
    return STEPS.map((s, i) => ({ ...s, completed: i <= idx, current: i === idx }));
  };

  /* ── loading ── */
  if (loading) return <LoadingSkeleton />;

  /* ── error ── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: navy }}>
        <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '1rem' }}>
            Tracking Error
          </p>
          <h1 style={{ fontFamily: serif, fontSize: '2rem', color: cream, marginBottom: '0.75rem' }}>
            Shipment Not Found
          </h1>
          <p style={{ fontFamily: lora, color: muted, marginBottom: '2rem' }}>{error}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => router.back()}
              style={{ backgroundColor: rust, color: cream, border: 'none', padding: '0.875rem', fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Try Another Number
            </button>
            <Link
              href="/"
              style={{ border: `1.5px solid ${border}`, color: muted, padding: '0.875rem', fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center' }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!shipment) return null;

  const progressSteps = getProgressSteps();
  const paymentStatus = shipment.payment?.status || 'pending';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#030712', color: cream }}>

      {/* ── sticky header ── */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 40,
          backgroundColor: 'rgba(17,24,39,0.97)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${border}`,
        }}
      >
        {/* rust strip */}
        <div style={{ backgroundColor: rust, height: '3px' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => router.back()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
              onMouseEnter={e => (e.currentTarget.style.color = cream)}
              onMouseLeave={e => (e.currentTarget.style.color = muted as string)}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span style={{ color: border, fontSize: '0.8rem' }}>|</span>
            <Image src="/images/chat.png" width={80} height={36} alt="logo" style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.12em', color: muted }}>
            REF: <span style={{ color: cream }}>{trackingNumber}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">

        {/* ── title row ── */}
        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '0.5rem' }}>
              Live Shipment Status
            </p>
            <h1 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: cream, lineHeight: 1.1, marginBottom: '0.4rem' }}>
              {shipment.status.current.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h1>
            <p style={{ fontFamily: mono, fontSize: '0.7rem', color: muted }}>
              Last updated — {format(new Date(shipment.status.lastUpdated), "dd MMM yyyy · HH:mm 'UTC'")}
            </p>
          </div>
          {shipment.payment.status === 'pending' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              style={{ backgroundColor: rust, color: cream, border: 'none', padding: '0.75rem 1.75rem', fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#15803d')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = rust)}
            >
              Make Payment →
            </button>
          )}
        </div>

        {/* ── progress track ── */}
        <div style={{ marginBottom: '3rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '560px', position: 'relative' }}>
            {progressSteps.map((step, i) => (
              <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* connector line */}
                {i < progressSteps.length - 1 && (
                  <div style={{ position: 'absolute', top: '14px', left: '50%', width: '100%', height: '2px', backgroundColor: step.completed ? rust : 'rgba(240,253,244,0.12)', zIndex: 0 }} />
                )}
                {/* dot */}
                <div style={{
                  position: 'relative', zIndex: 1,
                  width: '28px', height: '28px',
                  borderRadius: '50%',
                  backgroundColor: step.completed ? rust : 'rgba(240,253,244,0.08)',
                  border: `2px solid ${step.completed ? rust : 'rgba(240,253,244,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step.completed && <span style={{ color: cream, fontSize: '0.6rem' }}>✓</span>}
                  {step.current && !step.completed && <span style={{ width: '8px', height: '8px', backgroundColor: rust, borderRadius: '50%', display: 'block' }} />}
                </div>
                <div style={{ marginTop: '0.6rem', textAlign: 'center', padding: '0 0.25rem' }}>
                  <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: step.completed ? cream : muted }}>
                    {step.label}
                  </p>
                  {step.current && (
                    <p style={{ fontFamily: mono, fontSize: '0.55rem', color: rust, marginTop: '0.2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      ◆ Current
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── main grid ── */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT: 2 cols */}
          <div className="lg:col-span-2 space-y-8">

            {/* Route */}
            <Card>
              <CardHeading>Shipping Route</CardHeading>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { dir: 'Origin', party: shipment.sender },
                  { dir: 'Destination', party: shipment.recipient },
                ].map(({ dir, party }) => (
                  <div key={dir} style={{ borderLeft: `3px solid ${rust}`, paddingLeft: '1rem' }}>
                    <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: rust, marginBottom: '0.35rem' }}>{dir}</p>
                    <p style={{ fontFamily: serif, fontSize: '1.1rem', color: cream, marginBottom: '0.25rem' }}>{party.name || '—'}</p>
                    <p style={{ fontFamily: lora, fontSize: '0.85rem', color: muted }}>
                      {party.city}, {party.state}<br />{party.country}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Map */}
            <TrackingMap shipment={shipment} />

            {/* Package Info */}
            <Card>
              <CardHeading>Package Information</CardHeading>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0' }}>
                {[
                  ['Description',        shipment.package.description],
                  ['Weight',             `${shipment.package.weight.value} ${shipment.package.weight.unit}`],
                  ['Service Type',       shipment.service.type],
                  ['Est. Delivery',      format(new Date(shipment.service.estimatedDelivery), 'dd MMM yyyy')],
                  ['Created',            format(new Date(shipment.createdAt), 'dd MMM yyyy')],
                  ...(shipment.currentLocation
                    ? [['Current Location', `${shipment.currentLocation.city}, ${shipment.currentLocation.state}`]]
                    : []),
                  ...(shipment.package.dimensions
                    ? [['Dimensions', `${shipment.package.dimensions.length}×${shipment.package.dimensions.width}×${shipment.package.dimensions.height} ${shipment.package.dimensions.unit}`]]
                    : []),
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    style={{ padding: '1rem', borderRight: '1px solid rgba(240,253,244,0.08)', borderBottom: '1px solid rgba(240,253,244,0.08)' }}
                  >
                    <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: rust, marginBottom: '0.3rem' }}>{label}</p>
                    <p style={{ fontFamily: lora, fontSize: '0.9rem', color: cream }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Images */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(240,253,244,0.08)' }}>
                <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: rust, marginBottom: '1rem' }}>
                  Package Images
                </p>
                {shipment.package.images && shipment.package.images.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                    {shipment.package.images.map((image: any, index: number) => (
                      <div key={image.filename || index} style={{ position: 'relative', height: '130px', overflow: 'hidden' }}>
                        <Image
                          src={image.path || image.url || '/images/default-package.jpg'}
                          alt={image.description || `Package image ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = '/images/delivery.jpg'; }}
                        />
                        {image.description && (
                          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(3,7,18,0.82)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                          >
                            <p style={{ fontFamily: lora, fontSize: '0.78rem', color: cream, textAlign: 'center' }}>{image.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: muted, padding: '1rem 0' }}>
                    <ImageIcon size={16} />
                    <span style={{ fontFamily: lora, fontSize: '0.85rem' }}>No images available</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeading>Shipment Timeline</CardHeading>
              {timeline ? (
                <TrackingTimelines timeline={timeline} />
              ) : shipment.tracking && shipment.tracking.length > 0 ? (
                <div style={{ paddingLeft: '0.5rem' }}>
                  {shipment.tracking.map((event: any, index: number) => (
                    <div
                      key={index}
                      style={{ display: 'flex', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(240,253,244,0.07)', marginBottom: '1.25rem' }}
                    >
                      <div style={{ flexShrink: 0, paddingTop: '0.35rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: rust }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                          <div>
                            <p style={{ fontFamily: lora, fontWeight: 600, color: cream, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                              {event.status.replace(/_/g, ' ')}
                            </p>
                            <p style={{ fontFamily: lora, fontSize: '0.82rem', color: muted, marginTop: '0.2rem' }}>{event.description}</p>
                            {event.location && (
                              <p style={{ fontFamily: mono, fontSize: '0.65rem', color: rust, marginTop: '0.2rem', letterSpacing: '0.08em' }}>
                                {event.location.city}, {event.location.state}
                              </p>
                            )}
                          </div>
                          <span style={{ fontFamily: mono, fontSize: '0.65rem', color: muted, whiteSpace: 'nowrap', letterSpacing: '0.06em' }}>
                            {format(new Date(event.timestamp), 'dd MMM · HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontFamily: lora, color: muted, fontSize: '0.9rem' }}>No timeline entries yet.</p>
              )}
            </Card>

          </div>

          {/* RIGHT: sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Payment */}
            <Card>
              <CardHeading>Payment Details</CardHeading>
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: `1px solid ${border}` }}>
                <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: '0.3rem' }}>Amount Due</p>
                <p style={{ fontFamily: serif, fontSize: '1.75rem', color: cream }}>
                  ${shipment.payment.amount} <span style={{ fontSize: '1rem', color: muted }}>{shipment.payment.currency}</span>
                </p>
              </div>
              <ManifestRow label="Status" value={paymentStatusTag(paymentStatus)} />
              {shipment.payment.paidAt && (
                <ManifestRow label="Settled" value={format(new Date(shipment.payment.paidAt), 'dd MMM yyyy')} />
              )}
              {shipment.payment.allowedMethods?.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${border}` }}>
                  <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust, marginBottom: '0.6rem' }}>Accepted Methods</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {shipment.payment.allowedMethods.map((m: string) => (
                      <span key={m} style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid rgba(22,163,74,0.4)`, color: muted, padding: '2px 8px' }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {shipment.payment.paymentType === 'partial' && (
                <div style={{ marginTop: '1rem', padding: '0.875rem', backgroundColor: 'rgba(184,122,0,0.12)', borderLeft: `3px solid #B87A00` }}>
                  <p style={{ fontFamily: lora, fontSize: '0.82rem', color: '#FFF8E1', lineHeight: 1.6 }}>
                    The sender has covered 50% (${shipment.payment.baseAmount}). The remaining
                    ${shipment.payment.amount} is required to proceed.
                  </p>
                </div>
              )}
              {paymentStatus === 'pending' && (
                <>
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${border}` }}>
                    <p style={{ fontFamily: lora, fontSize: '0.82rem', color: muted, lineHeight: 1.6 }}>
                      {shipment.paymentInstructions?.message ||
                        'Contact our team via email to receive wallet addresses and payment details.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    style={{ marginTop: '1rem', width: '100%', backgroundColor: rust, color: cream, border: 'none', padding: '0.875rem', fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#15803d')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = rust)}
                  >
                    Pay Now →
                  </button>
                </>
              )}
            </Card>

            {/* Help */}
            <Card>
              <CardHeading>Need Assistance?</CardHeading>
              <p style={{ fontFamily: lora, fontSize: '0.875rem', color: muted, lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Our freight specialists are available around the clock to assist with
                your shipment or payment enquiry.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <Link
                  href="/support"
                  style={{ display: 'block', textAlign: 'center', padding: '0.75rem', backgroundColor: rust, color: cream, fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = rust)}
                >
                  Contact Support
                </Link>
                <Link
                  href="/"
                  style={{ display: 'block', textAlign: 'center', padding: '0.75rem', border: `1.5px solid rgba(240,253,244,0.2)`, color: muted, fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = cream)}
                  onMouseLeave={e => (e.currentTarget.style.color = muted as string)}
                >
                  Track Another Shipment
                </Link>
              </div>
            </Card>

          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          trackingNumber={trackingNumber}
          amount={shipment.payment.amount}
          currency={shipment.payment.currency}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={() => { setShowPaymentModal(false); window.location.reload(); }}
        />
      )}
    </div>
  );
}