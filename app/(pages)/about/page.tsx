'use client';

import React from 'react';
import Image from 'next/image';

const cream  = '#f0fdf4';
const navy   = '#111827';
const rust   = '#16a34a';
const muted  = 'rgba(240,253,244,0.6)';
const border = 'rgba(240,253,244,0.1)';
const serif  = "'Playfair Display', Georgia, serif";
const lora   = "'Lora', Georgia, serif";
const mono   = "'Courier New', monospace";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '0.75rem' }}>
      {children}
    </p>
  );
}

function SectionHeading({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: light ? cream : navy, lineHeight: 1.12, marginBottom: '0' }}>
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0fdf4', color: navy }}>

      {/* ── HERO ── */}
      <section className="relative" style={{ minHeight: '62vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&h=900&fit=crop&auto=format"
            alt="Cargo operations"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3,7,18,0.3) 0%, rgba(3,7,18,0.85) 100%)' }} />
        </div>

        {/* top manifest strip */}
        <div className="absolute top-0 left-0 right-0 z-20" style={{ borderBottom: `1px solid rgba(255,255,255,0.12)`, backgroundColor: 'rgba(17,24,39,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-2.5 flex gap-8 text-xs" style={{ fontFamily: mono, color: 'rgba(240,253,244,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            <span>Green Sphere Services</span>
            <span style={{ color: rust }}>◆</span>
            <span>Est. 2018</span>
            <span style={{ color: rust }}>◆</span>
            <span>About Us</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full">
          <SectionLabel>Our Story</SectionLabel>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: cream, lineHeight: 1.05, maxWidth: '18ch' }}>
            Moving the world&apos;s goods, <em style={{ color: rust, fontStyle: 'italic' }}>reliably.</em>
          </h1>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ backgroundColor: navy, borderTop: `4px solid ${rust}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '500K+', label: 'Packages Delivered', sub: 'And counting' },
              { value: '10K+',  label: 'Active Clients',     sub: 'Worldwide' },
              { value: '180+',  label: 'Countries Served',   sub: 'Global network' },
              { value: '24/7',  label: 'Support',            sub: 'Any timezone' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{ padding: '2rem 1rem', textAlign: 'center', borderRight: i < 3 ? `1px solid ${border}` : 'none' }}
              >
                <div style={{ fontFamily: serif, fontSize: '2rem', color: rust, marginBottom: '0.25rem' }}>{stat.value}</div>
                <div style={{ fontFamily: lora, fontSize: '0.875rem', color: cream, marginBottom: '0.15rem' }}>{stat.label}</div>
                <div style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(240,253,244,0.35)', textTransform: 'uppercase' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-24" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ borderBottom: `1px solid #86efac`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}>
            <SectionLabel>Who We Are</SectionLabel>
            <SectionHeading>Purpose &amp; Direction</SectionHeading>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                heading: 'Our Mission',
                body: 'To make global freight accessible, transparent, and trustworthy — connecting businesses across continents through sea, air, road and rail with end-to-end visibility and modern payment options including cryptocurrency.',
                img: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=700&h=480&fit=crop&auto=format',
                alt: 'Cargo ship mission',
              },
              {
                heading: 'Our Vision',
                body: 'To become the world\'s most trusted multi-modal freight platform — where every shipment, from a single parcel to a full container load, is tracked with precision and settled with ease, regardless of currency or geography.',
                img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&h=480&fit=crop&auto=format',
                alt: 'Air cargo vision',
              },
            ].map(({ heading, body, img, alt }) => (
              <div key={heading}>
                <div style={{ position: 'relative', height: '260px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <Image src={img} alt={alt} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,24,39,0.5) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderTop: `4px solid ${rust}` }} />
                </div>
                <h3 style={{ fontFamily: serif, fontSize: '1.5rem', color: navy, marginBottom: '0.75rem' }}>{heading}</h3>
                <p style={{ fontFamily: lora, fontSize: '1rem', color: '#1f2937', lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24" style={{ backgroundColor: navy }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}>
            <SectionLabel>Principles</SectionLabel>
            <SectionHeading light>What we stand for</SectionHeading>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0" style={{ borderTop: `1px solid ${border}`, borderLeft: `1px solid ${border}` }}>
            {[
              {
                icon: '🛡',
                title: 'Security First',
                body: 'Enterprise-grade protection for your cargo data and cryptocurrency transactions, with full chain-of-custody documentation.',
              },
              {
                icon: '📍',
                title: 'Precision Tracking',
                body: 'Real-time location data across all transport modes — every checkpoint, every status change, delivered instantly.',
              },
              {
                icon: '🤝',
                title: 'Client Focused',
                body: 'Every operational decision is made through one lens: does it make our clients\' supply chains more reliable?',
              },
              {
                icon: '🏆',
                title: 'Excellence Driven',
                body: '99.9% on-time delivery rate maintained through rigorous partner vetting and proactive shipment monitoring.',
              },
            ].map((v, i) => (
              <div
                key={i}
                style={{ padding: '2rem', borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{v.icon}</div>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', color: cream, marginBottom: '0.6rem' }}>{v.title}</h3>
                <p style={{ fontFamily: lora, fontSize: '0.875rem', color: muted, lineHeight: 1.75 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ── */}
      <section className="py-24" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ borderBottom: `1px solid #86efac`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}>
            <SectionLabel>History</SectionLabel>
            <SectionHeading>Our Journey</SectionHeading>
          </div>

          {/* Horizontal timeline for desktop, stacked for mobile */}
          <div className="hidden md:block" style={{ position: 'relative', paddingBottom: '3rem' }}>
            {/* Spine */}
            <div style={{ position: 'absolute', top: '22px', left: 0, right: 0, height: '2px', backgroundColor: '#86efac' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0' }}>
              {[
                { year: '2018', title: 'Founded',           body: 'Green Sphere Services established with a focus on multi-modal freight for emerging markets.' },
                { year: '2019', title: 'Network Built',     body: 'Partnerships established with 40+ carriers across sea, air and road corridors.' },
                { year: '2021', title: 'Crypto Payments',   body: 'First freight platform in our segment to integrate Bitcoin, ETH and Litecoin settlement.' },
                { year: '2022', title: 'Global Expansion',  body: 'Operations extended to 120+ countries; dedicated Lagos and Nairobi operations hubs opened.' },
                { year: '2024', title: 'Industry Leader',   body: '500K+ shipments delivered. Recognised as the leading crypto-enabled logistics platform.' },
              ].map((m, i) => (
                <div key={i} style={{ paddingTop: '3rem', paddingRight: '1.5rem', position: 'relative' }}>
                  {/* dot */}
                  <div style={{
                    position: 'absolute', top: '14px', left: 0,
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: rust, border: `3px solid #f0fdf4`,
                    transform: 'translateX(-50%)',
                  }} />
                  <p style={{ fontFamily: mono, fontSize: '0.7rem', letterSpacing: '0.15em', color: rust, marginBottom: '0.4rem' }}>{m.year}</p>
                  <p style={{ fontFamily: serif, fontSize: '1rem', color: navy, marginBottom: '0.4rem' }}>{m.title}</p>
                  <p style={{ fontFamily: lora, fontSize: '0.82rem', color: '#374151', lineHeight: 1.7 }}>{m.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile stacked */}
          <div className="md:hidden space-y-0" style={{ borderLeft: `2px solid #86efac`, marginLeft: '0.5rem', paddingLeft: '1.5rem' }}>
            {[
              { year: '2018', title: 'Founded',          body: 'Established with a focus on multi-modal freight for emerging markets.' },
              { year: '2019', title: 'Network Built',    body: 'Partnerships with 40+ carriers across sea, air and road corridors.' },
              { year: '2021', title: 'Crypto Payments',  body: 'First to integrate Bitcoin, ETH and Litecoin for freight settlement.' },
              { year: '2022', title: 'Global Expansion', body: 'Extended to 120+ countries; Lagos and Nairobi hubs opened.' },
              { year: '2024', title: 'Industry Leader',  body: '500K+ shipments delivered. Leading crypto-enabled logistics platform.' },
            ].map((m, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: '1.75rem' }}>
                <div style={{ position: 'absolute', left: '-1.85rem', top: '0.3rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: rust, border: `2px solid #f0fdf4` }} />
                <p style={{ fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.15em', color: rust, marginBottom: '0.25rem' }}>{m.year}</p>
                <p style={{ fontFamily: serif, fontSize: '1rem', color: navy, marginBottom: '0.3rem' }}>{m.title}</p>
                <p style={{ fontFamily: lora, fontSize: '0.85rem', color: '#374151', lineHeight: 1.7 }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO COLLAGE + CREDENTIALS ── */}
      <section className="py-24" style={{ backgroundColor: navy }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <SectionLabel>Credentials</SectionLabel>
              <SectionHeading light>Recognised. Certified. Trusted.</SectionHeading>
              <p style={{ fontFamily: lora, fontSize: '1rem', color: muted, lineHeight: 1.8, marginTop: '1.25rem', marginBottom: '2rem' }}>
                We hold all required industry certifications and maintain active membership in
                the world&apos;s leading freight and customs associations — so your cargo moves
                without friction across every border.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  'IATA Certified Agent',
                  'FIATA Member',
                  'ISO 9001:2015 Compliant',
                  'Customs Brokerage Licensed',
                  'WCA Freight Network',
                  'AEO Status (EU)',
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: rust, fontSize: '0.55rem' }}>◆</span>
                    <span style={{ fontFamily: mono, fontSize: '0.7rem', letterSpacing: '0.08em', color: 'rgba(240,253,244,0.7)', textTransform: 'uppercase' }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', height: '420px' }}>
              <div style={{ position: 'relative', gridRow: 'span 2' }}>
                <Image src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&h=800&fit=crop&auto=format" alt="Port workers" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <Image src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop&auto=format" alt="Warehouse" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <Image src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=300&fit=crop&auto=format" alt="Road freight" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}