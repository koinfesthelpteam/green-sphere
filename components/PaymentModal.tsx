/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentsApi } from '@/lib/api';
import { PaymentInfo, PaymentDetailsRequest } from '@/types';

interface PaymentModalProps {
  trackingNumber: string;
  amount: number;
  currency: string;
  onClose: () => void;
  onPaymentComplete?: () => void;
}

const cream  = '#f0fdf4';
const navy   = '#111827';
const rust   = '#16a34a';
const muted  = 'rgba(240,253,244,0.6)';
const border = 'rgba(240,253,244,0.12)';
const tele   = '#24A1DE';
const serif  = "'Playfair Display', Georgia, serif";
const lora   = "'Lora', Georgia, serif";
const mono   = "'Courier New', monospace";

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: `1.5px solid rgba(240,253,244,0.2)`,
  color: cream,
  fontFamily: lora,
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M6 8L0 0h12z' fill='%2316a34a'/%3E%3C/svg%3E")`;

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: mono,
        fontSize: '0.62rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: rust,
        marginBottom: '0.4rem',
      }}
    >
      {children}
      {required && <span style={{ marginLeft: '3px' }}>*</span>}
    </label>
  );
}

function ManifestRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: `1px solid ${border}`,
      }}
    >
      <span style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust }}>
        {label}
      </span>
      <span style={{ fontFamily: mono, fontSize: '0.75rem', color: cream }}>{value}</span>
    </div>
  );
}

const allPaymentMethods = [
  { value: 'crypto'    as const, label: 'Cryptocurrency (BTC, ETH, LTC)' },
  { value: 'cashapp'   as const, label: 'Cash App (USD)' },
  { value: 'etransfer' as const, label: 'E-Transfer (CAD)' },
];

const TelegramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z" />
  </svg>
);

export default function PaymentModal({
  trackingNumber,
  amount,
  currency,
  onClose,
  onPaymentComplete,
}: PaymentModalProps) {
  const [paymentInfo, setPaymentInfo]         = useState<PaymentInfo | null>(null);
  const [loading, setLoading]                 = useState(true);
  const [requestForm, setRequestForm]         = useState({
    email: '',
    preferredMethod: '' as '' | 'crypto' | 'cashapp' | 'etransfer',
    message: '',
  });
  const [requestingDetails, setRequestingDetails] = useState(false);

  // Lock body scroll while modal is mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await paymentsApi.getPaymentInfo(trackingNumber);
        if (res.success && res.data) setPaymentInfo(res.data);
        else toast.error('Failed to load payment information');
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to load payment information');
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingNumber]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.email) { toast.error('Please enter your email address'); return; }
    try {
      setRequestingDetails(true);
      const res = await paymentsApi.requestPaymentDetails(trackingNumber, {
        customerEmail: requestForm.email,
        preferredMethod: requestForm.preferredMethod || undefined,
        message: requestForm.message || undefined,
      } as PaymentDetailsRequest);
      if (res.success) {
        toast.success('Request sent. Check your email within 1–2 hours.');
        onClose();
      } else {
        toast.error(res.message || 'Failed to request payment details');
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to request payment details');
    } finally {
      setRequestingDetails(false);
    }
  };

  const focusRust  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = rust);
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(240,253,244,0.2)');

  /* ── loading ── */
  if (loading) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(3,7,18,0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '1rem',
        }}
      >
        <div style={{ backgroundColor: navy, borderTop: `4px solid ${rust}`, padding: '2.5rem 3rem', textAlign: 'center' }}>
          <div
            style={{
              width: '28px', height: '28px',
              border: `2px solid rgba(240,253,244,0.2)`,
              borderTopColor: rust,
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
            Loading Payment Information…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const paymentStatus = paymentInfo?.payment.status ?? 'pending';

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(3,7,18,0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '1rem',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: navy,
          borderTop: `4px solid ${rust}`,
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        {/* ── header ── */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.5rem 1.75rem',
            borderBottom: `1px solid ${border}`,
          }}
        >
          <div>
            <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: rust, marginBottom: '0.25rem' }}>
              Payment
            </p>
            <h2 style={{ fontFamily: serif, fontSize: '1.25rem', color: cream }}>
              Ref: {trackingNumber}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: '0.25rem' }}
            onMouseEnter={e => (e.currentTarget.style.color = cream)}
            onMouseLeave={e => (e.currentTarget.style.color = muted as string)}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── payment summary ── */}
        {paymentInfo && (
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderBottom: `1px solid ${border}`,
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            {/* Amount */}
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: `1px solid ${border}` }}>
              <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust, marginBottom: '0.3rem' }}>
                Amount Due
              </p>
              <p style={{ fontFamily: serif, fontSize: '2rem', color: cream, lineHeight: 1 }}>
                ${paymentInfo.payment.amount}{' '}
                <span style={{ fontSize: '1rem', color: muted }}>{paymentInfo.payment.currency}</span>
              </p>
              {paymentInfo.payment.paymentType === 'partial' && (
                <p style={{ fontFamily: lora, fontSize: '0.8rem', color: '#FFD54F', marginTop: '0.35rem', lineHeight: 1.6 }}>
                  Sender has covered 50% (${paymentInfo.payment.baseAmount}). Remaining balance required to proceed.
                </p>
              )}
            </div>

            <ManifestRow
              label="Status"
              value={
                <span
                  style={{
                    fontFamily: mono, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: paymentStatus === 'paid' ? '#22c55e' : '#FFD54F',
                  }}
                >
                  {paymentStatus}
                </span>
              }
            />

            {/* Accepted methods */}
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: rust, marginBottom: '0.5rem' }}>
                Accepted Methods
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {allPaymentMethods.map(m => {
                  const ok = paymentInfo.allowedMethods.includes(m.value);
                  return (
                    <span
                      key={m.value}
                      style={{
                        fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '3px 9px',
                        border: `1px solid ${ok ? rust : 'rgba(240,253,244,0.15)'}`,
                        color: ok ? cream : 'rgba(240,253,244,0.3)',
                      }}
                    >
                      {ok ? '◆ ' : ''}{m.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {paymentInfo.payment.paymentType === 'partial' && (
              <div style={{ marginTop: '1rem', padding: '0.875rem 1rem', borderLeft: `3px solid #B87A00`, backgroundColor: 'rgba(184,122,0,0.1)' }}>
                <p style={{ fontFamily: lora, fontSize: '0.82rem', color: '#FFF8E1', lineHeight: 1.65 }}>
                  <strong>Action Required:</strong> Shipment is on hold until the remaining balance is settled.
                  Contact our agent on Telegram or request payment details via email below.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── section label ── */}
        <div style={{ padding: '1rem 1.75rem', borderBottom: `1px solid ${border}` }}>
          <p style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: rust }}>
            Payment Instructions
          </p>
        </div>

        {/* ── body ── */}
        <div style={{ padding: '1.75rem', flex: 1 }}>

          {/* ── Telegram CTA ── */}
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.25rem 1.25rem 1.25rem 1.1rem',
              backgroundColor: 'rgba(36,161,222,0.07)',
              borderLeft: `3px solid ${tele}`,
            }}
          >
            <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: tele, marginBottom: '0.4rem' }}>
              Recommended — Pay via Telegram
            </p>
            <p style={{ fontFamily: lora, fontSize: '0.85rem', color: muted, lineHeight: 1.75, marginBottom: '1.1rem' }}>
              Connect with our payment agent on Telegram for step-by-step instructions,
              wallet addresses, and instant support. Fastest way to clear your balance
              and resume transit.
            </p>
            <a
              href="https://t.me/greensphereservices"   /* ← replace with your handle */
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: tele,
                color: '#fff',
                padding: '0.8rem 1.5rem',
                fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a8bbf')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = tele)}
            >
              <TelegramIcon />
              Open Telegram →
            </a>
          </div>

          {/* ── OR divider ── */}
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: border }} />
            <span style={{ fontFamily: mono, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
              or request via email
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: border }} />
          </div> */}

          {/* ── email request form ── */}
          {/* <div
            style={{
              marginBottom: '1.5rem',
              padding: '0.875rem 1rem',
              borderLeft: `3px solid rgba(240,253,244,0.2)`,
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <p style={{ fontFamily: lora, fontSize: '0.82rem', color: muted, lineHeight: 1.7 }}>
              Our team will email you specific payment instructions — wallet addresses, account details,
              or platform info — based on your preferred method.
            </p>
          </div> */}

          {/* <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <FieldLabel required>Email Address</FieldLabel>
              <input
                type="email"
                required
                value={requestForm.email}
                onChange={e => setRequestForm(p => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                style={inputStyle}
                onFocus={focusRust}
                onBlur={blurBorder}
              />
            </div>

            <div>
              <FieldLabel>Preferred Payment Method</FieldLabel>
              <select
                value={requestForm.preferredMethod}
                onChange={e => setRequestForm(p => ({ ...p, preferredMethod: e.target.value as typeof p.preferredMethod }))}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  backgroundImage: chevronSvg,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                }}
                onFocus={focusRust}
                onBlur={blurBorder}
              >
                <option value="">Any available method</option>
                {allPaymentMethods.map(m => (
                  <option
                    key={m.value}
                    value={m.value}
                    disabled={!paymentInfo?.allowedMethods.includes(m.value)}
                  >
                    {m.label}{!paymentInfo?.allowedMethods.includes(m.value) ? ' — Unavailable' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>Additional Notes</FieldLabel>
              <textarea
                value={requestForm.message}
                onChange={e => setRequestForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Any specific requirements or questions…"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={focusRust}
                onBlur={blurBorder}
              />
            </div>

            <button
              type="submit"
              disabled={requestingDetails}
              style={{
                backgroundColor: requestingDetails ? 'rgba(22,163,74,0.5)' : rust,
                color: cream,
                border: 'none',
                padding: '0.875rem',
                fontFamily: mono,
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: requestingDetails ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => { if (!requestingDetails) e.currentTarget.style.backgroundColor = '#15803d'; }}
              onMouseLeave={e => { if (!requestingDetails) e.currentTarget.style.backgroundColor = rust; }}
            >
              {requestingDetails ? (
                <>
                  <span
                    style={{
                      width: '12px', height: '12px',
                      border: `2px solid rgba(240,253,244,0.3)`,
                      borderTopColor: cream,
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  Sending…
                </>
              ) : (
                'Request Payment Details →'
              )}
            </button>

            <p style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.1em', color: muted, textAlign: 'center' }}>
              Response within 1–2 business hours
            </p>
          </form> */}

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* ── footer notice ── */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: `1px solid ${border}`,
            backgroundColor: 'rgba(255,255,255,0.02)',
          }}
        >
          <p style={{ fontFamily: lora, fontSize: '0.78rem', color: 'rgba(240,253,244,0.4)', lineHeight: 1.65 }}>
            <strong style={{ color: muted }}>Note:</strong> All payments are processed manually by our admin team.
            Email confirmations are sent for all payment activities. Contact support if you experience any issues.
          </p>
        </div>

      </div>
    </div>
  );
}