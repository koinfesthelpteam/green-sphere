'use client';

import React from 'react';
import { Package, Users, Globe, Shield, Clock, Award, Target, Heart } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const stats = [
    { icon: Package, value: '500K+', label: 'Packages Delivered' },
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Globe, value: '180+', label: 'Countries Served' },
    { icon: Clock, value: '24/7', label: 'Customer Support' },
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format',
      description: 'Visionary leader with 15+ years in logistics and technology innovation.'
    },
    {
      name: 'Maria Rodriguez',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&auto=format',
      description: 'Tech expert specializing in blockchain integration and secure payment systems.'
    },
    {
      name: 'David Kim',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format',
      description: 'Operations specialist ensuring seamless global shipping and logistics.'
    },
    {
      name: 'Sarah Wilson',
      role: 'Customer Success Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format',
      description: 'Dedicated to ensuring exceptional customer experiences and satisfaction.'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Your packages and data are protected with enterprise-grade security measures.'
    },
    {
      icon: Target,
      title: 'Precision Tracking',
      description: 'Advanced technology provides accurate, real-time location updates.'
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'Every decision we make prioritizes our customers\' needs and satisfaction.'
    },
    {
      icon: Award,
      title: 'Excellence Driven',
      description: 'We strive for perfection in every aspect of our service delivery.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=800&fit=crop&auto=format"
            alt="About us background"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Green Sphere Services</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We&apos;re revolutionizing the logistics industry with cutting-edge tracking technology 
              and secure cryptocurrency payment solutions, making global shipping accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-green-500/50 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6 text-green-400">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                To democratize global logistics by providing secure, transparent, and efficient 
                shipping solutions that bridge traditional logistics with modern payment technologies. 
                We believe everyone deserves access to reliable shipping services, regardless of 
                their preferred payment method.
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-green-500/50 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6 text-green-400">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                To become the world&apos;s leading platform for crypto-enabled logistics, setting new 
                standards for transparency, security, and customer satisfaction in the shipping industry. 
                We envision a future where global commerce is seamless and accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-900/20 via-black to-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-green-500 mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do and drive our commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black" id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The passionate experts behind ShipTracker Pro&apos;s innovative logistics solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    width={500}
                    height={500}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-green-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-green-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From startup to global logistics leader - here&apos;s how we&apos;ve grown.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-green-500 to-green-300"></div>
            
            <div className="space-y-12">
              {[
                {
                  year: '2020',
                  title: 'Company Founded',
                  description: 'ShipTracker Pro was established with a vision to revolutionize logistics.'
                },
                {
                  year: '2021',
                  title: 'Crypto Integration',
                  description: 'First to integrate cryptocurrency payments into logistics platform.'
                },
                {
                  year: '2022',
                  title: 'Global Expansion',
                  description: 'Expanded operations to over 50 countries worldwide.'
                },
                {
                  year: '2023',
                  title: 'Advanced Tracking',
                  description: 'Launched real-time tracking system.'
                },
                {
                  year: '2024',
                  title: 'Industry Leader',
                  description: 'Became the leading crypto-enabled logistics platform globally.'
                }
              ].map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-1"></div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-black"></div>
                  </div>
                  <div className="flex-1 px-8">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
                      <div className="text-green-400 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}