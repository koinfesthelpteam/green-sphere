/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Plus, ArrowLeft, Upload, X, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { shipmentsApi } from '@/lib/api';
import { CreateShipmentForm } from '@/types';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import Image from 'next/image';

interface ImageFile {
  file: File;
  preview: string;
  description: string;
  id: string; // Add unique ID for better tracking
}

const CreateShipment: React.FC = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateShipmentForm>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Watch payment type to show/hide fields
  const watchPaymentType = watch('payment.paymentType', 'full');

  // Improved image validation
  const validateImage = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return `${file.name} is not a valid image file.`;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return `${file.name} is too large. Maximum size is 5MB.`;
    }

    // Check supported formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!supportedFormats.includes(file.type.toLowerCase())) {
      return `${file.name} format is not supported. Please use JPG, PNG, GIF, or WebP.`;
    }

    return null;
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadingImages(true);
    const fileArray = Array.from(files);
    
    // Check total number of images
    if (images.length + fileArray.length > 10) {
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

    // Show errors if any
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    // Add valid images
    if (validImages.length > 0) {
      setImages((prev) => [...prev, ...validImages]);
      toast.success(`${validImages.length} image(s) added successfully.`);
    }

    // Reset input value to allow same file selection again
    event.target.value = '';
    setUploadingImages(false);
  }, [images.length]);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const imageIndex = prev.findIndex(img => img.id === id);
      if (imageIndex !== -1) {
        // Revoke object URL to free memory
        URL.revokeObjectURL(prev[imageIndex].preview);
        return prev.filter(img => img.id !== id);
      }
      return prev;
    });
    toast.success('Image removed successfully.');
  }, []);

  const updateImageDescription = useCallback((id: string, description: string) => {
    setImages((prev) => {
      return prev.map(img => 
        img.id === id ? { ...img, description } : img
      );
    });
  }, []);

  // Clean up object URLs on component unmount
  React.useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  const onSubmit = async (data: CreateShipmentForm) => {
    try {
      setLoading(true);

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

      // Add images to FormData with proper naming convention
      images.forEach((imageFile, index) => {
        formData.append('packageImages', imageFile.file);
        formData.append(`imageDescription_${index}`, imageFile.description);
      });

      console.log('Submitting form with images:', images.length);
      
      const response = await shipmentsApi.createWithImages(formData);
      
      if (response.success) {
        toast.success('Shipment created successfully');
        // Clean up object URLs before navigation
        images.forEach(image => {
          URL.revokeObjectURL(image.preview);
        });
        router.push('/admin/shipments');
      } else {
        toast.error(response.message || 'Failed to create shipment');
      }
    } catch (error: any) {
      console.error('Create shipment error:', error);
      toast.error(error.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Shipment</h1>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Sender and Recipient Information */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Sender Information */}
                  <div className="space-y-6">
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
                        {errors.sender?.phone && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('sender.phone')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          {...register('sender.email', {
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.sender?.email ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="email@example.com"
                        />
                        {errors.sender?.email && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('sender.email')}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recipient Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Recipient Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          {...register('recipient.name', { required: 'Recipient name is required' })}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.recipient?.name ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="Enter full name"
                        />
                        {errors.recipient?.name && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('recipient.name')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company (Optional)
                        </label>
                        <input
                          {...register('recipient.company')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm  text-gray-700"
                          placeholder="Company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <input
                          {...register('recipient.address1', { required: 'Address is required' })}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.recipient?.address1 ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="Street address"
                        />
                        {errors.recipient?.address1 && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('recipient.address1')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          {...register('recipient.address2')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                          placeholder="Apartment, suite, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            {...register('recipient.city', { required: 'City is required' })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.recipient?.city ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="City"
                          />
                          {errors.recipient?.city && (
                            <p className="text-red-600 text-sm mt-1">{getFieldError('recipient.city')}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State/Province *
                          </label>
                          <input
                            {...register('recipient.state', { required: 'State is required' })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.recipient?.state ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="State/Province"
                          />
                          {errors.recipient?.state && (
                            <p className="text-red-600 text-sm mt-1">{getFieldError('recipient.state')}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                          </label>
                          <input
                            {...register('recipient.postalCode', { required: 'Postal code is required' })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.recipient?.postalCode ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Postal code"
                          />
                          {errors.recipient?.postalCode && (
                            <p className="text-red-600 text-sm mt-1">{getFieldError('recipient.postalCode')}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <input
                            {...register('recipient.country', { required: 'Country is required' })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.recipient?.country ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Country"
                          />
                          {errors.recipient?.country && (
                            <p className="text-red-600 text-sm mt-1">{getFieldError('recipient.country')}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          {...register('recipient.phone', { required: 'Phone number is required' })}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 ${errors.recipient?.phone ? 'border-red-300' : 'border-gray-300'}`}
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
                <div className="space-y-6">
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

                  {/* Enhanced Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Images (Optional)
                    </label>
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="package-images"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                            uploadingImages 
                              ? 'border-blue-400 bg-blue-50' 
                              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                          } ${images.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploadingImages ? (
                              <>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
                                <p className="text-sm text-blue-600 font-medium">Uploading images...</p>
                              </>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF, WebP up to 5MB each (Max 10 images)
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {images.length} / 10 images uploaded
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            id="package-images"
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={loading || uploadingImages || images.length >= 10}
                          />
                        </label>
                      </div>

                      {/* Image Preview Grid */}
                      {images.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              Uploaded Images ({images.length})
                            </h4>
                            {images.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Click on an image to remove it
                              </p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((image) => (
                              <div key={image.id} className="relative group">
                                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 border-2 border-transparent group-hover:border-gray-300 transition-all duration-200">
                                  <Image
                                    src={image.preview}
                                    alt={`Package image`}
                                    width={400}
                                    height={250}
                                    className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                                    onError={(e) => {
                                      // Handle broken image
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJMMTEgMTRMMTUgMTBNMjEgMTJDMjEgMTYuOTcwNiAxNi45NzA2IDIxIDEyIDIxQzcuMDI5NDQgMjEgMyAxNi45NzA2IDMgMTJDMyA3LjAyOTQ0IDcuMDI5NDQgMyAxMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyWiIgc3Ryb2tlPSIjOTMzNEE0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(image.id)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                    title="Remove image"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
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
                                    onChange={(e) => updateImageDescription(image.id, e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
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

                {/* Service Information */}
                <div className="space-y-6">
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
                <div className="space-y-6">
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
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploadingImages}
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating...
                      </>
                    ) : uploadingImages ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing Images...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Shipment
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
};

export default CreateShipment;