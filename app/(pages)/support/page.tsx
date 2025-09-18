'use client';

import React, { useState } from 'react';
import { Search, HelpCircle, Phone, Mail, MessageCircle, FileText, Shield, Package, CreditCard, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const supportChannels = [
    {
      icon: <Phone className="h-8 w-8 text-red-500" />,
      title: '24/7 Phone Support',
      description: 'Speak with our experts anytime',
      contact: '+1 (555) 123-SHIP',
      availability: 'Available 24/7',
      responseTime: 'Immediate'
    },
    {
      icon: <Mail className="h-8 w-8 text-red-500" />,
      title: 'Email Support',
      description: 'Send us detailed inquiries',
      contact: 'support@shiptracker.com',
      availability: 'Mon-Sun',
      responseTime: 'Within 2 hours'
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-red-500" />,
      title: 'Live Chat',
      description: 'Instant help from our team',
      contact: 'Chat widget (bottom right)',
      availability: '6 AM - 2 AM EST',
      responseTime: 'Within 1 minute'
    },
    {
      icon: <FileText className="h-8 w-8 text-red-500" />,
      title: 'Help Center',
      description: 'Browse our knowledge base',
      contact: 'Comprehensive guides',
      availability: 'Always available',
      responseTime: 'Self-service'
    }
  ];

  const faqCategories = [
    {
      category: 'Shipping & Tracking',
      icon: <Package className="h-6 w-6 text-red-500" />,
      questions: [
        {
          question: 'How do I track my package?',
          answer: 'Simply enter your tracking number on our homepage or tracking page. You\'ll get real-time updates on your package location and delivery status.'
        },
        {
          question: 'What if my tracking number isn\'t working?',
          answer: 'Double-check the tracking number for any typos. If it still doesn\'t work, wait 24 hours as it may not be in the system yet, or contact our support team.'
        },
        {
          question: 'How long do different shipping options take?',
          answer: 'Same-day: 6 hours, Express: 24-48 hours, Standard: 5-7 business days, International: 7-14 business days, Secure transport: 24-72 hours.'
        },
        {
          question: 'Can I change my delivery address after shipping?',
          answer: 'Address changes are possible before the package is out for delivery. Contact us immediately with your tracking number and new address.'
        }
      ]
    },
    {
      category: 'Payments & Crypto',
      icon: <CreditCard className="h-6 w-6 text-red-500" />,
      questions: [
        {
          question: 'What cryptocurrencies do you accept?',
          answer: 'We accept Bitcoin (BTC), Ethereum (ETH), and Litecoin (LTC). Payments are processed instantly with QR code scanning.'
        },
        {
          question: 'Are crypto payments secure?',
          answer: 'Yes, all crypto transactions use blockchain technology and are fully secure. We provide instant confirmation and receipt.'
        },
        {
          question: 'What are the payment processing fees?',
          answer: 'Crypto payments have a 2% processing fee. This covers blockchain network fees and processing costs.'
        },
        {
          question: 'Can I get a refund on crypto payments?',
          answer: 'Refunds are processed in the same cryptocurrency used for payment, typically within 24-48 hours after approval.'
        }
      ]
    },
    {
      category: 'Security & Insurance',
      icon: <Shield className="h-6 w-6 text-red-500" />,
      questions: [
        {
          question: 'How secure are my packages?',
          answer: 'All packages are tracked with GPS, handled by verified couriers, and come with basic insurance. Secure transport includes enhanced security measures.'
        },
        {
          question: 'What if my package is lost or damaged?',
          answer: 'Contact us immediately. We\'ll investigate and provide compensation based on your insurance coverage. Most claims are resolved within 5 business days.'
        },
        {
          question: 'How much insurance coverage do I get?',
          answer: 'Standard shipping includes up to $100 coverage. Express includes up to $500. Secure transport includes up to $10,000. Additional coverage available.'
        },
        {
          question: 'Is my personal information protected?',
          answer: 'Yes, we use enterprise-grade encryption and never share your data with third parties. All information is stored securely and used only for shipping purposes.'
        }
      ]
    }
  ];

  const quickActions = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Track Package',
      description: 'Enter tracking number',
      action: () => window.location.href = '/'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Call Support',
      description: '+1 (555) 123-SHIP',
      action: () => window.open('tel:+15551234747', '_self')
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Us',
      description: 'Send detailed inquiry',
      action: () => window.location.href = '/contact'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Live Chat',
      description: 'Instant help available',
      action: () => alert('Live chat would open here')
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        searchQuery === '' || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900"></div>
        <div className="absolute inset-0 opacity-10">
          <Image 
            src="https://images.unsplash.com/photo-1553484771-371a605b060b?w=1920&h=600&fit=crop&auto=format"
            alt="Support background"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Support
              <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Center
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Get the help you need, when you need it. Our support team is available 24/7 to assist 
              you with tracking, payments, and any shipping questions.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-20 w-6 h-6 bg-red-600 rounded-full animate-pulse"></div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Quick <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Actions</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group hover:transform hover:scale-105 text-left"
              >
                <div className="text-red-500 mb-3 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-red-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Contact <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Support</span>
            </h2>
            <p className="text-xl text-gray-400">
              Choose the best way to reach our support team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportChannels.map((channel, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group hover:transform hover:-translate-y-2"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform">
                  {channel.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-red-400 transition-colors">
                  {channel.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {channel.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-500 w-20">Contact:</span>
                    <span className="text-white">{channel.contact}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-20">Hours:</span>
                    <span className="text-white">{channel.availability}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-20">Response:</span>
                    <span className="text-green-400">{channel.responseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-400">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  {category.icon}
                  <h3 className="text-2xl font-semibold ml-3 text-white">
                    {category.category}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex; // Create unique index
                    const isExpanded = expandedFAQ === globalIndex;
                    
                    return (
                      <div 
                        key={faqIndex}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-red-500/50 transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/30 transition-colors"
                        >
                          <span className="text-white font-medium pr-4">
                            {faq.question}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-red-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="px-4 pb-4 text-gray-300 leading-relaxed border-t border-gray-700/50 pt-4">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">
                We couldn&apos;t find any FAQs matching your search. Try different keywords or contact our support team.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Status & Updates */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  System Status
                </h3>
                <p className="text-gray-400">
                  All systems operational and running smoothly
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">All Systems Operational</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">&lt;2min</div>
                <div className="text-gray-400 text-sm">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900/20 via-black to-red-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Still Need
            <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Help?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Our support team is standing by to assist you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/30"
            >
              Contact Support
            </a>
            <button 
              onClick={() => window.open('tel:+15551234747', '_self')}
              className="bg-transparent border-2 border-gray-700 hover:border-red-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Call Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}