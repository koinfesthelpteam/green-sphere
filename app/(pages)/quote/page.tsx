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

/* ── types ── */
interface Dimensions { length: string; width: string; height: string }
interface ContactInfo { name: string; email: string; phone: string; company: string }
interface FormData {
  serviceType: string; origin: string; destination: string; shipmentDate: string;
  weight: string; dimensions: Dimensions; cargoType: string; cargoValue: string;
  specialRequirements: string; contactInfo: ContactInfo;
}
type NestedKey = 'dimensions' | 'contactInfo';

const STEPS = [
  { n: '01', label: 'Service & Route' },
  { n: '02', label: 'Cargo Details' },
  { n: '03', label: 'Requirements' },
  { n: '04', label: 'Contact' },
];

const CARGO_TYPES = [
  'General Cargo', 'Electronics', 'Automotive Parts', 'Machinery',
  'Textiles', 'Food & Beverages', 'Chemicals', 'Pharmaceuticals', 'Fragile Items', 'Other',
];

const SPECIAL_REQS = [
  'Temperature Controlled', 'Hazardous Materials', 'Oversized Cargo',
  'High Value Items', 'Urgent Delivery', 'Custom Packaging',
];

/* ── field label ── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A4E44', marginBottom: '0.45rem' }}>
      {children}{required && <span style={{ color: rust, marginLeft: '3px' }}>*</span>}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem 1rem',
  backgroundColor: 'transparent', border: '1.5px solid #C4B49A',
  color: navy, fontFamily: lora, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
};
const focusRust = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = rust);
const blurStone = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = '#C4B49A');

export default function GetQuotePage() {
  const [formData, setFormData] = useState<FormData>({
    serviceType: '', origin: '', destination: '', shipmentDate: '',
    weight: '', dimensions: { length: '', width: '', height: '' },
    cargoType: '', cargoValue: '', specialRequirements: '',
    contactInfo: { name: '', email: '', phone: '', company: '' },
  });
  const [step, setStep]             = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checked, setChecked]       = useState<string[]>([]);

  const set = (field: string, value: string, nested?: NestedKey) => {
    if (nested) {
      setFormData(p => ({ ...p, [nested]: { ...(p[nested] as object), [field]: value } }));
    } else {
      setFormData(p => ({ ...p, [field]: value }));
    }
  };

  const toggleReq = (req: string) => {
    setChecked(prev => prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsSubmitted(true); };

  /* ── SUCCESS ── */
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: navy }}>
        <div style={{ maxWidth: '540px', width: '100%' }}>
          <div style={{ borderTop: `4px solid ${rust}`, backgroundColor: 'rgba(245,240,232,0.04)', padding: '3rem' }}>
            <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '1rem' }}>
              Quote Request Received
            </p>
            <h1 style={{ fontFamily: serif, fontSize: '2.25rem', color: cream, lineHeight: 1.1, marginBottom: '1rem' }}>
              Thank you.<br />We&apos;re on it.
            </h1>
            <p style={{ fontFamily: lora, fontSize: '0.95rem', color: muted, lineHeight: 1.8, marginBottom: '2rem' }}>
              Our freight specialists will review your requirements and send you a competitive quote within 2–4 hours.
            </p>
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                ['Review', 'Your details reviewed within 2–4 hours'],
                ['Quote', 'Detailed pricing delivered to your email'],
                ['Call', 'A specialist may call to discuss specifics'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: rust, minWidth: '3.5rem' }}>{k}</span>
                  <span style={{ fontFamily: lora, fontSize: '0.875rem', color: muted }}>{v}</span>
                </div>
              ))}
            </div>
            <Link
              href="/"
              style={{ display: 'inline-block', padding: '0.875rem 2rem', backgroundColor: rust, color: cream, fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#A85D2E')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = rust)}
            >
              Return to Homepage →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const serviceOptions = [
    { id: 'ocean', name: 'Sea Freight',   desc: 'FCL & LCL container shipping',    icon: '🚢' },
    { id: 'air',   name: 'Air Freight',   desc: 'Express international cargo',      icon: '✈️' },
    { id: 'road',  name: 'Road Haulage',  desc: 'Door-to-door land transport',      icon: '🚛' },
    { id: 'rail',  name: 'Rail Freight',  desc: 'Overland continental corridors',   icon: '🚂' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8', color: navy }}>

      {/* ── HERO ── */}
      <section className="relative" style={{ minHeight: '60vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=700&fit=crop&auto=format"
            alt="Global logistics"
            fill className="object-cover" priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,16,32,0.2) 0%, rgba(10,16,32,0.88) 100%)' }} />
        </div>

        <div className="absolute top-0 left-0 right-0 z-20" style={{ borderBottom: `1px solid rgba(255,255,255,0.1)`, backgroundColor: 'rgba(13,27,62,0.65)', backdropFilter: 'blur(6px)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-2.5 flex gap-8 text-xs" style={{ fontFamily: mono, color: 'rgba(245,240,232,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            <span>Green Sphere Services</span>
            <span style={{ color: rust }}>◆</span>
            <span>Request a Quote</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-14 w-full">
          <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color:  cream , marginBottom: '0.75rem' }} className='bg-blue-950 w-fit p-2 rounded-full'>
            Freight Pricing
          </p>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.25rem, 5vw, 4rem)', color: cream, lineHeight: 1.05 }}>
            Get your freight quote
          </h1>
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="py-20" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">

          {/* Step indicator — manifest style */}
          <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: '3rem', borderTop: `3px solid ${rust}`, borderBottom: `1px solid #C4B49A` }}>
            {STEPS.map((s, i) => {
              const done    = step > i + 1;
              const current = step === i + 1;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1, padding: '1rem 0.75rem', textAlign: 'center',
                    borderRight: i < 3 ? '1px solid #C4B49A' : 'none',
                    backgroundColor: current ? navy : 'transparent',
                  }}
                >
                  <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.18em', color: done ? rust : current ? rust : '#9E8E7E', marginBottom: '0.2rem' }}>
                    {done ? '✓' : s.n}
                  </p>
                  <p style={{ fontFamily: lora, fontSize: '0.8rem', color: current ? cream : done ? navy : '#9E8E7E', fontWeight: current ? 500 : 400 }}>
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <FieldLabel>Service Type</FieldLabel>
                  <div className="grid md:grid-cols-2 gap-3" style={{ marginTop: '0.5rem' }}>
                    {serviceOptions.map(svc => (
                      <div
                        key={svc.id}
                        onClick={() => set('serviceType', svc.id)}
                        style={{
                          padding: '1.25rem',
                          border: `1.5px solid ${formData.serviceType === svc.id ? rust : '#C4B49A'}`,
                          backgroundColor: formData.serviceType === svc.id ? 'rgba(196,113,59,0.06)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '1rem',
                          transition: 'border-color 0.2s',
                        }}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && set('serviceType', svc.id)}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{svc.icon}</span>
                        <div>
                          <p style={{ fontFamily: serif, fontSize: '1rem', color: navy, marginBottom: '0.2rem' }}>{svc.name}</p>
                          <p style={{ fontFamily: lora, fontSize: '0.8rem', color: '#5A4E44' }}>{svc.desc}</p>
                        </div>
                        {formData.serviceType === svc.id && (
                          <span style={{ marginLeft: 'auto', color: rust, fontFamily: mono, fontSize: '0.7rem' }}>◆</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Origin</FieldLabel>
                    <input type="text" value={formData.origin} onChange={e => set('origin', e.target.value)} placeholder="City, country or port code" style={inputStyle} onFocus={focusRust} onBlur={blurStone} required />
                  </div>
                  <div>
                    <FieldLabel required>Destination</FieldLabel>
                    <input type="text" value={formData.destination} onChange={e => set('destination', e.target.value)} placeholder="City, country or port code" style={inputStyle} onFocus={focusRust} onBlur={blurStone} required />
                  </div>
                </div>

                <div>
                  <FieldLabel required>Preferred Shipment Date</FieldLabel>
                  <input type="date" value={formData.shipmentDate} onChange={e => set('shipmentDate', e.target.value)} style={inputStyle} onFocus={focusRust} onBlur={blurStone} required />
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Total Weight (kg)</FieldLabel>
                    <input type="number" value={formData.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 2500" style={inputStyle} onFocus={focusRust} onBlur={blurStone} required />
                  </div>
                  <div>
                    <FieldLabel>Declared Value (USD)</FieldLabel>
                    <input type="number" value={formData.cargoValue} onChange={e => set('cargoValue', e.target.value)} placeholder="For insurance purposes" style={inputStyle} onFocus={focusRust} onBlur={blurStone} />
                  </div>
                </div>

                <div>
                  <FieldLabel>Dimensions (cm) — L × W × H</FieldLabel>
                  <div className="grid grid-cols-3 gap-4">
                    {(['length', 'width', 'height'] as const).map(dim => (
                      <input key={dim} type="number" value={formData.dimensions[dim]} onChange={e => set(dim, e.target.value, 'dimensions')} placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)} style={inputStyle} onFocus={focusRust} onBlur={blurStone} />
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel required>Cargo Type</FieldLabel>
                  <select
                    value={formData.cargoType}
                    onChange={e => set('cargoType', e.target.value)}
                    style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M6 8L0 0h12z' fill='%23C4713B'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                    onFocus={focusRust} onBlur={blurStone}
                    required
                  >
                    <option value="">Select cargo type</option>
                    {CARGO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <FieldLabel>Special Handling Requirements</FieldLabel>
                  <div className="grid md:grid-cols-2 gap-0" style={{ marginTop: '0.75rem', border: '1.5px solid #C4B49A' }}>
                    {SPECIAL_REQS.map((req, i) => (
                      <label
                        key={req}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.875rem 1rem',
                          borderRight: i % 2 === 0 ? '1px solid #C4B49A' : 'none',
                          borderBottom: i < SPECIAL_REQS.length - 2 ? '1px solid #C4B49A' : 'none',
                          cursor: 'pointer',
                          backgroundColor: checked.includes(req) ? 'rgba(196,113,59,0.06)' : 'transparent',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked.includes(req)}
                          onChange={() => toggleReq(req)}
                          style={{ accentColor: rust, width: '14px', height: '14px', flexShrink: 0 }}
                        />
                        <span style={{ fontFamily: lora, fontSize: '0.875rem', color: navy }}>{req}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel>Additional Notes</FieldLabel>
                  <textarea
                    value={formData.specialRequirements}
                    onChange={e => set('specialRequirements', e.target.value)}
                    placeholder="Any special handling instructions, packaging needs, or other requirements…"
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={focusRust} onBlur={blurStone}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 4 ── */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <input type="text" value={formData.contactInfo.name} onChange={e => set('name', e.target.value, 'contactInfo')} placeholder="Your full name" style={inputStyle} onFocus={focusRust} onBlur={blurStone} required />
                  </div>
                  <div>
                    <FieldLabel>Company</FieldLabel>
                    <input type="text" value={formData.contactInfo.company} onChange={e => set('company', e.target.value, 'contactInfo')} placeholder="Company or organisation" style={inputStyle} onFocus={focusRust} onBlur={blurStone} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <input type="email" value={formData.contactInfo.email} onChange={e => set('email', e.target.value, 'contactInfo')} placeholder="your@email.com" style={inputStyle} onFocus={focusRust} onBlur={blurStone} required />
                  </div>
                  <div>
                    <FieldLabel required>Phone Number</FieldLabel>
                    <input type="tel" value={formData.contactInfo.phone} onChange={e => set('phone', e.target.value, 'contactInfo')} placeholder="+1 (555) 123-4567" style={inputStyle} onFocus={focusRust} onBlur={blurStone} required />
                  </div>
                </div>

                {/* Summary */}
                <div style={{ borderTop: `1px solid #C4B49A`, paddingTop: '1.5rem' }}>
                  <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '1rem' }}>Quote Summary</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid #C4B49A' }}>
                    {[
                      ['Service', serviceOptions.find(s => s.id === formData.serviceType)?.name || '—'],
                      ['Origin', formData.origin || '—'],
                      ['Destination', formData.destination || '—'],
                      ['Date', formData.shipmentDate || '—'],
                      ['Weight', formData.weight ? `${formData.weight} kg` : '—'],
                      ['Cargo Type', formData.cargoType || '—'],
                    ].map(([k, v], i) => (
                      <div key={k} style={{ padding: '0.75rem 1rem', borderRight: i % 2 === 0 ? '1px solid #C4B49A' : 'none', borderBottom: i < 4 ? '1px solid #C4B49A' : 'none' }}>
                        <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust, marginBottom: '0.2rem' }}>{k}</p>
                        <p style={{ fontFamily: lora, fontSize: '0.875rem', color: navy }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── NAV BUTTONS ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #C4B49A' }}>
              <button
                type="button"
                onClick={() => setStep(s => Math.max(s - 1, 1))}
                disabled={step === 1}
                style={{
                  padding: '0.75rem 1.75rem',
                  backgroundColor: 'transparent',
                  border: `1.5px solid ${step === 1 ? 'rgba(196,181,154,0.4)' : '#C4B49A'}`,
                  color: step === 1 ? '#9E8E7E' : navy,
                  fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: step === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => Math.min(s + 1, 4))}
                  style={{
                    padding: '0.75rem 1.75rem',
                    backgroundColor: navy,
                    color: cream,
                    border: 'none',
                    fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = rust)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = navy)}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: rust,
                    color: cream,
                    border: 'none',
                    fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#A85D2E')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = rust)}
                >
                  Submit Quote Request →
                </button>
              )}
            </div>
          </form>

          {/* ── DIRECT CONTACT ALTERNATIVE ── */}
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #C4B49A', textAlign: 'center' }}>
            <p style={{ fontFamily: lora, fontSize: '0.9rem', color: '#5A4E44', marginBottom: '1.25rem' }}>
              Prefer to speak with someone directly?
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              <a href="tel:+1-555-GREEN-01" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: '1.5px solid #C4B49A', color: navy, fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = rust)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#C4B49A')}
              >
                📞 Call: +1 (555) GREEN-01
              </a>
              <a href="mailto:quotes@greensphere.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: '1.5px solid #C4B49A', color: navy, fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = rust)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#C4B49A')}
              >
                ✉️ quotes@greensphere.com
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}