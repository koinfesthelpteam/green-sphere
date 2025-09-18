'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CreditCard, Shield, Truck, Clock, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const router = useRouter();
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  // Array of video sources for the slideshow
  const videoSources = [
    'https://cdn.pixabay.com/video/2020/08/27/48342-454346532_large.mp4',
    'https://cdn.pixabay.com/video/2020/11/07/55305-499594268_tiny.mp4',
    'https://cdn.pixabay.com/video/2017/04/13/8686-213189350_tiny.mp4',
  ];

  // Handle video slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
    }, 5000); // Change video every 5 seconds

    return () => clearInterval(interval);
  }, [videoSources.length]);

  // Manage video playback
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideoIndex && isVideoPlaying) {
          video.play().catch((error) => console.error('Video playback failed:', error));
        } else {
          video.pause();
        }
      }
    });
  }, [currentVideoIndex, isVideoPlaying]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }
    router.push(`/track/${trackingNumber.trim().toUpperCase()}`);
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-green-500" />,
      title: 'Real-time Tracking',
      description: 'Track your shipments in real-time with detailed location updates and status changes.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&auto=format'
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-500" />,
      title: 'Crypto Payments',
      description: 'Pay for your shipments using Bitcoin, Ethereum, or Litecoin with secure QR code payments.',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop&auto=format'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Secure & Reliable',
      description: 'Your packages and payment information are protected with enterprise-grade security.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&auto=format'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-500" />,
      title: 'Fast Delivery',
      description: 'Choose from multiple delivery options including express and overnight shipping.',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6888?w=400&h=300&fit=crop&auto=format'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Create Shipment',
      description: 'Contact our team to create your shipment and generate a unique tracking number.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop&auto=format'
    },
    {
      number: 2,
      title: 'Make Payment',
      description: 'Scan the QR code and pay using your preferred cryptocurrency.',
      image: 'https://images.unsplash.com/photo-1711379437694-0422e4a1b30c?w=300&h=200&fit=crop&auto=format'
    },
    {
      number: 3,
      title: 'Track Progress',
      description: 'Monitor your package journey with real-time updates and location tracking.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop&auto=format'
    },
    {
      number: 4,
      title: 'Receive Package',
      description: 'Get your package delivered safely to your specified address.',
      image: 'https://images.unsplash.com/photo-1595514191830-3e96a518989b?w=300&h=200&fit=crop&auto=format'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section with Video Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Slideshow */}
        <div className="absolute inset-0 z-10">
          {videoSources.map((src, index) => (
            <video
              key={index}
              ref={(el) => {
                if (el) {
                  videoRefs.current[index] = el;
                }
              }}
              autoPlay={index === 0}
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}
        </div>
        
        {/* Fallback Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-green-900 z-5"></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        
        {/* Video Control Button */}
        <button
          onClick={toggleVideo}
          className="absolute top-24 right-8 z-30 bg-gray-800/50 hover:bg-gray-700/70 text-white p-3 rounded-full transition-colors duration-200"
        >
          {isVideoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        {/* Content */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Track Your Shipments
            <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Anywhere, Anytime
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Professional shipment tracking with cryptocurrency payments. Monitor your packages 
            in real-time with our advanced logistics platform.
          </p>

          {/* Tracking Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleTrackSubmit} className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full pl-10 pr-4 py-4 text-lg bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 outline-none"
                />
              </div>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/20">
                Track
              </button>
            </form>
            <p className="text-sm text-gray-300 mt-2">
              Enter your tracking number to get real-time updates
            </p>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-20 w-6 h-6 bg-green-600 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-pulse delay-500"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose 
               <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"> ShipTracker Pro?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of shipping with our cutting-edge features and secure payment options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:transform hover:scale-105 hover:border-green-500/50 transition-all duration-300 group overflow-hidden"
              >
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <Image 
                    src={feature.image} 
                    alt={feature.title}
                    width={500}
                    height={500}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-green-500 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-green-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-green-300 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-400">
              Simple steps to get your package delivered safely and securely
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10">
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <Image 
                      src={step.image} 
                      alt={step.title}
                      width={500}
                      height={500}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-500 to-green-300 transform -translate-y-1/2 z-10 opacity-60"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-green-900/20 via-black to-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-green-500 mb-2 group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-gray-400 group-hover:text-white transition-colors">Packages Delivered</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-500 mb-2 group-hover:scale-110 transition-transform">99.9%</div>
              <div className="text-gray-400 group-hover:text-white transition-colors">Delivery Success</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-500 mb-2 group-hover:scale-110 transition-transform">150+</div>
              <div className="text-gray-400 group-hover:text-white transition-colors">Countries Served</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-500 mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-gray-400 group-hover:text-white transition-colors">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1920&h=600&fit=crop&auto=format"
            alt="Logistics background"
            width={500}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-green-900/40 to-black/95"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Track Your
            <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Shipment?</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Enter your tracking number above or contact our team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                document.querySelector('input')?.focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
              Start Tracking Now
            </button>
            <a 
              href="/contact"
              className="bg-transparent border-2 border-gray-700 hover:border-green-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Customers Say</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Incredibly fast and reliable service. The crypto payment option is a game-changer!",
                author: "Sarah Johnson",
                role: "E-commerce Manager"
              },
              {
                quote: "Real-time tracking gave me peace of mind. Professional service throughout.",
                author: "Michael Chen",
                role: "Tech Entrepreneur"
              },
              {
                quote: "Seamless experience from payment to delivery. Highly recommended!",
                author: "Emma Rodriguez",
                role: "Online Retailer"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
                <div className="text-gray-400 mb-4 italic">&quot;{testimonial.quote}&quot;</div>
                <div className="text-white font-semibold">{testimonial.author}</div>
                <div className="text-green-400 text-sm">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}