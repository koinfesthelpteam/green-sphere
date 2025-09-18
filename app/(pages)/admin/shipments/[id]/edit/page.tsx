/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Edit, ArrowLeft, Upload, X, ImageIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { shipmentsApi } from '@/lib/api';
import { CreateShipmentForm, PackageImage, Shipment } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface ImageFile {
  file: File;
  preview: string;
  description: string;
  id: string;
}

interface ExistingImage {
  _id: string;
  originalName: string;
  cloudinaryUrl?: string;
  thumbnail?: string;
  description?: string;
  isLegacy?: boolean;
}

export default function EditShipment() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<CreateShipmentForm>();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  
  // Image handling states
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  // Watch payment type to show/hide fields
  const watchPaymentType = watch('payment.paymentType', 'full');

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      const response = await shipmentsApi.getById(id);
      if (response.success && response.data) {
        const shipmentData = response.data;
        setShipment(shipmentData);
        
        // Set existing images
        if (shipmentData.package?.images) {
  const validImages = shipmentData.package.images
    .filter((image): image is PackageImage & { _id: string } => 
      image._id !== undefined
    )
    .map((image): ExistingImage => ({
      _id: image._id,
      originalName: image.originalName,
      cloudinaryUrl: image.path, // Assuming path maps to cloudinaryUrl
      thumbnail: image.path, // You might need to adjust this based on your API
      description: image.description,
      isLegacy: false // Set based on your logic
    }));
  
  setExistingImages(validImages);
}

        // Format data for form
        const formData = {
          sender: shipmentData.sender,
          recipient: shipmentData.recipient,
          package: {
            weight: shipmentData.package.weight,
            dimensions: shipmentData.package.dimensions,
            description: shipmentData.package.description,
            value: shipmentData.package.value
          },
          service: {
            type: shipmentData.service.type,
            estimatedDelivery: shipmentData.service.estimatedDelivery ? 
              new Date(shipmentData.service.estimatedDelivery).toISOString().split('T')[0] : ''
          },
          payment: {
            baseAmount: shipmentData.payment.baseAmount,
            paymentType: shipmentData.payment.paymentType || 'full'
          },
          notes: shipmentData.notes || ''
        };

        reset(formData);
      } else {
        toast.error('Shipment not found');
        router.push('/admin/shipments');
      }
    } catch (err: any) {
      console.error('Failed to load shipment:', err);
      toast.error('Failed to load shipment');
      router.push('/admin/shipments');
    } finally {
      setLoading(false);
    }
  };

  // Image validation
  const validateImage = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return `${file.name} is not a valid image file.`;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return `${file.name} is too large. Maximum size is 5MB.`;
    }

    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!supportedFormats.includes(file.type.toLowerCase())) {
      return `${file.name} format is not supported. Please use JPG, PNG, GIF, or WebP.`;
    }

    return null;
  };

  // Handle new image uploads
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadingImages(true);
    const fileArray = Array.from(files);
    
    // Check total number of images (existing + new)
    const totalImages = existingImages.length + newImages.length + fileArray.length;
    if (totalImages > 10) {
      toast.error('Maximum 10 images allowed per shipment.');
      setUploadingImages(false);
      return;
    }

    const validImages: ImageFile[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const error = validateImage(file);
      if (error) {
        errors.push(error);
      } else {
        try {
          const preview = URL.createObjectURL(file);
          const id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          validImages.push({ 
            file, 
            preview, 
            description: '', 
            id 
          });
        } catch (err) {
          errors.push(`Failed to process ${file.name}`);
        }
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validImages.length > 0) {
      setNewImages((prev) => [...prev, ...validImages]);
      toast.success(`${validImages.length} new image(s) added.`);
    }

    event.target.value = '';
    setUploadingImages(false);
  }, [existingImages.length, newImages.length]);

  // Remove new image
  const removeNewImage = useCallback((id: string) => {
    setNewImages((prev) => {
      const imageIndex = prev.findIndex(img => img.id === id);
      if (imageIndex !== -1) {
        URL.revokeObjectURL(prev[imageIndex].preview);
        return prev.filter(img => img.id !== id);
      }
      return prev;
    });
    toast.success('New image removed.');
  }, []);

  // Delete existing image
  const deleteExistingImage = async (imageId: string) => {
    if (deletingImages.has(imageId)) return;

    try {
      setDeletingImages(prev => new Set(prev).add(imageId));
      
      const response = await shipmentsApi.deleteImage(id, imageId);
      if (response.success) {
        setExistingImages(prev => prev.filter(img => img._id !== imageId));
        toast.success('Image deleted successfully');
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error: any) {
      console.error('Delete image error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
    } finally {
      setDeletingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  // Update new image description
  const updateNewImageDescription = useCallback((id: string, description: string) => {
    setNewImages((prev) => {
      return prev.map(img => 
        img.id === id ? { ...img, description } : img
      );
    });
  }, []);

  // Update existing image description
  const updateExistingImageDescription = useCallback((id: string, description: string) => {
    setExistingImages((prev) => {
      return prev.map(img => 
        img._id === id ? { ...img, description } : img
      );
    });
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      newImages.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  const onSubmit = async (data: CreateShipmentForm) => {
    try {
      setUpdating(true);

      // If there are new images, use FormData; otherwise use JSON
      if (newImages.length > 0) {
        const formData = new FormData();
        
        // Add all text fields to FormData
        formData.append('sender.name', data.sender.name);
        formData.append('sender.address1', data.sender.address1);
        if (data.sender.address2) formData.append('sender.address2', data.sender.address2);
        formData.append('sender.city', data.sender.city);
        formData.append('sender.state', data.sender.state);
        formData.append('sender.postalCode', data.sender.postalCode);
        formData.append('sender.country', data.sender.country);
        formData.append('sender.phone', data.sender.phone);
        if (data.sender.email) formData.append('sender.email', data.sender.email);
        if (data.sender.company) formData.append('sender.company', data.sender.company);

        formData.append('recipient.name', data.recipient.name);
        formData.append('recipient.address1', data.recipient.address1);
        if (data.recipient.address2) formData.append('recipient.address2', data.recipient.address2);
        formData.append('recipient.city', data.recipient.city);
        formData.append('recipient.state', data.recipient.state);
        formData.append('recipient.postalCode', data.recipient.postalCode);
        formData.append('recipient.country', data.recipient.country);
        formData.append('recipient.phone', data.recipient.phone);
        if (data.recipient.email) formData.append('recipient.email', data.recipient.email);
        if (data.recipient.company) formData.append('recipient.company', data.recipient.company);

        formData.append('package.weight.value', data.package.weight.value.toString());
        formData.append('package.weight.unit', data.package.weight.unit || 'kg');
        formData.append('package.dimensions.length', data.package.dimensions.length.toString());
        formData.append('package.dimensions.width', data.package.dimensions.width.toString());
        formData.append('package.dimensions.height', data.package.dimensions.height.toString());
        formData.append('package.dimensions.unit', data.package.dimensions.unit || 'cm');
        formData.append('package.description', data.package.description);
        formData.append('package.value.amount', data.package.value.amount.toString());
        formData.append('package.value.currency', data.package.value.currency || 'USD');

        formData.append('service.type', data.service.type);
        formData.append('service.estimatedDelivery', data.service.estimatedDelivery);

        formData.append('payment.baseAmount', data.payment.baseAmount.toString());
        formData.append('payment.paymentType', data.payment.paymentType || 'full');

        if (data.notes) formData.append('notes', data.notes);

        // Add new images
        newImages.forEach((imageFile, index) => {
          formData.append('packageImages', imageFile.file);
          formData.append(`imageDescription_${index}`, imageFile.description);
        });

        const response = await shipmentsApi.updateWithImages(id, formData);
        
        if (response.success) {
          toast.success('Shipment updated successfully');
          newImages.forEach(image => URL.revokeObjectURL(image.preview));
          router.push(`/admin/shipments/${id}`);
        } else {
          toast.error(response.message || 'Failed to update shipment');
        }
      } else {
        // No new images, use regular JSON update
        const response = await shipmentsApi.update(id, data);
        if (response.success) {
          toast.success('Shipment updated successfully');
          router.push(`/admin/shipments/${id}`);
        } else {
          toast.error('Failed to update shipment');
        }
      }
    } catch (error: any) {
      console.error('Update shipment error:', error);
      toast.error(error.response?.data?.message || 'Failed to update shipment');
    } finally {
      setUpdating(false);
    }
  };

  const getFieldError = (fieldPath: string): string => {
    const pathArray = fieldPath.split('.');
    let error = errors as any;
    for (const path of pathArray) {
      error = error?.[path];
    }
    return error?.message || (error ? 'This field is required' : '');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={updating}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Shipment {shipment?.trackingNumber && `(${shipment.trackingNumber})`}
            </h1>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Sender and Recipient Information */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Sender Information */}
                  <div className="space-y-6 text-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Sender Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          {...register('sender.name', { required: 'Sender name is required' })}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.sender?.name ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="Enter full name"
                        />
                        {errors.sender?.name && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('sender.name')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company (Optional)
                        </label>
                        <input
                          {...register('sender.company')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <input
                          {...register('sender.address1', { required: 'Address is required' })}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.sender?.address1 ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="Street address"
                        />
                        {errors.sender?.address1 && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('sender.address1')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          {...register('sender.address2')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Apartment, suite, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            {...register('sender.city', { required: 'City is required' })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.sender?.city ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="City"
                          />
                          {errors.sender?.city && (
                            <p className="text-red-600 text-sm mt-1">{getFieldError('sender.city')}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State/Province *
                          </label>
                          <input
                            {...register('sender.state', { required: 'State is required' })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.sender?.state ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="State/Province"
                          />
                          {errors.sender?.state && (
                            <p className="text-red-600 text-sm mt-1">{getFieldError('sender.state')}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                          </label>
                          <input
                            {...register('sender.postalCode', { required: 'Postal code is required' })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.sender?.postalCode ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Postal code"
                          />
                          {errors.sender?.postalCode && (
                            <p className="text-red-600 text-sm mt-1">{getFieldError('sender.postalCode')}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <input
                            {...register('sender.country', { required: 'Country is required' })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.sender?.country ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Country"
                          />
                          {errors.sender?.country && (
                            <p className="text-red-600 text-sm mt-1">{getFieldError('sender.country')}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          {...register('sender.phone', { required: 'Phone number is required' })}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.sender?.phone ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="+1 (555) 123-4567"
                        />
                        {errors.recipient?.phone && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('recipient.phone')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          {...register('recipient.email', {
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.recipient?.email ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="email@example.com"
                        />
                        {errors.recipient?.email && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('recipient.email')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Information */}
                <div className="space-y-6 text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Package Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          {...register('package.weight.value', {
                            required: 'Weight is required',
                            min: { value: 0.1, message: 'Weight must be greater than 0' },
                          })}
                          className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.package?.weight?.value ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="0.0"
                        />
                        <select
                          {...register('package.weight.unit')}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0 text-gray-700"
                        >
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                        </select>
                      </div>
                      {errors.package?.weight?.value && (
                        <p className="text-red-600 text-sm mt-1">{getFieldError('package.weight.value')}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dimensions (L × W × H) *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          {...register('package.dimensions.length', {
                            required: 'Length is required',
                            min: { value: 0.1, message: 'Length must be greater than 0' },
                          })}
                          className={`flex-1 min-w-0 px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.package?.dimensions?.length ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="L"
                        />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          {...register('package.dimensions.width', {
                            required: 'Width is required',
                            min: { value: 0.1, message: 'Width must be greater than 0' },
                          })}
                          className={`flex-1 min-w-0 px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.package?.dimensions?.width ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="W"
                        />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          {...register('package.dimensions.height', {
                            required: 'Height is required',
                            min: { value: 0.1, message: 'Height must be greater than 0' },
                          })}
                          className={`flex-1 min-w-0 px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.package?.dimensions?.height ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="H"
                        />
                        <select
                          {...register('package.dimensions.unit')}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0 text-gray-700"
                        >
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                      {(errors.package?.dimensions?.length || errors.package?.dimensions?.width || errors.package?.dimensions?.height) && (
                        <p className="text-red-600 text-sm mt-1">All dimensions are required</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Package Description *
                      </label>
                      <textarea
                        {...register('package.description', { required: 'Description is required' })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.package?.description ? 'border-red-300' : 'border-gray-300'}`}
                        rows={3}
                        placeholder="Describe the package contents..."
                      />
                      {errors.package?.description && (
                        <p className="text-red-600 text-sm mt-1">{getFieldError('package.description')}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Declared Value *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register('package.value.amount', {
                            required: 'Value is required',
                            min: { value: 0.01, message: 'Value must be greater than 0' },
                          })}
                          className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.package?.value?.amount ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="0.00"
                        />
                        <select
                          {...register('package.value.currency')}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0 text-gray-700"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                      {errors.package?.value?.amount && (
                        <p className="text-red-600 text-sm mt-1">{getFieldError('package.value.amount')}</p>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Image Management Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Images
                    </label>
                    <div className="space-y-6">
                      
                      {/* Existing Images */}
                      {existingImages.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              Current Images ({existingImages.length})
                            </h4>
                            <p className="text-xs text-gray-500">
                              Click the delete button to remove an image
                            </p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {existingImages.map((image) => (
                              <div key={image._id} className="relative group">
                                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 border-2 border-transparent group-hover:border-gray-300 transition-all duration-200">
                                  {image.cloudinaryUrl && !image.isLegacy ? (
                                    <Image
                                      src={image.thumbnail || image.cloudinaryUrl}
                                      alt={image.description || 'Package image'}
                                      width={400}
                                      height={300}
                                      className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <div className="text-center p-2">
                                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500">Legacy Image</p>
                                        <p className="text-xs text-gray-400">URL not available</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <button
                                    type="button"
                                    onClick={() => deleteExistingImage(image._id)}
                                    disabled={deletingImages.has(image._id)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg disabled:opacity-50"
                                    title="Delete image"
                                  >
                                    {deletingImages.has(image._id) ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                                    ) : (
                                      <Trash2 className="h-3 w-3" />
                                    )}
                                  </button>
                                  
                                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded truncate">
                                      {image.originalName}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    placeholder="Image description (optional)"
                                    value={image.description || ''}
                                    onChange={(e) => updateExistingImageDescription(image._id, e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
                                    maxLength={100}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload New Images */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-700">
                            Add New Images
                          </h4>
                          <p className="text-xs text-gray-500">
                            {existingImages.length + newImages.length} / 10 images total
                          </p>
                        </div>
                        
                        {/* Upload Area */}
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="new-package-images"
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                              uploadingImages 
                                ? 'border-blue-400 bg-blue-50' 
                                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                            } ${(existingImages.length + newImages.length) >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {uploadingImages ? (
                                <>
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
                                  <p className="text-sm text-blue-600 font-medium">Processing images...</p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF, WebP up to 5MB each
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              id="new-package-images"
                              type="file"
                              multiple
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={updating || uploadingImages || (existingImages.length + newImages.length) >= 10}
                            />
                          </label>
                        </div>

                        {/* New Images Preview */}
                        {newImages.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-700">
                                New Images to Upload ({newImages.length})
                              </h4>
                              <p className="text-xs text-gray-500">
                                These will be uploaded when you save
                              </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                              {newImages.map((image) => (
                                <div key={image.id} className="relative group">
                                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 border-2 border-green-200 group-hover:border-green-300 transition-all duration-200">
                                    <Image
                                      src={image.preview}
                                      alt="New package image"
                                      width={500}
                                      height={500}
                                      className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeNewImage(image.id)}
                                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                      title="Remove new image"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                      NEW
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded truncate">
                                        {image.file.name}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      placeholder="Image description (optional)"
                                      value={image.description}
                                      onChange={(e) => updateNewImageDescription(image.id, e.target.value)}
                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
                                      maxLength={100}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                      Size: {(image.file.size / 1024).toFixed(1)}KB
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-6 text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Service Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Type *
                      </label>
                      <select
                        {...register('service.type', { required: 'Service type is required' })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.service?.type ? 'border-red-300' : 'border-gray-300'}`}
                      >
                        <option value="">Select service type</option>
                        <option value="economy">Economy (5-7 business days)</option>
                        <option value="standard">Standard (3-5 business days)</option>
                        <option value="express">Express (1-2 business days)</option>
                        <option value="overnight">Overnight (Next business day)</option>
                      </select>
                      {errors.service?.type && (
                        <p className="text-red-600 text-sm mt-1">{getFieldError('service.type')}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Delivery Date *
                      </label>
                      <input
                        type="date"
                        {...register('service.estimatedDelivery', { required: 'Estimated delivery date is required' })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.service?.estimatedDelivery ? 'border-red-300' : 'border-gray-300'}`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.service?.estimatedDelivery && (
                        <p className="text-red-600 text-sm mt-1">{getFieldError('service.estimatedDelivery')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-6 text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Amount (USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register('payment.baseAmount', {
                            required: 'Payment amount is required',
                            min: { value: 0.01, message: 'Amount must be greater than 0' },
                          })}
                          className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.payment?.baseAmount ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.payment?.baseAmount && (
                        <p className="text-red-600 text-sm mt-1">{getFieldError('payment.baseAmount')}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Type *
                      </label>
                      <select
                        {...register('payment.paymentType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                      >
                        <option value="full">Full Payment (100%)</option>
                        <option value="partial">Partial Payment (50%)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {watchPaymentType === 'partial'
                          ? 'Customer will pay 50% of the base amount upfront'
                          : 'Customer will pay the full amount upfront'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Additional Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internal Notes (Optional)
                    </label>
                    <textarea
                      {...register('notes')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                      rows={4}
                      placeholder="Add any internal notes or special instructions..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      These notes are for internal use only and will not be visible to customers.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating || uploadingImages || deletingImages.size > 0}
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Updating...
                      </>
                    ) : uploadingImages ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing Images...
                      </>
                    ) : deletingImages.size > 0 ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Deleting Images...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Shipment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 