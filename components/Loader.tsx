'use client';

import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative w-full max-w-xs">
        <Image
          src="/videos/loader.gif"
          alt="Loading animation"
          width={200}
          height={200}
          className="w-full h-auto rounded-lg shadow-lg"
          unoptimized
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
          <span className="inline-flex items-center">
            Loading
            <span className="ml-2 animate-pulse">...</span>
          </span>
        </div>
      </div>
    </div>
  );
}