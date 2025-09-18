/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Package, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    trackingNumber: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="h-8 w-8 text-red-500" />,
      title: '24/7 Phone Support',
      details: ['+1 (555) 123-SHIP', '+1 (555) 123-7447'],
      description: 'Available around the clock for urgent matters'
    },
    {
      icon: <Mail className="h-8 w-8 text-red-500" />,
      title: 'Email Support',
      details: ['support@shiptracker.com', 'sales@shiptracker.com'],
      description: 'For detailed inquiries and documentation'
    },
    {
      icon: <MapPin className="h-8 w-8 text-red-500" />,
      title: 'Headquarters',
      details: ['1234 Logistics Ave', 'Shipping City, SC 12345'],
      description: 'Visit our main office for in-person assistance'
    },
    {
      icon: <Clock className="h-8 w-8 text-red-500" />,
      title: 'Business Hours',
      details: ['Customer Service: 24/7', 'Office: Mon-Fri 8AM-6PM EST'],
      description: 'Different departments have varying hours'
    }
  ];

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'tracking', label: 'Tracking Issue', icon: <Package className="h-4 w-4" /> },
    { value: 'payment', label: 'Payment/Billing', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'complaint', label: 'Complaint', icon: <AlertCircle className="h-4 w-4" /> },
    { value: 'partnership', label: 'Business Partnership', icon: <User className="h-4 w-4" /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message sent successfully! We\'ll get back to you within 2 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        trackingNumber: '',
        message: '',
        priority: 'normal'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900"></div>
        <div className="absolute inset-0 opacity-10">
          <Image 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop&auto=format"
            alt="Contact background"
            height={500}
            width={500}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Contact
              <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Us
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Get in touch with our expert team. Whether you need help with tracking, payments, 
              or have questions about our services, we&lsquo;re here to assist you 24/7.
            </p>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-20 w-6 h-6 bg-red-600 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-white rounded-full animate-bounce"></div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Get in <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-gray-400">
              Multiple ways to reach our support team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group hover:transform hover:-translate-y-2"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-red-400 transition-colors">
                  {info.title}
                </h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-300">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-red-500/30 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6">
                Send us a <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Message</span>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 outline-none transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Phone and Subject */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 outline-none transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white outline-none transition-colors"
                    >
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tracking Number and Priority */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tracking Number
                      <span className="text-xs text-gray-500 ml-1">(if applicable)</span>
                    </label>
                    <input
                      type="text"
                      name="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 outline-none transition-colors"
                      placeholder="e.g., ST123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white outline-none transition-colors"
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="normal">Normal - Standard support</option>
                      <option value="high">High - Urgent matter</option>
                      <option value="critical">Critical - Emergency</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 outline-none transition-colors resize-vertical"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg shadow-red-500/20 disabled:shadow-none flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              {/* Expected Response Time */}
              <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-white">Expected Response Times</span>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• Critical: Within 15 minutes</p>
                  <p>• High: Within 1 hour</p>
                  <p>• Normal: Within 2 hours</p>
                  <p>• Low: Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              {/* Live Support */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-500/30 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Need Immediate <span className="text-red-400">Help?</span>
                </h3>
                <p className="text-gray-400 mb-6">
                  For urgent matters, our live support options are available 24/7
                </p>
                
                <div className="space-y-4">
                  <a 
                    href="tel:+15551234747"
                    className="flex items-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-red-500/50 transition-all group"
                  >
                    <Phone className="h-6 w-6 text-red-500 mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-white font-medium">Call Now</div>
                      <div className="text-gray-400 text-sm">+1 (555) 123-SHIP</div>
                    </div>
                  </a>
                  
                  <button 
                    onClick={() => alert('Live chat would open here')}
                    className="flex items-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-red-500/50 transition-all group w-full text-left"
                  >
                    <MessageSquare className="h-6 w-6 text-red-500 mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-white font-medium">Live Chat</div>
                      <div className="text-gray-400 text-sm">Available 6 AM - 2 AM EST</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Office Hours</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-300">Customer Service</span>
                    <span className="text-green-400 font-medium">24/7</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-300">Sales Team</span>
                    <span className="text-white">Mon-Fri: 8 AM - 8 PM EST</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-300">Technical Support</span>
                    <span className="text-white">Mon-Sun: 6 AM - 2 AM EST</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300">Office Visit</span>
                    <span className="text-white">Mon-Fri: 8 AM - 6 PM EST</span>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-800/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Check Our FAQ First
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Many common questions are answered in our comprehensive FAQ section. 
                  You might find your answer instantly!
                </p>
                <a 
                  href="/support"
                  className="inline-flex items-center text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  View FAQ Section →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Visit Our <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Office</span>
            </h2>
            <p className="text-xl text-gray-400">
              Located in the heart of the logistics district
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map Placeholder */}
            <div className="relative h-96 bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <Image 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format"
                alt="Office location map"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-red-900/20"></div>
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                📍 Our Location
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Address</h3>
                    <p className="text-gray-300">
                      1234 Logistics Avenue<br />
                      Shipping City, SC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Visiting Hours</h3>
                    <div className="text-gray-300 space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                      <p className="text-sm text-gray-400 mt-2">
                        * Please call ahead for appointments
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <Package className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Services Available</h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Package drop-off and pickup</li>
                      <li>• In-person consultation</li>
                      <li>• Account setup assistance</li>
                      <li>• Payment processing help</li>
                      <li>• Documentation support</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Get Directions
                </button>
                <button className="flex-1 bg-transparent border-2 border-gray-700 hover:border-red-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-900/10 border-t border-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800/30 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Emergency Support
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              For critical shipment issues, lost packages, or security concerns that require 
              immediate attention, use our emergency hotline available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+15551239911"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/30"
              >
                Emergency Hotline: +1 (555) 123-9911
              </a>
              <button 
                onClick={() => alert('Emergency chat would open here')}
                className="bg-transparent border-2 border-red-600 hover:bg-red-600/10 text-red-400 hover:text-red-300 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Emergency Chat
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}