/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  TrendingUp, 
  CreditCard,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/authContext';
import { shipmentsApi } from '@/lib/api';
import { DashboardStats, Shipment } from '@/types';
import AdminLayout from './AdminLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats and recent shipments separately
      const [statsResponse, shipmentsResponse] = await Promise.all([
        shipmentsApi.getDashboardStats(),
        shipmentsApi.getAll({ limit: 5, page: 1 })
      ]);

      console.log('Stats response:', statsResponse);
      console.log('Shipments response:', shipmentsResponse);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        console.error('Failed to fetch stats:', statsResponse);
        toast.error('Failed to load dashboard statistics');
      }

      if (shipmentsResponse.success && shipmentsResponse.data) {
        // Handle both array response and paginated response
        const responseData = shipmentsResponse.data as any;
        const shipments = Array.isArray(responseData) 
          ? responseData 
          : (responseData.data || []);
        
        setRecentShipments(shipments.slice(0, 5)); // Ensure we only get top 5
      } else {
        console.error('Failed to fetch shipments:', shipmentsResponse);
        toast.error('Failed to load recent shipments');
      }

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      created: 'bg-gray-800/50 text-gray-400 border-gray-600',
      picked_up: 'bg-blue-900/50 text-blue-400 border-blue-600',
      in_transit: 'bg-yellow-900/50 text-yellow-400 border-yellow-600',
      out_for_delivery: 'bg-purple-900/50 text-purple-400 border-purple-600',
      delivered: 'bg-green-900/50 text-green-400 border-green-600',
      exception: 'bg-red-900/50 text-red-400 border-red-600',
      returned: 'bg-orange-900/50 text-orange-400 border-orange-600'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-800/50 text-gray-400 border-gray-600';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-900/50 text-yellow-400 border-yellow-600',
      paid: 'bg-green-900/50 text-green-400 border-green-600',
      failed: 'bg-red-900/50 text-red-400 border-red-600',
      refunded: 'bg-gray-800/50 text-gray-400 border-gray-600'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-800/50 text-gray-400 border-gray-600';
  };

  const handleDelete = async (shipmentId: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
      const response = await shipmentsApi.delete(shipmentId);
      if (response.success) {
        toast.success('Shipment deleted successfully');
        fetchDashboardData(); // Refresh both stats and recent shipments
      } else {
        toast.error(response.message || 'Failed to delete shipment');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete shipment');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatStatusText = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6 bg-black min-h-screen text-white p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-red-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-400">Manage shipments and payments</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/admin/shipments/create" 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Shipment</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-transparent border border-gray-700 hover:border-red-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:transform hover:scale-105 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Shipments</p>
                  <p className="mt-1 text-3xl font-semibold text-white">{stats.totalShipments}</p>
                </div>
                <Package className="h-8 w-8 text-red-400 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:transform hover:scale-105 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Recent Shipments</p>
                  <p className="mt-1 text-3xl font-semibold text-white">{stats.recentShipments}</p>
                  <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:transform hover:scale-105 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                  <p className="mt-1 text-3xl font-semibold text-white">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-xs text-gray-400 mt-1">From paid shipments</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:transform hover:scale-105 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending Payments</p>
                  <p className="mt-1 text-3xl font-semibold text-white">{stats.paymentBreakdown.pending || 0}</p>
                </div>
                <CreditCard className="h-8 w-8 text-yellow-400 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Breakdowns */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipment Status Breakdown */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-400" />
                <span>Shipment Status Breakdown</span>
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-400 capitalize">{status.replace('_', ' ')}</span>
                      <span className="text-sm font-medium text-white">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ease-in-out ${
                          status === 'created' ? 'bg-gray-600' :
                          status === 'picked_up' ? 'bg-blue-500' :
                          status === 'in_transit' ? 'bg-yellow-500' :
                          status === 'out_for_delivery' ? 'bg-purple-500' :
                          status === 'delivered' ? 'bg-green-500' :
                          status === 'exception' ? 'bg-red-500' :
                          status === 'returned' ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                        style={{ width: `${(count / stats.totalShipments) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status Breakdown */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-red-400" />
                <span>Payment Status Breakdown</span>
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.paymentBreakdown).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-400 capitalize">{status}</span>
                      <span className="text-sm font-medium text-white">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ease-in-out ${
                          status === 'pending' ? 'bg-yellow-500' :
                          status === 'paid' ? 'bg-green-500' :
                          status === 'failed' ? 'bg-red-500' :
                          status === 'refunded' ? 'bg-gray-500' : 'bg-gray-600'
                        }`}
                        style={{ width: `${(count / stats.totalShipments) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Shipments */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Package className="h-5 w-5 text-red-400" />
              <span>Recent Shipments</span>
              <span className="text-sm text-gray-400">({recentShipments.length})</span>
            </h3>
            <Link href="/admin/shipments" className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          {recentShipments.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-900/70">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tracking</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/30 divide-y divide-gray-800">
                  {recentShipments.map((shipment) => (
                    <tr key={shipment._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{shipment.trackingNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{shipment.recipient.name}</div>
                        <div className="text-xs text-gray-400">{shipment.recipient.city}, {shipment.recipient.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(shipment.status.current)}`}>
                          {formatStatusText(shipment.status.current)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(shipment.payment.status)}`}>
                          {shipment.payment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(shipment.payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link 
                            href={`/admin/shipments/${shipment._id}`} 
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link 
                            href={`/admin/shipments/${shipment._id}/edit`} 
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Edit Shipment"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(shipment._id)} 
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Shipment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-white">No Recent Shipments</h3>
              <p className="mt-1 text-sm text-gray-400">Create your first shipment to get started.</p>
              <div className="mt-6">
                <Link 
                  href="/admin/shipments/create" 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Shipment</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}