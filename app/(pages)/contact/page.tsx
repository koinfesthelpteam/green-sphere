/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';

const cream  = '#f0fdf4';
const navy   = '#111827';
const rust   = '#16a34a';
const muted  = 'rgba(240,253,244,0.6)';
const border = 'rgba(240,253,244,0.1)';
const serif  = "'Playfair Display', Georgia, serif";
const lora   = "'Lora', Georgia, serif";
const mono   = "'Courier New', monospace";

/* reusable field label */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#374151', marginBottom: '0.45rem' }}>
      {children}{required && <span style={{ color: rust, marginLeft: '3px' }}>*</span>}
    </label>
  );
}

/* reusable text input */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'transparent',
  border: '1.5px solid #86efac',
  color: navy,
  fontFamily: lora,
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: 'general',
    trackingNumber: '', message: '', priority: 'normal',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      toast.success("Message received. We'll be in touch within 2 hours.");
      setFormData({ name: '', email: '', phone: '', subject: 'general', trackingNumber: '', message: '', priority: 'normal' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0fdf4', color: navy }}>

      {/* ── HERO ── */}
      <section className="relative" style={{ minHeight: '65vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&h=800&fit=crop&auto=format"
            alt="Freight operations"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3,7,18,0.25) 0%, rgba(3,7,18,0.88) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full">
          <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: cream, marginBottom: '0.75rem' }}>
            Get in Touch
          </p>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: cream, lineHeight: 1.05, maxWidth: '18ch' }}>
            We&apos;re here.<br />
            <em style={{ fontStyle: 'italic', color: rust }}>Talk to us.</em>
          </h1>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section style={{ backgroundColor: navy, borderTop: `4px solid ${rust}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0" style={{ borderTop: `1px solid ${border}`, borderLeft: `1px solid ${border}` }}>
            {[
              {
                label: 'Phone',
                heading: '24/7 Phone Support',
                lines: ['+1 (555) 123-7447', '+1 (555) 123-4567'],
                note: 'Available for urgent shipment matters',
              },
              {
                label: 'Email',
                heading: 'Email Support',
                lines: ['support@greensphereservices.com', 'sales@greensphereservices.com'],
                note: 'Detailed inquiries &amp; documentation',
              },
              {
                label: 'Office',
                heading: 'Headquarters',
                lines: ['14 Harbour Court', 'Trade District, SC 12345'],
                note: 'In-person visits by appointment',
              },
              {
                label: 'Hours',
                heading: 'Business Hours',
                lines: ['Customer Service: 24/7', 'Office: Mon–Fri 8AM–6PM'],
                note: 'All times in EST',
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{ padding: '2rem 1.5rem', borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}
              >
                <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: rust, marginBottom: '0.5rem' }}>
                  {card.label}
                </p>
                <h3 style={{ fontFamily: serif, fontSize: '1.05rem', color: cream, marginBottom: '0.75rem' }}>
                  {card.heading}
                </h3>
                {card.lines.map((l, j) => (
                  <p key={j} style={{ fontFamily: mono, fontSize: '0.72rem', color: muted, letterSpacing: '0.04em', lineHeight: 1.7 }}>
                    {l}
                  </p>
                ))}
                <p style={{ fontFamily: lora, fontSize: '0.78rem', color: 'rgba(240,253,244,0.35)', fontStyle: 'italic', marginTop: '0.6rem' }} dangerouslySetInnerHTML={{ __html: card.note }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section className="py-24" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div style={{ borderBottom: `1px solid #86efac`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, whiteSpace: 'nowrap' }}>
              Send a Message
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: navy, lineHeight: 1.1 }}>
              How can we help you?
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* FORM */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = rust)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#86efac')}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = rust)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#86efac')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>Phone Number</FieldLabel>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = rust)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#86efac')}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Subject</FieldLabel>
                    <select name="subject" value={formData.subject} onChange={handleChange} required style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M6 8L0 0h12z' fill='%2316a34a'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                      onFocus={e => (e.currentTarget.style.borderColor = rust)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#86efac')}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="tracking">Tracking Issue</option>
                      <option value="payment">Payment / Billing</option>
                      <option value="complaint">Complaint</option>
                      <option value="partnership">Business Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>Tracking Reference</FieldLabel>
                    <input type="text" name="trackingNumber" value={formData.trackingNumber} onChange={handleChange} placeholder="GSS-2024-XXXXX" style={{ ...inputStyle, fontFamily: mono, letterSpacing: '0.05em' }}
                      onFocus={e => (e.currentTarget.style.borderColor = rust)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#86efac')}
                    />
                  </div>
                  <div>
                    <FieldLabel>Priority</FieldLabel>
                    <select name="priority" value={formData.priority} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M6 8L0 0h12z' fill='%2316a34a'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                      onFocus={e => (e.currentTarget.style.borderColor = rust)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#86efac')}
                    >
                      <option value="low">Low — General inquiry</option>
                      <option value="normal">Normal — Standard support</option>
                      <option value="high">High — Urgent matter</option>
                      <option value="critical">Critical — Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <FieldLabel required>Message</FieldLabel>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} placeholder="Please describe your enquiry in detail…" style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => (e.currentTarget.style.borderColor = rust)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#86efac')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? '#888' : rust,
                    color: cream,
                    border: 'none',
                    padding: '1rem 2rem',
                    fontFamily: mono,
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={e => !isSubmitting && (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseLeave={e => !isSubmitting && (e.currentTarget.style.backgroundColor = rust)}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ width: '14px', height: '14px', border: `2px solid rgba(240,253,244,0.3)`, borderTopColor: cream, borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                      Sending…
                    </>
                  ) : 'Send Message →'}
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

              </form>
            </div>

            {/* SIDEBAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Response times */}
              <div style={{ borderTop: `4px solid ${rust}`, backgroundColor: navy, padding: '1.75rem' }}>
                <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '1rem' }}>
                  Response Times
                </p>
                {[
                  { level: 'Critical', time: 'Within 15 min', color: '#FF8A80' },
                  { level: 'High',     time: 'Within 1 hour',  color: '#FFD54F' },
                  { level: 'Normal',   time: 'Within 2 hours', color: cream },
                  { level: 'Low',      time: 'Within 24 hours', color: muted },
                ].map(({ level, time, color }) => (
                  <div key={level} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.6rem', marginBottom: '0.6rem', borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>{level}</span>
                    <span style={{ fontFamily: mono, fontSize: '0.7rem', color }}>{time}</span>
                  </div>
                ))}
              </div>

              {/* Office hours */}
              <div style={{ borderTop: `3px solid #86efac`, backgroundColor: '#fff', padding: '1.75rem' }}>
                <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '1rem' }}>
                  Office Hours
                </p>
                {[
                  ['Customer Service', '24 / 7'],
                  ['Sales Team',       'Mon–Fri 8AM–8PM'],
                  ['Tech Support',     'Mon–Sun 6AM–2AM'],
                  ['Office Visits',    'Mon–Fri 8AM–6PM'],
                ].map(([dept, hours]) => (
                  <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '0.6rem', marginBottom: '0.6rem', borderBottom: `1px solid rgba(3,7,18,0.08)` }}>
                    <span style={{ fontFamily: lora, fontSize: '0.85rem', color: '#374151' }}>{dept}</span>
                    <span style={{ fontFamily: mono, fontSize: '0.68rem', color: navy, letterSpacing: '0.05em' }}>{hours}</span>
                  </div>
                ))}
              </div>

              {/* Email CTA */}
              <a
                href="mailto:support@greensphereservices.com"
                style={{ display: 'block', borderTop: `3px solid ${rust}`, backgroundColor: '#f0fdf4', border: `1.5px solid #86efac`, padding: '1.5rem', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = rust)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#86efac')}
              >
                <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: rust, marginBottom: '0.4rem' }}>Email Direct</p>
                <p style={{ fontFamily: lora, fontSize: '0.85rem', color: navy }}>support@greensphereservices.com</p>
              </a>

              {/* FAQ */}
              <div style={{ padding: '1.5rem', backgroundColor: navy }}>
                <p style={{ fontFamily: serif, fontSize: '1.05rem', color: cream, marginBottom: '0.5rem' }}>Check the FAQ first</p>
                <p style={{ fontFamily: lora, fontSize: '0.82rem', color: muted, lineHeight: 1.7, marginBottom: '1rem' }}>
                  Many common shipment and payment questions are answered instantly in our Help Centre.
                </p>
                <Link
                  href="/support"
                  style={{ fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = cream)}
                  onMouseLeave={e => (e.currentTarget.style.color = rust)}
                >
                  View Help Centre →
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="py-24" style={{ backgroundColor: navy }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, whiteSpace: 'nowrap' }}>
              Find Us
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: cream, lineHeight: 1.1 }}>
              Visit Our Office
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">

            <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
              <Image
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&h=600&fit=crop&auto=format"
                alt="Office building"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,24,39,0.6) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                <span style={{ display: 'inline-block', backgroundColor: rust, color: cream, fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px' }}>
                  ◆ Our Location
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  label: 'Address',
                  lines: ['14 Harbour Court', 'Trade District, SC 12345', 'United States'],
                },
                {
                  label: 'Visiting Hours',
                  lines: ['Monday – Friday: 8:00 AM – 6:00 PM', 'Saturday: 9:00 AM – 4:00 PM', 'Sunday: Closed', '* Please call ahead for appointments'],
                },
                {
                  label: 'Services Available On-Site',
                  lines: ['Package drop-off and pickup', 'In-person freight consultation', 'Account setup assistance', 'Payment processing help', 'Documentation support'],
                },
              ].map(({ label, lines }) => (
                <div key={label} style={{ borderLeft: `3px solid ${rust}`, paddingLeft: '1.25rem' }}>
                  <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: rust, marginBottom: '0.5rem' }}>{label}</p>
                  {lines.map((line, j) => (
                    <p key={j} style={{ fontFamily: lora, fontSize: '0.875rem', color: line.startsWith('*') ? 'rgba(240,253,244,0.4)' : muted, lineHeight: 1.7 }}>{line}</p>
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}