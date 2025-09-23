'use client';

import React, { useState } from 'react';
import {
  Package,
  Truck,
  Ship,
  Plane,
  Train,
  MapPin,
  Calendar,
  Weight,
  Ruler,
  User,
  Mail,
  Phone,
  Building,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';

// Define types for form data
interface Dimensions {
  length: string;
  width: string;
  height: string;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface FormData {
  serviceType: string;
  origin: string;
  destination: string;
  shipmentDate: string;
  weight: string;
  dimensions: Dimensions;
  cargoType: string;
  cargoValue: string;
  specialRequirements: string;
  contactInfo: ContactInfo;
}

export default function GetQuotePage() {
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    origin: '',
    destination: '',
    shipmentDate: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    cargoType: '',
    cargoValue: '',
    specialRequirements: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const serviceTypes = [
    { id: 'air', name: 'Air Freight', icon: <Plane className="h-6 w-6" />, description: 'Fast international shipping' },
    { id: 'ocean', name: 'Ocean Freight', icon: <Ship className="h-6 w-6" />, description: 'Cost-effective bulk shipping' },
    { id: 'rail', name: 'Rail Transport', icon: <Train className="h-6 w-6" />, description: 'Overland cargo transport' },
    { id: 'road', name: 'Road Freight', icon: <Truck className="h-6 w-6" />, description: 'Door-to-door delivery' },
  ];

  const cargoTypes = [
    'General Cargo',
    'Electronics',
    'Automotive Parts',
    'Machinery',
    'Textiles',
    'Food & Beverages',
    'Chemicals',
    'Pharmaceuticals',
    'Fragile Items',
    'Other',
  ];

  const specialRequirements = [
    'Temperature Controlled',
    'Hazardous Materials',
    'Oversized Cargo',
    'High Value Items',
    'Urgent Delivery',
    'Custom Packaging',
  ];

  // Define valid nested keys
  type NestedKey = 'dimensions' | 'contactInfo';

  const handleInputChange = (field: string, value: string, nested?: NestedKey) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/50 rounded-xl p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Quote Request Submitted!</h1>
            <p className="text-gray-300 mb-6">
              Thank you for choosing Green Sphere Services. Our freight experts will review your requirements
              and provide you with a competitive quote within 24 hours.
            </p>
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2 text-green-400">What happens next?</h3>
              <ul className="text-left space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-green-500 mr-2" />
                  Our team will review your quote within 2-4 hours
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 text-green-500 mr-2" />
                  You&apos;ll receive a detailed quote via email
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 text-green-500 mr-2" />
                  Our specialist may call to discuss your requirements
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-green-900/20"></div>
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop&auto=format"
            alt="Global logistics"
            width={1200}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Get Your
              <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Freight Quote
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Tell us about your shipping needs and we&apos;ll provide you with a competitive quote
              tailored to your specific requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-12 h-1 ${currentStep > step ? 'bg-green-600' : 'bg-gray-700'}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <span className="text-gray-400">
                Step {currentStep} of 4:{' '}
                {currentStep === 1
                  ? 'Service & Route'
                  : currentStep === 2
                  ? 'Cargo Details'
                  : currentStep === 3
                  ? 'Special Requirements'
                  : 'Contact Information'}
              </span>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Service Type & Route */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Select Service & Route</h3>

                  {/* Service Type Selection */}
                  <div>
                    <label className="block text-lg font-semibold mb-4">Service Type</label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {serviceTypes.map((service) => (
                        <div
                          key={service.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            formData.serviceType === service.id
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-gray-700 hover:border-green-500/50'
                          }`}
                          onClick={() => handleInputChange('serviceType', service.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleInputChange('serviceType', service.id);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-green-500">{service.icon}</div>
                            <div>
                              <h4 className="font-semibold">{service.name}</h4>
                              <p className="text-sm text-gray-400">{service.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Origin & Destination */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Origin</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.origin}
                          onChange={(e) => handleInputChange('origin', e.target.value)}
                          placeholder="City, Country or Port/Airport code"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Destination</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.destination}
                          onChange={(e) => handleInputChange('destination', e.target.value)}
                          placeholder="City, Country or Port/Airport code"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipment Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Shipment Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.shipmentDate}
                        onChange={(e) => handleInputChange('shipmentDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Cargo Details */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Cargo Details</h3>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Weight (kg)</label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="Enter weight in kilograms"
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Dimensions (cm)</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.dimensions.length}
                          onChange={(e) => handleInputChange('length', e.target.value, 'dimensions')}
                          placeholder="Length"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={formData.dimensions.width}
                          onChange={(e) => handleInputChange('width', e.target.value, 'dimensions')}
                          placeholder="Width"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={formData.dimensions.height}
                          onChange={(e) => handleInputChange('height', e.target.value, 'dimensions')}
                          placeholder="Height"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cargo Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Cargo Type</label>
                    <select
                      value={formData.cargoType}
                      onChange={(e) => handleInputChange('cargoType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                      required
                    >
                      <option value="">Select cargo type</option>
                      {cargoTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cargo Value */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Cargo Value (USD)</label>
                    <input
                      type="number"
                      value={formData.cargoValue}
                      onChange={(e) => handleInputChange('cargoValue', e.target.value)}
                      placeholder="Estimated value for insurance purposes"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Special Requirements */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Special Requirements</h3>

                  <div>
                    <label className="block text-sm font-medium mb-4">
                      Select any special requirements (optional)
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {specialRequirements.map((requirement) => (
                        <label key={requirement} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-green-600 bg-gray-800 border-gray-700 rounded focus:ring-green-500"
                            onChange={(e) =>
                              handleInputChange(
                                'specialRequirements',
                                e.target.checked
                                  ? `${formData.specialRequirements} ${requirement}`.trim()
                                  : formData.specialRequirements
                                      .replace(requirement, '')
                                      .trim(),
                              )
                            }
                          />
                          <span className="text-sm">{requirement}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      placeholder="Any additional requirements or special handling instructions..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Contact Information */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Contact Information</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.contactInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value, 'contactInfo')}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.contactInfo.company}
                          onChange={(e) => handleInputChange('company', e.target.value, 'contactInfo')}
                          placeholder="Company name"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.contactInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value, 'contactInfo')}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.contactInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value, 'contactInfo')}
                          placeholder="+1 (555) 123-4567"
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentStep === 1
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Submit Quote Request
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Contact Alternative */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Prefer to speak with someone directly?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+1-555-GREEN-01"
                className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
              >
                <Phone className="h-5 w-5" />
                <span>Call: +1 (555) GREEN-01</span>
              </a>
              <a
                href="mailto:quotes@greensphere.com"
                className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
              >
                <Mail className="h-5 w-5" />
                <span>Email: quotes@greensphere.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}