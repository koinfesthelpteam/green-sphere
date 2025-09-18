'use client';
import Image from "next/image";

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Logo Container */}
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Pulsing Logo */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-600 opacity-20 animate-ping scale-150"></div>
          
          {/* Middle glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-600 opacity-30 animate-pulse scale-125"></div>
          
          {/* Logo container with shadow */}
          <div className="relative bg-white rounded-full p-8 shadow-2xl border-4 border-green-200 animate-pulse">
            <Image 
              src="/images/logo.png" 
              alt="Loading..." 
              width={300}
              height={300}
              className="w-24 h-24 object-contain filter drop-shadow-lg"
            />
          </div>
        </div>

        {/* Loading text with animation */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-green-800 animate-pulse">
            Loading Your Package Details
          </h2>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <p className="text-green-600 text-sm font-medium animate-pulse">
            Please wait while we fetch your tracking information...
          </p>
        </div>

        {/* Optional progress bar */}
        <div className="w-64 bg-green-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}

// Simple shimmer skeleton component (kept for backward compatibility)
export function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-green-100 rounded animate-pulse ${className}`}></div>
  );
}

// Text skeleton (updated for white/green theme)
export function SkeletonText({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <div 
          key={index} 
          className={`h-4 bg-green-100 rounded animate-pulse ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
}

// Card skeleton (updated for white/green theme)
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white border-2 border-green-100 rounded-xl p-6 shadow-lg ${className}`}>
      <div className="space-y-4">
        <SkeletonBox className="h-6 w-1/3" />
        <SkeletonText lines={3} />
        <div className="flex justify-between">
          <SkeletonBox className="h-4 w-1/4" />
          <SkeletonBox className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
}