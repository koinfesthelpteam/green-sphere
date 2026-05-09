'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const cream  = '#F5F0E8';
const navy   = '#0D1B3E';
const rust   = '#C4713B';
const muted  = 'rgba(245,240,232,0.6)';
const border = 'rgba(245,240,232,0.1)';
const serif  = "'Playfair Display', Georgia, serif";
const lora   = "'Lora', Georgia, serif";
const mono   = "'Courier New', monospace";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: cream, marginBottom: '0.75rem', whiteSpace: 'nowrap' }}>
      {children}
    </p>
  );
}

const faqCategories = [
  {
    category: 'Shipping & Tracking',
    questions: [
      { q: 'How do I track my shipment?', a: 'Enter your tracking reference on our homepage. You\'ll receive real-time location updates, customs status, and estimated delivery milestones for every mode of transport.' },
      { q: 'My tracking number isn\'t working — what should I do?', a: 'Check for typos and allow up to 24 hours after booking, as the reference may not yet be active in our system. If the issue persists, contact our support team with your booking confirmation.' },
      { q: 'How long do different service types take?', a: 'Air freight: 2–5 days. Sea freight FCL/LCL: 15–35 days depending on route. Road haulage: 3–10 days. Rail freight: 10–20 days. Express and specific corridor timelines are quoted individually.' },
      { q: 'Can I change the delivery address after booking?', a: 'Address amendments are possible before cargo reaches the destination port or hub. Contact us immediately with your tracking reference and the updated address.' },
    ],
  },
  {
    category: 'Payments & Cryptocurrency',
    questions: [
      { q: 'Which cryptocurrencies do you accept?', a: 'We accept Bitcoin (BTC), Ethereum (ETH), and Litecoin (LTC). Payments are confirmed on-chain with a QR code provided at checkout.' },
      { q: 'Are cryptocurrency payments secure?', a: 'Yes. All transactions are blockchain-verified. We provide a signed receipt and transaction hash for every crypto payment.' },
      { q: 'What are the payment processing fees?', a: 'Crypto payments carry a 2% processing fee to cover network gas and conversion. Bank transfers are billed at standard rates with no surcharge.' },
      { q: 'How are refunds handled for crypto payments?', a: 'Approved refunds are returned in the original cryptocurrency to the sending wallet, typically within 24–48 hours of approval.' },
    ],
  },
  {
    category: 'Insurance & Security',
    questions: [
      { q: 'How is my cargo protected during transit?', a: 'All shipments include GPS milestone tracking, verified carrier vetting, and basic coverage. Secure transport tiers include enhanced handling protocols and chain-of-custody documentation.' },
      { q: 'What happens if my cargo is lost or damaged?', a: 'Notify us within 48 hours of the incident. We will open an investigation and process compensation in line with your coverage level. Most claims are resolved within 5 business days.' },
      { q: 'What insurance coverage is included?', a: 'Standard: up to $100. Express: up to $500. Secure transport: up to $10,000. Additional all-risk cargo insurance can be arranged at booking.' },
      { q: 'Is my personal and business data protected?', a: 'We use enterprise-grade TLS encryption for all data in transit and at rest. We do not share your information with third parties beyond operational carriers.' },
    ],
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery]   = useState('');
  const [expandedFAQ, setExpandedFAQ]   = useState<string | null>(null);

  const toggleFAQ = (key: string) => setExpandedFAQ(expandedFAQ === key ? null : key);

  const filteredCategories = faqCategories
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(
        ({ q, a }) =>
          searchQuery === '' ||
          q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8', color: navy }}>

      {/* ── HERO ── */}
      <section className="relative" style={{ minHeight: '65vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&h=800&fit=crop&auto=format"
            alt="Warehouse support"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,16,32,0.25) 0%, rgba(10,16,32,0.88) 100%)' }} />
        </div>

        <div className="absolute top-0 left-0 right-0 z-20" style={{ borderBottom: `1px solid rgba(255,255,255,0.1)`, backgroundColor: 'rgba(13,27,62,0.65)', backdropFilter: 'blur(6px)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-2.5 flex gap-8 text-xs" style={{ fontFamily: mono, color: 'rgba(245,240,232,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            <span>Green Sphere Services</span>
            <span style={{ color: rust }}>◆</span>
            <span>Help Centre</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <SectionLabel>Help &amp; Support</SectionLabel>
              <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: cream, lineHeight: 1.05 }}>
                How can we<br />
                <em style={{ color: rust, fontStyle: 'italic' }}>help you?</em>
              </h1>
            </div>
            {/* Search */}
            <div>
              <label style={{ display: 'block', fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: '0.6rem' }}>
                Search the knowledge base
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="e.g. tracking number, crypto payment, customs…"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 1rem',
                    backgroundColor: 'rgba(245,240,232,0.08)',
                    border: `1.5px solid rgba(245,240,232,0.25)`,
                    color: cream,
                    fontFamily: lora,
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = rust)}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(245,240,232,0.25)')}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(245,240,232,0.5)', cursor: 'pointer', fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section style={{ backgroundColor: navy, borderTop: `4px solid ${rust}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ borderTop: `1px solid ${border}`, borderLeft: `1px solid ${border}` }}>
            {[
              { label: 'Track a Shipment', sub: 'Enter tracking reference', href: '/', icon: '📦' },
              { label: 'Call Support', sub: '+1 (555) 123-7447', href: 'tel:+15551234747', icon: '📞' },
              { label: 'Email Us', sub: 'Detailed enquiries', href: '/contact', icon: '✉️' },
              { label: 'Get a Quote', sub: 'Freight pricing', href: '/quote', icon: '📋' },
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                style={{
                  display: 'block',
                  padding: '1.75rem 1.5rem',
                  borderRight: `1px solid ${border}`,
                  borderBottom: `1px solid ${border}`,
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(196,113,59,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '0.6rem' }}>{action.icon}</span>
                <p style={{ fontFamily: serif, fontSize: '1rem', color: cream, marginBottom: '0.25rem' }}>{action.label}</p>
                <p style={{ fontFamily: mono, fontSize: '0.67rem', color: muted, letterSpacing: '0.05em' }}>{action.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORT CHANNELS ── */}
      <section className="py-24" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ borderBottom: `1px solid #C4B49A`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}>
            <SectionLabel>Contact Us</SectionLabel>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: navy, lineHeight: 1.1 }}>
              Ways to reach our team
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0" style={{ backgroundColor: '#C4B49A' }}>
            {[
              {
                label: 'Phone',
                heading: '24/7 Phone Support',
                desc: 'Speak directly with a freight specialist',
                contact: '+1 (555) 123-7447',
                hours: '24 / 7',
                response: 'Immediate',
              },
              {
                label: 'Email',
                heading: 'Email Support',
                desc: 'For detailed enquiries and documentation',
                contact: 'support@greensphereservices.com',
                hours: 'Mon – Sun',
                response: 'Within 2 hours',
              },
              {
                label: 'Live Chat',
                heading: 'Live Chat',
                desc: 'Instant messaging with our ops team',
                contact: 'Available in-app',
                hours: '6 AM – 2 AM EST',
                response: 'Under 1 minute',
              },
              {
                label: 'Self-Service',
                heading: 'Knowledge Base',
                desc: 'Browse guides and answers below',
                contact: 'No login required',
                hours: 'Always available',
                response: 'Instant',
              },
            ].map((ch, i) => (
              <div
                key={i}
                style={{ backgroundColor: '#F5F0E8', padding: '2rem', borderBottom: '1px solid #C4B49A', marginBottom: '1px', marginRight: '1px' }}
              >
                <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: rust, marginBottom: '0.5rem' }}>{ch.label}</p>
                <h3 style={{ fontFamily: serif, fontSize: '1.1rem', color: navy, marginBottom: '0.4rem' }}>{ch.heading}</h3>
                <p style={{ fontFamily: lora, fontSize: '0.85rem', color: '#5A4E44', lineHeight: 1.65, marginBottom: '1.25rem' }}>{ch.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {[['Contact', ch.contact], ['Hours', ch.hours], ['Response', ch.response]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust, minWidth: '4.5rem', flexShrink: 0 }}>{k}</span>
                      <span style={{ fontFamily: mono, fontSize: '0.72rem', color: navy }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24" style={{ backgroundColor: navy }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '2rem', flexWrap: 'wrap' }}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: cream, lineHeight: 1.1 }}>
              Frequently asked questions
            </h2>
          </div>

          {filteredCategories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {filteredCategories.map((cat, ci) => (
                <div key={ci}>
                  <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '1.25rem' }}>
                    {cat.category}
                  </p>
                  <div style={{ borderTop: `1px solid ${border}` }}>
                    {cat.questions.map((faq, fi) => {
                      const key = `${ci}-${fi}`;
                      const open = expandedFAQ === key;
                      return (
                        <div
                          key={fi}
                          style={{ borderBottom: `1px solid ${border}` }}
                        >
                          <button
                            onClick={() => toggleFAQ(key)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '1.1rem 0',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              gap: '1rem',
                            }}
                          >
                            <span style={{ fontFamily: lora, fontSize: '0.975rem', color: open ? rust : cream, fontWeight: 500, flex: 1 }}>
                              {faq.q}
                            </span>
                            <span style={{ color: rust, fontFamily: mono, fontSize: '1rem', flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>
                              +
                            </span>
                          </button>
                          {open && (
                            <div style={{ paddingBottom: '1.25rem' }}>
                              <p style={{ fontFamily: lora, fontSize: '0.9rem', color: muted, lineHeight: 1.8 }}>
                                {faq.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ fontFamily: serif, fontSize: '1.5rem', color: cream, marginBottom: '0.75rem' }}>No results found</p>
              <p style={{ fontFamily: lora, fontSize: '0.9rem', color: muted, marginBottom: '1.5rem' }}>
                Try different keywords or contact our support team directly.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                style={{ backgroundColor: rust, color: cream, border: 'none', padding: '0.75rem 1.75rem', fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── SYSTEM STATUS ── */}
      <section className="py-16" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ borderTop: `4px solid ${rust}`, backgroundColor: '#fff', padding: '2rem 2.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(10,16,32,0.1)' }}>
              <div>
                <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rust, marginBottom: '0.35rem' }}>System Status</p>
                <h3 style={{ fontFamily: serif, fontSize: '1.35rem', color: navy }}>All Systems Operational</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4CAF50' }} />
                <span style={{ fontFamily: mono, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50' }}>Live</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-0" style={{ borderLeft: '1px solid rgba(10,16,32,0.1)' }}>
              {[
                { value: '99.9%', label: 'Platform Uptime', sub: 'Last 90 days' },
                { value: '<2 min', label: 'Avg. Response', sub: 'Support team' },
                { value: '24 / 7', label: 'Availability', sub: 'All services' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.25rem 2rem', borderRight: '1px solid rgba(10,16,32,0.1)', textAlign: 'center' }}>
                  <div style={{ fontFamily: serif, fontSize: '1.75rem', color: rust, marginBottom: '0.25rem' }}>{s.value}</div>
                  <div style={{ fontFamily: lora, fontSize: '0.875rem', color: navy, marginBottom: '0.15rem' }}>{s.label}</div>
                  <div style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E8E7E' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
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
              <SectionLabel>Still Need Help?</SectionLabel>
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: cream, lineHeight: 1.1 }}>
                Our team is standing by.
              </h2>
              <p style={{ fontFamily: lora, fontSize: '1rem', color: muted, marginTop: '0.75rem', maxWidth: '45ch', lineHeight: 1.7 }}>
                If the FAQ didn&apos;t answer your question, reach out directly and a freight specialist will respond promptly.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
              <Link
                href="/contact"
                style={{ display: 'block', textAlign: 'center', padding: '0.875rem 2rem', backgroundColor: rust, color: cream, fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#A85D2E')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = rust)}
              >
                Contact Support
              </Link>
              <a
                href="tel:+15551234747"
                style={{ display: 'block', textAlign: 'center', padding: '0.875rem 2rem', border: `1.5px solid rgba(245,240,232,0.3)`, color: muted, fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = cream)}
                onMouseLeave={e => (e.currentTarget.style.color = muted as string)}
              >
                Call Now: +1 (555) 123-7447
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}