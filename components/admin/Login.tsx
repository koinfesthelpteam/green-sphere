/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/authContext';
import { authApi } from '@/lib/api';
import { LoginForm } from '@/types';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const response = await authApi.login(data);
      if (response.success && response.token && response.user) {
        login(response.token, response.user);
        toast.success('Login successful!');
        router.push('/admin/dashboard');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: '#f0fdf4', color: '#111827' }}
    >
      {/* ── LEFT PANEL — editorial image column ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=1080&fit=crop&auto=format"
          alt="Container port"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(3,7,18,0.25) 0%, rgba(3,7,18,0.65) 60%, rgba(3,7,18,0.92) 100%)',
          }}
        />

        {/* Top-left logo */}
        <div className="relative z-10 p-10">
          <Image src="/images/gss-logo.png" alt="Green Sphere" width={72} height={72} />
        </div>

        {/* Bottom copy */}
        <div className="relative z-10 mt-auto p-10">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{
              color: '#16a34a',
              fontFamily: "'Courier New', monospace",
              letterSpacing: '0.2em',
            }}
          >
            Admin Portal
          </p>
          <h2
            className="font-bold mb-4"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: '#f0fdf4',
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.08,
            }}
          >
            Manage Every
            <br />
            <em style={{ fontStyle: 'italic', color: '#16a34a' }}>Shipment.</em>
          </h2>
          <p
            style={{
              color: 'rgba(240,253,244,0.6)',
              fontFamily: "'Lora', Georgia, serif",
              fontSize: '0.95rem',
              maxWidth: '38ch',
              lineHeight: 1.75,
            }}
          >
            Full visibility across routes, tracking events, payments,
            and client manifests — all in one secure console.
          </p>

          {/* Credential strip */}
          <div
            className="mt-8 flex gap-6 text-xs"
            style={{
              borderTop: '1px solid rgba(134,239,172,0.25)',
              paddingTop: '1.25rem',
              color: 'rgba(240,253,244,0.45)',
              fontFamily: "'Courier New', monospace",
            }}
          >
            <span>🔒 SSL Encrypted</span>
            <span>🛡️ Role-based Access</span>
            <span>⚡ 2FA Ready</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Image src="/images/chat.png" alt="Green Sphere" width={64} height={64} />
        </div>

        {/* Eyebrow */}
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{
            color: '#16a34a',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.2em',
          }}
        >
          Secure Access
        </p>

        {/* Heading */}
        <h1
          className="font-bold mb-2"
          style={{
            fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
            color: '#111827',
            fontFamily: "'Playfair Display', Georgia, serif",
            lineHeight: 1.05,
          }}
        >
          Admin Sign In
        </h1>
        <p
          className="mb-10"
          style={{
            color: '#4b7c59',
            fontFamily: "'Lora', Georgia, serif",
            fontSize: '0.95rem',
          }}
        >
          Enter your credentials to access the dashboard.
        </p>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md w-full">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: '#111827', fontFamily: "'Lora', Georgia, serif" }}
            >
              Email Address
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              type="email"
              placeholder="admin@greensphere.com"
              className="w-full px-4 py-3.5 text-base outline-none transition-all"
              style={{
                backgroundColor: 'transparent',
                border: errors.email ? '1.5px solid #16a34a' : '1.5px solid #86efac',
                color: '#111827',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.04em',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#111827')}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = errors.email ? '#16a34a' : '#86efac')
              }
            />
            {errors.email && (
              <p
                className="mt-2 text-xs"
                style={{ color: '#16a34a', fontFamily: "'Courier New', monospace" }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: '#111827', fontFamily: "'Lora', Georgia, serif" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                className="w-full px-4 py-3.5 pr-12 text-base outline-none transition-all"
                style={{
                  backgroundColor: 'transparent',
                  border: errors.password ? '1.5px solid #16a34a' : '1.5px solid #86efac',
                  color: '#111827',
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.08em',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#111827')}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = errors.password ? '#16a34a' : '#86efac')
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#4b7c59' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#16a34a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4b7c59')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p
                className="mt-2 text-xs"
                style={{ color: '#16a34a', fontFamily: "'Courier New', monospace" }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-semibold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-3"
            style={{
              backgroundColor: loading ? '#4b7c59' : '#111827',
              color: '#f0fdf4',
              fontFamily: "'Courier New', monospace",
              letterSpacing: '0.18em',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#16a34a';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#111827';
            }}
          >
            {loading ? (
              <>
                <span
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'rgba(240,253,244,0.25)', borderTopColor: '#f0fdf4' }}
                />
                Authenticating…
              </>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        {/* Divider */}
        <div
          className="mt-8 max-w-md w-full pt-6 flex items-center justify-between text-xs"
          style={{
            borderTop: '1px solid #86efac',
            color: '#4b7c59',
            fontFamily: "'Courier New', monospace",
          }}
        >
          <Link
            href="/admin/register"
            style={{ color: '#4b7c59', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#16a34a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#4b7c59')}
          >
            Need an account? Register →
          </Link>
          <Link
            href="/"
            style={{ color: '#4b7c59', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#111827')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#4b7c59')}
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}