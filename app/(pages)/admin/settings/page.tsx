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

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Update Profile</h3>
          <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input {...register('firstName')} className="input mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input {...register('lastName')} className="input mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" {...register('email')} className="input mt-1" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handlePw(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input type="password" {...registerPw('currentPassword', { required: true })} className="input mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" {...registerPw('newPassword', { required: true, minLength: 6 })} className="input mt-1" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}