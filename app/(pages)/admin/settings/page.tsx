/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { RegisterForm } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

export default function Settings() {
  const { register, handleSubmit } = useForm<Partial<RegisterForm>>();
  const { register: registerPw, handleSubmit: handlePw, reset } = useForm<{ currentPassword: string; newPassword: string }>();
  const [loading, setLoading] = useState(false);

  const onUpdateProfile = async (data: Partial<RegisterForm>) => {
    try {
      setLoading(true);
      const response = await authApi.updateProfile(data);
      if (response.success) {
        toast.success('Profile updated');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      setLoading(true);
      const response = await authApi.changePassword(data);
      if (response.success) {
        toast.success('Password changed');
        reset();
      } else {
        toast.error('Failed to change password');
      }
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <span>Update Profile</span>
          </h3>
          <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                {...register('firstName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                {...register('lastName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-500" />
            <span>Change Password</span>
          </h3>
          <form onSubmit={handlePw(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                {...registerPw('currentPassword', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                {...registerPw('newPassword', { required: true, minLength: 6 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
