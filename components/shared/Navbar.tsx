'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const hideNavbar =
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (hideNavbar) return null;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: '/contact' },
  ];

  const navBg = scrolled
    ? 'rgba(13,27,62,0.97)'
    : 'rgba(13,27,62,0.72)';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        backgroundColor: navBg,
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled
          ? '1px solid rgba(196,113,59,0.4)'
          : '1px solid rgba(245,240,232,0.1)',
      }}
    >
      {/* Top manifest strip */}
      <div
        style={{
          backgroundColor: '#C4713B',
          borderBottom: 'none',
          padding: '3px 0',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            color: '#F5F0E8',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Sea · Air · Road · Rail — Global Freight &amp; Logistics Since 2018
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/images/gss-logo.png"
              alt="Green Sphere Services"
              width={60}
              height={30}
              style={{ objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-sm transition-colors duration-200"
                  style={{
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                    color: isActive ? '#C4713B' : 'rgba(245,240,232,0.75)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) =>
                    !isActive && (e.currentTarget.style.color = '#F5F0E8')
                  }
                  onMouseLeave={(e) =>
                    !isActive && (e.currentTarget.style.color = 'rgba(245,240,232,0.75)')
                  }
                >
                  {item.name}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-px"
                      style={{ backgroundColor: '#C4713B' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/quote"
              className="hidden md:inline-block px-5 py-2 text-xs transition-all duration-200"
              style={{
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                backgroundColor: '#C4713B',
                color: '#F5F0E8',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#A85D2E')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#C4713B')
              }
            >
              Get a Quote
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9"
              aria-label="Toggle menu"
            >
              <span
                className="block w-6 h-px transition-all duration-200"
                style={{
                  backgroundColor: '#F5F0E8',
                  transform: isOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
                }}
              />
              <span
                className="block w-6 h-px transition-all duration-200"
                style={{
                  backgroundColor: '#F5F0E8',
                  opacity: isOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-6 h-px transition-all duration-200"
                style={{
                  backgroundColor: '#F5F0E8',
                  transform: isOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? '400px' : '0',
          backgroundColor: '#0D1B3E',
          borderTop: isOpen ? '1px solid rgba(196,113,59,0.3)' : 'none',
        }}
      >
        <nav className="px-6 py-5 flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="py-3 text-sm"
                style={{
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  color: isActive ? '#C4713B' : 'rgba(245,240,232,0.7)',
                  borderBottom: '1px solid rgba(245,240,232,0.07)',
                  textDecoration: 'none',
                }}
              >
                {isActive ? '◆ ' : ''}{item.name}
              </Link>
            );
          })}
          <Link
            href="/quote"
            onClick={() => setIsOpen(false)}
            className="mt-4 py-3 text-xs text-center"
            style={{
              fontFamily: "'Courier New', monospace",
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              backgroundColor: '#C4713B',
              color: '#F5F0E8',
              textDecoration: 'none',
            }}
          >
            Get a Quote →
          </Link>
        </nav>
      </div>
    </header>
  );
}