'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cream  = '#F5F0E8';
const navy   = '#0D1B3E';
const rust   = '#C4713B';
const muted  = 'rgba(245,240,232,0.6)';
const border = 'rgba(245,240,232,0.1)';
const serif  = "'Playfair Display', Georgia, serif";
const lora   = "'Lora', Georgia, serif";
const mono   = "'Courier New', monospace";

const services = [
  {
    mode: 'Sea',
    title: 'Ocean Freight',
    desc: 'Cost-effective bulk shipping via container vessels across major global trade lanes.',
    features: ['Full Container Load (FCL)', 'Less than Container Load (LCL)', 'Bulk cargo handling', 'Port-to-port delivery'],
    capacity: '20ft & 40ft containers',
    img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&h=600&fit=crop&auto=format',
    alt: 'Container ship ocean freight',
    span: 'lg:col-span-2 lg:row-span-2',
    tall: true,
  },
  {
    mode: 'Air',
    title: 'Air Freight',
    desc: 'Express international cargo transport via commercial and dedicated cargo aircraft.',
    features: ['Global reach within 1–3 days', 'High-value cargo handling', 'Temperature-controlled options', 'Express customs clearance'],
    capacity: '100+ tons per flight',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop&auto=format',
    alt: 'Air cargo freight',
    span: '',
    tall: false,
  },
  {
    mode: 'Road',
    title: 'Road Haulage',
    desc: 'Flexible door-to-door trucking for regional and long-haul deliveries.',
    features: ['Full Truckload (FTL)', 'Less than Truckload (LTL)', 'Refrigerated transport', 'Last-mile delivery'],
    capacity: 'Up to 40 tons per truck',
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=500&fit=crop&auto=format',
    alt: 'Road freight truck',
    span: '',
    tall: false,
  },
  {
    mode: 'Rail',
    title: 'Rail Freight',
    desc: 'Efficient overland cargo transport via freight trains across continental networks.',
    features: ['Intermodal containers', 'Bulk commodity transport', 'Cross-border rail services', 'Environmentally efficient'],
    capacity: 'Up to 125 tons per railcar',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop&auto=format',
    alt: 'Rail freight train',
    span: '',
    tall: false,
  },
  {
    mode: 'Multi',
    title: 'Multimodal Logistics',
    desc: 'Combined transport solutions using multiple modes for optimal efficiency and cost.',
    features: ['Sea–air combinations', 'Rail–road integration', 'Custom routing solutions', 'Single point of contact'],
    capacity: 'Scalable to any size',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop&auto=format',
    alt: 'Multimodal logistics',
    span: '',
    tall: false,
  },
  {
    mode: 'Spec',
    title: 'Specialised Cargo',
    desc: 'Expert handling of oversized, hazardous, temperature-sensitive and high-value shipments.',
    features: ['Out-of-gauge cargo (OOG)', 'Dangerous goods (DG)', 'Project cargo management', 'White-glove service'],
    capacity: 'Custom solutions',
    img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=500&fit=crop&auto=format',
    alt: 'Specialised cargo handling',
    span: '',
    tall: false,
  },
];

const support = [
  {
    icon: '📍',
    title: 'Cargo Tracking',
    desc: 'Real-time visibility of your shipments across all transport modes, updated at every milestone.',
  },
  {
    icon: '🛡',
    title: 'Cargo Insurance',
    desc: 'All-risk and named-perils coverage options for general, high-value and specialised cargo.',
  },
  {
    icon: '🌐',
    title: 'Customs Brokerage',
    desc: 'Licensed customs clearance, tariff classification, and documentation in 150+ countries.',
  },
  {
    icon: '🏭',
    title: 'Warehousing',
    desc: 'Bonded and general-purpose storage with pick-and-pack and cross-docking services.',
  },
];

export default function ServicesPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8', color: navy }}>

      {/* ── HERO ── */}
      <section
        className="relative"
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=900&fit=crop&auto=format"
            alt="Cargo ship at sea"
            fill
            className="object-cover object-center"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,16,32,0.2) 0%, rgba(10,16,32,0.9) 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-end">
            <div>
              <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: cream, marginBottom: '0.75rem' }}>
                Our Services
              </p>
              <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', color: cream, lineHeight: 1.05 }}>
                Freight solutions<br />
                <em style={{ fontStyle: 'italic', color: rust }}>built to move.</em>
              </h1>
            </div>
            <div>
              <p style={{ fontFamily: lora, fontSize: '1.05rem', color: 'rgba(245,240,232,0.72)', lineHeight: 1.8, maxWidth: '44ch' }}>
                Comprehensive logistics across air, ocean, rail, and road networks — with customs
                brokerage, warehousing, and real-time tracking included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODE TICKER ── */}
      <section style={{ backgroundColor: navy, borderTop: `4px solid ${rust}`, borderBottom: `1px solid ${border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-wrap items-center gap-8">
          {['Ocean Freight', 'Air Freight', 'Road Haulage', 'Rail Freight', 'Multimodal', 'Specialised Cargo'].map((m, i) => (
            <span key={i} className="flex items-center gap-2" style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)' }}>
              {i > 0 && <span style={{ color: rust, fontSize: '0.5rem' }}>◆</span>}
              {m}
            </span>
          ))}
        </div>
      </section>

      {/* ── SERVICES EDITORIAL GRID ── */}
      <section className="py-24" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div
            style={{ borderBottom: `1px solid #C4B49A`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}
          >
            <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, whiteSpace: 'nowrap' }}>
              Transportation Modes
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: navy, lineHeight: 1.1 }}>
              Every mode, one platform
            </h2>
          </div>

          {/* Row 1: large ocean + 2 small */}
          <div className="grid lg:grid-cols-3 gap-0.5" style={{ backgroundColor: '#C4B49A', marginBottom: '0.5px' }}>

            {/* Ocean — tall spanning card */}
            <div
              className="relative overflow-hidden group lg:row-span-2"
              style={{ minHeight: '520px', backgroundColor: '#F5F0E8', cursor: 'pointer' }}
              onMouseEnter={() => setActive(0)}
              onMouseLeave={() => setActive(null)}
            >
              <Image
                src={services[0].img}
                alt={services[0].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,16,32,0.92) 0%, rgba(10,16,32,0.35) 55%, transparent 100%)' }} />
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <span style={{ display: 'inline-block', alignSelf: 'flex-start', fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', backgroundColor: rust, color: cream, padding: '3px 10px' }}>
                  {services[0].mode}
                </span>
                <div>
                  <h3 style={{ fontFamily: serif, fontSize: '1.75rem', color: cream, marginBottom: '0.5rem' }}>{services[0].title}</h3>
                  <p style={{ fontFamily: lora, fontSize: '0.9rem', color: 'rgba(245,240,232,0.72)', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: '38ch' }}>{services[0].desc}</p>
                  <div
                    style={{
                      maxHeight: active === 0 ? '200px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.35s ease',
                    }}
                  >
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                      {services[0].features.map((f, fi) => (
                        <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: rust, fontSize: '0.5rem' }}>◆</span>
                          <span style={{ fontFamily: lora, fontSize: '0.8rem', color: 'rgba(245,240,232,0.75)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust }}>
                    {services[0].capacity}
                  </span>
                </div>
              </div>
            </div>

            {/* Air + Road — right column, stacked */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0.5">
              {[1, 2].map(si => (
                <div
                  key={si}
                  className="relative overflow-hidden group"
                  style={{ minHeight: '255px', backgroundColor: '#F5F0E8', cursor: 'pointer' }}
                  onMouseEnter={() => setActive(si)}
                  onMouseLeave={() => setActive(null)}
                >
                  <Image src={services[si].img} alt={services[si].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,16,32,0.9) 0%, rgba(10,16,32,0.2) 65%, transparent 100%)' }} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <span style={{ alignSelf: 'flex-start', fontFamily: mono, fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', backgroundColor: navy, color: cream, padding: '3px 9px' }}>
                      {services[si].mode}
                    </span>
                    <div>
                      <h3 style={{ fontFamily: serif, fontSize: '1.25rem', color: cream, marginBottom: '0.3rem' }}>{services[si].title}</h3>
                      <div style={{ maxHeight: active === si ? '120px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                        <p style={{ fontFamily: lora, fontSize: '0.8rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.65, marginBottom: '0.5rem' }}>{services[si].desc}</p>
                      </div>
                      <span style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: rust }}>{services[si].capacity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Row 2: Rail + Multimodal + Specialised — equal thirds */}
          <div className="grid md:grid-cols-3 gap-0.5" style={{ backgroundColor: '#C4B49A' }}>
            {[3, 4, 5].map(si => (
              <div
                key={si}
                className="relative overflow-hidden group"
                style={{ minHeight: '300px', backgroundColor: '#F5F0E8', cursor: 'pointer' }}
                onMouseEnter={() => setActive(si)}
                onMouseLeave={() => setActive(null)}
              >
                <Image src={services[si].img} alt={services[si].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,16,32,0.92) 0%, rgba(10,16,32,0.25) 60%, transparent 100%)' }} />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <span style={{ alignSelf: 'flex-start', fontFamily: mono, fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', backgroundColor: rust, color: cream, padding: '3px 9px' }}>
                    {services[si].mode}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: serif, fontSize: '1.2rem', color: cream, marginBottom: '0.3rem' }}>{services[si].title}</h3>
                    <div style={{ maxHeight: active === si ? '150px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
                      <p style={{ fontFamily: lora, fontSize: '0.8rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.65, marginBottom: '0.5rem' }}>{services[si].desc}</p>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {services[si].features.slice(0, 3).map((f, fi) => (
                          <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ color: rust, fontSize: '0.45rem' }}>◆</span>
                            <span style={{ fontFamily: lora, fontSize: '0.75rem', color: 'rgba(245,240,232,0.7)' }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: rust, display: 'block', marginTop: active === si ? '0.6rem' : '0' }}>
                      {services[si].capacity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── LOGISTICS SUPPORT ── */}
      <section className="py-24" style={{ backgroundColor: navy }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, whiteSpace: 'nowrap' }}>
              Support Services
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: cream, lineHeight: 1.1 }}>
              Everything around the shipment
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0" style={{ borderTop: `1px solid ${border}`, borderLeft: `1px solid ${border}` }}>
            {support.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '2rem 1.75rem',
                  borderRight: `1px solid ${border}`,
                  borderBottom: `1px solid ${border}`,
                }}
              >
                <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '1rem' }}>{s.icon}</span>
                <h3 style={{ fontFamily: serif, fontSize: '1.1rem', color: cream, marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ fontFamily: lora, fontSize: '0.875rem', color: muted, lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDENTIALS STRIP ── */}
      <section style={{ backgroundColor: '#0A1020', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-wrap items-center gap-6">
          {['IATA Certified Agent', 'FIATA Member', 'ISO 9001 Compliant', 'Customs Brokerage Licensed', 'WCA Network Member'].map((c, i) => (
            <span key={i} className="flex items-center gap-2" style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)' }}>
              <span style={{ color: rust, fontSize: '0.45rem' }}>◆</span>{c}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: navy, borderTop: `4px solid ${rust}` }}>
        <div className="absolute inset-0 z-0 opacity-15">
          <Image src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&h=400&fit=crop&auto=format" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
            <div>
              <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '0.75rem' }}>
                Ready to Ship?
              </p>
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: cream, lineHeight: 1.1, marginBottom: '0.75rem' }}>
                Move your cargo with us.
              </h2>
              <p style={{ fontFamily: lora, fontSize: '1rem', color: muted, maxWidth: '46ch', lineHeight: 1.75 }}>
                Our freight specialists will find the most efficient route, mode, and cost structure
                for your shipment within 2 hours of enquiry.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
              <Link
                href="/quote"
                style={{ display: 'block', textAlign: 'center', padding: '0.875rem 2.25rem', backgroundColor: rust, color: cream, fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#A85D2E')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = rust)}
              >
                Get a Quote →
              </Link>
              <Link
                href="/contact"
                style={{ display: 'block', textAlign: 'center', padding: '0.875rem 2.25rem', border: `1.5px solid rgba(245,240,232,0.25)`, color: muted, fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = cream)}
                onMouseLeave={e => (e.currentTarget.style.color = muted as string)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}