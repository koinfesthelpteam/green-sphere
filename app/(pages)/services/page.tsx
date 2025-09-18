/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Package, Truck, Shield, Clock, Globe, Zap, CreditCard, Phone, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 1,
      icon: <Truck className="h-12 w-12 text-green-500" />,
      title: 'Express Delivery',
      description: 'Fast and reliable delivery service for urgent shipments',
      features: ['24-48 hour delivery', 'Real-time tracking', 'Priority handling', 'Insurance included'],
      price: 'Starting at $25',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6888?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 2,
      icon: <Package className="h-12 w-12 text-green-500" />,
      title: 'Standard Shipping',
      description: 'Cost-effective shipping solution for regular deliveries',
      features: ['5-7 business days', 'Package tracking', 'Secure handling', 'Affordable rates'],
      price: 'Starting at $8',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 3,
      icon: <Globe className="h-12 w-12 text-green-500" />,
      title: 'International Shipping',
      description: 'Worldwide delivery with customs handling and documentation',
      features: ['Global coverage', 'Customs clearance', 'Documentation support', 'Multi-currency'],
      price: 'Starting at $35',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 4,
      icon: <Shield className="h-12 w-12 text-green-500" />,
      title: 'Secure Transport',
      description: 'High-security shipping for valuable and sensitive items',
      features: ['Enhanced security', 'Chain of custody', 'Insurance up to $10K', 'Signature required'],
      price: 'Starting at $50',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 5,
      icon: <Zap className="h-12 w-12 text-green-500" />,
      title: 'Same-Day Delivery',
      description: 'Ultra-fast delivery within the same metropolitan area',
      features: ['Within 6 hours', 'Live GPS tracking', 'Direct courier', 'Photo confirmation'],
      price: 'Starting at $45',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 6,
      icon: <CreditCard className="h-12 w-12 text-green-500" />,
      title: 'Crypto Payments',
      description: 'Secure cryptocurrency payment processing for all services',
      features: ['Bitcoin, Ethereum, Litecoin', 'QR code payments', 'Instant confirmation', 'Low fees'],
      price: 'Processing fee: 2%',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop&auto=format'
    }
  ];

  const additionalServices = [
    {
      icon: <Clock className="h-8 w-8 text-green-500" />,
      title: 'Scheduled Pickup',
      description: 'Schedule pickups at your convenience'
    },
    {
      icon: <Phone className="h-8 w-8 text-green-500" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance'
    },
    {
      icon: <Package className="h-8 w-8 text-green-500" />,
      title: 'Package Consolidation',
      description: 'Combine multiple items into one shipment'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Insurance Options',
      description: 'Comprehensive coverage for your packages'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-green-50-900"></div>
        <div className="absolute inset-0 opacity-10">
          <Image 
            src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1920&h=600&fit=crop&auto=format"
            alt="Services background"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our
              <span className="block bg-gradient-to-r from-green-400 to-green-50-600 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Comprehensive shipping solutions tailored to your needs. From express delivery to secure transport, 
              we&apos;ve got you covered with cutting-edge technology and reliable service.
            </p>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-20 w-6 h-6 bg-green-600 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-white rounded-full animate-bounce"></div>
      </section>

      {/* Main Services Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Shipping <span className="bg-gradient-to-r from-green-400 to-green-50-600 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-xl text-gray-400">
              Choose the perfect service for your delivery needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 group hover:transform hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <Image 
                    src={service.image} 
                    alt={service.title}
                    width={500}
                    height={500}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    {service.icon}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {service.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                    Select Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Additional <span className="bg-gradient-to-r from-green-400 to-green-50-600 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-gray-400">
              Extra services to enhance your shipping experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div 
                key={index}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 group hover:transform hover:-translate-y-2"
              >
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-900/20 via-black to-green-50-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Ship
            <span className="block bg-gradient-to-r from-green-400 to-green-50-600 bg-clip-text text-transparent">Your Package?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Contact our team to get started with your shipment today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/30"
            >
              Get Quote
            </a>
            <a 
              href="/support"
              className="bg-transparent border-2 border-gray-700 hover:border-green-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}