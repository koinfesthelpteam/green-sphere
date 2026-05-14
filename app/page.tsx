'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }
    router.push(`/track/${trackingNumber.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0fdf4', color: '#111827' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end overflow-hidden"
        style={{ paddingBottom: '6rem' }}
      >
        {/* Full-bleed hero image */}
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <Image
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=1080&fit=crop&auto=format"
            alt="Cargo ship at sea"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Graduated overlay - lighter at top, heavier at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(3,7,18,0.15) 0%, rgba(3,7,18,0.55) 50%, rgba(3,7,18,0.9) 100%)',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-end">

            {/* Left: headline */}
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-5"
                style={{
                  color: '#16a34a',
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.2em',
                }}
              >
                Global Freight Intelligence
              </p>
              <h1
                className="font-bold leading-none mb-6"
                style={{
                  fontSize: 'clamp(3rem, 7vw, 4rem)',
                  color: '#f0fdf4',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  lineHeight: 1.05,
                }}
              >
                Your Cargo,
                <br />
                <em style={{ fontStyle: 'italic', color: '#16a34a' }}>Tracked.</em>
                <br />
                Delivered.
              </h1>
              <p
                className="text-lg leading-relaxed mb-0"
                style={{
                  color: 'rgba(240,253,244,0.72)',
                  maxWidth: '42ch',
                  fontFamily: "'Lora', Georgia, serif",
                }}
              >
                End-to-end visibility across sea freight, air cargo, road haulage and rail —
                with secure cryptocurrency settlement.
              </p>
            </div>

            {/* Right: tracking form */}
            <div>
              <div
                className="p-8"
                style={{
                  backgroundColor: '#f0fdf4',
                  borderTop: '4px solid #16a34a',
                }}
              >
                <p
                  className="text-xs tracking-widest uppercase mb-5"
                  style={{
                    color: '#4b7c59',
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.18em',
                  }}
                >
                  Shipment Tracking
                </p>
                <form onSubmit={handleTrackSubmit} className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: '#111827', fontFamily: "'Lora', Georgia, serif" }}
                    >
                      Tracking Reference
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. GSS-2024-00847"
                      className="w-full px-4 py-3.5 text-base outline-none transition-all"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1.5px solid #86efac',
                        color: '#111827',
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: '0.05em',
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = '#16a34a')
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = '#86efac')
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 text-sm font-semibold tracking-widest uppercase transition-all duration-200"
                    style={{
                      backgroundColor: '#111827',
                      color: '#f0fdf4',
                      fontFamily: "'Courier New', monospace",
                      letterSpacing: '0.18em',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#16a34a')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#111827')
                    }
                  >
                    Track Shipment →
                  </button>
                </form>
                <div
                  className="mt-5 pt-5 flex items-center gap-6 text-xs"
                  style={{
                    borderTop: '1px solid #86efac',
                    color: '#4b7c59',
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  <span>✓ Real-time updates</span>
                  <span>✓ 24/7 visibility</span>
                  <span>✓ Crypto payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#111827',
          borderTop: '4px solid #16a34a',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { value: '50,000+', label: 'Shipments Delivered', sub: 'Since 2018' },
              { value: '150+', label: 'Countries Served', sub: 'Global network' },
              { value: '99.9%', label: 'On-Time Success', sub: 'Last 12 months' },
              { value: '24 / 7', label: 'Support Available', sub: 'Any timezone' },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-8 py-8 text-center"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
              >
                <div
                  className="font-bold mb-1"
                  style={{
                    fontSize: '2rem',
                    color: '#16a34a',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm font-medium mb-0.5"
                  style={{ color: '#f0fdf4', fontFamily: "'Lora', Georgia, serif" }}
                >
                  {stat.label}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: 'rgba(240,253,244,0.45)',
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Section heading */}
          <div className="flex items-baseline gap-8 mb-16" style={{ borderBottom: '1px solid #86efac', paddingBottom: '1.5rem' }}>
            <p
              className="text-xs tracking-widest uppercase"
              style={{
                color: '#16a34a',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.2em',
                whiteSpace: 'nowrap',
              }}
            >
              Our Services
            </p>
            <h2
              className="font-bold"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                color: '#111827',
                fontFamily: "'Playfair Display', Georgia, serif",
                lineHeight: 1.1,
              }}
            >
              Every mode of transport, one platform
            </h2>
          </div>

          {/* Services grid - editorial magazine layout */}
          <div className="grid md:grid-cols-2 gap-0.5" style={{ backgroundColor: '#86efac' }}>
            {/* Large feature - Sea Freight */}
            <div
              className="relative overflow-hidden group md:row-span-2"
              style={{ minHeight: '520px', backgroundColor: '#f0fdf4' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&h=800&fit=crop&auto=format"
                alt="Container ship sea freight"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(3,7,18,0.9) 0%, rgba(3,7,18,0.3) 60%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span
                  className="inline-block text-xs tracking-widest uppercase mb-3 px-2.5 py-1"
                  style={{
                    color: '#f0fdf4',
                    backgroundColor: '#16a34a',
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.15em',
                  }}
                >
                  Sea Freight
                </span>
                <h3
                  className="font-bold text-2xl mb-2"
                  style={{ color: '#f0fdf4', fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Ocean & Container Shipping
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(240,253,244,0.75)', fontFamily: "'Lora', Georgia, serif" }}
                >
                  Full container loads (FCL) and less-than-container (LCL) services across
                  major global trade lanes. Real-time vessel tracking included.
                </p>
              </div>
            </div>

            {/* Air Freight */}
            <div
              className="relative overflow-hidden group"
              style={{ minHeight: '255px', backgroundColor: '#f0fdf4' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop&auto=format"
                alt="Air cargo freight"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(3,7,18,0.85) 0%, rgba(3,7,18,0.2) 70%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  className="inline-block text-xs tracking-widest uppercase mb-2 px-2.5 py-1"
                  style={{
                    color: '#f0fdf4',
                    backgroundColor: '#111827',
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.15em',
                  }}
                >
                  Air Freight
                </span>
                <h3
                  className="font-bold text-xl"
                  style={{ color: '#f0fdf4', fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Express Air Cargo
                </h3>
              </div>
            </div>

            {/* Road & Rail */}
            <div
              className="relative overflow-hidden group"
              style={{ minHeight: '255px', backgroundColor: '#f0fdf4' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=500&fit=crop&auto=format"
                alt="Road freight truck"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(3,7,18,0.85) 0%, rgba(3,7,18,0.2) 70%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  className="inline-block text-xs tracking-widest uppercase mb-2 px-2.5 py-1"
                  style={{
                    color: '#f0fdf4',
                    backgroundColor: '#111827',
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.15em',
                  }}
                >
                  Road & Rail
                </span>
                <h3
                  className="font-bold text-xl"
                  style={{ color: '#f0fdf4', fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Land Transport & Haulage
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: '#111827' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-baseline gap-8 mb-16" style={{ borderBottom: '1px solid rgba(134,239,172,0.25)', paddingBottom: '1.5rem' }}>
            <p
              className="text-xs tracking-widest uppercase"
              style={{
                color: '#16a34a',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.2em',
                whiteSpace: 'nowrap',
              }}
            >
              The Process
            </p>
            <h2
              className="font-bold"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                color: '#f0fdf4',
                fontFamily: "'Playfair Display', Georgia, serif",
                lineHeight: 1.1,
              }}
            >
              From booking to your door
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-0" style={{ position: 'relative' }}>
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-8 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(22,163,74,0.3)', top: '2.5rem' }}
            />

            {[
              {
                n: '01',
                title: 'Request a Quote',
                body: 'Contact our logistics team with your shipment details. We provide competitive rates across all modes.',
                img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&auto=format',
              },
              {
                n: '02',
                title: 'Confirm & Pay',
                body: 'Approve your shipment plan and settle via bank transfer or cryptocurrency — Bitcoin, ETH, Litecoin accepted.',
                img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&auto=format',
              },
              {
                n: '03',
                title: 'Live Tracking',
                body: 'Your unique tracking reference gives you live location data, customs status, and ETAs at every checkpoint.',
                img: 'https://images.unsplash.com/photo-1502920514313-52581002a659?w=400&h=300&fit=crop&auto=format',
              },
              {
                n: '04',
                title: 'Safe Delivery',
                body: 'Your cargo arrives at the confirmed destination with full chain-of-custody documentation.',
                img: 'https://images.unsplash.com/photo-1609688948884-c6ed8b359c21?w=400&h=300&fit=crop&auto=format',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative p-6 group"
                style={{
                  borderRight: i < 3 ? '1px solid rgba(134,239,172,0.15)' : 'none',
                }}
              >
                {/* Step number */}
                <div
                  className="relative z-10 flex items-center justify-center w-10 h-10 mb-6 font-bold text-sm"
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#f0fdf4',
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {step.n}
                </div>

                {/* Image */}
                <div className="relative overflow-hidden mb-5" style={{ height: '160px' }}>
                  <Image
                    src={step.img}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'rgba(17,24,39,0.25)' }}
                  />
                </div>

                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: '#f0fdf4', fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'rgba(240,253,244,0.6)',
                    fontFamily: "'Lora', Georgia, serif",
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / PHOTO SPLIT ──────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Images collage */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative" style={{ height: '320px', gridRow: 'span 2' }}>
                <Image
                  src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&h=800&fit=crop&auto=format"
                  alt="Port workers loading cargo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative" style={{ height: '153px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop&auto=format"
                  alt="Warehouse operations"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative" style={{ height: '153px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=300&fit=crop&auto=format"
                  alt="Freight documentation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-5"
                style={{
                  color: '#16a34a',
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.2em',
                }}
              >
                About Green Sphere
              </p>
              <h2
                className="font-bold mb-6"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  color: '#111827',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  lineHeight: 1.15,
                }}
              >
                Moving goods across borders since 2018
              </h2>

              <div
                className="space-y-4 mb-8"
                style={{
                  color: '#1f2937',
                  fontFamily: "'Lora', Georgia, serif",
                  lineHeight: 1.8,
                  fontSize: '1.0rem',
                }}
              >
                <p>
                  Green Sphere Services was built on a single conviction: that businesses deserve
                  freight logistics they can actually trust — with full transparency, real-time
                  data, and a team that picks up the phone.
                </p>
                <p>
                  From a single container load to multi-modal supply chain management across 150
                  countries, we handle cargo by sea, air, road and rail. Every shipment comes
                  with a dedicated tracking reference and milestone alerts delivered straight
                  to you.
                </p>
              </div>

              {/* Credentials */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  'IATA Certified Agent',
                  'FIATA Member',
                  'Customs Brokerage Licensed',
                  'ISO 9001 Compliant',
                ].map((cred, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm"
                    style={{
                      color: '#1f2937',
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    <span style={{ color: '#16a34a', fontSize: '0.6rem' }}>◆</span>
                    {cred}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CRYPTO PAYMENT SECTION ──────────────────────────────────── */}
      <section
        className="py-20"
        style={{
          backgroundColor: '#14532d',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-5"
                style={{
                  color: '#16a34a',
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.2em',
                }}
              >
                Payment
              </p>
              <h2
                className="font-bold mb-6"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  color: '#f0fdf4',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  lineHeight: 1.15,
                }}
              >
                Pay how you work best — including crypto
              </h2>
              <p
                className="mb-8 leading-relaxed"
                style={{
                  color: 'rgba(240,253,244,0.7)',
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: '1rem',
                }}
              >
                We accept standard bank transfers alongside Bitcoin, Ethereum, and Litecoin.
                Scan a QR code at checkout and confirm your payment within seconds.
                Invoices and receipts provided for all transactions.
              </p>

              <div className="flex flex-wrap gap-4">
                {['Bitcoin (BTC)', 'Ethereum (ETH)', 'Litecoin (LTC)', 'Bank Transfer'].map(
                  (method, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 text-sm"
                      style={{
                        border: '1px solid rgba(22,163,74,0.5)',
                        color: 'rgba(240,253,244,0.8)',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.75rem',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Receipt / manifest card */}
            <div
              className="p-8"
              style={{
                backgroundColor: '#f0fdf4',
                borderLeft: '4px solid #16a34a',
              }}
            >
              <div
                className="flex items-center justify-between mb-6 pb-4"
                style={{ borderBottom: '1px solid #86efac' }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-0.5"
                    style={{
                      color: '#4b7c59',
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    Payment Manifest
                  </p>
                  <p
                    className="font-bold text-lg"
                    style={{ color: '#111827', fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    GSS-2024-00847
                  </p>
                </div>
                <span
                  className="px-3 py-1 text-xs"
                  style={{
                    backgroundColor: '#14532d',
                    color: '#22c55e',
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  CONFIRMED
                </span>
              </div>
              <div className="space-y-3">
                {[
                  ['Origin', 'Shanghai, CN'],
                  ['Destination', 'Lagos, NG'],
                  ['Mode', 'Sea Freight — FCL'],
                  ['Container', '20ft Standard'],
                  ['Payment', '0.0214 BTC'],
                  ['Settled', '14 Mar 2024 — 09:41 UTC'],
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-2"
                    style={{ borderBottom: '1px solid rgba(134,239,172,0.4)' }}
                  >
                    <span
                      style={{
                        color: '#4b7c59',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        color: '#111827',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-baseline gap-8 mb-16" style={{ borderBottom: '1px solid #86efac', paddingBottom: '1.5rem' }}>
            <p
              className="text-xs tracking-widest uppercase"
              style={{
                color: '#16a34a',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.2em',
                whiteSpace: 'nowrap',
              }}
            >
              Client Accounts
            </p>
            <h2
              className="font-bold"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                color: '#111827',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              What our clients say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  'The level of visibility into our container shipments changed how we manage our supply chain entirely. Having live vessel positions and customs ETAs in one place is invaluable.',
                author: 'Sarah Johnson',
                role: 'Supply Chain Director',
                company: 'Afrique Retail Group',
                img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&auto=format',
              },
              {
                quote:
                  'We\'ve shipped time-sensitive electronics via air freight three times now. Every time — on schedule, fully documented, no surprises. The crypto payment option also makes cross-border settlements fast.',
                author: 'Michael Chen',
                role: 'Procurement Manager',
                company: 'TechBridge International',
                img: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&h=100&fit=crop&auto=format',
              },
              {
                quote:
                  'Road haulage from Nairobi to Lagos used to be a headache coordinating multiple forwarders. Green Sphere handles the whole corridor and we can track every leg in real-time.',
                author: 'Emma Rodriguez',
                role: 'Operations Lead',
                company: 'PanAfrica Traders',
                img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&auto=format',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-7"
                style={{
                  backgroundColor: '#fff',
                  borderTop: '3px solid #16a34a',
                }}
              >
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{
                    color: '#1f2937',
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex-shrink-0" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                    <Image src={t.img} alt={t.author} fill className="object-cover" />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: '#111827', fontFamily: "'Lora', Georgia, serif" }}
                    >
                      {t.author}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: '#4b7c59',
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {t.role} — {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#111827' }}>
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=400&fit=crop&auto=format"
            alt="Shipping background"
            fill
            className="object-cover"
          />
        </div>
        <div
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 flex flex-col md:flex-row items-center justify-between gap-10"
          style={{ borderTop: '4px solid #16a34a' }}
        >
          <div>
            <h2
              className="font-bold mb-3"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                color: '#f0fdf4',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Ready to ship?
            </h2>
            <p
              style={{
                color: 'rgba(240,253,244,0.65)',
                fontFamily: "'Lora', Georgia, serif",
                maxWidth: '50ch',
              }}
            >
              Get a freight quote within 2 hours, or enter your tracking number above to locate
              an existing shipment.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <a
              href="/contact"
              className="px-8 py-3.5 text-sm font-semibold text-center transition-all duration-200"
              style={{
                backgroundColor: '#16a34a',
                color: '#f0fdf4',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.12em',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
            >
              Request a Quote
            </a>
            <a
              href="/contact"
              className="px-8 py-3.5 text-sm font-semibold text-center transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
                border: '1.5px solid rgba(240,253,244,0.4)',
                color: 'rgba(240,253,244,0.85)',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.12em',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(240,253,244,0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(240,253,244,0.4)')}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}