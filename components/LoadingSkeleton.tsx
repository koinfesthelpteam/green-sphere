
'use client';
import React from 'react';
import Image from 'next/image';

const cream = '#F5F0E8';
const navy  = '#0D1B3E';
const rust  = '#C4713B';
const mono  = "'Courier New', monospace";
const serif = "'Playfair Display', Georgia, serif";
const lora  = "'Lora', Georgia, serif";

export default function LoadingSkeleton() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: navy }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { opacity: 0.3; }
          50%  { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gss-skeleton-fade {
          animation: shimmer 1.8s ease-in-out infinite;
        }
        .gss-slide-in {
          animation: slide-in 0.5s ease forwards;
        }
      `}</style>

      <div className="gss-slide-in" style={{ textAlign: 'center', padding: '2rem' }}>

        {/* Logo */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Image
            src="/images/gss-logo.png"
            alt="Green Sphere Services"
            width={90}
            height={40}
            style={{ objectFit: 'contain', opacity: 0.85 }}
          />
        </div>

        {/* Spinner — thin rust ring, no gradients */}
        <div style={{ position: 'relative', width: '48px', height: '48px', margin: '0 auto 2rem' }}>
          <div style={{
            width: '48px', height: '48px',
            border: `2px solid rgba(245,240,232,0.1)`,
            borderTopColor: rust,
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* Label */}
        <p style={{
          fontFamily: mono,
          fontSize: '0.65rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.45)',
          marginBottom: '2.5rem',
        }}>
          Fetching Shipment Data…
        </p>

        {/* Manifest skeleton rows */}
        <div style={{ width: '320px', maxWidth: '90vw' }}>
          {/* Rust accent top */}
          <div style={{ height: '3px', backgroundColor: rust, marginBottom: '1px' }} />

          {[
            { w: '45%', wb: '70%' },
            { w: '55%', wb: '60%' },
            { w: '35%', wb: '75%' },
            { w: '50%', wb: '65%' },
          ].map(({ w, wb }, i) => (
            <div
              key={i}
              className="gss-skeleton-fade"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.7rem 1rem',
                borderBottom: '1px solid rgba(245,240,232,0.07)',
                animationDelay: `${i * 0.18}s`,
              }}
            >
              <div style={{ height: '8px', width: w, backgroundColor: 'rgba(196,113,59,0.35)', borderRadius: '1px' }} />
              <div style={{ height: '8px', width: wb, backgroundColor: 'rgba(245,240,232,0.12)', borderRadius: '1px' }} />
            </div>
          ))}

          {/* Progress bar shimmer */}
          <div style={{ margin: '1.25rem 1rem 0', height: '2px', backgroundColor: 'rgba(245,240,232,0.08)', overflow: 'hidden' }}>
            <div
              className="gss-skeleton-fade"
              style={{ height: '100%', width: '60%', backgroundColor: rust, animationDelay: '0.6s' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── utility skeletons (kept for backward compat) ── */

export function SkeletonBox({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{ backgroundColor: 'rgba(196,113,59,0.15)', animation: 'shimmer 1.8s ease-in-out infinite', ...style }}
    />
  );
}

export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '10px',
            width: i === lines - 1 ? '70%' : '100%',
            backgroundColor: 'rgba(245,240,232,0.1)',
            animation: `shimmer 1.8s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ borderTop: `3px solid ${rust}`, backgroundColor: `rgba(255,255,255,0.03)`, padding: '1.5rem' }}
    >
      <SkeletonBox style={{ height: '14px', width: '35%', marginBottom: '1rem' }} />
      <SkeletonText lines={3} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <SkeletonBox style={{ height: '10px', width: '25%' }} />
        <SkeletonBox style={{ height: '10px', width: '25%' }} />
      </div>
    </div>
  );
}