/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  MapPin,
  Download,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { shipmentsApi } from '@/lib/api';
import { Shipment } from '@/types';

export default function ShipmentsList() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'created', label: 'Created' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'exception', label: 'Exception' },
    { value: 'returned', label: 'Returned' }
  ];

  useEffect(() => {
    fetchShipments();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentsApi.getAll({
        page: currentPage,
        limit: 10,
        status: statusFilter || undefined,
        search: searchTerm || undefined
      });

      if (response.success) {
        setShipments(response.data);
        setTotalPages(response.pagination.total);
        setTotalRecords(response.pagination.totalRecords);
      } else {
        toast.error('Failed to fetch shipments');
      }
    } catch (error: any) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchShipments();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDeleteShipment = async (id: string) => {
    try {
      const response = await shipmentsApi.delete(id);
      if (response.success) {
        toast.success('Shipment deleted successfully');
        fetchShipments();
        setShowDeleteModal(null);
      } else {
        toast.error(response.message || 'Failed to delete shipment');
      }
    } catch (error: any) {
      console.error('Error deleting shipment:', error);
      toast.error('Failed to delete shipment');
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

  if (loading) {
    return (
        <div className="space-y-6 bg-black min-h-screen text-white p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/3"></div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-800/50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="space-y-6 bg-black min-h-screen text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Shipments</h1>
          <p className="mt-1 text-sm text-gray-400">Manage and track all your shipments</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={fetchShipments}
            className="bg-transparent border border-gray-700 hover:border-green-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <Link 
            href="/admin/shipments/create" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Shipment</span>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by tracking number, sender, or recipient..."
                className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full lg:w-auto"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <button className="bg-transparent border border-gray-700 hover:border-green-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400 border-t border-gray-800 pt-4">
          <span>
            Showing {shipments.length} of {totalRecords} shipments
          </span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
        {shipments.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-900/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/30 divide-y divide-gray-800">
                {shipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{shipment.trackingNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {shipment.recipient.name}<br />
                      <span className="text-xs">{shipment.recipient.city}, {shipment.recipient.state}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.status.current)}`}>
                        {shipment.status.current.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(shipment.payment.status)}`}>
                        {shipment.payment.status.toUpperCase()}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        {shipment.payment.amount} {shipment.payment.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link 
                          href={`/admin/shipments/${shipment._id}`} 
                          className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded-lg hover:bg-gray-800/50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link 
                          href={`/admin/shipments/${shipment._id}/edit`} 
                          className="text-yellow-400 hover:text-yellow-300 transition-colors p-1 rounded-lg hover:bg-gray-800/50"
                          title="Edit Shipment"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link 
                          href={`/track/${shipment.trackingNumber}`} 
                          className="text-green-400 hover:text-green-300 transition-colors p-1 rounded-lg hover:bg-gray-800/50"
                          title="Track Package"
                        >
                          <MapPin className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => setShowDeleteModal(shipment._id)} 
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-gray-800/50"
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
            <h3 className="mt-2 text-sm font-medium text-white">No shipments found</h3>
            <p className="mt-1 text-sm text-gray-400">
              {searchTerm || statusFilter ? 'Try adjusting your filters' : 'Create your first shipment to get started'}
            </p>
            <div className="mt-6">
              <Link 
                href="/admin/shipments/create" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Shipment</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-transparent border border-gray-700 hover:border-green-500 disabled:hover:border-gray-700 text-gray-300 hover:text-white disabled:text-gray-500 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="bg-transparent border border-gray-700 hover:border-green-500 disabled:hover:border-gray-700 text-gray-300 hover:text-white disabled:text-gray-500 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Delete Shipment</h3>
                <p className="text-sm text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this shipment? All tracking data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteShipment(showDeleteModal)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex-1"
              >
                Delete Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}