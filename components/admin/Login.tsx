/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn } from 'lucide-react';
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

  // Redirect if already authenticated
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

  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-green-900 opacity-90"></div>
      
      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-40 right-20 w-6 h-6 bg-green-600 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-white rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-32 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Image
              src='/images/chat.png'
              alt='logo'
              width={120}
              height={120}
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Admin
            <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Login
            </span>
          </h1>
          <p className="text-gray-400">Access your admin dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-green-500/30 transition-all duration-300">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                className={`w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 outline-none transition-colors ${
                  errors.email ? 'border-green-500 focus:border-green-400' : ''
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-green-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 outline-none transition-colors ${
                    errors.password ? 'border-green-500 focus:border-green-400' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-green-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg shadow-red-500/20 disabled:shadow-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Need to create an admin account?{' '}
              <Link 
                href="/admin/register" 
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-gray-900/30 border border-gray-800/50 rounded-xl p-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2">Secure Admin Access</p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>🔒 SSL Encrypted</span>
              <span>•</span>
              <span>🛡️ 2FA Ready</span>
              <span>•</span>
              <span>⚡ Fast Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}