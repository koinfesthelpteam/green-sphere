/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Package, Truck, Shield, Clock, Globe, Zap, Plane, Ship, Train, MapPin, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 1,
      icon: <Plane className="h-12 w-12 text-green-500" />,
      title: 'Air Freight',
      description: 'Fast international and domestic cargo transport via commercial and cargo aircraft',
      features: ['Global reach within 1-3 days', 'High-value cargo handling', 'Temperature-controlled options', 'Express customs clearance'],
      capacity: 'Up to 100+ tons per flight',
      image: '/images/freight.jpg'
    },
    {
      id: 2,
      icon: <Ship className="h-12 w-12 text-green-500" />,
      title: 'Ocean Freight',
      description: 'Cost-effective bulk shipping via container vessels and cargo ships worldwide',
      features: ['Full container loads (FCL)', 'Less than container loads (LCL)', 'Bulk cargo handling', 'Port-to-port delivery'],
      capacity: '20ft & 40ft containers',
      image: '/images/ship.jpg'
    },
    {
      id: 3,
      icon: <Train className="h-12 w-12 text-green-500" />,
      title: 'Rail Transport',
      description: 'Efficient overland cargo transport via freight trains across continental networks',
      features: ['Intermodal containers', 'Bulk commodity transport', 'Cross-border rail services', 'Environmental friendly'],
      capacity: 'Up to 125 tons per railcar',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 4,
      icon: <Truck className="h-12 w-12 text-green-500" />,
      title: 'Road Freight',
      description: 'Flexible door-to-door trucking services for regional and long-haul deliveries',
      features: ['Full truckload (FTL)', 'Less than truckload (LTL)', 'Refrigerated transport', 'Last-mile delivery'],
      capacity: 'Up to 40 tons per truck',
      image: '/images/truck.jpg'
    },
    {
      id: 5,
      icon: <Package className="h-12 w-12 text-green-500" />,
      title: 'Multimodal Logistics',
      description: 'Combined transport solutions using multiple modes for optimal efficiency',
      features: ['Sea-air combinations', 'Rail-road integration', 'Custom routing solutions', 'Single point of contact'],
      capacity: 'Scalable to any size',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 6,
      icon: <Shield className="h-12 w-12 text-green-500" />,
      title: 'Specialized Cargo',
      description: 'Expert handling of oversized, hazardous, and high-value cargo shipments',
      features: ['Oversized cargo (OOG)', 'Hazardous materials (DG)', 'Project cargo management', 'White glove service'],
      capacity: 'Custom solutions',
      image: '/images/delivery.jpg'
    }
  ];

  const additionalServices = [
    {
      icon: <MapPin className="h-8 w-8 text-green-500" />,
      title: 'Cargo Tracking',
      description: 'Real-time visibility of your shipments worldwide'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Cargo Insurance',
      description: 'Comprehensive coverage for your valuable goods'
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: 'Customs Brokerage',
      description: 'Expert customs clearance and documentation'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-500" />,
      title: 'Warehousing',
      description: 'Secure storage and distribution facilities'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-green-900/20"></div>
        <div className="absolute inset-0 opacity-30">
          <Image 
            src="/images/freight.jpg"
            alt="Cargo ships and freight"
            width={1200}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Freight
              <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Comprehensive freight and logistics services across air, ocean, rail, and road networks. 
              Move your cargo efficiently with our global transportation solutions.
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
              Transportation <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Modes</span>
            </h2>
            <p className="text-xl text-gray-400">
              Choose the right freight solution for your cargo requirements
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
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    {service.icon}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {service.capacity}
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
                    Learn More
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
              Logistics <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Support</span>
            </h2>
            <p className="text-xl text-gray-400">
              Additional services to support your freight operations
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
      <section className="py-20 bg-gradient-to-r from-green-900/20 via-black to-green-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Move
            <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Your Cargo?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Contact our freight experts to find the best transportation solution for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/30"
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