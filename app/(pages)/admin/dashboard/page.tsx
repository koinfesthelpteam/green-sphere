import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoutes';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard - ShipTracker Pro',
  description: 'Admin dashboard for managing shipments and tracking',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
        <AdminDashboard />
    </ProtectedRoute>
  );
}