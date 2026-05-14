'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Footer() {
  const pathname = usePathname();

  const hideFooter =
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register';

  if (hideFooter) return null;

  const footerLinks = {
    Services: [
      { name: 'Sea Freight', href: '/services#sea' },
      { name: 'Air Cargo', href: '/services#air' },
      { name: 'Road Haulage', href: '/services#road' },
      { name: 'Rail Freight', href: '/services#rail' },
      { name: 'Bulk Shipping', href: '/services#bulk' },
    ],
    Tracking: [
      { name: 'Track a Shipment', href: '/' },
      { name: 'Help Center', href: '/support' },
      { name: 'Shipping Guide', href: '/support#guide' },
      { name: 'Contact Support', href: '/contact' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/about#team' },
      { name: 'Careers', href: '/about#careers' },
      { name: 'News', href: '/about#news' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refunds' },
    ],
  };

  const monoLabel: React.CSSProperties = {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: '#16a34a',
    marginBottom: '1rem',
    display: 'block',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '0.875rem',
    color: 'rgba(240,253,244,0.55)',
    textDecoration: 'none',
    display: 'block',
    paddingBottom: '0.5rem',
    transition: 'color 0.2s',
  };

  return (
    <footer style={{ backgroundColor: '#030712', borderTop: '4px solid #16a34a' }}>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <Image
                src="/images/gss-logo.png"
                alt="Green Sphere Services"
                width={90}
                height={30}
                style={{ objectFit: 'contain' }}
              />
            </Link>

            <p
              className="leading-relaxed mb-7"
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: '0.9rem',
                color: 'rgba(240,253,244,0.55)',
                maxWidth: '32ch',
              }}
            >
              End-to-end freight visibility across sea, air, road and rail.
              Serving 150+ countries with cryptocurrency-enabled settlement
              since 2018.
            </p>

            {/* Contact block — manifest style */}
            <div
              className="space-y-3 pt-5"
              style={{ borderTop: '1px solid rgba(240,253,244,0.1)' }}
            >
              {[
                { label: 'Address', value: '14 Harbour Court, Trade District' },
                { label: 'Phone', value: '+1 (555) 123-4567' },
                { label: 'Email', value: 'support@greensphere.co' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 items-baseline">
                  <span
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.62rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#16a34a',
                      minWidth: '4.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.75rem',
                      color: 'rgba(240,253,244,0.6)',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <span style={monoLabel}>{heading}</span>
              <ul className="space-y-0">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      style={linkStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#f0fdf4')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'rgba(240,253,244,0.55)')
                      }
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications bar */}
      <div
        style={{
          borderTop: '1px solid rgba(240,253,244,0.08)',
          borderBottom: '1px solid rgba(240,253,244,0.08)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-wrap items-center gap-6">
          {['IATA Certified', 'FIATA Member', 'ISO 9001', 'Customs Licensed', 'WCA Network'].map(
            (cert, i) => (
              <span
                key={i}
                className="flex items-center gap-2"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(240,253,244,0.35)',
                }}
              >
                <span style={{ color: '#16a34a', fontSize: '0.5rem' }}>◆</span>
                {cert}
              </span>
            )
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              color: 'rgba(240,253,244,0.3)',
              textTransform: 'uppercase',
            }}
          >
            © 2025 Green Sphere Services Ltd. — All rights reserved
          </p>

          {/* Social links — clean text style, no round blobs */}
          <div className="flex items-center gap-6">
            {[
              { label: 'LinkedIn', href: '#' },
              { label: 'Twitter', href: '#' },
              { label: 'Facebook', href: '#' },
              { label: 'Instagram', href: '#' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(240,253,244,0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#16a34a')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(240,253,244,0.3)')
                }
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}